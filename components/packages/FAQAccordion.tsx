'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQ } from '@/types';

interface FAQAccordionProps {
  faq: FAQ[];
}

export default function FAQAccordion({ faq }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faq.map((item, index) => (
        <div
          key={index}
          className="bg-gray-50 rounded-lg card-shadow overflow-hidden border border-gray-200 hover:border-[#485342]/30 transition-all duration-300"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/50 transition-colors text-left"
          >
            <h4 className="text-lg md:text-xl font-semibold text-[#2d2d2d] pr-4">{item.question}</h4>
            <svg
              className={`w-6 h-6 text-gray-400 flex-shrink-0 transition-transform ${
                openIndex === index ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 py-5 border-t border-gray-200 bg-white">
                  <p className="text-base text-gray-700 leading-relaxed">{item.answer}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

