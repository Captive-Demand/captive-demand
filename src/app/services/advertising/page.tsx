import { AdvertisingHero } from '@/components/services/advertising/AdvertisingHero';
import { AdvertisingChannels } from '@/components/services/advertising/AdvertisingChannels';
import { AdvertisingMethodology } from '@/components/services/advertising/AdvertisingMethodology';
import { AdvertisingPricing } from '@/components/services/advertising/AdvertisingPricing';
import { WhyAEO, ADS_PROBLEM_CONTENT } from '@/components/services/seo/WhyAEO';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { CTASection } from '@/components/sections/CTASection';
import { ServiceSchema } from '@/components/schema/ServiceSchema';
import { createSeoMetadata } from '@/lib/site';
import { adsNationalFaqs } from '@/data/service-faqs';
import Link from 'next/link';

export const metadata = createSeoMetadata({
  title: 'Senior PPC Strategy, Creative Included | Captive Demand',
  description:
    'Senior on-shore strategy and execution, static creative included and pricing that doesn\'t balloon with your ad spend.',
  path: '/services/advertising',
});

export default function AdvertisingServicePage() {
  return (
    <main className="min-h-screen w-full bg-[#FAFAFA]">
      <ServiceSchema
        name="Paid Advertising"
        description={metadata.description as string}
        slug="advertising"
      />
      <AdvertisingHero />
      <TestimonialsSection
        title={
          <Link
            href="/work"
            className="transition-colors duration-150 hover:text-[#ff5501]"
          >
            Trusted to spend well by
          </Link>
        }
      />
      <WhyAEO content={ADS_PROBLEM_CONTENT} />
      <AdvertisingChannels />
      <AdvertisingMethodology />
      <AdvertisingPricing />
      <FAQSection items={adsNationalFaqs} />
      <CTASection />
    </main>
  );
}
