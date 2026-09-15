import { NextResponse } from 'next/server';

import {
  BOOKING_PLATFORM_OPTIONS,
  PREP,
  UNIT_COUNT_OPTIONS,
} from '@/components/landers/direct-booking/copy';
import { findContactIdByEmail, isHubSpotConfigured } from '@/lib/hubspot-form';

/**
 * Stamps ad attribution (and, on a second call, the post-booking prep answers)
 * onto the contact that HubSpot Meetings just created.
 *
 * The scheduling page only collects name and email, so without this the CRM has
 * no idea which creative produced the call. This endpoint never surfaces an
 * error to the visitor: a booking that happened is more important than a
 * property that did not get written.
 *
 * HubSpot rejects an entire PATCH when any one property is unknown or carries a
 * value outside its options. Two defences keep one bad field from losing the
 * rest: the portal's property catalog is used to resolve names (by internal
 * name, then by label) and option values up front, and any property HubSpot
 * still rejects is dropped and the patch retried.
 */

const MAX_BODY_BYTES = 8 * 1024;
const MAX_STRING_LENGTH = 512;
const MAX_ANSWER_LENGTH = 200;

/** A contact that has not been touched in this long was not created or updated by the booking we are stamping. */
const CONTACT_AGE_LIMIT_MS = 60 * 60 * 1000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EVENT_ID_PATTERN = /^cd-dbl-[0-9a-f-]{36}$/;

const BOOKED_CALL_SOURCE = 'direct-booking-lander';
const HUBSPOT_API = 'https://api.hubapi.com';
const CATALOG_TTL_MS = 10 * 60 * 1000;
const MAX_PATCH_ROUNDS = 4;

type Attribution = {
  utm_source?: unknown;
  utm_medium?: unknown;
  utm_campaign?: unknown;
  utm_content?: unknown;
  utm_term?: unknown;
  fbclid?: unknown;
};

type Answers = {
  booking_platform?: unknown;
  unit_count?: unknown;
  booking_site_link?: unknown;
  phone?: unknown;
};

type RequestBody = {
  email?: unknown;
  eventId?: unknown;
  startTime?: unknown;
  meetingSlug?: unknown;
  attribution?: unknown;
  fbc?: unknown;
  fbp?: unknown;
  landingUrl?: unknown;
  answers?: unknown;
};

/**
 * Labels the prep questions were created with in HubSpot, so a property whose
 * internal name was auto-generated from its label still resolves.
 */
const LABEL_FALLBACKS: Record<string, string> = {
  booking_platform: PREP.bookingPlatformLabel,
  unit_count: PREP.unitCountLabel,
};

interface PropertyOption {
  label: string;
  value: string;
}

interface PropertyDef {
  name: string;
  label: string;
  type: string;
  options: PropertyOption[];
}

interface Catalog {
  fetchedAt: number;
  byName: Map<string, PropertyDef>;
  byLabel: Map<string, PropertyDef>;
}

let catalogCache: Catalog | null = null;

function cleanString(value: unknown, maxLength = MAX_STRING_LENGTH): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) return undefined;
  return trimmed;
}

function badRequest(reason: string) {
  return NextResponse.json({ status: 'invalid', reason }, { status: 400 });
}

/** Validates a radio answer against the options the page offers. `null` means "sent but not one of ours". */
function pickOption<T extends readonly string[]>(
  value: unknown,
  options: T,
): T[number] | undefined | null {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return (options as readonly string[]).includes(trimmed) ? (trimmed as T[number]) : null;
}

