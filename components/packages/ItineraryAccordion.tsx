'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ItineraryDay } from '@/types';

interface ItineraryAccordionProps {
  itinerary: ItineraryDay[];
}

export default function ItineraryAccordion({ itinerary }: ItineraryAccordionProps) {
  const [openDay, setOpenDay] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {itinerary.map((day, index) => (
        <div
          key={day.day}
          className="bg-gray-50 rounded-lg card-shadow overflow-hidden border border-gray-200 hover:border-[#485342]/30 transition-all duration-300"
        >
          <button
            onClick={() => setOpenDay(openDay === day.day ? null : day.day)}
            className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/50 transition-colors"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-14 h-14 rounded-full bg-[#485342] text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                {day.day}
              </div>
              <div className="text-left flex-1">
                <h4 className="text-lg md:text-xl font-serif text-[#2d2d2d] mb-1">{day.title}</h4>
                <p className="text-sm md:text-base text-gray-600 line-clamp-2">{day.description}</p>
              </div>
            </div>
            <svg
              className={`w-6 h-6 text-gray-400 flex-shrink-0 transition-transform ml-4 ${
                openDay === day.day ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <AnimatePresence>
            {openDay === day.day && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 py-5 border-t border-gray-200 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-base">
                        <span className="text-xl">🏔️</span> Activities
                      </h5>
                      <ul className="space-y-2">
                        {day.activities.map((activity, i) => (
                          <li key={i} className="text-sm md:text-base text-gray-700 flex items-start gap-2">
                            <span className="text-[#485342] mt-1.5">•</span>
                            <span>{activity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-base">
                        <span className="text-xl">🍽️</span> Meals
                      </h5>
                      <ul className="space-y-2">
                        {day.meals.map((meal, i) => (
                          <li key={i} className="text-sm md:text-base text-gray-700 flex items-start gap-2">
                            <span className="text-[#485342] mt-1.5">•</span>
                            <span>{meal}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-base">
                        <span className="text-xl">🏨</span> Accommodation
                      </h5>
                      <p className="text-sm md:text-base text-gray-700 leading-relaxed">{day.accommodation}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

