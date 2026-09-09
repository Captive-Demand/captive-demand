import { AdvertisingHero } from '@/components/services/advertising/AdvertisingHero';
import { NashvilleAdsBody } from '@/components/services/nashville/NashvilleAdsBody';
import { AdvertisingPricing } from '@/components/services/advertising/AdvertisingPricing';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { NASHVILLE_CLIENT_LOGO_NAMES } from '@/components/about/ClientLogos';
import { FAQSection } from '@/components/sections/FAQSection';
import { CTASection } from '@/components/sections/CTASection';
import { ServiceSchema } from '@/components/schema/ServiceSchema';
import { createSeoMetadata } from '@/lib/site';
import { adsNashvilleFaqs } from '@/data/service-faqs';
import { AccentBr } from '@/components/ui/accent-br';

export const metadata = createSeoMetadata({
  title: 'Nashville Advertising Agency | Paid Ads | Captive Demand',
  description:
    'A Nashville advertising agency built for performance, not brand awareness. Google and Meta ads, creative included, and fees capped at $6,000/month.',
  path: '/nashville-advertising-agency',
});

export default function NashvilleAdvertisingAgencyPage() {
  return (
    <main className="min-h-screen w-full bg-[#FAFAFA]">
      <ServiceSchema
        name="Nashville Advertising Agency"
        description={metadata.description as string}
        slug="advertising"
        path="/nashville-advertising-agency"
        areaServed="Nashville, TN"
      />
      <AdvertisingHero
        eyebrowCategory="Location"
        eyebrowLabel="Nashville, Tennessee"
        h1="A Nashville advertising agency that's measured on revenue"
        subhead="Nashville has no shortage of agencies that will build you a beautiful brand campaign. We do the other thing: paid advertising on Google and Meta, tracked to the dollar, reported weekly. Static ad creative included, and our fee caps at $6,000/month no matter how much you scale."
        buttonText="GET A FREE ACCOUNT AUDIT"
        leadSource="nashville_ads_audit"
      />
      <TestimonialsSection
        companyNames={NASHVILLE_CLIENT_LOGO_NAMES}
        title={
          <>
            <span className="text-[#d3d4d9]">Working with Nashville</span>
            <AccentBr />
            <span className="text-[#1a1512]">and Middle Tennessee brands</span>
          </>
        }
      />
      <NashvilleAdsBody />
      <AdvertisingPricing />
      <FAQSection items={adsNashvilleFaqs} />
      <CTASection
        dek="Send us your ad account and we'll tell you what we'd change. No pitch deck, no discovery sequence: a senior operator looks at it and gives you a straight read. Nashville clients, we'll buy the coffee."
      />
    </main>
  );
}
