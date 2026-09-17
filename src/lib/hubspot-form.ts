export const DEFAULT_HUBSPOT_PORTAL_ID = '51761572';
export const DEFAULT_HUBSPOT_AUDIT_FORM_ID = 'b4944350-8188-42ab-b168-5fb8bf1eb967';
export const DEFAULT_HUBSPOT_ADS_FORM_ID = 'da7205c5-9dda-44f1-beab-2c4ea26847eb';

export const ADS_PLATFORM_OPTIONS = [
  'Meta Ads',
  'Google Ads',
  'TikTok Ads',
  'Other (Pinterest, Linkedin)',
  "I'm not running any ads yet",
] as const;

export const ADS_BUDGET_OPTIONS = [
  'Under $3,000',
  '$3-5k',
  '$5-10k',
  '$10-25k',
  '$25-50k',
  '$50k+',
] as const;

export type AdsPlatformOption = (typeof ADS_PLATFORM_OPTIONS)[number];
export type AdsBudgetOption = (typeof ADS_BUDGET_OPTIONS)[number];

type HubSpotAttribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  pageUri?: string;
  pageName?: string;
  hutk?: string;
};

export type HubSpotAuditSubmission = HubSpotAttribution & {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  siteUrls: string[];
};

export type HubSpotAdsSubmission = HubSpotAttribution & {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  platforms: string[];
  monthlyBudget?: string;
};

export type HubSpotFormField = {
  objectTypeId: string;
  name: string;
  value: string;
};

export function splitPersonName(fullName: string): { firstname: string; lastname: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstname: '', lastname: '' };
  if (parts.length === 1) return { firstname: parts[0], lastname: '' };
  return { firstname: parts[0], lastname: parts.slice(1).join(' ') };
}

function field(name: string, value: string | undefined, objectTypeId = '0-1'): HubSpotFormField | null {
  const trimmed = value?.trim() ?? '';
  if (!trimmed) return null;
  return { objectTypeId, name, value: trimmed };
}

export function normalizeAuditSiteUrls(urls: string[]): string[] {
  return urls.map((url) => url.trim()).filter(Boolean);
}

/** Contact `website` is a single text field — join portco URLs so all of them land on the record. */
export function formatWebsiteProperty(urls: string[]): string {
  return normalizeAuditSiteUrls(urls).join(', ');
}

export function buildHubSpotAuditFields(input: HubSpotAuditSubmission): HubSpotFormField[] {
  const { firstname, lastname } = splitPersonName(input.fullName);
  const siteUrls = normalizeAuditSiteUrls(input.siteUrls);
  const websites = formatWebsiteProperty(siteUrls);

  return [
    field('firstname', firstname),
    field('lastname', lastname),
    field('email', input.email),
    field('phone', input.phone),
    field('company', input.company),
    field('website', websites),
    field('website', siteUrls[0], '0-2'),
    field('utm_source', input.utmSource),
    field('utm_medium', input.utmMedium),
    field('utm_campaign', input.utmCampaign),
    field('captive_demand_form_location', input.pageUri),
  ].filter((item): item is HubSpotFormField => item !== null);
}

export function isHubSpotConfigured(): boolean {
  return Boolean(process.env.HUBSPOT_ACCESS_TOKEN?.trim());
}

function buildHubSpotContext(input: HubSpotAttribution): Record<string, string> {
  const context: Record<string, string> = {};
  if (input.pageUri?.trim()) context.pageUri = input.pageUri.trim();
  if (input.pageName?.trim()) context.pageName = input.pageName.trim();
  if (input.hutk?.trim()) context.hutk = input.hutk.trim();
  return context;
}

async function postHubSpotForm(
  token: string,
  formId: string,
  fields: HubSpotFormField[],
  context: Record<string, string>,
): Promise<{ ok: boolean; error?: string }> {
  const portalId = process.env.HUBSPOT_PORTAL_ID?.trim() || DEFAULT_HUBSPOT_PORTAL_ID;
  let response: Response;
  try {
    response = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/secure/submit/${portalId}/${formId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields,
          ...(Object.keys(context).length > 0 ? { context } : {}),
        }),
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error';
    return { ok: false, error: message };
  }

  if (response.ok) return { ok: true };
  const body = await response.text();
  return { ok: false, error: `HubSpot ${response.status}: ${body.slice(0, 400)}` };
}

