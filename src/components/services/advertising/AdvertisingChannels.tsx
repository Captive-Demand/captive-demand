'use client';

import { AccentBr } from '@/components/ui/accent-br';
import { SolutionMarquee } from '@/components/services/shared/SolutionMarquee';

const channels = [
    {
        title: 'Google Ads',
        logo: { src: '/logos/channels/google-ads.svg', width: 312, height: 48 },
        description:
            'Search, Shopping, Performance Max, Demand Gen. Single-theme ad groups, exact and phrase match, no broad-match budget leaks. Display Network and Search Partners off unless we\'ve tested into them.',
    },
    {
        title: 'Meta Ads',
        logo: { src: '/logos/channels/meta.svg', width: 948, height: 191 },
        description:
            'Facebook and Instagram Feed, Reels, and Stories. Built through AdFactory against the Marketing API, with creative composed natively for each aspect ratio.',
    },
    {
        title: 'TikTok',
        logo: { src: '/logos/channels/tiktok.svg', width: 1183, height: 287 },
        description:
            'We run TikTok where the audience is genuinely there rather than because the platform exists.',
    },
    {
        title: 'Bing',
        logo: { src: '/logos/channels/bing.svg', width: 154, height: 24 },
        description:
            'We run Bing where the audience is genuinely there rather than because the platform exists.',
    },
    {
        title: 'Pinterest',
        logo: { src: '/logos/channels/pinterest.svg', width: 826, height: 209 },
        description:
            'We run Pinterest where the audience is genuinely there rather than because the platform exists.',
    },
    {
        title: 'LinkedIn',
        logo: { src: '/logos/channels/linkedin.svg', width: 852, height: 223 },
        description:
            'LinkedIn earns its cost for B2B and considered-purchase offers where the targeting justifies the CPM.',
    },
];

export interface AdvertisingChannelsProps {
    title?: React.ReactNode;
    body?: string;
    link?: { href: string; label: string };
}

export function AdvertisingChannels({
    title,
    body,
    link,
}: AdvertisingChannelsProps = {}) {
    return (
        <SolutionMarquee
            label="CHANNELS"
            title={
                title ?? (
                    <>
                        Search and social,<AccentBr />
                        <span className="text-white/70">run by the same team</span>
                    </>
                )
            }
            body={
                body ??
                "One strategist across every channel you run, so your Google and Meta accounts aren't making contradictory bets with the same budget. Single channel or full mix. The fee structure is the same either way."
            }
            items={channels}
            footer={null}
            link={link}
            dark
        />
    );
}

export default AdvertisingChannels;
