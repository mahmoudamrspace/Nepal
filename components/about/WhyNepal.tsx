'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { getBlurDataURL } from '@/lib/imageUtils';

interface WhyNepalProps {
  title: string;
  content: string;
  highlights: string[];
  image: string;
}

export default function WhyNepal({ title, content, highlights, image }: WhyNepalProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} className="bg-gradient-to-br from-white via-gray-50 to-[#dbe2dd] py-16 md:py-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#485342]/5 rounded-full blur-3xl -z-0"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#dbe2dd]/50 rounded-full blur-3xl -z-0"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-800 mb-4">
            {title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-lg text-gray-700 leading-relaxed mb-8">{content}</p>
            <div className="bg-gradient-to-br from-[#dbe2dd] to-white rounded-2xl p-6 md:p-8 shadow-xl border-2 border-gray-100">
              <h3 className="text-xl md:text-2xl font-serif text-[#2d2d2d] mb-6 font-bold">Highlights</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {highlights.map((highlight, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    className="flex items-start gap-3 bg-white/50 rounded-xl p-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#485342] to-[#3a4235] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium">{highlight}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative h-64 md:h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-100"
          >
            <Image
              src={image}
              alt="Beautiful Nepal landscape showcasing why to visit"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              placeholder="blur"
              blurDataURL={getBlurDataURL()}
              loading="lazy"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

