'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Package, Traveler } from '@/types';
import { PaymentData } from '@/lib/validations';
import { formatDate } from '@/lib/bookingUtils';
import Link from 'next/link';

interface BookingReviewProps {
  package: Package;
  selectedDate: string;
  numberOfTravelers: number;
  travelers: Traveler[];
  paymentData: PaymentData;
  pricing: {
    basePrice: number;
    taxes: number;
    fees: number;
    total: number;
  };
  specialRequests?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  onEditStep: (step: number) => void;
}

export default function BookingReview({
  package: pkg,
  selectedDate,
  numberOfTravelers,
  travelers,
  paymentData,
  pricing,
  specialRequests,
  emergencyContact,
  onEditStep,
}: BookingReviewProps) {
  const primaryTraveler = travelers.find(t => t.isPrimary) || travelers[0];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-800 mb-2">
          Review Your Booking
        </h2>
        <p className="text-gray-600">
          Please review all details before confirming your booking.
        </p>
      </div>

      {/* Package Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 md:p-8 card-shadow"
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-serif font-semibold text-gray-800">Package Details</h3>
          <button
            onClick={() => onEditStep(1)}
            className="text-sm text-[#485342] hover:underline font-semibold"
          >
            Edit
          </button>
        </div>
        <div className="flex gap-4">
          <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={pkg.featuredImage}
              alt={pkg.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">{pkg.name}</h4>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
              <span>{pkg.duration}</span>
              <span>•</span>
              <span>{pkg.location}</span>
              <span>•</span>
              <span>{numberOfTravelers} {numberOfTravelers === 1 ? 'Traveler' : 'Travelers'}</span>
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Date:</span> {selectedDate ? formatDate(selectedDate) : 'Flexible'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Traveler Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 md:p-8 card-shadow"
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-serif font-semibold text-gray-800">Traveler Information</h3>
          <button
            onClick={() => onEditStep(2)}
            className="text-sm text-[#485342] hover:underline font-semibold"
          >
            Edit
          </button>
        </div>
        <div className="space-y-4">
          {travelers.map((traveler, index) => (
            <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Traveler {index + 1}
                </span>
                {traveler.isPrimary && (
                  <span className="text-xs bg-[#485342] text-white px-2 py-1 rounded-full">
                    Primary
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                <p><span className="font-semibold">Name:</span> {traveler.firstName} {traveler.lastName}</p>
                <p><span className="font-semibold">Email:</span> {traveler.email}</p>
                <p><span className="font-semibold">Phone:</span> {traveler.phone}</p>
                <p><span className="font-semibold">Nationality:</span> {traveler.nationality}</p>
                {traveler.passportNumber && (
                  <p><span className="font-semibold">Passport:</span> {traveler.passportNumber}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {emergencyContact && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Emergency Contact</h4>
            <p className="text-sm text-gray-600">
              {emergencyContact.name} ({emergencyContact.relationship}) - {emergencyContact.phone}
            </p>
          </div>
        )}

        {specialRequests && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Special Requests</h4>
            <p className="text-sm text-gray-600">{specialRequests}</p>
          </div>
        )}
      </motion.div>

      {/* Payment Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-6 md:p-8 card-shadow"
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-serif font-semibold text-gray-800">Payment Method</h3>
          <button
            onClick={() => onEditStep(3)}
            className="text-sm text-[#485342] hover:underline font-semibold"
          >
            Edit
          </button>
        </div>
        <div className="text-sm text-gray-600">
          <p className="font-semibold mb-2">
            {paymentData.paymentMethod === 'credit_card' && '💳 Credit Card'}
            {paymentData.paymentMethod === 'bank_transfer' && '🏦 Bank Transfer'}
            {paymentData.paymentMethod === 'paypal' && '🔵 PayPal'}
          </p>
          {paymentData.paymentMethod === 'credit_card' && paymentData.cardNumber && (
            <p className="text-gray-500">
              Card ending in {paymentData.cardNumber.slice(-4)}
            </p>
          )}
        </div>
      </motion.div>

      {/* Price Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6 md:p-8 card-shadow"
      >
        <h3 className="text-xl font-serif font-semibold text-gray-800 mb-4">Price Summary</h3>
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
        <div className="flex justify-between items-center pt-4 border-t-2 border-gray-300">
          <span className="text-xl font-bold text-gray-800">Total</span>
          <span className="text-3xl font-bold text-[#485342]">
            {pkg.currency} {pricing.total.toLocaleString()}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

