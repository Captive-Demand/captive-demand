import { getAuditFormBrowserContext } from '@/lib/form-browser-context';
import { markShoreFormSubmitted } from '@/lib/shore-form-session';

export type ShoreAuditFormSource = 'audit-form' | 'exit-intent';

export type SubmitShoreAuditParams = {
  source: ShoreAuditFormSource;
  email: string;
  fullName: string;
  businessName: string;
  phone: string;
  siteUrls: string[];
  recaptchaToken?: string;
};

export function normalizeSiteUrls(urls: string[]): string[] {
  return urls.map((u) => u.trim()).filter(Boolean);
}

export function formatSiteUrlsMessage(urls: string[]): string {
  return normalizeSiteUrls(urls).join('\n');
}

export async function submitShoreAuditForm(params: SubmitShoreAuditParams): Promise<boolean> {
  const urls = normalizeSiteUrls(params.siteUrls);
  if (!params.email.trim() || !params.phone.trim() || urls.length === 0) {
    return false;
  }

  const browser = getAuditFormBrowserContext();

  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source: params.source,
      fullName: params.fullName.trim(),
      email: params.email.trim(),
      phone: params.phone.trim(),
      businessName: params.businessName.trim(),
      message: formatSiteUrlsMessage(urls),
      recaptchaToken: params.recaptchaToken,
      utmSource: browser.utmSource,
      utmMedium: browser.utmMedium,
      utmCampaign: browser.utmCampaign,
      pageUri: browser.pageUri,
      pageName: browser.pageName,
      hutk: browser.hutk,
    }),
  });

  if (!res.ok) {
    return false;
  }

  markShoreFormSubmitted();
  return true;
}