export interface FindContactOptions {
  /** Contacts are created asynchronously, so a miss is retried before giving up. */
  attempts?: number;
  /** Delay before retry N, multiplied by the attempt index. */
  backoffMs?: number;
  /** Extra contact properties to return alongside the id. */
  properties?: string[];
}

export interface FindContactResult {
  id?: string;
  properties?: Record<string, string | null>;
  error?: string;
}

export async function findContactIdByEmail(
  token: string,
  email: string,
  options: FindContactOptions = {},
): Promise<FindContactResult> {
  const { attempts = 4, backoffMs = 400, properties = ['email'] } = options;

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (attempt > 0) {
      await new Promise((resolve) => setTimeout(resolve, backoffMs * attempt));
    }

    let searchResponse: Response;
    try {
      searchResponse = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: email }] }],
          properties,
          limit: 1,
        }),
      });
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Network error' };
    }

    if (!searchResponse.ok) {
      const body = await searchResponse.text();
      return { error: `HubSpot search ${searchResponse.status}: ${body.slice(0, 400)}` };
    }

    const searchBody = (await searchResponse.json()) as {
      results?: Array<{ id?: string; properties?: Record<string, string | null> }>;
    };
    const result = searchBody.results?.[0];
    if (result?.id) return { id: result.id, properties: result.properties };
  }

  return {};
}

export async function patchContactProperties(
  token: string,
  contactId: string,
  properties: Record<string, string>,
): Promise<{ ok: boolean; error?: string }> {
  if (Object.keys(properties).length === 0) return { ok: true };

  let patchResponse: Response;
  try {
    patchResponse = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ properties }),
    });
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Network error' };
  }

  if (!patchResponse.ok) {
    const body = await patchResponse.text();
    return { ok: false, error: `HubSpot patch ${patchResponse.status}: ${body.slice(0, 400)}` };
  }

  return { ok: true };
}

async function syncHubSpotContactAuditProperties(
  token: string,
  input: HubSpotAuditSubmission,
): Promise<{ ok: boolean; error?: string }> {
  const email = input.email.trim();
  const website = formatWebsiteProperty(input.siteUrls);
  const company = input.company.trim();
  if (!email || (!website && !company)) return { ok: true };

  const found = await findContactIdByEmail(token, email);
  if (found.error) return { ok: false, error: found.error };
  if (!found.id) return { ok: true };

  const properties: Record<string, string> = {};
  if (website) properties.website = website;
  if (company) properties.company = company;
  return patchContactProperties(token, found.id, properties);
}

export async function submitHubSpotAuditForm(
  input: HubSpotAuditSubmission,
): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const token = process.env.HUBSPOT_ACCESS_TOKEN?.trim();
  if (!token) {
    return { ok: true, skipped: true };
  }

  const formId = process.env.HUBSPOT_AUDIT_FORM_ID?.trim() || DEFAULT_HUBSPOT_AUDIT_FORM_ID;
  const context = buildHubSpotContext(input);

  const submitted = await postHubSpotForm(token, formId, buildHubSpotAuditFields(input), context);
  if (!submitted.ok) return submitted;

  const sync = await syncHubSpotContactAuditProperties(token, input);
  if (!sync.ok) {
    console.error('HubSpot contact property sync failed:', sync.error);
  }

  return { ok: true };
}

export function buildHubSpotAdsFields(input: HubSpotAdsSubmission): HubSpotFormField[] {
  const { firstname, lastname } = splitPersonName(input.fullName);
  const website = input.website.trim();
  const platforms = input.platforms.map((item) => item.trim()).filter(Boolean).join(';');

  return [
    field('firstname', firstname),
    field('lastname', lastname),
    field('email', input.email),
    field('phone', input.phone),
    field('company', input.company),
    field('website', website, '0-2'),
    field('which_platforms_are_you_running_ads_on_currently_', platforms),
    field('what_is_your_monthly_ad_budget_', input.monthlyBudget),
    field('utm_source', input.utmSource),
    field('utm_medium', input.utmMedium),
    field('utm_campaign', input.utmCampaign),
    field('captive_demand_form_location', input.pageUri),
  ].filter((item): item is HubSpotFormField => item !== null);
}

