"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { DecorativeShapeWithLine } from '@/components/ui/DecorativeShapeWithLine';

type Service = {
  id: string;
  number: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
};

const services: Service[] = [{
  id: '01',
  number: '01',
  title: 'Web Design & Development',
  description: 'Developers charge an arm and a leg for websites that don\'t match business goals. We\'re marketers who leverage best-of-breed CMSs to move quickly and affordably while focusing on conversion.',
  tags: ['Responsive Design', 'CMS Integration', 'Conversion Focused', 'SEO Ready'],
  imageUrl: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=2069&auto=format&fit=crop'
}, {
  id: '02',
  number: '02',
  title: 'SEO Services',
  description: 'Visibility in Google is still one of the best ways to drum up demand. Local SEO is very achievable with the correct keyword strategy and time horizon. Our team has decades of experience.',
  tags: ['Local SEO', 'Keyword Strategy', 'Page 1 Rankings', 'Technical SEO'],
  imageUrl: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?q=80&w=2074&auto=format&fit=crop'
}, {
  id: '03',
  number: '03',
  title: 'Marketing Automation',
  description: 'Our all-in-one platform offers full CRM, automated SMS & email campaigns for reviews, appointments, missed call text back, text to pay, and much more—all starting at $199/month.',
  tags: ['CRM', 'Email & SMS', 'Review Generation', 'Appointment Follow-up'],
  imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop'
}, {
  id: '04',
  number: '04',
  title: 'Web Analytics & Reporting',
  description: 'Measure what matters on your website. Through Google Tag Manager and Analytics, we build reports to measure every action that matters most and provide regular recommendations.',
  tags: ['Google Analytics', 'Tag Manager', 'Custom Reports', 'Data-Driven Insights'],
  imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop'
}];

