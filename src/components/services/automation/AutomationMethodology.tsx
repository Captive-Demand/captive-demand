'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';
import { AnimatedCTAButton } from '@/components/sections/Hero';
import { AccentBr } from '@/components/ui/accent-br';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DecorativeShapeWithLine } from '@/components/ui/DecorativeShapeWithLine';


const automationServicesData = [
    {
        id: '01',
        name: 'Discovery',
        subtext: <>We map your chaos.<br />Then we fix it.</>,
        description: "Before building a single workflow, we audit your current processes, identify bottlenecks, and map every handoff. We document what's manual, what's repetitive, and what's costing you hours. The discovery becomes the blueprint for automation.",
        tags: ['Process Audit', 'Tool Inventory', 'Pain Point Mapping', 'ROI Projection', 'Stakeholder Interviews', 'Current State Analysis'],
    },
    {
        id: '02',
        name: 'Architecture',
        subtext: <>Design the flow.<br />Build the logic.</>,
        description: "We design the automation architecture: triggers, conditions, branches, and fallbacks. Every edge case gets a path. We choose the right tools (Make, Zapier, n8n, or custom) and define how data flows between your systems.",
        tags: ['Workflow Design', 'Trigger Mapping', 'Error Handling', 'Tool Selection', 'Data Flow', 'Scalability'],
    },
    {
        id: '03',
        name: 'Build',
        subtext: <>Code it once.<br />Run it forever.</>,
        description: "We build the workflows, test every branch, and handle edge cases. We set up logging, monitoring, and alerts so you know when something breaks. The result: a system that runs 24/7 without you thinking about it.",
        tags: ['Workflow Build', 'Testing', 'Logging', 'Monitoring', 'Documentation', 'Handoff'],
    },
    {
        id: '04',
        name: 'Optimize',
        subtext: <>Measure. Iterate.<br />Scale.</>,
        description: "We track performance, identify bottlenecks, and optimize. As your business grows, we extend the automation to new processes. The system evolves with you.",
        tags: ['Performance Review', 'Bottleneck Analysis', 'A/B Testing', 'Scaling', 'New Integrations', 'Continuous Improvement'],
    },
];

const ServiceContent = ({ service }: { service: (typeof automationServicesData)[0] }) => (
    <div className="pb-8 pt-4 px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start mb-16">
            <div className="lg:col-span-4 flex flex-col items-start">
                <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-sm leading-snug">{service.subtext}</p>
                <AnimatedCTAButton />
            </div>

            <div className="lg:col-span-4">
                <p className="font-mono text-sm leading-relaxed text-white/60">{service.description}</p>
            </div>

            <div className="lg:col-span-4">
                <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
                    {service.tags.map((tag, i) => (
                        <span
                            key={i}
                            className="px-3 py-1.5 rounded-[7px] border border-white/10 text-xs font-mono text-white/60 hover:border-white/40 hover:text-white transition-colors cursor-default"
                            style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 2px rgba(0,0,0,0.15)' }}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const AccordionItem = ({
    service,
    isOpen,
    onClick,
}: {
    service: (typeof automationServicesData)[0];
    isOpen: boolean;
    onClick: () => void;
}) => (
    <div
        className={`relative w-full overflow-hidden transition-all duration-500 ease-in-out rounded-3xl ${
            isOpen ? 'bg-[#1a1512]' : 'bg-[#f3f4f6] hover:bg-[#e8e8e8]'
        }`}
        style={isOpen ? {} : { boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.15)' }}
    >
        <button onClick={onClick} className="w-full flex items-center justify-between p-6 md:p-8">
            <div className="flex min-w-0 flex-1 items-start md:items-center gap-3 sm:gap-4 md:gap-8">
                <span
                    className={`shrink-0 font-mono text-sm transition-colors duration-300 ${
                        isOpen ? 'text-[#ff5501] font-bold' : 'text-[#1a1512]/40'
                    }`}
                >
                    {service.id}
                </span>
                <span
                    className={`min-w-0 text-left text-lg leading-tight sm:text-xl md:text-4xl md:leading-none uppercase tracking-wide transition-colors duration-300 ${
                        isOpen ? 'text-white font-medium' : 'text-[#1a1512]/60 group-hover:text-[#1a1512]'
                    }`}
                    style={{ fontFamily: 'Nohemi, sans-serif' }}
                >
                    {service.name}
                </span>
            </div>

            <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isOpen ? 'bg-white/10 text-white' : 'bg-[#e8e8e8] text-[#1a1512]/40 hover:bg-[#d5d5d5]'
                }`}
            >
                <Plus size={20} className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`} />
            </div>
        </button>

        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] as [number, number, number, number] }}
                >
                    <ServiceContent service={service} />
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

export function AutomationMethodology() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 600);
        return () => clearTimeout(timeout);
    }, [openIndex]);

    return (
        <section className="w-full bg-[#FAFAFA] py-20 md:py-32 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 md:mb-16">
                    <div className="mb-6 w-full">
                        <DecorativeShapeWithLine shapeColor="#d5d5d5" lineColor="#e5e5e5" label="METHODOLOGY" />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
                        <div>
                            
                            <h2
                                className="text-4xl md:text-5xl lg:text-6xl text-[#1a1512]"
                                style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
                            >
                                From manual to autopilot.<AccentBr />
                                <span className="text-[#1a1512]/40">The system behind the flow.</span>
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {automationServicesData.map((service, index) => (
                        <AccordionItem
                            key={service.id}
                            service={service}
                            isOpen={openIndex === index}
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
