'use client';

import { usePathname } from 'next/navigation';

import { isStandaloneLanderPath } from '@/lib/standalone-landers';

export interface CrawlableSiteLink {
  href: string;
  label: string;
}

/**
 * Keyboard-reachable sitemap for crawlers and screen readers. Suppressed on
 * standalone landers, where the only intended way off the page is the CTA.
 */
export function CrawlableSiteLinks({ links }: { links: readonly CrawlableSiteLink[] }) {
  const pathname = usePathname();
  if (isStandaloneLanderPath(pathname)) return null;

  return (
    <nav
      aria-label="Site links"
      className="sr-only focus-within:not-sr-only focus-within:fixed focus-within:bottom-4 focus-within:left-4 focus-within:z-[60] focus-within:max-w-sm focus-within:rounded-xl focus-within:border focus-within:border-brand-dark/10 focus-within:bg-[#fafafa] focus-within:p-4 focus-within:shadow-lg"
    >
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} className="text-sm text-brand-dark underline underline-offset-2">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
