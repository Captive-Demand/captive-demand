import type { Metadata } from "next";
import { Inter, Syne, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { DeferredFooter } from "@/components/layout/DeferredFooter";
import { SiteReCaptchaProvider } from "@/components/providers/SiteReCaptchaProvider";
import { SiteGoogleAnalytics } from "@/components/analytics/SiteGoogleAnalytics";
import { OrganizationSchema } from "@/components/schema/OrganizationSchema";
import { AdsRequestModalProvider } from "@/components/services/advertising/AdsRequestModalProvider";
import { AuditRequestModalProvider } from "@/components/shore-partnership/AuditRequestModalProvider";
import { siteConfig } from "@/lib/site";

const crawlableSiteLinks = [
    { href: "/work", label: "Case studies" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About Captive Demand" },
    { href: "/contact", label: "Contact Captive Demand" },
    { href: "/insights", label: "Digital marketing insights" },
    { href: "/products", label: "Products" },
    { href: "/products/calsync", label: "CalSync" },
    { href: "/services/website", label: "Website design services" },
    { href: "/services/seo", label: "SEO and AEO services" },
    { href: "/services/email-marketing", label: "Email marketing services" },
    { href: "/services/advertising", label: "PPC and paid advertising" },
    { href: "/services/software", label: "Custom software services" },
    { href: "/services/automation", label: "Workflow automation services" },
    { href: "/nashville-email-marketing-agency", label: "Nashville email marketing agency" },
    { href: "/nashville-seo-agency", label: "Nashville SEO agency" },
    { href: "/nashville-advertising-agency", label: "Nashville advertising agency" },
    { href: "/privacy", label: "Privacy policy" },
    { href: "/terms", label: "Terms of service" },
];

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});

const syne = Syne({
    subsets: ["latin"],
    variable: "--font-syne",
    weight: ["400", "500", "600", "700", "800"],
    display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    display: "swap",
    // Default next/font metric fallback for mono fonts is Arial — proportional, so labels read as "wrong"
    // sans until the woff2 loads. Use a real monospace stack during load instead (may add minor CLS).
    adjustFontFallback: false,
    fallback: [
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "Monaco",
        "Consolas",
        "Liberation Mono",
        "Courier New",
        "monospace",
    ],
});

const nohemi = localFont({
    src: "../../public/fonts/Nohemi-Light-BF6438cc5899919.ttf",
    variable: "--font-nohemi",
    weight: "300",
    display: "swap",
});

export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: {
        default: siteConfig.defaultTitle,
        template: siteConfig.titleTemplate,
    },
    description: siteConfig.description,
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        siteName: siteConfig.name,
        locale: "en_US",
        url: "/",
        title: siteConfig.defaultTitle,
        description: siteConfig.description,
        images: [
            {
                url: "/opengraph.png",
                width: 1200,
                height: 628,
                alt: siteConfig.name,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: siteConfig.defaultTitle,
        description: siteConfig.description,
        images: ["/opengraph.png"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="h-full">
            <head>
                {/*
                 * Preload the H1 font weight (Nohemi 300) used by the homepage hero.
                 * Nohemi is loaded via @font-face in globals.css, so Next.js can't
                 * auto-detect it and inject a preload. Without this, the H1 paints
                 * in the system fallback font and reflows when Nohemi loads, which
                 * was preventing Lighthouse from settling on a stable LCP element.
                 */}
                <link
                    rel="preload"
                    href="/fonts/Nohemi-Light-BF6438cc5899919.ttf"
                    as="font"
                    type="font/ttf"
                    crossOrigin="anonymous"
                />
            </head>
            <body className={`${inter.variable} ${syne.variable} ${jetBrainsMono.variable} ${nohemi.variable} antialiased h-full relative`}>
                <SiteReCaptchaProvider>
                <SiteGoogleAnalytics />
                <OrganizationSchema />
                <Navbar />
                <AuditRequestModalProvider>
                <AdsRequestModalProvider>
                <main className="relative z-10 bg-[#fafafa] w-full overflow-x-hidden">
                    {children}
                </main>
                </AdsRequestModalProvider>
                </AuditRequestModalProvider>
                <nav
                    aria-label="Site links"
                    className="sr-only focus-within:not-sr-only focus-within:fixed focus-within:bottom-4 focus-within:left-4 focus-within:z-[60] focus-within:max-w-sm focus-within:rounded-xl focus-within:border focus-within:border-brand-dark/10 focus-within:bg-[#fafafa] focus-within:p-4 focus-within:shadow-lg"
                >
                    <ul className="flex flex-col gap-2">
                        {crawlableSiteLinks.map((link) => (
                            <li key={link.href}>
                                <a href={link.href} className="text-sm text-brand-dark underline underline-offset-2">
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <DeferredFooter />
                </SiteReCaptchaProvider>
            </body>
        </html>
    );
}
