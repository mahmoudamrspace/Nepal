'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { formatDate } from '@/lib/bookingUtils';

interface Booking {
  id: string;
  bookingNumber: string;
  packageId: string;
  packageName: string;
  packageSlug: string;
  travelers: any[];
  selectedDate: string;
  numberOfTravelers: number;
  totalPrice: number;
  currency: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  customerEmail: string;
  customerPhone: string;
}

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingNumber = searchParams.get('bookingNumber');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookingNumber) {
      fetch(`/api/bookings?bookingNumber=${bookingNumber}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.booking) {
            setBooking(data.booking);
          } else {
            setError(data.error || 'Booking not found');
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching booking:', err);
          setError('Failed to load booking details');
          setLoading(false);
        });
    } else {
      setError('No booking number provided');
      setLoading(false);
    }
  }, [bookingNumber]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-20 flex items-center justify-center bg-[#dbe2dd]">
          <div className="text-center">
            <div className="inline-block w-16 h-16 border-4 border-[#485342] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading booking confirmation...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !booking) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-20 flex items-center justify-center bg-[#dbe2dd]">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-3xl font-serif font-bold text-gray-800 mb-4">Booking Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The booking you\'re looking for doesn\'t exist.'}</p>
            <Link
              href="/packages"
              className="inline-block px-6 py-3 bg-[#485342] text-white rounded-full font-semibold hover:bg-[#3a4235] transition-colors"
            >
              Browse Packages
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const primaryTraveler = booking.travelers.find((t: any) => t.isPrimary) || booking.travelers[0];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#dbe2dd] pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Success Header */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="inline-block w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
              >
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
                Booking Confirmed!
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                Thank you for your booking. We're excited to have you join us!
              </p>
              <div className="inline-block bg-[#485342] text-white px-6 py-2 rounded-full font-semibold text-lg">
                Booking #{booking.bookingNumber}
              </div>
            </div>

            {/* Booking Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 md:p-8 card-shadow mb-8"
            >
              <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Booking Details</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Package</h3>
                  <p className="text-gray-800 font-medium">{booking.packageName}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Travel Date</h3>
                    <p className="text-gray-800">{formatDate(booking.selectedDate)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Number of Travelers</h3>
                    <p className="text-gray-800">{booking.numberOfTravelers} {booking.numberOfTravelers === 1 ? 'Person' : 'People'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Booking Status</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Payment Status</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                      booking.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Total Amount</h3>
                  <p className="text-3xl font-bold text-[#485342]">
                    {booking.currency} {booking.totalPrice.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Traveler Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-6 md:p-8 card-shadow mb-8"
            >
              <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Traveler Information</h2>
              <div className="space-y-4">
                {booking.travelers.map((traveler: any, index: number) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-gray-700">
                        Traveler {index + 1}
                      </span>
                      {traveler.isPrimary && (
                        <span className="text-xs bg-[#485342] text-white px-2 py-1 rounded-full">
                          Primary Contact
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <p><span className="font-semibold">Name:</span> {traveler.firstName} {traveler.lastName}</p>
                      <p><span className="font-semibold">Email:</span> {traveler.email}</p>
                      <p><span className="font-semibold">Phone:</span> {traveler.phone}</p>
                      <p><span className="font-semibold">Nationality:</span> {traveler.nationality}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-blue-50 border border-blue-200 rounded-xl p-6 md:p-8 mb-8"
            >
              <h2 className="text-xl font-serif font-bold text-blue-900 mb-4">What's Next?</h2>
              <ul className="space-y-3 text-blue-800">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>You will receive a confirmation email at <strong>{primaryTraveler?.email || booking.customerEmail}</strong> within the next few minutes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Our team will contact you within 24 hours to discuss your booking details and answer any questions.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Please keep your booking number (<strong>{booking.bookingNumber}</strong>) for your records.</span>
                </li>
              </ul>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href={`/packages/${booking.packageSlug}`}
                className="px-8 py-3 border-2 border-[#485342] text-[#485342] rounded-full font-semibold uppercase tracking-wide hover:bg-[#485342] hover:text-white transition-all text-center"
              >
                View Package Details
              </Link>
              <Link
                href="/packages"
                className="px-8 py-3 bg-[#485342] text-white rounded-full font-semibold uppercase tracking-wide hover:bg-[#3a4235] transition-all button-shadow text-center"
              >
                Browse More Packages
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}

