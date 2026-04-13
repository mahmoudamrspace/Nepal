'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import ReviewCarousel from '../reviews/ReviewCarousel';
import AggregateRatings from '../reviews/AggregateRatings';
import WriteReviewCTA from '../reviews/WriteReviewCTA';
import { ReviewPlatform, Review, AggregateRatings as AggregateRatingsType } from '@/types';

export default function Reviews() {
  const [selectedPlatform, setSelectedPlatform] = useState<ReviewPlatform | 'All'>('All');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [aggregateRatings, setAggregateRatings] = useState<AggregateRatingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: '-100px' });

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch('/api/reviews');
        if (res.ok) {
          const data = await res.json();
          setReviews(data.reviews.map((r: any) => ({
            ...r,
            date: r.date,
            rating: r.rating,
          })));
          setAggregateRatings(data.aggregateRatings);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  const filteredReviews = useMemo(() => {
    if (selectedPlatform === 'All') {
      return reviews;
    }
    return reviews.filter(review => review.platform === selectedPlatform);
  }, [selectedPlatform, reviews]);

  return (
    <section ref={sectionRef} className="bg-[#dbe2dd] py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-800 mb-4">
            WHAT OUR GUESTS SAY
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Read reviews from Google and TripAdvisor
          </p>
        </motion.div>

        {/* Aggregate Ratings */}
        {aggregateRatings && <AggregateRatings ratings={aggregateRatings} />}

        {/* Platform Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          {(['All', 'Google', 'TripAdvisor'] as const).map((platform) => (
            <motion.button
              key={platform}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedPlatform(platform)}
              className={`px-6 py-3 rounded-full text-sm font-semibold uppercase tracking-wide transition-all duration-300 ${
                selectedPlatform === platform
                  ? 'bg-[#485342] text-white button-shadow'
                  : 'bg-white text-[#485342] border-2 border-[#485342] hover:bg-[#485342] hover:text-white'
              }`}
            >
              {platform}
            </motion.button>
          ))}
        </motion.div>

        {/* Reviews Carousel */}
        {loading ? (
          <div className="mb-12 text-center py-12">
            <p className="text-gray-600">Loading reviews...</p>
          </div>
        ) : (
          <div className="mb-12 min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedPlatform}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              >
                <ReviewCarousel reviews={filteredReviews} />
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Write Review CTA */}
        {aggregateRatings && <WriteReviewCTA ratings={aggregateRatings} />}
      </div>
    </section>
  );
}

