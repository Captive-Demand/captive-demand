'use client';

import Image from 'next/image';
import { AdFactoryDock } from '@/components/services/advertising/AdFactoryDock';
import { ServiceAccentTitle, ServiceSectionShell } from '@/components/services/shared/ServiceSectionShell';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';

export function AdvertisingSoftware() {
  return (
    <ServiceSectionShell
      id="software"
      label="SOFTWARE"
      title={<ServiceAccentTitle lead="Campaigns live in hours," accent="not weeks" />}
    >
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="space-y-5 lg:col-span-5">
          <p className="text-pretty font-mono text-sm leading-relaxed text-[#1a1512]/70 md:text-[15px]">
            AdFactory is our own build software. It posts campaigns directly against the ad platform
            APIs, which means a full campaign, every ad set, every placement, every creative variant,
            goes from approved spec to built account in hours instead of the days it takes to click
            through an ads manager.
          </p>
          <p className="text-pretty font-mono text-sm leading-relaxed text-[#1a1512]/70 md:text-[15px]">
            Everything builds paused. Nothing goes live until you&apos;ve reviewed it and said go.
          </p>
          <p className="text-pretty font-mono text-sm leading-relaxed text-[#1a1512]/70 md:text-[15px]">
            The practical difference: when a test idea comes up mid-month, it runs that week. It
            doesn&apos;t go in the queue for next month&apos;s build.
          </p>
        </div>

        <div className="lg:col-span-7">
          <div className="flex min-h-[500px] items-stretch rounded-2xl border border-[#1a1512]/5 bg-[#f3f4f6] p-[10px] shadow-sm">
            <div
              className="relative min-h-[480px] w-full overflow-hidden rounded-lg bg-[#0a0a0a] sm:aspect-auto lg:min-h-0"
              role="img"
              aria-label="AdFactory posting a campaign build to Meta, Google Ads, and LinkedIn, paused for review."
            >
              <Image
                src="/mountain.png"
                alt=""
                fill
                className="object-cover object-[50%_35%]"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/20"
                aria-hidden
              />
              <NoiseOverlay opacity={0.04} className="z-[1]" />
              <div className="absolute bottom-0 left-1/2 z-10 w-full -translate-x-1/2 translate-y-12 px-3 sm:translate-y-14 sm:px-4">
                <div className="relative z-10 mx-auto w-[min(94%,520px)] rounded-[22px] border border-white/35 bg-white/15 p-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-3">
                  <AdFactoryDock className="w-full shadow-none sm:w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ServiceSectionShell>
  );
}

export default AdvertisingSoftware;
