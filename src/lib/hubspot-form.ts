export const DEFAULT_HUBSPOT_PORTAL_ID = '51761572';
export const DEFAULT_HUBSPOT_AUDIT_FORM_ID = 'b4944350-8188-42ab-b168-5fb8bf1eb967';

export type HubSpotAuditSubmission = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  siteUrls: string[];
  formLocation?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  pageUri?: string;
  pageName?: string;
  hutk?: string;
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

export function buildHubSpotAuditFields(input: HubSpotAuditSubmission): HubSpotFormField[] {
  const { firstname, lastname } = splitPersonName(input.fullName);
  const website = input.siteUrls.map((url) => url.trim()).filter(Boolean)[0] ?? '';

  return [
    field('firstname', firstname),
    field('lastname', lastname),
    field('email', input.email),
    field('phone', input.phone),
    field('company', input.company),
    field('website', website, '0-2'),
    field('utm_source', input.utmSource),
    field('utm_medium', input.utmMedium),
    field('utm_campaign', input.utmCampaign),
    field('captive_demand_form_location', input.formLocation),
  ].filter((item): item is HubSpotFormField => item !== null);
}

export function isHubSpotConfigured(): boolean {
  return Boolean(process.env.HUBSPOT_ACCESS_TOKEN?.trim());
}

export async function submitHubSpotAuditForm(
  input: HubSpotAuditSubmission,
): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const token = process.env.HUBSPOT_ACCESS_TOKEN?.trim();
  if (!token) {
    return { ok: true, skipped: true };
  }

  const portalId = process.env.HUBSPOT_PORTAL_ID?.trim() || DEFAULT_HUBSPOT_PORTAL_ID;
  const formId = process.env.HUBSPOT_AUDIT_FORM_ID?.trim() || DEFAULT_HUBSPOT_AUDIT_FORM_ID;

  const context: Record<string, string> = {};
  if (input.pageUri?.trim()) context.pageUri = input.pageUri.trim();
  if (input.pageName?.trim()) context.pageName = input.pageName.trim();
  if (input.hutk?.trim()) context.hutk = input.hutk.trim();

  const extraUrls = input.siteUrls.map((url) => url.trim()).filter(Boolean).slice(1);
  const pageName =
    extraUrls.length > 0
      ? `${context.pageName || 'Audit request'} · additional sites: ${extraUrls.join(' | ')}`
      : context.pageName;
  if (pageName) context.pageName = pageName;

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
          fields: buildHubSpotAuditFields(input),
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