export async function submitHubSpotAdsForm(
  input: HubSpotAdsSubmission,
): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const token = process.env.HUBSPOT_ACCESS_TOKEN?.trim();
  if (!token) {
    return { ok: true, skipped: true };
  }

  const formId = process.env.HUBSPOT_ADS_FORM_ID?.trim() || DEFAULT_HUBSPOT_ADS_FORM_ID;
  const context = buildHubSpotContext(input);
  const publishedFields = buildHubSpotAdsFields(input).filter(
    (item) =>
      item.name !== 'which_platforms_are_you_running_ads_on_currently_' &&
      item.name !== 'what_is_your_monthly_ad_budget_',
  );

  const submitted = await postHubSpotForm(token, formId, publishedFields, context);
  if (!submitted.ok) return submitted;

  const sync = await syncHubSpotContactAdsProperties(token, input);
  if (!sync.ok) {
    console.error('HubSpot ads contact property sync failed:', sync.error);
  }

  return { ok: true };
}

async function syncHubSpotContactAdsProperties(
  token: string,
  input: HubSpotAdsSubmission,
): Promise<{ ok: boolean; error?: string }> {
  const email = input.email.trim();
  if (!email) return { ok: true };

  const found = await findContactIdByEmail(token, email);
  if (found.error) return { ok: false, error: found.error };
  if (!found.id) return { ok: true };

  const properties: Record<string, string> = {};
  if (input.website.trim()) properties.website = input.website.trim();
  if (input.company.trim()) properties.company = input.company.trim();
  const platforms = input.platforms.map((item) => item.trim()).filter(Boolean);
  if (platforms.length > 0) {
    properties.which_platforms_are_you_running_ads_on_currently_ = platforms.join(';');
  }
  if (input.monthlyBudget?.trim()) {
    properties.what_is_your_monthly_ad_budget_ = input.monthlyBudget.trim();
  }

  return patchContactProperties(token, found.id, properties);
}

export type HubSpotContactSubmission = HubSpotAttribution & {
  fullName: string;
  email: string;
  /** E.164, already validated by the route. */
  phone?: string;
  company: string;
  annualCompanyRevenue?: string;
  annualCompanyRevenueLabel?: string;
  service?: string;
  budget?: string;
  message?: string;
};

/** Contact properties written by the /contact form. Created in the portal if missing. */
export const CONTACT_FORM_PROPERTIES = {
  annualCompanyRevenue: 'annual_company_revenue',
  service: 'service_interested_in',
  budget: 'project_budget',
  message: 'project_message',
} as const;

const CONTACT_FORM_PROPERTY_DEFS: Array<{
  name: string;
  label: string;
  type: 'string' | 'enumeration';
  fieldType: 'text' | 'textarea' | 'select';
  options?: Array<{ label: string; value: string }>;
}> = [
  {
    name: CONTACT_FORM_PROPERTIES.annualCompanyRevenue,
    label: 'Annual company revenue',
    type: 'enumeration',
    fieldType: 'select',
    options: [
      { label: 'Under $250k', value: 'under_250k' },
      { label: '$250k - $500k', value: '250k_500k' },
      { label: '$500k - $1M', value: '500k_1m' },
      { label: '$1M+', value: '1m_plus' },
    ],
  },
  {
    name: CONTACT_FORM_PROPERTIES.service,
    label: 'Service interested in',
    type: 'enumeration',
    fieldType: 'select',
    options: [
      { label: 'Website Design/Development', value: 'Website Design/Development' },
      { label: 'SEO/AEO', value: 'SEO/AEO' },
      { label: 'Email Marketing', value: 'Email Marketing' },
      { label: 'Marketing Automation', value: 'Marketing Automation' },
      { label: 'Software Development', value: 'Software Development' },
      { label: 'Not sure yet', value: 'Not sure yet' },
    ],
  },
  {
    name: CONTACT_FORM_PROPERTIES.budget,
    label: 'Project budget',
    type: 'enumeration',
    fieldType: 'select',
    options: [
      { label: 'Under $5K', value: 'Under $5K' },
      { label: '$5K–$10K', value: '$5K–$10K' },
      { label: '$10K–$25K', value: '$10K–$25K' },
      { label: '$25K+', value: '$25K+' },
      { label: "Let's talk", value: "Let's talk" },
    ],
  },
  {
    name: CONTACT_FORM_PROPERTIES.message,
    label: 'Project details',
    type: 'string',
    fieldType: 'textarea',
  },
];