function parseTimestamp(value: string | null | undefined): number | null {
  if (!value) return null;
  const asNumber = Number(value);
  if (Number.isFinite(asNumber) && asNumber > 0) return asNumber;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function normalizeLabel(label: string): string {
  return label.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * The portal's contact property definitions. Needs the private app's
 * `crm.schemas.contacts.read` scope; without it the catalog is simply absent
 * and the retry loop below carries the load alone.
 */
async function loadCatalog(token: string): Promise<Catalog | null> {
  if (catalogCache && Date.now() - catalogCache.fetchedAt < CATALOG_TTL_MS) return catalogCache;

  let response: Response;
  try {
    response = await fetch(`${HUBSPOT_API}/crm/v3/properties/contacts?archived=false`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error('Direct booking: property catalog fetch failed:', error);
    return null;
  }

  if (!response.ok) {
    console.warn(
      `Direct booking: property catalog unavailable (HubSpot ${response.status}); add the crm.schemas.contacts.read scope to the private app to enable label matching.`,
    );
    return null;
  }

  const body = (await response.json()) as {
    results?: Array<{
      name?: string;
      label?: string;
      type?: string;
      options?: Array<{ label?: string; value?: string; hidden?: boolean }>;
    }>;
  };

  const byName = new Map<string, PropertyDef>();
  const byLabel = new Map<string, PropertyDef>();
  for (const raw of body.results ?? []) {
    if (!raw.name) continue;
    const def: PropertyDef = {
      name: raw.name,
      label: raw.label ?? raw.name,
      type: raw.type ?? 'string',
      options: (raw.options ?? [])
        .filter((option) => !option.hidden && typeof option.value === 'string')
        .map((option) => ({ label: option.label ?? option.value!, value: option.value! })),
    };
    byName.set(def.name, def);
    // First definition wins for a duplicated label; internal-name matches take precedence anyway.
    const key = normalizeLabel(def.label);
    if (!byLabel.has(key)) byLabel.set(key, def);
  }

  catalogCache = { fetchedAt: Date.now(), byName, byLabel };
  return catalogCache;
}

/**
 * Maps our property keys onto what actually exists in the portal and coerces
 * values to what each property accepts. Returns the properties to send plus a
 * log of what was dropped and why.
 */
function resolveProperties(
  wanted: Record<string, string>,
  catalog: Catalog | null,
): { properties: Record<string, string>; dropped: string[] } {
  const properties: Record<string, string> = {};
  const dropped: string[] = [];

  for (const [key, value] of Object.entries(wanted)) {
    if (!catalog) {
      properties[key] = value;
      continue;
    }

    const def =
      catalog.byName.get(key) ??
      (LABEL_FALLBACKS[key] ? catalog.byLabel.get(normalizeLabel(LABEL_FALLBACKS[key])) : undefined);

    if (!def) {
      dropped.push(`${key} (no such property)`);
      continue;
    }

    if (def.type === 'enumeration') {
      const match =
        def.options.find((option) => option.value === value) ??
        def.options.find((option) => normalizeLabel(option.label) === normalizeLabel(value));
      if (!match) {
        dropped.push(`${key} (value "${value}" is not an option of ${def.name})`);
        continue;
      }
      properties[def.name] = match.value;
      continue;
    }

    if (def.type === 'date') {
      // Date pickers only accept midnight UTC.
      const at = parseTimestamp(value) ?? Date.now();
      properties[def.name] = String(Math.floor(at / 86_400_000) * 86_400_000);
      continue;
    }

    if (def.type === 'datetime') {
      const at = parseTimestamp(value) ?? Date.now();
      properties[def.name] = String(at);
      continue;
    }

    properties[def.name] = value;
  }

  return { properties, dropped };
}

/** Property names HubSpot flagged in a 400 body, e.g. `"name":"some_missing_property"`. */
function invalidPropertyNames(body: string): string[] {
  // The validation detail is JSON nested inside the message string, so its
  // quotes arrive backslash-escaped. Strip the escapes before matching.
  const unescaped = body.replace(/\\/g, '');
  const names = new Set<string>();
  for (const match of unescaped.matchAll(/"name"\s*:\s*"([^"]+)"/g)) names.add(match[1]);
  return [...names];
}

/**
 * PATCHes the contact, dropping any property HubSpot rejects and retrying, so a
 * missing or misconfigured field never blocks the others.
 */
async function patchWithRetry(
  token: string,
  contactId: string,
  initial: Record<string, string>,
): Promise<{ written: string[]; dropped: string[]; error?: string }> {
  const properties = { ...initial };
  const dropped: string[] = [];

  for (let round = 0; round < MAX_PATCH_ROUNDS; round += 1) {
    if (Object.keys(properties).length === 0) return { written: [], dropped };

    let response: Response;
    try {
      response = await fetch(`${HUBSPOT_API}/crm/v3/objects/contacts/${contactId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ properties }),
      });
    } catch (error) {
      return { written: [], dropped, error: error instanceof Error ? error.message : 'Network error' };
    }

    if (response.ok) return { written: Object.keys(properties), dropped };

    const body = await response.text();
    const invalid = response.status === 400 ? invalidPropertyNames(body).filter((name) => name in properties) : [];
    if (invalid.length === 0) {
      return { written: [], dropped, error: `HubSpot patch ${response.status}: ${body.slice(0, 600)}` };
    }

    for (const name of invalid) {
      delete properties[name];
      dropped.push(`${name} (rejected by HubSpot)`);
    }
  }

  return { written: [], dropped, error: 'HubSpot patch kept rejecting properties' };
}

export async function POST(request: Request) {
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return badRequest('body too large');

    let body: RequestBody;
    try {
      body = JSON.parse(raw) as RequestBody;
    } catch {
      return badRequest('malformed json');
    }

    const email = cleanString(body.email);
    if (!email || !EMAIL_PATTERN.test(email)) return badRequest('email');

    const eventId = cleanString(body.eventId);
    if (!eventId || !EVENT_ID_PATTERN.test(eventId)) return badRequest('eventId');

    const landingUrl = cleanString(body.landingUrl);
    const fbc = cleanString(body.fbc);
    const fbp = cleanString(body.fbp);

    const attribution: Attribution =
      body.attribution && typeof body.attribution === 'object'
        ? (body.attribution as Attribution)
        : {};

    const answersInput: Answers =
      body.answers && typeof body.answers === 'object' ? (body.answers as Answers) : {};

    const bookingPlatform = pickOption(answersInput.booking_platform, BOOKING_PLATFORM_OPTIONS);
    const unitCount = pickOption(answersInput.unit_count, UNIT_COUNT_OPTIONS);
    if (bookingPlatform === null || unitCount === null) return badRequest('answer option');

    if (!isHubSpotConfigured()) {
      console.warn('Direct booking stamp skipped: HUBSPOT_ACCESS_TOKEN is not set');
      return NextResponse.json({ status: 'skipped', reason: 'not configured' });
    }

    const token = process.env.HUBSPOT_ACCESS_TOKEN!.trim();

    // The meeting booking creates the contact asynchronously, so the first
    // search often misses. Stay under Netlify's function timeout.
    const found = await findContactIdByEmail(token, email, {
      attempts: 5,
      backoffMs: 1500,
      properties: ['email', 'createdate', 'lastmodifieddate', 'utm_source', 'utm_medium', 'utm_campaign'],
    });

    if (found.error) {
      console.error('Direct booking contact search failed:', found.error);
      return NextResponse.json({ status: 'error' });
    }

    if (!found.id) {
      return NextResponse.json({ status: 'pending' });
    }

    // Without this guard the endpoint would let anyone rewrite attribution on
    // an arbitrary existing contact just by knowing their email address.
    const existing = found.properties ?? {};
    const createdAt = parseTimestamp(existing.createdate);
    const modifiedAt = parseTimestamp(existing.lastmodifieddate);
    const freshest = Math.max(createdAt ?? 0, modifiedAt ?? 0);
    if (!freshest || Date.now() - freshest > CONTACT_AGE_LIMIT_MS) {
      console.warn(`Direct booking stamp skipped: contact ${found.id} was last touched ${new Date(freshest).toISOString()}`);
      return NextResponse.json({ status: 'skipped', reason: 'stale contact' });
    }

    const wanted: Record<string, string> = {
      meta_event_id: eventId,
      booked_call_source: BOOKED_CALL_SOURCE,
      booked_call_at: new Date().toISOString(),
    };

    // First touch wins on the three UTMs other forms also write.
    const firstTouch: Array<['utm_source' | 'utm_medium' | 'utm_campaign', unknown]> = [
      ['utm_source', attribution.utm_source],
      ['utm_medium', attribution.utm_medium],
      ['utm_campaign', attribution.utm_campaign],
    ];
    for (const [key, value] of firstTouch) {
      const incoming = cleanString(value);
      if (incoming && !existing[key]?.trim()) wanted[key] = incoming;
    }

    const utmContent = cleanString(attribution.utm_content);
    if (utmContent) wanted.utm_content = utmContent;
    const utmTerm = cleanString(attribution.utm_term);
    if (utmTerm) wanted.utm_term = utmTerm;
    const fbclid = cleanString(attribution.fbclid);
    if (fbclid) wanted.fbclid = fbclid;
    if (fbc) wanted.meta_fbc = fbc;
    if (fbp) wanted.meta_fbp = fbp;
    if (landingUrl) wanted.captive_demand_form_location = landingUrl;

    if (bookingPlatform) wanted.booking_platform = bookingPlatform;
    if (unitCount) wanted.unit_count = unitCount;
    // The listing link goes into HubSpot's standard Website URL field, so it
    // shows in the contact sidebar and the property name can be read off it.
    const siteLink = cleanString(answersInput.booking_site_link, MAX_ANSWER_LENGTH);
    if (siteLink) wanted.website = siteLink;
    const phone = cleanString(answersInput.phone, MAX_ANSWER_LENGTH);
    if (phone) wanted.phone = phone;

    const catalog = await loadCatalog(token);
    const resolved = resolveProperties(wanted, catalog);
    const patched = await patchWithRetry(token, found.id, resolved.properties);
    const dropped = [...resolved.dropped, ...patched.dropped];

    if (dropped.length > 0) {
      console.warn(`Direct booking stamp for contact ${found.id} dropped: ${dropped.join('; ')}`);
    }
    if (patched.error) {
      console.error('Direct booking contact patch failed:', patched.error);
      return NextResponse.json({ status: 'error', dropped });
    }

    return NextResponse.json({ status: 'ok', written: patched.written, dropped });
  } catch (error) {
    console.error('Direct booking stamp threw:', error);
    return NextResponse.json({ status: 'error' });
  }
}
