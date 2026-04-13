'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { getBlurDataURL, getImageSizes } from '@/lib/imageUtils';

const instagramImages = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000',
    alt: 'Nepal mountains'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=1000',
    alt: 'Nepal culture'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?q=80&w=1000',
    alt: 'Nepal landscape'
  }
];

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  }),
};

export default function Instagram() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} className="bg-[#dbe2dd] py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-800 text-center mb-12 md:mb-16"
        >
          FOLLOW US ON INSTAGRAM
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-12 md:mb-16"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="https://www.instagram.com/explorevisionnepal/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 border-2 border-gray-800 rounded-full text-sm md:text-base font-sans text-gray-800 uppercase tracking-wide hover:bg-gray-800 hover:text-white transition-all duration-300 font-semibold button-shadow hover:button-shadow-hover focus:outline-none focus:ring-4 focus:ring-gray-800/50"
              aria-label="Follow us on Instagram (opens in new tab)"
            >
              @EXPLOREVISIONNEPAL
            </Link>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {instagramImages.map((image, index) => (
            <motion.div
              key={image.id}
              custom={index}
              variants={imageVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              whileHover={{ y: -8 }}
              className="relative aspect-square overflow-hidden rounded-lg card-shadow hover:card-shadow-hover transition-all duration-300 group"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="relative h-full w-full"
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes={getImageSizes({ mobile: '100vw', tablet: '33vw', desktop: '33vw' })}
                  placeholder="blur"
                  blurDataURL={getBlurDataURL()}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-white text-2xl font-bold">📷</div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
