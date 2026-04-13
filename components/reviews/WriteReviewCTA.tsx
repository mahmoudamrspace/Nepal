'use client';

import { motion } from 'framer-motion';
import { AggregateRatings } from '@/types';

interface WriteReviewCTAProps {
  ratings: AggregateRatings;
}

export default function WriteReviewCTA({ ratings }: WriteReviewCTAProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-[#485342] rounded-lg p-8 md:p-12 text-center text-white"
    >
      <h3 className="text-3xl md:text-4xl font-serif mb-4">
        Share Your Experience
      </h3>
      <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
        Help others discover the magic of Nepal by sharing your journey with us
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <motion.a
          href={ratings.google.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-white text-[#485342] rounded-full font-semibold uppercase tracking-wide hover:bg-gray-100 transition-all duration-300 button-shadow hover:button-shadow-hover"
        >
          Write Google Review
        </motion.a>
        <motion.a
          href={ratings.tripadvisor.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold uppercase tracking-wide hover:bg-white hover:text-[#485342] transition-all duration-300"
        >
          Write TripAdvisor Review
        </motion.a>
      </div>
    </motion.div>
  );
}

