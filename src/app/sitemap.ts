import type { MetadataRoute } from "next";
import { getAllInsightSlugs } from "@/lib/insights";
import { absoluteUrl } from "@/lib/site";
import { getAllSlugs } from "@/data/case-studies";

const staticRoutes = [
  "",
  "/about",
  "/work",
  "/contact",
  "/insights",
  "/pricing",
  "/products",
  "/products/calsync",
  "/services/website",
  "/services/email-marketing",
  "/services/software",
  "/services/seo",
  "/services/advertising",
  "/services/automation",
  "/nashville-email-marketing-agency",
  "/nashville-seo-agency",
  "/nashville-advertising-agency",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = staticRoutes.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const insightEntries = getAllInsightSlugs().map((slug) => ({
    url: absoluteUrl(`/insights/${slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const workEntries = getAllSlugs().map((slug) => ({
    url: absoluteUrl(`/work/${slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...insightEntries, ...workEntries];
}
