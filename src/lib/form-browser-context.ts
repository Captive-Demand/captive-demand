export type AuditFormBrowserContext = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  pageUri?: string;
  pageName?: string;
  hutk?: string;
};

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}

/** UTM + page context for HubSpot form attribution. Safe to call only in the browser. */
export function getAuditFormBrowserContext(): AuditFormBrowserContext {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source') ?? undefined,
    utmMedium: params.get('utm_medium') ?? undefined,
    utmCampaign: params.get('utm_campaign') ?? undefined,
    pageUri: window.location.href,
    pageName: document.title,
    hutk: readCookie('hubspotutk'),
  };
}
