import { EmailHero } from '@/components/services/email-marketing/EmailHero';
import { NashvilleEmailBody } from '@/components/services/nashville/NashvilleEmailBody';
import { EmailPricing } from '@/components/services/email-marketing/EmailPricing';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { NASHVILLE_CLIENT_LOGO_NAMES } from '@/components/about/ClientLogos';
import { FAQSection } from '@/components/sections/FAQSection';
import { ServiceClosingCTA } from '@/components/services/shared/ServiceClosingCTA';
import { ServiceSchema } from '@/components/schema/ServiceSchema';
import { createSeoMetadata } from '@/lib/site';
import { emailNashvilleFaqs } from '@/data/service-faqs';
import { AccentBr } from '@/components/ui/accent-br';

export const metadata = createSeoMetadata({
  title: 'Nashville Email Marketing Agency | Captive Demand',
  description:
    'A Nashville email marketing agency that writes, builds, and ships your campaigns. Approvals in Slack, and data that triggers the right send. Free audit.',
  path: '/nashville-email-marketing-agency',
});

export default function NashvilleEmailMarketingPage() {
  return (
    <main className="min-h-screen w-full bg-[#FAFAFA]">
      <ServiceSchema
        name="Nashville Email Marketing Agency"
        description={metadata.description as string}
        slug="email-marketing"
        path="/nashville-email-marketing-agency"
        areaServed="Nashville, TN"
      />
      <EmailHero
        eyebrowCategory="Location"
        eyebrowLabel="Nashville, Tennessee"
        h1="A Nashville email marketing agency that actually ships"
        subhead="Most email programs don't stall for lack of ideas. They stall waiting on a designer, waiting on copy, waiting on one more round of approvals. We built software that closes that gap: you request a campaign in Asana, give feedback in Slack, and the edits apply themselves."
        buttonText="GET A FREE PROGRAM AUDIT"
        leadSource="nashville_email_audit"
      />
      <TestimonialsSection
        companyNames={NASHVILLE_CLIENT_LOGO_NAMES}
        title={
          <>
            <span className="text-[#d3d4d9]">Sending on behalf of</span>
            <AccentBr />
            <span className="text-[#1a1512]">Nashville and Middle Tennessee brands</span>
          </>
        }
      />
      <NashvilleEmailBody />
      <EmailPricing />
      <FAQSection items={emailNashvilleFaqs} />
      <ServiceClosingCTA
        body="Send us your account and we'll audit the program: what's sending, what's landing, what's leaking revenue, and what we'd build first. A senior operator does the review. Nashville clients, we'll buy the coffee."
        buttonText="GET A FREE PROGRAM AUDIT"
        leadSource="nashville_email_audit"
      />
    </main>
  );
}
