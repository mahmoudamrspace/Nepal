'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import DashboardStats from '@/components/admin/DashboardStats';
import StatusBadge from '@/components/admin/StatusBadge';

interface RecentBooking {
  id: string;
  bookingNumber: string;
  packageName: string;
  customerEmail: string;
  totalPrice: number;
  currency: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [meName, setMeName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);

  useEffect(() => {
    fetch('/api/admin/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.name) setMeName(data.name);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch('/api/admin/bookings?limit=5')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRecentBookings(data.slice(0, 5));
      })
      .catch(() => {});
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-[#485342] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">
          Welcome back{meName ? `, ${meName}` : ''}! 👋
        </h1>
        <p className="text-gray-600">Here's what's happening with your business today.</p>
      </motion.div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl card-shadow p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif font-bold text-gray-800">Recent Bookings</h2>
            <Link href="/admin/bookings">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm text-[#485342] font-semibold hover:underline"
              >
                View All
              </motion.button>
            </Link>
          </div>
          {recentBookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No recent bookings</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-gray-800">{booking.bookingNumber}</span>
                      <StatusBadge status={booking.status} size="sm" />
                    </div>
                    <p className="text-sm text-gray-600">{booking.packageName}</p>
                    <p className="text-xs text-gray-500 mt-1">{booking.customerEmail}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      {booking.currency} {booking.totalPrice.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl card-shadow p-6"
        >
          <h2 className="text-xl font-serif font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/packages/new">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg cursor-pointer border-2 border-blue-200 hover:border-blue-300 transition-all"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="font-semibold text-gray-800">New Package</p>
                <p className="text-xs text-gray-600 mt-1">Create package</p>
              </motion.div>
            </Link>
            <Link href="/admin/blog/new">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg cursor-pointer border-2 border-purple-200 hover:border-purple-300 transition-all"
              >
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <p className="font-semibold text-gray-800">New Post</p>
                <p className="text-xs text-gray-600 mt-1">Write blog post</p>
              </motion.div>
            </Link>
            <Link href="/admin/bookings">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg cursor-pointer border-2 border-green-200 hover:border-green-300 transition-all"
              >
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <p className="font-semibold text-gray-800">View Bookings</p>
                <p className="text-xs text-gray-600 mt-1">Manage orders</p>
              </motion.div>
            </Link>
            <Link href="/admin/tags">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg cursor-pointer border-2 border-orange-200 hover:border-orange-300 transition-all"
              >
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <p className="font-semibold text-gray-800">Manage Tags</p>
                <p className="text-xs text-gray-600 mt-1">Organize content</p>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
