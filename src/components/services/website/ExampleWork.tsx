'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

import { CTAButton } from '@/components/ui/CTAButton';
import { AccentBr } from '@/components/ui/accent-br';
import { caseStudies } from '@/data/case-studies';
import { DecorativeShapeWithLine } from '@/components/ui/DecorativeShapeWithLine';

// --- HELPER COMPONENT ---

// --- DATA STRUCTURES ---
interface Metric {
    value: string;
    label: string;
}

interface Project {
    id: string;
    title: string;
    headline?: string;
    description: string;
    image: string;
    number: string;
    industry?: string;
    services?: string[];
    metrics?: Metric[];
}

// Map case study to Project format
function caseStudyToProject(cs: (typeof caseStudies)[number], number: string): Project {
    return {
        id: cs.slug,
        title: cs.clientName,
        headline: cs.headline,
        description: cs.shortDescription,
        image: cs.heroImage,
        number,
        industry: cs.industryTag,
        services: cs.services.map((s) => s.toUpperCase()),
        metrics: cs.stats.slice(0, 2).map((s) => ({ value: s.value, label: s.label.toUpperCase() })),
    };
}

// All five from real case studies (003, 004, 005 are the three different ones user requested)
const featuredSlugs = ['custom-cowgirl', 'mentality-health', 'voyage-and-vibes', 'farmulated', 'boombox'];
const projects: Project[] = featuredSlugs.map((slug, i) => {
    const cs = caseStudies.find((c) => c.slug === slug);
    if (!cs) throw new Error(`Case study not found: ${slug}`);
    return caseStudyToProject(cs, String(i + 1).padStart(3, '0'));
});

