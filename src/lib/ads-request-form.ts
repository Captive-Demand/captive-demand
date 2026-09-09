import { getAuditFormBrowserContext } from '@/lib/form-browser-context';

export type SubmitAdsRequestParams = {
  email: string;
  fullName: string;
  phone: string;
  company: string;
  website: string;
  platforms: string[];
  monthlyBudget?: string;
  recaptchaToken?: string;
};

export async function submitAdsRequestForm(params: SubmitAdsRequestParams): Promise<boolean> {
  if (
    !params.email.trim() ||
    !params.fullName.trim() ||
    !params.phone.trim() ||
    !params.company.trim() ||
    !params.website.trim() ||
    params.platforms.length === 0
  ) {
    return false;
  }

  const browser = getAuditFormBrowserContext();

  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source: 'ads-form',
      fullName: params.fullName.trim(),
      email: params.email.trim(),
      phone: params.phone.trim(),
      businessName: params.company.trim(),
      website: params.website.trim(),
      platforms: params.platforms,
      monthlyBudget: params.monthlyBudget?.trim(),
      recaptchaToken: params.recaptchaToken,
      utmSource: browser.utmSource,
      utmMedium: browser.utmMedium,
      utmCampaign: browser.utmCampaign,
      pageUri: browser.pageUri,
      pageName: browser.pageName,
      hutk: browser.hutk,
    }),
  });

  return res.ok;
}
