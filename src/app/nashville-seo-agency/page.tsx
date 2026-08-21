import { SEOHero } from '@/components/services/seo/SEOHero';
import { NashvilleSeoBody } from '@/components/services/nashville/NashvilleSeoBody';
import { SEOPricing } from '@/components/services/seo/SEOPricing';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { NASHVILLE_CLIENT_LOGO_NAMES } from '@/components/about/ClientLogos';
import { FAQSection } from '@/components/sections/FAQSection';
import { ServiceClosingCTA } from '@/components/services/shared/ServiceClosingCTA';
import { ServiceSchema } from '@/components/schema/ServiceSchema';
import { createSeoMetadata } from '@/lib/site';
import { seoNashvilleFaqs } from '@/data/service-faqs';
import { AccentBr } from '@/components/ui/accent-br';

export const metadata = createSeoMetadata({
  title: 'Nashville SEO Agency | SEO & AEO | Captive Demand',
  description:
    'A Nashville SEO agency that gets you ranked on Google and cited by AI search. 200+ optimizations shipped to your site every month. Free audit.',
  path: '/nashville-seo-agency',
});

export default function NashvilleSeoAgencyPage() {
  return (
    <main className="min-h-screen w-full bg-[#FAFAFA]">
      <ServiceSchema
        name="Nashville SEO Agency"
        description={metadata.description as string}
        slug="seo"
        path="/nashville-seo-agency"
        areaServed="Nashville, TN"
      />
      <SEOHero
        eyebrowCategory="Location"
        eyebrowLabel="Nashville, Tennessee"
        h1="A Nashville SEO agency built for how people search now"
        subhead="Half the work of ranking in Nashville is still what it always was: technical foundations, real content, earned links. The other half is new: your buyers are asking AI assistants before they ever see a list of results, and getting cited in those answers takes different work. We do both, and we ship 200+ optimizations to your site every month doing it."
        buttonText="GET A FREE SITE AUDIT"
        leadSource="nashville_seo_audit"
      />
      <TestimonialsSection
        companyNames={NASHVILLE_CLIENT_LOGO_NAMES}
        title={
          <>
            <span className="text-[#d3d4d9]">Ranking for Nashville</span>
            <AccentBr />
            <span className="text-[#1a1512]">and Middle Tennessee brands</span>
          </>
        }
      />
      <NashvilleSeoBody />
      <SEOPricing />
      <FAQSection items={seoNashvilleFaqs} />
      <ServiceClosingCTA
        body="Send us your site and we'll tell you where you stand: what's ranking, what's being cited, and what's realistic to win in this market. A senior operator does the audit. Nashville clients, we'll buy the coffee."
        buttonText="GET A FREE SITE AUDIT"
        leadSource="nashville_seo_audit"
      />
    </main>
  );
}
