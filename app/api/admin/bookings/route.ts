import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where = status && status !== 'all' ? { status: status as any } : {};

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        bookingNumber: true,
        package: {
          select: {
            name: true,
          },
        },
        customerEmail: true,
        totalPrice: true,
        currency: true,
        status: true,
        paymentStatus: true,
        numberOfTravelers: true,
        selectedDate: true,
        createdAt: true,
      },
    });

    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      bookingNumber: booking.bookingNumber,
      packageName: booking.package.name,
      customerEmail: booking.customerEmail,
      totalPrice: booking.totalPrice,
      currency: booking.currency,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      numberOfTravelers: booking.numberOfTravelers,
      selectedDate: booking.selectedDate,
      createdAt: booking.createdAt.toISOString(),
    }));

    return NextResponse.json(formattedBookings);
  } catch (error) {
    console.error('Bookings fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

