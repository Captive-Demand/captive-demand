/**
 * Server-only HubSpot helpers for the direct booking lander.
 *
 * HubSpot rejects an entire contact write when any one property is unknown or
 * carries a value outside its options. Everything here exists so one bad field
 * never costs the rest: the portal's property catalog resolves names (by
 * internal name, then by label) and option values up front, and any property
 * HubSpot still rejects is dropped and the write retried.
 */

import { findContactIdByEmail } from '@/lib/hubspot-form';

const HUBSPOT_API = 'https://api.hubapi.com';
const CATALOG_TTL_MS = 10 * 60 * 1000;
const MAX_WRITE_ROUNDS = 4;

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

export interface WriteResult {
  written: string[];
  dropped: string[];
  error?: string;
}

let catalogCache: Catalog | null = null;

function normalizeLabel(label: string): string {
  return label.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function parseTimestamp(value: string | null | undefined): number | null {
  if (!value) return null;
  const asNumber = Number(value);
  if (Number.isFinite(asNumber) && asNumber > 0) return asNumber;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

/**
 * The portal's contact property definitions. Needs the private app's
 * `crm.schemas.contacts.read` scope; without it the catalog is simply absent
 * and the retry loop carries the load alone.
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
    const key = normalizeLabel(def.label);
    if (!byLabel.has(key)) byLabel.set(key, def);
  }

  catalogCache = { fetchedAt: Date.now(), byName, byLabel };
  return catalogCache;
}

/**
 * Maps our property keys onto what exists in the portal and coerces values to
 * what each property accepts. `labelFallbacks` lets a property whose internal
 * name was auto-generated from its label still resolve.
 */
function resolveProperties(
  wanted: Record<string, string>,
  catalog: Catalog | null,
  labelFallbacks: Record<string, string>,
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
      (labelFallbacks[key] ? catalog.byLabel.get(normalizeLabel(labelFallbacks[key])) : undefined);

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

/** Property names HubSpot flagged in a 400 body. The detail JSON arrives escaped inside the message string. */
function invalidPropertyNames(body: string): string[] {
  const unescaped = body.replace(/\\/g, '');
  const names = new Set<string>();
  for (const match of unescaped.matchAll(/"name"\s*:\s*"([^"]+)"/g)) names.add(match[1]);
  return [...names];
}

/**
 * Writes properties to HubSpot (PATCH an existing contact, or POST a new one),
 * dropping whatever HubSpot rejects and retrying so a bad field never blocks
 * the others. Returns the new contact id on create.
 */
async function writeWithRetry(
  token: string,
  target: { contactId: string } | { create: true },
  initial: Record<string, string>,
): Promise<WriteResult & { contactId?: string }> {
  const properties = { ...initial };
  const dropped: string[] = [];

  for (let round = 0; round < MAX_WRITE_ROUNDS; round += 1) {
    if (Object.keys(properties).length === 0) return { written: [], dropped };

    const url =
      'contactId' in target
        ? `${HUBSPOT_API}/crm/v3/objects/contacts/${target.contactId}`
        : `${HUBSPOT_API}/crm/v3/objects/contacts`;

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'contactId' in target ? 'PATCH' : 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ properties }),
      });
    } catch (error) {
      return { written: [], dropped, error: error instanceof Error ? error.message : 'Network error' };
    }

    if (response.ok) {
      let contactId: string | undefined;
      if ('create' in target) {
        const created = (await response.json().catch(() => ({}))) as { id?: string };
        contactId = created.id;
      }
      return { written: Object.keys(properties), dropped, contactId };
    }

    const body = await response.text();
    if (response.status === 409 && 'create' in target) {
      return { written: [], dropped, error: 'conflict' };
    }

    const invalid =
      response.status === 400 ? invalidPropertyNames(body).filter((name) => name in properties) : [];
    if (invalid.length === 0) {
      return { written: [], dropped, error: `HubSpot ${response.status}: ${body.slice(0, 600)}` };
    }
    for (const name of invalid) {
      delete properties[name];
      dropped.push(`${name} (rejected by HubSpot)`);
    }
  }

  return { written: [], dropped, error: 'HubSpot kept rejecting properties' };
}

export interface UpsertOptions {
  /** Labels to try when a key's internal name is missing from the portal. */
  labelFallbacks?: Record<string, string>;
  /** Create the contact when no contact has this email. */
  createIfMissing?: boolean;
  /** Only written when the contact is created (never overwrites an existing person's record). */
  createOnly?: Record<string, string>;
  /** Only written when the contact already lacks a value (first touch wins). */
  firstTouch?: Record<string, string>;
  /** Refuse to update an existing contact last touched longer ago than this. */
  maxAgeMs?: number;
  /** Search retries; the meeting booking creates contacts asynchronously. */
  searchAttempts?: number;
  searchBackoffMs?: number;
}

export interface UpsertResult extends WriteResult {
  status: 'ok' | 'pending' | 'skipped' | 'error';
  contactId?: string;
  created?: boolean;
  reason?: string;
}

/** Finds the contact by email and writes `properties`, creating the contact first when allowed. */
export async function upsertContactProperties(
  token: string,
  email: string,
  properties: Record<string, string>,
  options: UpsertOptions = {},
): Promise<UpsertResult> {
  const labelFallbacks = options.labelFallbacks ?? {};
  const firstTouchKeys = Object.keys(options.firstTouch ?? {});

  const found = await findContactIdByEmail(token, email, {
    attempts: options.searchAttempts ?? 1,
    backoffMs: options.searchBackoffMs ?? 1500,
    properties: ['email', 'createdate', 'lastmodifieddate', ...firstTouchKeys],
  });
  if (found.error) {
    return { status: 'error', written: [], dropped: [], error: found.error };
  }

  const catalog = await loadCatalog(token);

  if (found.id) {
    const existing = found.properties ?? {};
    if (options.maxAgeMs) {
      const freshest = Math.max(
        parseTimestamp(existing.createdate) ?? 0,
        parseTimestamp(existing.lastmodifieddate) ?? 0,
      );
      if (!freshest || Date.now() - freshest > options.maxAgeMs) {
        return { status: 'skipped', reason: 'stale contact', written: [], dropped: [], contactId: found.id };
      }
    }

    const wanted: Record<string, string> = { ...properties };
    for (const [key, value] of Object.entries(options.firstTouch ?? {})) {
      if (!existing[key]?.trim()) wanted[key] = value;
    }
    const resolved = resolveProperties(wanted, catalog, labelFallbacks);
    const result = await writeWithRetry(token, { contactId: found.id }, resolved.properties);
    return {
      status: result.error ? 'error' : 'ok',
      contactId: found.id,
      created: false,
      written: result.written,
      dropped: [...resolved.dropped, ...result.dropped],
      error: result.error,
    };
  }

  if (!options.createIfMissing) {
    return { status: 'pending', written: [], dropped: [] };
  }

  const wanted: Record<string, string> = {
    email,
    ...(options.createOnly ?? {}),
    ...(options.firstTouch ?? {}),
    ...properties,
  };
  const resolved = resolveProperties(wanted, catalog, labelFallbacks);
  const created = await writeWithRetry(token, { create: true }, resolved.properties);

  if (created.error === 'conflict') {
    // Someone created the contact between our search and our create. Update it instead.
    return upsertContactProperties(token, email, properties, { ...options, createIfMissing: false, searchAttempts: 2 });
  }

  return {
    status: created.error ? 'error' : 'ok',
    contactId: created.contactId,
    created: true,
    written: created.written,
    dropped: [...resolved.dropped, ...created.dropped],
    error: created.error,
  };
}
