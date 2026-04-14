import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/supabase/adminSession';

export async function GET(request: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? Math.min(parseInt(limitParam, 10) || 500, 500) : 500;

  let q = auth.admin.from('bookings').select('*').order('createdAt', { ascending: false });
  if (status && status !== 'all') {
    q = q.eq('status', status);
  }
  q = q.limit(limit);

  const { data: bookings, error } = await q;
  if (error) {
    console.error('Bookings fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }

  const packageIds = [...new Set((bookings ?? []).map((b) => b.packageId))];
  const { data: packages } =
    packageIds.length > 0
      ? await auth.admin.from('packages').select('id, name').in('id', packageIds)
      : { data: [] as { id: string; name: string }[] };

  const nameById = Object.fromEntries((packages ?? []).map((p) => [p.id, p.name]));

  const formattedBookings = (bookings ?? []).map((booking) => ({
    id: booking.id,
    bookingNumber: booking.bookingNumber,
    packageName: nameById[booking.packageId] ?? '',
    customerEmail: booking.customerEmail,
    totalPrice: booking.totalPrice,
    currency: booking.currency,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    numberOfTravelers: booking.numberOfTravelers,
    selectedDate: booking.selectedDate,
    createdAt:
      booking.createdAt instanceof Date
        ? booking.createdAt.toISOString()
        : String(booking.createdAt),
  }));

  return NextResponse.json(formattedBookings);
}
