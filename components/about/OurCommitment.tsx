'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Icon from '@/components/ui/Icon';

interface OurCommitmentProps {
  title: string;
  items: {
    title: string;
    description: string;
    icon: string;
  }[];
}

export default function OurCommitment({ title, items }: OurCommitmentProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} className="bg-gradient-to-br from-[#dbe2dd] via-white to-[#dbe2dd] py-16 md:py-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#485342]/5 rounded-full blur-3xl -z-0"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#dbe2dd]/50 rounded-full blur-3xl -z-0"></div>
      
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden border-2 border-gray-100 hover:border-[#485342]/30 group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--nepal-red)] via-[var(--nepal-blue)] to-white"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#485342]/10 via-nepal-blue/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#485342] via-nepal-red/20 to-[#3a4235] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Icon name={item.icon} className="text-white" size={32} />
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-serif text-[#2d2d2d] mb-4 font-bold group-hover:text-[#485342] transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

