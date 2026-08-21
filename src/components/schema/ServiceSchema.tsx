import { absoluteUrl } from "@/lib/site";
import { JsonLd } from "./JsonLd";

interface ServiceSchemaProps {
  name: string;
  description: string;
  slug: string;
  /** Full path when not under /services/{slug} (e.g. Nashville local pages). */
  path?: string;
  areaServed?: string;
}

export function ServiceSchema({
  name,
  description,
  slug,
  path,
  areaServed = "United States",
}: ServiceSchemaProps) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name,
        description,
        provider: { "@id": absoluteUrl("/#organization") },
        areaServed,
        url: absoluteUrl(path ?? `/services/${slug}`),
      }}
    />
  );
}
