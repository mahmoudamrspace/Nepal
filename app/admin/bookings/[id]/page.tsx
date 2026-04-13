'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface BookingDetails {
  id: string;
  bookingNumber: string;
  package: {
    name: string;
    slug: string;
    featuredImage: string;
  };
  travelers: any[];
  selectedDate: string;
  numberOfTravelers: number;
  basePrice: number;
  taxes: number;
  fees: number;
  totalPrice: number;
  currency: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests?: string;
  emergencyContact?: any;
  createdAt: string;
}

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/bookings/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBooking(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load booking');
        setLoading(false);
      });
  }, [id]);

  const updateStatus = async (field: 'status' | 'paymentStatus', value: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });

      if (res.ok) {
        toast.success('Booking updated');
        setBooking(booking ? { ...booking, [field]: value } : null);
      } else {
        toast.error('Failed to update booking');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="pt-16">
        <div className="text-center py-12">
          <div className="inline-block w-16 h-16 border-4 border-[#485342] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading booking...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="pt-16">
        <div className="text-center py-12">
          <p className="text-gray-600">Booking not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="text-[#485342] hover:underline mb-4"
        >
          ← Back to Bookings
        </button>
        <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">
          Booking #{booking.bookingNumber}
        </h1>
        <p className="text-gray-600">View and manage booking details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Package Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 card-shadow"
          >
            <h2 className="text-xl font-serif font-bold text-gray-800 mb-4">Package Information</h2>
            <div className="flex gap-4">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={booking.package.featuredImage}
                  alt={booking.package.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{booking.package.name}</h3>
                <p className="text-sm text-gray-600">Travel Date: {new Date(booking.selectedDate).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">Number of Travelers: {booking.numberOfTravelers}</p>
              </div>
            </div>
          </motion.div>

          {/* Travelers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 card-shadow"
          >
            <h2 className="text-xl font-serif font-bold text-gray-800 mb-4">Travelers</h2>
            <div className="space-y-4">
              {booking.travelers.map((traveler: any, index: number) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-700">Traveler {index + 1}</span>
                    {traveler.isPrimary && (
                      <span className="text-xs bg-[#485342] text-white px-2 py-1 rounded-full">Primary</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <p><span className="font-semibold">Name:</span> {traveler.firstName} {traveler.lastName}</p>
                    <p><span className="font-semibold">Email:</span> {traveler.email}</p>
                    <p><span className="font-semibold">Phone:</span> {traveler.phone}</p>
                    <p><span className="font-semibold">Nationality:</span> {traveler.nationality}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Additional Info */}
          {(booking.specialRequests || booking.emergencyContact) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 card-shadow"
            >
              <h2 className="text-xl font-serif font-bold text-gray-800 mb-4">Additional Information</h2>
              {booking.specialRequests && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Special Requests</h3>
                  <p className="text-sm text-gray-600">{booking.specialRequests}</p>
                </div>
              )}
              {booking.emergencyContact && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Emergency Contact</h3>
                  <p className="text-sm text-gray-600">
                    {booking.emergencyContact.name} ({booking.emergencyContact.relationship}) - {booking.emergencyContact.phone}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 card-shadow"
          >
            <h2 className="text-xl font-serif font-bold text-gray-800 mb-4">Status</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Booking Status</label>
                <select
                  value={booking.status}
                  onChange={(e) => updateStatus('status', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border-0 text-sm font-semibold ${
                    booking.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Status</label>
                <select
                  value={booking.paymentStatus}
                  onChange={(e) => updateStatus('paymentStatus', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border-0 text-sm font-semibold ${
                    booking.paymentStatus === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : booking.paymentStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Price Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 card-shadow"
          >
            <h2 className="text-xl font-serif font-bold text-gray-800 mb-4">Price Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Base Price</span>
                <span>{booking.currency} {booking.basePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Taxes</span>
                <span>{booking.currency} {booking.taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Fees</span>
                <span>{booking.currency} {booking.fees.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-lg font-bold text-gray-800">Total</span>
              <span className="text-2xl font-bold text-[#485342]">
                {booking.currency} {booking.totalPrice.toLocaleString()}
              </span>
            </div>
          </motion.div>

          {/* Customer Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 card-shadow"
          >
            <h2 className="text-xl font-serif font-bold text-gray-800 mb-4">Customer Information</h2>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold text-gray-700">Email:</span> {booking.customerEmail}</p>
              <p><span className="font-semibold text-gray-700">Phone:</span> {booking.customerPhone}</p>
              <p><span className="font-semibold text-gray-700">Created:</span> {new Date(booking.createdAt).toLocaleDateString()}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

