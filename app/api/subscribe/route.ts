import { NextRequest, NextResponse } from 'next/server';
import { subscribeSchema } from '@/lib/validations';
import { rateLimit, getClientIdentifier } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  // Rate limiting
  const identifier = getClientIdentifier(request);
  const rateLimitResult = rateLimit(`subscribe:${identifier}`, 3, 60000); // 3 requests per minute
  
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { 
        error: 'Too many requests. Please try again later.',
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
    const validationResult = subscribeSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: validationResult.error.issues[0]?.message || 'Please provide a valid email address'
        },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    // Here you would typically save the email to a database or email service
    // For now, we'll just log it and return success
    console.log('New subscription:', email);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json(
      { message: 'Subscription successful', email },
      { 
        status: 200,
        headers: {
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
        }
      }
    );
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