let contactFormPropertiesReady: Promise<void> | null = null;

async function hubspotJson<T>(
  token: string,
  url: string,
  init: RequestInit,
): Promise<{ ok: boolean; status: number; body: T | string }> {
  try {
    const response = await fetch(url, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...(init.headers ?? {}),
      },
    });
    const text = await response.text();
    if (!text) return { ok: response.ok, status: response.status, body: '' };
    try {
      return { ok: response.ok, status: response.status, body: JSON.parse(text) as T };
    } catch {
      return { ok: response.ok, status: response.status, body: text };
    }
  } catch (error) {
    return { ok: false, status: 0, body: error instanceof Error ? error.message : 'Network error' };
  }
}

async function provisionContactFormProperties(token: string): Promise<void> {
  for (const def of CONTACT_FORM_PROPERTY_DEFS) {
    const existing = await hubspotJson(
      token,
      `https://api.hubapi.com/crm/v3/properties/contacts/${def.name}`,
      { method: 'GET' },
    );
    if (existing.ok) continue;
    if (existing.status !== 404) {
      console.error(`HubSpot property lookup ${def.name} failed:`, existing.body);
      continue;
    }

    const created = await hubspotJson(token, 'https://api.hubapi.com/crm/v3/properties/contacts', {
      method: 'POST',
      body: JSON.stringify({
        name: def.name,
        label: def.label,
        type: def.type,
        fieldType: def.fieldType,
        groupName: 'contactinformation',
        hasUniqueValue: false,
        hidden: false,
        ...(def.options
          ? {
              options: def.options.map((option, displayOrder) => ({
                label: option.label,
                value: option.value,
                hidden: false,
                displayOrder,
              })),
            }
          : {}),
      }),
    });
    if (!created.ok) {
      console.error(`HubSpot property create ${def.name} failed:`, created.body);
    }
  }
}

function ensureContactFormProperties(token: string): Promise<void> {
  if (!contactFormPropertiesReady) {
    contactFormPropertiesReady = provisionContactFormProperties(token).catch((error) => {
      contactFormPropertiesReady = null;
      console.error('HubSpot contact form property provision failed:', error);
    });
  }
  return contactFormPropertiesReady;
}

async function upsertContactByEmail(
  token: string,
  email: string,
  properties: Record<string, string>,
): Promise<{ id?: string; error?: string }> {
  const upserted = await hubspotJson<{ results?: Array<{ id?: string }> }>(
    token,
    'https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert',
    {
      method: 'POST',
      body: JSON.stringify({
        inputs: [
          {
            id: email,
            idProperty: 'email',
            properties: { ...properties, email },
          },
        ],
      }),
    },
  );

  if (upserted.ok && typeof upserted.body !== 'string') {
    const id = upserted.body.results?.[0]?.id;
    if (id) return { id };
  }

  if (!upserted.ok) {
    console.error('HubSpot contact upsert failed:', upserted.body);
  }

  const found = await findContactIdByEmail(token, email);
  if (found.id) {
    const patched = await patchContactProperties(token, found.id, properties);
    if (!patched.ok) return { error: patched.error };
    return { id: found.id };
  }

  const created = await hubspotJson<{ id?: string }>(
    token,
    'https://api.hubapi.com/crm/v3/objects/contacts',
    {
      method: 'POST',
      body: JSON.stringify({ properties: { ...properties, email } }),
    },
  );
  if (created.ok && typeof created.body !== 'string' && created.body.id) {
    return { id: created.body.id };
  }

  return {
    error:
      typeof created.body === 'string'
        ? created.body
        : `HubSpot create ${created.status}: ${JSON.stringify(created.body).slice(0, 400)}`,
  };
}

async function createContactNote(
  token: string,
  contactId: string,
  body: string,
): Promise<{ ok: boolean; error?: string }> {
  const created = await hubspotJson<{ id?: string }>(
    token,
    'https://api.hubapi.com/crm/v3/objects/notes',
    {
      method: 'POST',
      body: JSON.stringify({
        properties: {
          hs_timestamp: Date.now().toString(),
          hs_note_body: body,
        },
        associations: [
          {
            to: { id: contactId },
            types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 202 }],
          },
        ],
      }),
    },
  );

  if (created.ok) return { ok: true };
  return {
    ok: false,
    error:
      typeof created.body === 'string'
        ? created.body
        : `HubSpot note ${created.status}: ${JSON.stringify(created.body).slice(0, 400)}`,
  };
}

