'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { getBlurDataURL } from '@/lib/imageUtils';

export default function PlaceToBe() {
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
      {/* Image Column */}
      <motion.div
        variants={imageVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="relative h-64 md:h-96 lg:h-auto overflow-hidden"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
          className="relative h-full w-full"
        >
          <Image
            src="https://images.unsplash.com/photo-1708407298305-63bc288e3272?q=80&w=1880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Nepal temple and mountains landscape"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            placeholder="blur"
            blurDataURL={getBlurDataURL()}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
      </motion.div>

      {/* Text Column */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="bg-[#dbe2dd] flex items-center p-8 md:p-12 lg:p-16 xl:p-20"
      >
        <div>
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-800 mb-8 md:mb-10"
          >
            A PLACE TO BE
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg lg:text-xl font-sans text-gray-700 mb-6 leading-relaxed"
          >
            Nepal is more than just a destination, it&apos;s a journey into a world where ancient 
            traditions meet majestic mountain peaks. From the spiritual temples that dot the valleys 
            to the snow-capped Himalayas that touch the sky, every corner of this country 
            offers a unique experience.
          </motion.p>
          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg lg:text-xl font-sans text-gray-700 mb-10 leading-relaxed"
          >
            Whether you&apos;re seeking adventure in the towering mountains, cultural immersion 
            in traditional villages, or simply a place to unwind and reconnect with nature, 
            Nepal provides the perfect backdrop for your journey.
          </motion.p>
          <motion.div variants={itemVariants}>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="#learn-more"
                className="inline-block px-8 py-4 border-2 border-gray-800 rounded-full text-sm md:text-base font-sans text-gray-800 uppercase tracking-wide hover:bg-gray-800 hover:text-white transition-all duration-300 font-semibold button-shadow hover:button-shadow-hover focus:outline-none focus:ring-4 focus:ring-gray-800/50"
                aria-label="Learn more about Nepal"
              >
                LEARN MORE
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
