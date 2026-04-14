import { NextRequest, NextResponse } from 'next/server';
import { subscribeSchema } from '@/lib/validations';
import { rateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { createAnonClient } from '@/lib/supabase/anon';
import { newEntityId } from '@/lib/supabase/queries';

export async function POST(request: NextRequest) {
  const identifier = getClientIdentifier(request);
  const rateLimitResult = rateLimit(`subscribe:${identifier}`, 3, 60000);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        error: 'Too many requests. Please try again later.',
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
    const validationResult = subscribeSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error:
            validationResult.error.issues[0]?.message || 'Please provide a valid email address',
        },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;
    const supabase = createAnonClient();
    const { error } = await supabase.from('newsletter_subscribers').insert({
      id: newEntityId(),
      email,
      active: true,
    });

    if (error && error.code !== '23505') {
      console.error('Newsletter insert error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'Subscription successful', email },
      {
        status: 200,
        headers: {
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
        },
      }
    );
  } catch (e) {
    console.error('Subscription error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
