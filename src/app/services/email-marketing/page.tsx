import { EmailHero } from '@/components/services/email-marketing/EmailHero';
import { EmailFeatures } from '@/components/services/email-marketing/EmailFeatures';
import { EmailMethodology } from '@/components/services/email-marketing/EmailMethodology';
import { EmailApprovals } from '@/components/services/email-marketing/EmailApprovals';
import { EmailConduit } from '@/components/services/email-marketing/EmailConduit';
import { EmailDeliverability } from '@/components/services/email-marketing/EmailDeliverability';
import { EmailYourTeam } from '@/components/services/email-marketing/EmailYourTeam';
import { EmailReporting } from '@/components/services/email-marketing/EmailReporting';
import { EmailLandingPages } from '@/components/services/email-marketing/EmailLandingPages';
import { EmailPricing } from '@/components/services/email-marketing/EmailPricing';
import { WhyAEO, EMAIL_PROBLEM_CONTENT } from '@/components/services/seo/WhyAEO';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { CTASection } from '@/components/sections/CTASection';
import { ServiceSchema } from '@/components/schema/ServiceSchema';
import { createSeoMetadata } from '@/lib/site';
import { emailNationalFaqs } from '@/data/service-faqs';
import Link from 'next/link';

export const metadata = createSeoMetadata({
  title: 'Email Marketing Agency That Ships Fast | Captive Demand',
  description:
    'An email marketing agency that builds, writes, and ships your campaigns. Software-powered execution, approvals in Slack, and data that triggers the right send.',
  path: '/services/email-marketing',
});

export default function EmailMarketingServicePage() {
  return (
    <main className="min-h-screen w-full bg-[#FAFAFA]">
      <ServiceSchema
        name="Email Marketing"
        description={metadata.description as string}
        slug="email-marketing"
      />
      <EmailHero />
      <TestimonialsSection
        title={
          <Link
            href="/work"
            className="transition-colors duration-150 hover:text-[#ff5501]"
          >
            Sending on behalf of
          </Link>
        }
      />
      <WhyAEO content={EMAIL_PROBLEM_CONTENT} />
      <EmailFeatures subtitle="A full service, b2b email marketing agency: strategy, copy, campaigns, and hygiene." />
      <EmailMethodology />
      <EmailApprovals />
      <EmailConduit />
      <EmailDeliverability />
      <EmailYourTeam />
      <EmailReporting />
      <EmailLandingPages />
      <EmailPricing />
      <FAQSection items={emailNationalFaqs} />
      <CTASection
        dek="Send us your account and we'll audit the program: what's sending, what's landing, what's leaking revenue, and what we'd build first."
        nextStep="A senior operator does the review and gives you a straight read."
      />
    </main>
  );
}
