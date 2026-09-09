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

async function findContactIdByEmail(
  token: string,
  email: string,
): Promise<{ id?: string; error?: string }> {
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  for (let attempt = 0; attempt < 4; attempt += 1) {
    if (attempt > 0) {
      await new Promise((resolve) => setTimeout(resolve, 400 * attempt));
    }

    let searchResponse: Response;
    try {
      searchResponse = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: email }] }],
          properties: ['email'],
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

    const searchBody = (await searchResponse.json()) as { results?: Array<{ id?: string }> };
    const id = searchBody.results?.[0]?.id;
    if (id) return { id };
  }

  return {};
}

async function patchContactProperties(
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