export function ExampleWork() {
    const [activeIndex, setActiveIndex] = useState(0);
    const activeProject = projects[activeIndex];

    // Common Card Content Component
    const CardContent = ({ project }: { project: Project }) => {
        // Use headline if available, fallback to title
        const displayHeadline = project.headline || project.title;

        return (
            <>
                {/* Image Section (2/3 Width) */}
                <div className="relative w-full lg:w-2/3 aspect-[4/3] lg:aspect-none h-full rounded-lg overflow-hidden bg-gray-200 shrink-0">
                    <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 58vw"
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Content Section (1/3 Width) */}
                {/* REMOVED lg:pl-6 to bring content closer to image */}
                <div className="w-full lg:w-1/3 flex flex-col h-full justify-between pt-6 lg:pt-2">

                    {/* Header: Number & Industry Pill */}
                    <div className="flex justify-between items-start mb-6">
                        <span className="font-mono font-bold text-[#ff5501] text-sm">
                            {project.number}
                        </span>
                        {project.industry && (
                            <span className="bg-[#1a1512]/5 text-[#1a1512]/60 text-[10px] font-mono uppercase px-3 py-1 rounded-[6px] tracking-wider">
                                {project.industry}
                            </span>
                        )}
                    </div>

                    {/* Main Body: Title, Description, Services */}
                    <div>
                        {/* Title/Headline - Smaller size */}
                        <h4
                            className="font-medium font-sans text-[#1a1512] mb-4 leading-[1.2] text-xl lg:text-2xl tracking-tight"
                            style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}
                        >
                            {displayHeadline}
                        </h4>

                        {/* Description */}
                        <p className="text-sm text-[#1a1512]/70 font-mono leading-relaxed line-clamp-4 mb-6">
                            {project.description}
                        </p>

                        {/* Services Pills */}
                        {project.services && (
                            <div className="flex flex-wrap gap-2">
                                {project.services.map((service, i) => (
                                    <span key={i} className="border border-[#1a1512]/10 text-[#1a1512]/70 text-[10px] font-mono uppercase px-3 py-1.5 rounded-[4px] tracking-wider shadow-[inset_0px_4px_7px_0px_rgba(255,255,255,0.07),0px_4px_12px_0px_rgba(0,0,0,0.07)]">
                                        {service}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer: Metrics - Aligned to bottom */}
                    <div className="pt-8 mt-auto">
                        {project.metrics && project.metrics.length > 0 ? (
                            <div className="flex gap-6 lg:gap-8">
                                {project.metrics.map((metric, i) => (
                                    <div key={i}>
                                        <div className="text-[#ff5501] font-sans text-lg lg:text-xl font-bold leading-none mb-1" style={{ fontFamily: 'Nohemi, sans-serif' }}>
                                            {metric.value}
                                        </div>
                                        <div className="text-[#1a1512]/50 font-mono text-[10px] uppercase tracking-wider leading-tight">
                                            {metric.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </div>
            </>
        );
    };

    return (
        <section className="w-full bg-[#FAFAFA] py-20 md:py-32 overflow-hidden relative">
            <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col h-full">

                {/* Header */}
                <div className="mb-12 md:mb-20 max-w-7xl mx-auto w-full">
                    <div className="mb-6 w-full">
                        <DecorativeShapeWithLine shapeColor="#d5d5d5" lineColor="#e5e5e5" label="SELECTED WORK" />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                        <div>
                            
                            <h2 className="text-4xl md:text-5xl lg:text-6xl text-[#1a1512]" style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}>
                                We build ideas that shift<AccentBr />
                                perspectives and create<AccentBr />
                                <span className="text-[#1a1512]/40">lasting impact.</span>
                            </h2>
                        </div>
                        <div className="shrink-0">
                            <CTAButton variant="grey" text="More case studies" href="/work" ariaLabel="View All Work" />
                        </div>
                    </div>
                </div>

                {/* --- DESKTOP LAYOUT --- */}
                <div className="hidden lg:flex items-start gap-12 lg:gap-6">
                    {/* Left: Tabs Sticky Sidebar */}
                    <div className="w-1/4 flex flex-col gap-8 sticky top-32">
                        {projects.map((project, index) => (
                            <button
                                key={project.id}
                                onClick={() => setActiveIndex(index)}
                                className="group flex items-baseline gap-4 text-left transition-all duration-300"
                            >
                                <span className={`text-xs font-mono transition-colors duration-300 ${activeIndex === index ? 'text-[#ff5501]' : 'text-[#1a1512]/40 group-hover:text-[#1a1512]'
                                    }`}>
                                    {project.number}
                                </span>
                                <h3 className={`text-3xl xl:text-4xl whitespace-nowrap transition-all duration-300 ${activeIndex === index ? 'text-[#1a1512] translate-x-2' : 'text-[#1a1512]/40 group-hover:text-[#1a1512] group-hover:translate-x-1'
                                    }`} style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 500 }}>
                                    {project.title}
                                </h3>
                            </button>
                        ))}
                    </div>

                    {/* Right: The Card Container */}
                    <div className="w-3/4 relative min-h-[500px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeProject.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="relative w-full h-full perspective-1000"
                            >
                                <div className={cn(
                                    "w-full h-full",
                                    "rounded-2xl bg-[#f3f4f6] border border-[#1a1512]/5",
                                    "p-[10px]",
                                    "flex gap-4 shadow-sm transition-all duration-300 hover:shadow-md" // CHANGED: gap-6 to gap-4
                                )}>
                                    <CardContent project={activeProject} />
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* --- MOBILE/TABLET LAYOUT --- */}
                <div className="flex lg:hidden flex-col gap-12">
                    {projects.map((project, index) => (
                        <div key={project.id} className="flex flex-col">
                            <div className="flex items-baseline gap-3 mb-4 px-2">
                                <span className="text-xs font-mono text-[#ff5501]">
                                    {project.number}
                                </span>
                                <h3 className="text-3xl font-medium text-[#1a1512]" style={{ fontFamily: 'Nohemi, sans-serif' }}>
                                    {project.title}
                                </h3>
                            </div>
                            <div className={cn(
                                "w-full flex flex-col gap-5",
                                "rounded-2xl bg-[#f3f4f6] border border-[#1a1512]/5",
                                "p-5",
                                "shadow-sm"
                            )}>
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-200 shrink-0">
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                    />
                                </div>
                                <div className="flex flex-col gap-6">
                                    <div className="flex justify-between items-start">
                                        {project.industry && (
                                            <span className="bg-[#1a1512]/5 text-[#1a1512]/60 text-[10px] font-mono uppercase px-3 py-1 rounded-[6px] tracking-wider">
                                                {project.industry}
                                            </span>
                                        )}
                                    </div>
                                    <h4 className="text-xl font-medium font-sans text-[#1a1512] leading-[1.2]" style={{ fontFamily: 'Nohemi, sans-serif' }}>
                                        {project.headline || project.title}
                                    </h4>
                                    <p className="text-sm text-[#1a1512]/70 font-mono leading-relaxed">
                                        {project.description}
                                    </p>
                                    {project.services && (
                                        <div className="flex flex-wrap gap-2">
                                            {project.services.map((service, i) => (
                                                <span key={i} className="border border-[#1a1512]/10 text-[#1a1512]/70 text-[10px] font-mono uppercase px-3 py-1.5 rounded-[4px] tracking-wider shadow-[inset_0px_4px_7px_0px_rgba(255,255,255,0.07),0px_4px_12px_0px_rgba(0,0,0,0.07)]">
                                                    {service}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    {project.metrics && (
                                        <div className="flex flex-wrap gap-6 pt-4 border-t border-[#1a1512]/10">
                                            {project.metrics.map((metric, i) => (
                                                <div key={i}>
                                                    <div className="text-[#ff5501] font-sans text-lg font-bold leading-none mb-1" style={{ fontFamily: 'Nohemi, sans-serif' }}>
                                                        {metric.value}
                                                    </div>
                                                    <div className="text-[#1a1512]/50 font-mono text-[10px] uppercase tracking-wider leading-tight">
                                                        {metric.label}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}