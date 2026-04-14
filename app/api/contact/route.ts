import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/validations';
import { rateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { createAnonClient } from '@/lib/supabase/anon';
import { newEntityId } from '@/lib/supabase/queries';
import { sendContactNotification, sendContactConfirmation } from '@/lib/email';

export async function POST(request: NextRequest) {
  const identifier = getClientIdentifier(request);
  const rateLimitResult = rateLimit(`contact:${identifier}`, 5, 60000);

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
    const validationResult = contactFormSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
    }

    const validatedData = validationResult.data;
    let submissionId: string | null = null;

    try {
      const supabase = createAnonClient();
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert({
          id: newEntityId(),
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone || null,
          subject: validatedData.subject,
          message: validatedData.message,
        })
        .select('id')
        .single();

      if (!error && data) submissionId = data.id;
      else if (error) console.error('Contact DB error:', error);
    } catch (dbError) {
      console.error('Failed to save contact submission:', dbError);
    }

    const notificationResult = await sendContactNotification(validatedData);
    if (!notificationResult.success) {
      console.error('Failed to send notification email:', notificationResult.error);
    }

    const confirmationResult = await sendContactConfirmation(validatedData);
    if (!confirmationResult.success) {
      console.error('Failed to send confirmation email:', confirmationResult.error);
    }

    return NextResponse.json(
      { message: 'Message sent successfully', submissionId },
      {
        status: 200,
        headers: {
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
        },
      }
    );
  } catch (e) {
    console.error('Contact form error:', e);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
