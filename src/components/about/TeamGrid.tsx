'use client';

import React from 'react';
import Image from 'next/image';
import { AccentBr } from '@/components/ui/accent-br';
import { DecorativeShapeWithLine } from '@/components/ui/DecorativeShapeWithLine';

interface TeamMember {
    name: string;
    role: string;
    photo: string;
    tags: string[];
}

const TEAM: TeamMember[] = [
    { name: 'Spencer Donaldson', role: 'Founder & CEO', photo: '/3.png', tags: ['Strategy', 'Leadership', 'Growth'] },
    { name: 'Zachary Creasy', role: 'Creative Director', photo: '/2.png', tags: ['Brand', 'Design', 'Visual'] },
    { name: 'Michael Turner', role: 'Client Success Manager', photo: '/4.png', tags: ['Onboarding', 'Client Relations', 'Support'] },
    { name: 'Jordan Schneider', role: 'CMO', photo: '/Jordan2.png', tags: ['Email', 'Automation', 'Analytics'] },
];


export function TeamGrid() {
    return (
        <section className="w-full bg-[#FAFAFA] py-20 md:py-32 px-4">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-12 md:mb-16">
                    <div className="mb-6 w-full">
                        <DecorativeShapeWithLine label="Team" />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
                        <div>
                            <h2
                                className="text-4xl md:text-5xl lg:text-6xl text-[#1a1512]"
                                style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 300 }}
                            >
                                Embedded in your business.<AccentBr />
                                <span className="text-[#1a1512]/40">invested in your growth.</span>
                            </h2>
                        </div>
                        <div className="md:max-w-md md:text-right">
                            <p className="font-mono text-sm text-[#1a1512]/60 leading-relaxed uppercase tracking-wide">
                                We don&apos;t work like an agency. We work like your team — embedded, accountable, and always building toward your goals.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {TEAM.map((member) => (
                        <div
                            key={member.name}
                            className="group relative rounded-2xl border border-dashed border-[#ddd] bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-solid hover:border-[#d5d5d5]"
                            style={{
                                boxShadow: '0 1px 3px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.6)',
                            }}
                        >
                            {/* Photo — max-h 350px when stacked or 2-col */}
                            <div className="relative w-full overflow-hidden max-h-[350px] lg:max-h-none" style={{ aspectRatio: '4 / 5' }}>
                                <Image
                                    src={member.photo}
                                    alt={member.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                            </div>

                            {/* Info */}
                            <div className="p-5">
                                <p
                                    className="text-[20px] text-[#1a1512] tracking-tight"
                                    style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 600 }}
                                >
                                    {member.name}
                                </p>
                                <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-[#1a1512]/40 mt-1">
                                    {member.role}
                                </p>

                                {/* Divider */}
                                <div className="h-[1px] bg-[#e8e8e8] my-3" />

                                {/* Specialty Tags */}
                                <div className="flex flex-wrap gap-1.5">
                                    {member.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-[10px] font-medium px-3 py-1.5 rounded-lg uppercase tracking-wider"
                                            style={{
                                                background: 'linear-gradient(to bottom, #f7f6f5, #EBE9E5)',
                                                color: '#1a1512',
                                                boxShadow: 'inset 0 1px 0 0 #FFFFFF, 0 0 0 1px #D1CDC7, 0 2px 4px rgba(0,0,0,0.06)',
                                            }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
