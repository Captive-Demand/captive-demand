import { SEOHero } from '@/components/services/seo/SEOHero';
import { WhyAEO } from '@/components/services/seo/WhyAEO';
import { SEOPractice } from '@/components/services/seo/SEOPractice';
import { SEOMethodology } from '@/components/services/seo/SEOMethodology';
import { SEOProminence } from '@/components/services/seo/SEOProminence';
import { SEOVelocity } from '@/components/services/seo/SEOVelocity';
import { ResultsShowcase } from '@/components/services/seo/ResultsShowcase';
import { SEOYourTeam } from '@/components/services/seo/SEOYourTeam';
import { SEOReporting } from '@/components/services/seo/SEOReporting';
import { SEOLandingPages } from '@/components/services/seo/SEOLandingPages';
import { SEOPricing } from '@/components/services/seo/SEOPricing';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { CTASection } from '@/components/sections/CTASection';
import { ServiceSchema } from '@/components/schema/ServiceSchema';
import { createSeoMetadata } from '@/lib/site';
import { seoNationalFaqs } from '@/data/service-faqs';
import Link from 'next/link';

export const metadata = createSeoMetadata({
  title: 'Answer Engine Optimization Services | Captive Demand',
  description:
    'Answer engine optimization services that get you cited by AI search and ranked on Google. 200+ optimizations shipped per site every month.',
  path: '/services/seo',
});

export default function SEOServicePage() {
  return (
    <main className="min-h-screen w-full bg-[#FAFAFA]">
      <ServiceSchema
        name="Answer Engine Optimization Services"
        description={metadata.description as string}
        slug="seo"
      />
      <SEOHero />
      <TestimonialsSection
        title={
          <Link
            href="/work"
            className="transition-colors duration-150 hover:text-[#ff5501]"
          >
            Ranked and cited for
          </Link>
        }
      />
      <WhyAEO />
      <SEOPractice />
      <SEOMethodology />
      <SEOProminence />
      <SEOVelocity />
      <ResultsShowcase />
      <SEOYourTeam />
      <SEOReporting />
      <SEOLandingPages />
      <SEOPricing />
      <FAQSection items={seoNationalFaqs} />
      <CTASection
        dek="Send us your site and we'll tell you where you actually stand: what's ranking, what's being cited, and what's realistic to win."
        nextStep="A senior operator does the audit and gives you a straight read."
      />
    </main>
  );
}
