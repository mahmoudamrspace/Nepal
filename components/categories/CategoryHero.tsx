'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getBlurDataURL } from '@/lib/imageUtils';

interface CategoryHeroProps {
  title: string;
  subtitle: string;
  heroImage: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function CategoryHero({ title, subtitle, heroImage, ctaText = 'Explore Packages', ctaHref }: CategoryHeroProps) {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5 }}
      >
        <Image
          src={heroImage}
          alt={`${title} - ${subtitle}`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={getBlurDataURL()}
        />
        <div className="absolute inset-0 bg-black/50" />
      </motion.div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl mb-8 max-w-3xl mx-auto opacity-90">
            {subtitle}
          </p>
          {ctaHref && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={ctaHref}
                  className="inline-block px-8 py-4 bg-white text-[#485342] rounded-full font-semibold uppercase tracking-wide hover:bg-gray-100 transition-all duration-300 button-shadow hover:button-shadow-hover focus:outline-none focus:ring-4 focus:ring-white/50"
                  aria-label={`${ctaText} for ${title}`}
                >
                  {ctaText}
                </Link>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

