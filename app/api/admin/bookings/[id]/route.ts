import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/supabase/adminSession';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const { data: booking, error } = await auth.admin.from('bookings').select('*').eq('id', id).maybeSingle();

  if (error) {
    console.error('Booking fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
  }

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  const { data: pkg } = await auth.admin
    .from('packages')
    .select('name, slug, featuredImage')
    .eq('id', booking.packageId)
    .maybeSingle();

  return NextResponse.json({
    ...booking,
    package: pkg ?? null,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await request.json();

  const { data: updatedBooking, error } = await auth.admin
    .from('bookings')
    .update({
      status: body.status,
      paymentStatus: body.paymentStatus,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Booking update error:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }

  return NextResponse.json(updatedBooking);
}
