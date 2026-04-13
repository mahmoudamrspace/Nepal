'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function InLoveWithNepal() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <section ref={sectionRef} className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px] md:min-h-[600px] gap-0">
      {/* Text Column */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="bg-[#485342] flex items-center p-8 md:p-12 lg:p-16 xl:p-20 order-2 lg:order-1"
      >
        <div>
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-8 md:mb-10"
          >
            IN LOVE WITH NEPAL
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg lg:text-xl font-sans text-white mb-10 leading-relaxed"
          >
            Born and raised in Nepal, we have a deep-rooted connection to this magical country. 
            Our passion for sharing Nepal's rich culture, warm people, and breathtaking mountain 
            landscapes has been with us since childhood. We are proud locals who have made it our 
            mission to share this paradise with travelers from around the world, helping them 
            discover the same beauty and wonder that has been our home.
          </motion.p>
          <motion.div variants={itemVariants}>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/about"
                className="inline-block px-8 py-4 border-2 border-white rounded-full text-sm md:text-base font-sans text-white uppercase tracking-wide hover:bg-white hover:text-[#485342] transition-all duration-300 font-semibold button-shadow hover:button-shadow-hover"
              >
                MORE ABOUT US
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Image Column */}
      <motion.div
        variants={imageVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="relative h-64 md:h-96 lg:h-auto order-1 lg:order-2 overflow-hidden"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
          className="relative h-full w-full"
        >
          <Image
            src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?q=80&w=2000"
            alt="Nepal mountains and landscape"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
      </motion.div>
    </section>
  );
}
