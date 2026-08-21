'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const faqItems = [
  {
    q: 'What happens after I submit the form?',
    a: "We review every inquiry personally and respond within 1 hour. If it looks like a good fit, we'll schedule a 30-minute strategy call to learn more about your goals before any commitment.",
  },
  {
    q: 'Do you work with businesses outside Nashville?',
    a: "Yes — we work with clients across the US and internationally. Most of our collaboration happens over Zoom, Slack, and Loom, so location is never a barrier.",
  },
  {
    q: 'How much does it cost to work with Captive Demand?',
    a: "Every project is scoped individually based on your goals and scope. We send a detailed proposal after our strategy call. We're transparent about pricing — no hidden fees, no surprise invoices.",
  },
  {
    q: 'How long does a typical project take?',
    a: "Website projects typically take 3–6 weeks. SEO and marketing retainers start showing results within 60–90 days. We'll give you a clear timeline in your proposal.",
  },
  {
    q: 'Do you take on small projects or only large builds?',
    a: "We're selective about what we take on, but size isn't the only factor — fit matters more. If your problem is something we can genuinely solve, we're interested in talking.",
  },
];

export function ContactFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="w-full bg-white py-20 md:py-32 px-4 overflow-hidden">
      <div className="mx-auto max-w-3xl">
        <span className="font-mono text-sm tracking-wider text-[#1a1512]/70 uppercase block mb-4">
          / COMMON QUESTIONS
        </span>
        <h2
          className="mb-12 text-[32px] font-sans font-bold text-[#111]"
          style={{ fontFamily: 'Nohemi, sans-serif' }}
        >
          Answers before you ask.
        </h2>

        <div className="space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl overflow-hidden transition-colors ${
                  isOpen ? 'bg-[#1a1512]' : 'bg-[#f3f4f6] hover:bg-[#e8e8e8]'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span
                    className={`font-sans font-medium text-base md:text-lg ${
                      isOpen ? 'text-white' : 'text-[#111]'
                    }`}
                  >
                    {item.q}
                  </span>
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ml-4 ${
                      isOpen ? 'bg-white/10' : 'bg-[#e8e8e8]'
                    }`}
                  >
                    <Plus
                      size={20}
                      className={`transition-transform duration-300 ${
                        isOpen ? 'rotate-45 text-white' : 'text-[#1a1512]/40'
                      }`}
                      strokeWidth={1.5}
                    />
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 pt-0">
                        <p className="font-mono text-sm text-white/70 leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
