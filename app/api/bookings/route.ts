import { NextRequest, NextResponse } from 'next/server';
import { bookingSchema } from '@/lib/validations';
import { generateBookingNumber } from '@/lib/bookingUtils';
import { rateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { createAnonClient } from '@/lib/supabase/anon';
import { createAdminClient } from '@/lib/supabase/admin';
import { newEntityId } from '@/lib/supabase/queries';

export async function POST(request: NextRequest) {
  const identifier = getClientIdentifier(request);
  const rateLimitResult = rateLimit(`booking:${identifier}`, 3, 60000);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        error: 'Too many booking requests. Please try again later.',
        resetTime: rateLimitResult.resetTime,
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
        },
      }
    );
  }

  try {
    const body = await request.json();
    const validationResult = bookingSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
    }

    const validatedData = validationResult.data;
    const primaryTraveler = validatedData.travelers.find((t) => t.isPrimary);
    if (!primaryTraveler) {
      validatedData.travelers[0].isPrimary = true;
    }

    const bookingNumber = generateBookingNumber();
    const id = newEntityId();
    const primary = primaryTraveler ?? validatedData.travelers[0];

    const row = {
      id,
      bookingNumber,
      packageId: validatedData.packageId,
      travelers: validatedData.travelers,
      selectedDate: validatedData.selectedDate,
      numberOfTravelers: validatedData.numberOfTravelers,
      basePrice: body.basePrice ?? 0,
      taxes: body.taxes ?? 0,
      fees: body.fees ?? 0,
      totalPrice: body.totalPrice ?? 0,
      currency: body.currency ?? 'USD',
      status: 'pending' as const,
      paymentStatus: 'pending' as const,
      paymentMethod: validatedData.payment.paymentMethod,
      customerEmail: primary.email,
      customerPhone: primary.phone,
      specialRequests: validatedData.specialRequests ?? null,
      emergencyContact: validatedData.emergencyContact ?? null,
    };

    const supabase = createAnonClient();
    const { data: booking, error } = await supabase.from('bookings').insert(row).select().single();

    if (error) {
      console.error('Booking insert error:', error);
      return NextResponse.json(
        { error: 'Failed to create booking. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        booking: {
          id: booking.id,
          bookingNumber: booking.bookingNumber,
          status: booking.status,
          totalPrice: booking.totalPrice,
          currency: booking.currency,
        },
      },
      {
        status: 201,
        headers: {
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
        },
      }
    );
  } catch (e) {
    console.error('Booking creation error:', e);
    return NextResponse.json(
      { error: 'Failed to create booking. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingNumber = searchParams.get('bookingNumber');

    if (!bookingNumber) {
      return NextResponse.json({ error: 'Booking number is required' }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data: booking, error } = await admin
      .from('bookings')
      .select('*')
      .eq('bookingNumber', bookingNumber)
      .maybeSingle();

    if (error) {
      console.error('Booking lookup error:', error);
      return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
    }

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const { data: pkg } = await admin
      .from('packages')
      .select('name, slug')
      .eq('id', booking.packageId)
      .maybeSingle();

    return NextResponse.json({
      booking: {
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        packageId: booking.packageId,
        packageName: pkg?.name ?? '',
        packageSlug: pkg?.slug ?? '',
        travelers: booking.travelers,
        selectedDate: booking.selectedDate,
        numberOfTravelers: booking.numberOfTravelers,
        basePrice: booking.basePrice,
        taxes: booking.taxes,
        fees: booking.fees,
        totalPrice: booking.totalPrice,
        currency: booking.currency,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        paymentMethod: booking.paymentMethod,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
        specialRequests: booking.specialRequests,
        emergencyContact: booking.emergencyContact,
        createdAt:
          booking.createdAt instanceof Date
            ? booking.createdAt.toISOString()
            : String(booking.createdAt),
      },
    });
  } catch (e) {
    console.error('Booking fetch error:', e);
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
  }
}
