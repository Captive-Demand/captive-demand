import Image from 'next/image';
import Link from 'next/link';
import { EmailConduitFlow } from '@/components/services/email-marketing/EmailConduitFlow';
import { CTAButton } from '@/components/ui/CTAButton';
import { DecorativeShapeWithLine } from '@/components/ui/DecorativeShapeWithLine';

export function EmailConduit() {
  return (
    <section
      id="data"
      className="relative min-h-0 w-full bg-[#FAFAFA] py-20 font-sans text-[#1a1512] md:py-32"
    >
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-10 w-full">
          <DecorativeShapeWithLine label="DATA" />
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-start gap-6 lg:sticky lg:top-32">
            <h2
              className="text-pretty text-4xl tracking-tight text-[#1a1512] md:text-5xl lg:text-6xl"
              style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
            >
              <Image
                src="/conduitlogo.png"
                alt=""
                width={72}
                height={72}
                className="mr-[0.22em] inline-block h-[0.9em] w-[0.9em] rounded-[0.18em] object-contain align-top"
              />
              Conduit gets the data{' '}
              <span className="text-[#1a1512]/40">your campaigns need</span>
            </h2>
            <p className="text-pretty font-mono text-sm leading-relaxed text-[#1a1512]/60 md:text-[15px]">
              The reason most lifecycle email is generic is that the information needed to make it
              specific is trapped somewhere the email platform can&apos;t reach. Product usage sits
              in Mixpanel. Account health sits in a Metabase query. The list your team actually works
              from is a Google Sheet. Getting any of it into a marketing platform normally means a{' '}
              <Link
                href="/services/automation"
                className="underline decoration-[#1a1512]/25 underline-offset-4 transition-colors duration-150 hover:text-[#ff5501] hover:decoration-[#ff5501]"
              >
                workflow automation
              </Link>{' '}
              project or an engineering ticket, and by the time it lands the segment is stale.
            </p>
            <p className="text-pretty font-mono text-sm leading-relaxed text-[#1a1512]/60 md:text-[15px]">
              Conduit is our own software, and it removes that dependency. It pulls from where your
              data lives and pushes into the tools your campaigns run on, mapped once, then refreshed
              on whatever schedule you set. No code, no engineering ticket, no exported CSV that was
              accurate last Tuesday. And because we own it, the connector list isn&apos;t a limit:
              when your stack includes something it doesn&apos;t cover yet, we build it. With live
              data landing in custom fields, campaigns can be triggered by what someone actually did
              rather than by which list they happen to sit on.
            </p>
            <CTAButton
              variant="grey"
              text="See Conduit"
              href="https://buildyourconduit.com"
              as="a"
              target="_blank"
              rel="noopener noreferrer"
            />
          </div>

          <EmailConduitFlow />
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center font-mono text-[13px] leading-relaxed text-[#1a1512]/45">
          Postgres source in development. Custom integrations built on request: internal databases,
          booking systems, or anything else your stack runs on.
        </p>
      </div>
    </section>
  );
}

export default EmailConduit;
