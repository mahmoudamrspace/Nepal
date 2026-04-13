import { NextRequest, NextResponse } from 'next/server';
import { bookingSchema } from '@/lib/validations';
import { generateBookingNumber } from '@/lib/bookingUtils';
import { rateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  // Rate limiting
  const identifier = getClientIdentifier(request);
  const rateLimitResult = rateLimit(`booking:${identifier}`, 3, 60000); // 3 bookings per minute
  
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { 
        error: 'Too many booking requests. Please try again later.',
        resetTime: rateLimitResult.resetTime 
      },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
        }
      }
    );
  }

  try {
    const body = await request.json();

    // Validate with Zod
    const validationResult = bookingSchema.safeParse(body);
    
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: errors 
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Ensure at least one primary traveler
    const primaryTraveler = validatedData.travelers.find(t => t.isPrimary);
    if (!primaryTraveler) {
      validatedData.travelers[0].isPrimary = true;
    }

    // Generate booking number
    const bookingNumber = generateBookingNumber();

    // Create booking in database
    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        packageId: validatedData.packageId,
        travelers: validatedData.travelers as any,
        selectedDate: validatedData.selectedDate,
        numberOfTravelers: validatedData.numberOfTravelers,
        basePrice: body.basePrice || 0,
        taxes: body.taxes || 0,
        fees: body.fees || 0,
        totalPrice: body.totalPrice || 0,
        currency: body.currency || 'USD',
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: validatedData.payment.paymentMethod,
        customerEmail: primaryTraveler?.email || validatedData.travelers[0].email,
        customerPhone: primaryTraveler?.phone || validatedData.travelers[0].phone,
        specialRequests: validatedData.specialRequests || null,
        emergencyContact: validatedData.emergencyContact ? validatedData.emergencyContact as any : null,
      },
    });

    console.log('Booking created:', {
      bookingNumber,
      customerEmail: booking.customerEmail,
      totalPrice: booking.totalPrice,
    });

    return NextResponse.json(
      { 
        success: true,
        booking: {
          id: booking.id,
          bookingNumber: booking.bookingNumber,
          status: booking.status,
          totalPrice: booking.totalPrice,
          currency: booking.currency,
        }
      },
      { 
        status: 201,
        headers: {
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
        }
      }
    );
  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking. Please try again later.' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve booking (for confirmation page)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingNumber = searchParams.get('bookingNumber');

    if (!bookingNumber) {
      return NextResponse.json(
        { error: 'Booking number is required' },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findFirst({
      where: { bookingNumber },
      include: {
        package: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      booking: {
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        packageId: booking.packageId,
        packageName: booking.package.name,
        packageSlug: booking.package.slug,
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
        createdAt: booking.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Booking fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

