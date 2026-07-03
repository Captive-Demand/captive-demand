import type { Redirect } from "next/dist/lib/load-custom-routes";

/** WordPress migration redirects — keep in sync with netlify.toml path rules. */
function pairsWithSlash(
  path: string,
  destination: string,
): Redirect[] {
  return [
    { source: path, destination, permanent: true },
    { source: `${path}/`, destination, permanent: true },
  ];
}

export const legacyRedirects: Redirect[] = [
  ...pairsWithSlash("/web-design-development", "/services/website"),
  ...pairsWithSlash("/search-engine-optimization", "/services/seo"),
  ...pairsWithSlash("/seo", "/services/seo"),
  ...pairsWithSlash("/marketing-automation", "/services/automation"),
  ...pairsWithSlash("/web-analytics-reporting", "/services/software"),
  ...pairsWithSlash("/content-creation", "/"),
  ...pairsWithSlash("/contact-us-today", "/contact"),
  ...pairsWithSlash("/services", "/services/website"),
  ...pairsWithSlash("/home", "/"),
  ...pairsWithSlash("/home-4", "/"),
  ...pairsWithSlash("/shore-partnership", "/shore-capital-partnership"),
  { source: "/author/:path*", destination: "/insights", permanent: true },
  ...pairsWithSlash("/blog", "/insights"),
  { source: "/blog/:path*", destination: "/insights/:path*", permanent: true },
  ...pairsWithSlash("/feed", "/insights"),
  ...pairsWithSlash("/our-work", "/work"),
  ...pairsWithSlash("/our-work/boombox-project", "/work/boombox"),
  ...pairsWithSlash("/our-work/verity-project", "/work/endura-commerce"),
  { source: "/our-work/:path*", destination: "/work/:path*", permanent: true },
  ...pairsWithSlash("/agency-calendar-management", "/insights/agency-calendar-management"),
  ...pairsWithSlash(
    "/solutions-for-website-design-franklin-tn",
    "/insights/solutions-for-website-design-franklin-tn",
  ),
  ...pairsWithSlash(
    "/a-michigan-seo-company-to-boost-your-digital-presence",
    "/insights/a-michigan-seo-company-to-boost-your-digital-presence",
  ),
  ...pairsWithSlash(
    "/digital-marketing-nashville-tn",
    "/insights/digital-marketing-nashville-tn",
  ),
  ...pairsWithSlash("/detroit-seo", "/insights/detroit-seo"),
  ...pairsWithSlash("/ai-seo-tools", "/insights/ai-seo-tools"),
  ...pairsWithSlash(
    "/website-designer-nashville",
    "/insights/website-designer-nashville",
  ),
  ...pairsWithSlash(
    "/one-big-change-you-need-cro-marketing",
    "/insights/one-big-change-you-need-cro-marketing",
  ),
  ...pairsWithSlash(
    "/results-driven-nashville-seo",
    "/insights/results-driven-nashville-seo",
  ),
  {
    source: "/",
    has: [{ type: "query", key: "p" }],
    destination: "/insights",
    permanent: true,
  },
];
