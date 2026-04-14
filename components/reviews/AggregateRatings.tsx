'use client';

import { motion } from 'framer-motion';
import type { AggregateRatings } from '@/types';

interface AggregateRatingsProps {
  ratings: AggregateRatings;
}

export default function AggregateRatings({ ratings }: AggregateRatingsProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-6 h-6 ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const getPlatformLogo = (platform: string) => {
    if (platform === 'Google') {
      return 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png';
    } else {
      return 'https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      {/* Google Rating */}
      <motion.a
        href={ratings.google.profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.02, y: -4 }}
        className="bg-white rounded-lg p-6 md:p-8 card-shadow hover:card-shadow-hover transition-all duration-300"
      >
        <div className="flex items-center gap-4 mb-4">
          <img
            src={getPlatformLogo('Google')}
            alt="Google"
            width={80}
            height={30}
            className="object-contain h-8 w-20"
          />
          <div>
            <h3 className="text-xl font-serif text-[#2d2d2d]">Google Reviews</h3>
            <p className="text-sm text-gray-500">See all reviews</p>
          </div>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-1">
            {renderStars(ratings.google.averageRating)}
          </div>
          <span className="text-2xl font-bold text-[#2d2d2d]">
            {ratings.google.averageRating}
          </span>
        </div>
        <p className="text-gray-600">
          {ratings.google.totalReviews.toLocaleString()} reviews
        </p>
      </motion.a>

      {/* TripAdvisor Rating */}
      <motion.a
        href={ratings.tripadvisor.profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.02, y: -4 }}
        className="bg-white rounded-lg p-6 md:p-8 card-shadow hover:card-shadow-hover transition-all duration-300"
      >
        <div className="flex items-center gap-4 mb-4">
          <img
            src={getPlatformLogo('TripAdvisor')}
            alt="TripAdvisor"
            width={120}
            height={30}
            className="object-contain h-8 w-[120px]"
          />
          <div>
            <h3 className="text-xl font-serif text-[#2d2d2d]">TripAdvisor</h3>
            <p className="text-sm text-gray-500">See all reviews</p>
          </div>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-1">
            {renderStars(ratings.tripadvisor.averageRating)}
          </div>
          <span className="text-2xl font-bold text-[#2d2d2d]">
            {ratings.tripadvisor.averageRating}
          </span>
        </div>
        <p className="text-gray-600">
          {ratings.tripadvisor.totalReviews.toLocaleString()} reviews
        </p>
      </motion.a>
    </div>
  );
}

