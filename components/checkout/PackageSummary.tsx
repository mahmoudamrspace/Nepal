'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Package } from '@/types';
import { calculateBookingTotal } from '@/lib/bookingUtils';
import { shouldBypassImageOptimizer } from '@/lib/imageUtils';

interface PackageSummaryProps {
  package: Package;
  selectedDate: string;
  numberOfTravelers: number;
  onDateChange: (date: string) => void;
  onTravelersChange: (count: number) => void;
}

export default function PackageSummary({
  package: pkg,
  selectedDate,
  numberOfTravelers,
  onDateChange,
  onTravelersChange,
}: PackageSummaryProps) {
  const pricing = calculateBookingTotal(pkg.price, numberOfTravelers);

  const handleTravelersChange = (delta: number) => {
    const newCount = numberOfTravelers + delta;
    if (newCount >= 1 && newCount <= pkg.groupSize) {
      onTravelersChange(newCount);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 card-shadow sticky top-24">
      <div className="mb-6">
        <div className="relative h-48 rounded-lg overflow-hidden mb-4">
          <Image
            src={pkg.featuredImage}
            alt={pkg.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
            unoptimized={shouldBypassImageOptimizer(pkg.featuredImage)}
          />
        </div>
        <h3 className="text-xl md:text-2xl font-serif font-bold text-gray-800 mb-2">
          {pkg.name}
        </h3>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {pkg.duration}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {pkg.location}
          </span>
        </div>
      </div>

      {/* Date Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Date <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#485342] transition-all"
          required
        >
          <option value="">Choose a date</option>
          {pkg.availableDates && pkg.availableDates.length > 0 ? (
            pkg.availableDates.map((date) => (
              <option key={date} value={date}>
                {new Date(date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </option>
            ))
          ) : (
            <option value="flexible">Flexible Dates</option>
          )}
        </select>
      </div>

      {/* Number of Travelers */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Number of Travelers <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => handleTravelersChange(-1)}
            disabled={numberOfTravelers <= 1}
            className="w-10 h-10 rounded-full border-2 border-[#485342] text-[#485342] flex items-center justify-center font-semibold hover:bg-[#485342] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            −
          </button>
          <span className="text-xl font-bold text-gray-800 min-w-[3rem] text-center">
            {numberOfTravelers}
          </span>
          <button
            type="button"
            onClick={() => handleTravelersChange(1)}
            disabled={numberOfTravelers >= pkg.groupSize}
            className="w-10 h-10 rounded-full border-2 border-[#485342] text-[#485342] flex items-center justify-center font-semibold hover:bg-[#485342] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +
          </button>
          <span className="text-sm text-gray-600 ml-auto">
            Max: {pkg.groupSize}
          </span>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Price Breakdown</h4>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Base Price ({numberOfTravelers} {numberOfTravelers === 1 ? 'person' : 'people'})</span>
            <span>{pkg.currency} {pricing.basePrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Taxes (13%)</span>
            <span>{pkg.currency} {pricing.taxes.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Service Fee</span>
            <span>{pkg.currency} {pricing.fees.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <span className="text-lg font-bold text-gray-800">Total</span>
          <span className="text-2xl font-bold text-[#485342]">
            {pkg.currency} {pricing.total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Included Items Preview */}
      {pkg.included && pkg.included.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">What's Included</h4>
          <ul className="space-y-2">
            {pkg.included.slice(0, 3).map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-[#485342] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
            {pkg.included.length > 3 && (
              <li className="text-xs text-gray-500">+ {pkg.included.length - 3} more items</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