// @component: ServicesSection
export function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="w-full min-h-screen bg-[#FAFAFA] text-[#1a1512] py-20 md:py-32 font-sans overflow-hidden">
      {/* Header Section - Centered with max-width */}
      <div className="container mx-auto max-w-7xl px-4 md:px-8 mb-16 md:mb-24">
        <div className="mb-6 w-full">
          <DecorativeShapeWithLine label="OUR SERVICES" />
        </div>

        <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-12">
          {/* Left Side - Heading */}
          <div className="flex-1">
            <motion.h2
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: 0.4 }} 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#1a1512]"
            >
              Digital marketing solutions
            </motion.h2>
          </div>
          
          {/* Right Side - Description */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.5, duration: 0.6 }} 
            className="flex-1 md:max-w-xl"
          >
            <p className="text-base md:text-lg text-[#1a1512]/70 leading-relaxed">
              From web design and SEO to marketing automation—everything your local business needs to grow online, all under one roof.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Services List - Full Width */}
      <div className="w-full flex flex-col">
        {/* Top Divider - Full Width */}
        <div className="w-full h-px bg-[#1a1512]/20" />

        {services.map((service, index) => {
          const isActive = activeIndex === index;
          return (
            <div key={service.id} className="group flex flex-col w-full">
              {/* Accordion Item */}
              <div 
                className={`relative flex flex-col transition-colors duration-500 ${
                  isActive ? 'py-12' : 'py-8 hover:bg-black/5'
                }`} 
                onMouseEnter={() => setActiveIndex(index)}
              >
                {/* Background for Active State */}
                {isActive && (
                  <motion.div 
                    className="absolute inset-0 bg-[#e8e8e8] z-0" 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                  />
                )}

                {/* Closed State - Number and Title */}
                {!isActive && (
                  <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center px-4 md:px-8 relative z-10">
                    
                    {/* Number - Closed State */}
                    <motion.div 
                      className="col-span-12 md:col-span-1 flex items-baseline gap-1"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className="text-3xl md:text-4xl font-semibold transition-colors duration-300 text-[#1a1512]/40 group-hover:text-[#1a1512]">
                        {service.number}
                      </span>
                      <span className="text-3xl md:text-4xl font-semibold transition-colors duration-300 text-[#ff5501] group-hover:text-[#ff5501]">
                        .
                      </span>
                    </motion.div>

                    {/* Spacer for image column when closed */}
                    <div className="hidden md:block md:col-span-5" />

                    {/* Title - Only show when closed */}
                    <div className="col-span-12 md:col-span-6 flex items-center justify-between">
                      <h3 className="text-3xl md:text-5xl font-semibold tracking-tight transition-colors duration-300 text-[#1a1512]/60 group-hover:text-[#1a1512]">
                        {service.title}
                      </h3>
                      
                      {/* Mobile Accordion Indicator */}
                      <div className="md:hidden">
                        <motion.div 
                          animate={{ rotate: isActive ? 180 : 0 }} 
                          className="text-[#1a1512]/40"
                        >
                          <ArrowUpRight className="w-6 h-6" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Expanded Content */}
                <AnimatePresence mode="wait">
                  {isActive && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }} 
                      transition={{ duration: 0.4, ease: "easeInOut" }} 
                      className="w-full overflow-hidden relative z-10"
                    >
                      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 items-start gap-6 md:gap-16 px-4 md:px-8">
                        {/* Number - Show in open state with scale animation */}
                        <motion.div 
                          className="col-span-12 md:col-span-1 flex items-baseline gap-1"
                          initial={{ scale: 1 }}
                          animate={{ scale: 1.2 }}
                          transition={{ duration: 0.3 }}
                        >
                          <span className="text-4xl md:text-5xl font-semibold transition-colors duration-300 text-[#1a1512]">
                            {service.number}
                          </span>
                          <span className="text-4xl md:text-5xl font-semibold transition-colors duration-300 text-[#ff5501]">
                            .
                          </span>
                        </motion.div>

                        {/* Image Section - Center */}
                        <motion.div 
                          className="col-span-12 md:col-span-5 aspect-[16/10] rounded-2xl overflow-hidden relative" 
                          initial={{ opacity: 0, scale: 0.95 }} 
                          animate={{ opacity: 1, scale: 1 }} 
                          transition={{ delay: 0.15, duration: 0.5 }}
                        >
                          <Image 
                            src={service.imageUrl} 
                            alt={service.title} 
                            fill
                            className="object-cover transition-transform duration-700 hover:scale-110" 
                          />
                        </motion.div>

                        {/* Text & Tags Section - Right */}
                        <div className="col-span-12 md:col-span-6 flex flex-col justify-start space-y-6 md:pl-8">
                          {/* Title */}
                          <motion.h3
                            initial={{ y: 20, opacity: 0 }} 
                            animate={{ y: 0, opacity: 1 }} 
                            transition={{ delay: 0.05, duration: 0.4 }}
                            className="text-3xl md:text-4xl font-semibold tracking-tight text-[#1a1512]"
                          >
                            {service.title}
                          </motion.h3>

                          {/* Subtitle */}
                          <motion.p
                            initial={{ y: 20, opacity: 0 }} 
                            animate={{ y: 0, opacity: 1 }} 
                            transition={{ delay: 0.08, duration: 0.4 }}
                            className="text-base text-[#1a1512]/50 -mt-4"
                          >
                            Logos, colors, type, your brand, fully alive.
                          </motion.p>

                          {/* Description */}
                          <motion.p 
                            initial={{ y: 20, opacity: 0 }} 
                            animate={{ y: 0, opacity: 1 }} 
                            transition={{ delay: 0.1, duration: 0.4 }} 
                            className="text-base md:text-lg text-[#1a1512]/60 leading-relaxed"
                          >
                            {service.description}
                          </motion.p>
                          
                          <div className="flex flex-wrap gap-2.5">
                            {service.tags.map((tag, i) => (
                              <motion.span 
                                key={tag} 
                                initial={{ scale: 0.9, opacity: 0 }} 
                                animate={{ scale: 1, opacity: 1 }} 
                                transition={{ delay: 0.2 + i * 0.05, duration: 0.3 }} 
                                className="px-4 py-2 rounded-full border border-[#1a1512]/20 text-sm text-[#1a1512]/60 hover:text-[#1a1512] hover:border-[#1a1512]/40 transition-colors"
                              >
                                {tag}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Divider Line - Full Width */}
              <div className="w-full h-px relative overflow-hidden">
                <div className="absolute inset-0 bg-[#1a1512]/20" />
                {isActive && (
                  <motion.div 
                    layoutId="activeLine" 
                    className="absolute inset-0 bg-[#ff5501]" 
                    initial={{ x: '-100%' }} 
                    animate={{ x: '0%' }} 
                    transition={{ duration: 0.5, ease: "circOut" }} 
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

