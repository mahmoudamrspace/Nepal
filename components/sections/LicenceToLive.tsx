'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { getBlurDataURL, getImageSizes, shouldBypassImageOptimizer } from '@/lib/imageUtils';

const cards = [
  {
    id: 'adventure',
    title: 'ADVENTURE',
    imageUrl: 'https://images.unsplash.com/photo-1554710869-95f3df6a3197?q=80&w=977&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    buttonText: 'EXPLORE NEPAL',
    href: '/adventure'
  },
  {
    id: 'culture',
    title: 'CULTURE',
    imageUrl: 'https://images.unsplash.com/photo-1731045823669-8bf7801b5470?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    buttonText: 'UNDERSTAND NEPAL',
    href: '/culture'
  },
  {
    id: 'relaxation',
    title: 'RELAXATION',
    imageUrl: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?q=80&w=2000',
    buttonText: 'RELAX IN NEPAL',
    href: '/relaxation'
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  }),
};

export default function LicenceToLive() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} id="licence-to-live" className="bg-[#dbe2dd] py-16 md:py-24 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-800 text-center mb-12 md:mb-16"
        >
          LICENCE TO LIVE
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden w-full bg-white rounded-lg card-shadow hover:card-shadow-hover transition-all duration-300"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative h-64 md:h-80 lg:h-96 w-full overflow-hidden rounded-t-lg"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="relative h-full w-full"
                >
                  <Image
                    src={card.imageUrl}
                    alt={`${card.title} category image`}
                    fill
                    className="object-cover"
                    sizes={getImageSizes({ mobile: '100vw', tablet: '50vw', desktop: '33vw' })}
                    placeholder="blur"
                    blurDataURL={getBlurDataURL()}
                    loading={index < 3 ? 'eager' : 'lazy'}
                    unoptimized={shouldBypassImageOptimizer(card.imageUrl)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              </motion.div>
              <div className="p-8 md:p-10 lg:p-12 text-center bg-white rounded-b-lg">
                <h3 className="text-2xl md:text-3xl font-serif text-[#2d2d2d] mb-6 md:mb-8 tracking-wide">
                  {card.title}
                </h3>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={card.href}
                    className="inline-block px-8 py-3 border-2 border-[#2d2d2d] rounded-full text-sm md:text-base font-sans text-[#2d2d2d] uppercase tracking-wide hover:bg-[#2d2d2d] hover:text-white hover:button-shadow-hover transition-all duration-300 font-medium focus:outline-none focus:ring-4 focus:ring-[#2d2d2d]/50"
                    aria-label={`Explore ${card.title.toLowerCase()} packages`}
                  >
                    {card.buttonText}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
