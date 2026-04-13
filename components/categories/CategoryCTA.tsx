'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface CategoryCTAProps {
  title: string;
  description: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function CategoryCTA({ title, description, ctaText = 'Explore Packages', ctaHref }: CategoryCTAProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} className="bg-[#485342] py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center text-white max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6">
            {title}
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            {description}
          </p>
          {ctaHref && (
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={ctaHref}
                className="inline-block px-8 py-4 bg-white text-[#485342] rounded-full font-semibold uppercase tracking-wide hover:bg-gray-100 transition-all duration-300 button-shadow hover:button-shadow-hover"
              >
                {ctaText}
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