function buildContactFormNote(input: HubSpotContactSubmission): string {
  const lines = [
    'Website contact form',
    `Name: ${input.fullName.trim()}`,
    `Email: ${input.email.trim()}`,
    input.phone?.trim() ? `Phone: ${input.phone.trim()}` : '',
    `Company: ${input.company.trim()}`,
    input.annualCompanyRevenueLabel
      ? `Annual company revenue: ${input.annualCompanyRevenueLabel}`
      : '',
    input.service?.trim() ? `Service interested in: ${input.service.trim()}` : '',
    input.budget?.trim() ? `Project budget: ${input.budget.trim()}` : '',
    input.pageUri?.trim() ? `Page: ${input.pageUri.trim()}` : '',
    input.message?.trim() ? `\nProject details:\n${input.message.trim()}` : '',
  ];
  return lines.filter(Boolean).join('\n');
}

export function buildHubSpotContactProperties(
  input: HubSpotContactSubmission,
): Record<string, string> {
  const { firstname, lastname } = splitPersonName(input.fullName);
  const properties: Record<string, string> = {};

  if (firstname) properties.firstname = firstname;
  if (lastname) properties.lastname = lastname;
  if (input.phone?.trim()) properties.phone = input.phone.trim();
  if (input.company.trim()) properties.company = input.company.trim();
  if (input.annualCompanyRevenue?.trim()) {
    properties[CONTACT_FORM_PROPERTIES.annualCompanyRevenue] = input.annualCompanyRevenue.trim();
  }
  if (input.service?.trim()) properties[CONTACT_FORM_PROPERTIES.service] = input.service.trim();
  if (input.budget?.trim()) properties[CONTACT_FORM_PROPERTIES.budget] = input.budget.trim();
  if (input.message?.trim()) properties[CONTACT_FORM_PROPERTIES.message] = input.message.trim();
  if (input.pageUri?.trim()) properties.captive_demand_form_location = input.pageUri.trim();
  if (input.utmSource?.trim()) properties.utm_source = input.utmSource.trim();
  if (input.utmMedium?.trim()) properties.utm_medium = input.utmMedium.trim();
  if (input.utmCampaign?.trim()) properties.utm_campaign = input.utmCampaign.trim();

  return properties;
}

/**
 * Writes a /contact submission onto the HubSpot contact. The page form was
 * never posted to a HubSpot form, so collected-forms created a contact with
 * whatever it could guess (often just first name) and dropped the rest.
 */
export async function submitHubSpotContactForm(
  input: HubSpotContactSubmission,
): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const token = process.env.HUBSPOT_ACCESS_TOKEN?.trim();
  if (!token) {
    return { ok: true, skipped: true };
  }

  await ensureContactFormProperties(token);

  const email = input.email.trim();
  if (!email) return { ok: false, error: 'email required' };

  const allProperties = buildHubSpotContactProperties(input);
  const customNames = new Set<string>(Object.values(CONTACT_FORM_PROPERTIES));
  const standardProperties: Record<string, string> = {};
  const customProperties: Record<string, string> = {};
  for (const [key, value] of Object.entries(allProperties)) {
    if (customNames.has(key)) customProperties[key] = value;
    else standardProperties[key] = value;
  }

  // Standard fields first so a missing custom property cannot drop name/company.
  const upserted = await upsertContactByEmail(token, email, standardProperties);
  if (!upserted.id) {
    return { ok: false, error: upserted.error ?? 'contact not written' };
  }

  if (Object.keys(customProperties).length > 0) {
    const custom = await patchContactProperties(token, upserted.id, customProperties);
    if (!custom.ok) {
      console.error('HubSpot contact form custom properties failed:', custom.error);
    }
  }

  const note = await createContactNote(token, upserted.id, buildContactFormNote(input));
  if (!note.ok) {
    console.error('HubSpot contact form note failed:', note.error);
  }

  return { ok: true };
}
