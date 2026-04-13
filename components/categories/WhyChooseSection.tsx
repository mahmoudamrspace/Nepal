'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { WhyChooseItem } from '@/types';
import Icon from '@/components/ui/Icon';

interface WhyChooseSectionProps {
  items: WhyChooseItem[];
}

export default function WhyChooseSection({ items }: WhyChooseSectionProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-800 text-center mb-12 md:mb-16"
        >
          WHY CHOOSE THIS EXPERIENCE
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.03, y: -8, rotate: 1 }}
              className="bg-white rounded-xl p-6 md:p-8 text-center card-shadow hover:card-shadow-hover transition-all duration-300 relative overflow-hidden border border-gray-100 motion-card card-glow"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--nepal-red)] via-[var(--nepal-blue)] to-white"></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#485342]/5 via-nepal-blue/3 to-transparent rounded-full blur-xl"></div>
              <div className="relative z-10">
                {item.icon && (
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#485342] via-nepal-red/20 to-[#3a4235] rounded-2xl flex items-center justify-center shadow-lg">
                      <Icon name={item.icon} className="text-white" size={32} />
                    </div>
                  </div>
                )}
                <h3 className="text-xl md:text-2xl font-serif text-[#2d2d2d] mb-4 font-semibold">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

