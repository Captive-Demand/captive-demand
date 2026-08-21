import { Hero } from "@/components/sections/Hero";
import { HomepageDeferredSections } from "@/components/sections/HomepageDeferredSections";
import { FAQSchema } from "@/components/schema/FAQSchema";
import { homeFaqs } from "@/lib/home-faqs";
import { createSeoMetadata } from "@/lib/site";

export const metadata = createSeoMetadata({
    title: "Portfolio Marketing for PE, Holding Companies & Family Offices",
    description:
        "Captive Demand is the in-house marketing and software team for portfolios. Senior US strategy, one consolidated stack, and proprietary software applied across every company you own.",
    path: "/",
});

export default function Home() {
    return (
        <>
            <FAQSchema faqs={homeFaqs} />
            <Hero />
            <HomepageDeferredSections />
        </>
    );
}
