import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [totalBookings, pendingBookings, totalPackages, totalBlogPosts, bookings] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'pending' } }),
      prisma.package.count(),
      prisma.blogPost.count(),
      prisma.booking.findMany({
        where: { status: 'confirmed', paymentStatus: 'paid' },
        select: { totalPrice: true },
      }),
    ]);

    const revenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

    return NextResponse.json({
      totalBookings,
      pendingBookings,
      totalPackages,
      totalBlogPosts,
      revenue,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

