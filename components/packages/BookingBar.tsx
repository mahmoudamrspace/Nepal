'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface BookingBarProps {
  price: number;
  currency: string;
  name: string;
  slug: string;
}

export default function BookingBar({ price, currency, name, slug }: BookingBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div>
            <p className="text-sm text-gray-600">{name}</p>
            <p className="text-2xl font-bold text-[#485342]">
              {currency} {price.toLocaleString()}
              <span className="text-sm font-normal text-gray-600"> per person</span>
            </p>
          </div>
          <Link href={`/checkout?package=${slug}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-[#485342] text-white rounded-full font-semibold uppercase tracking-wide hover:bg-[#3a4235] transition-colors button-shadow"
            >
              Book Now
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

