'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Review } from '@/types';
import { getBlurDataURL } from '@/lib/imageUtils';

interface ReviewCardProps {
  review: Review;
  index?: number;
  disableAnimation?: boolean;
}

export default function ReviewCard({ review, index = 0, disableAnimation = false }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 200;
  const shouldTruncate = review.reviewText.length > maxLength;
  const displayText = isExpanded || !shouldTruncate 
    ? review.reviewText 
    : review.reviewText.substring(0, maxLength) + '...';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const getPlatformColor = (platform: string) => {
    return platform === 'Google' ? '#4285F4' : '#00AA6C';
  };

  const getPlatformLogo = (platform: string) => {
    if (platform === 'Google') {
      return 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png';
    } else {
      return 'https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg';
    }
  };

  const cardContent = (
    <>
      {/* Platform Badge */}
      <div className="flex items-center justify-between mb-4">
        <div 
          className="flex items-center gap-2 px-3 py-1 rounded-full"
          style={{ backgroundColor: `${getPlatformColor(review.platform)}20` }}
        >
          <Image
            src={getPlatformLogo(review.platform)}
            alt={`${review.platform} logo`}
            width={review.platform === 'Google' ? 60 : 80}
            height={review.platform === 'Google' ? 20 : 20}
            className="object-contain"
            sizes="(max-width: 768px) 60px, 80px"
            placeholder="blur"
            blurDataURL={getBlurDataURL()}
          />
        </div>
        {review.verified && (
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Verified
          </span>
        )}
      </div>

      {/* Star Rating */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1">
          {renderStars(review.rating)}
        </div>
        <span className="text-sm font-semibold text-gray-700">{review.rating}.0</span>
      </div>

      {/* Review Text */}
      <p className="text-gray-700 leading-relaxed mb-4">
        {displayText}
      </p>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-[#485342] font-semibold hover:underline mb-4 focus:outline-none focus:ring-2 focus:ring-[#485342] focus:ring-offset-2 rounded"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Show less of review' : 'Read more of review'}
        >
          {isExpanded ? 'Show less' : 'Read more'}
        </button>
      )}

      {/* Reviewer Info */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          {review.reviewerAvatar ? (
            <Image
              src={review.reviewerAvatar}
              alt={`${review.reviewerName}'s avatar`}
              width={40}
              height={40}
              className="rounded-full"
              sizes="40px"
              placeholder="blur"
              blurDataURL={getBlurDataURL()}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 font-semibold">
                {review.reviewerName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <p className="font-semibold text-[#2d2d2d]">{review.reviewerName}</p>
            <p className="text-xs text-gray-500">{formatDate(review.date)}</p>
          </div>
        </div>
        {review.reviewUrl && (
          <Link
            href={review.reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#485342] font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-[#485342] focus:ring-offset-2 rounded"
            aria-label={`Read full review on ${review.platform} (opens in new tab)`}
          >
            Read full →
          </Link>
        )}
      </div>
    </>
  );

  if (disableAnimation) {
    return (
      <div
        className="bg-white rounded-lg p-6 md:p-8 card-shadow hover:card-shadow-hover transition-shadow duration-300 h-full flex flex-col"
        style={{ transform: 'translateZ(0)' }}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: '-100px' }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-lg p-6 md:p-8 card-shadow hover:card-shadow-hover transition-all duration-300"
    >
      {cardContent}
    </motion.div>
  );
}

