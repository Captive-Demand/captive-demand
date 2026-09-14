import Script from "next/script";

import { siteConfig } from "@/lib/site";

function resolvedContainerId(): string | undefined {
  const fromEnv = process.env.NEXT_PUBLIC_GTM_CONTAINER_ID?.trim();
  if (fromEnv) return fromEnv;
  const fromConfig = siteConfig.gtmContainerId.trim();
  return fromConfig || undefined;
}

/**
 * Google Tag Manager — hosts the Meta Pixel and the GA4 event tags.
 *
 * `afterInteractive` rather than `lazyOnload`: on an ad landing page, waiting for
 * the window load event means the Pixel PageView fires late or not at all for
 * someone who bounces in two seconds.
 *
 * Skips development unless `NEXT_PUBLIC_GTM_IN_DEV=true`.
 */
export function GoogleTagManager() {
  const gtmId = resolvedContainerId();
  if (!gtmId) return null;

  const skipInDev =
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_GTM_IN_DEV !== "true";

  if (skipInDev) {
    return null;
  }

  return (
    <>
      <Script id="gtm-init" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmId}');
        `}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}
