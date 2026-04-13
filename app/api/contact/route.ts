import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/validations';
import { rateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { prisma } from '@/lib/db';
import { sendContactNotification, sendContactConfirmation } from '@/lib/email';

export async function POST(request: NextRequest) {
  // Rate limiting
  const identifier = getClientIdentifier(request);
  const rateLimitResult = rateLimit(`contact:${identifier}`, 5, 60000); // 5 requests per minute
  
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
    const validationResult = contactFormSchema.safeParse(body);
    
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

    // Store submission in database
    let submissionId: string | null = null;
    try {
      const submission = await prisma.contactSubmission.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone || null,
          subject: validatedData.subject,
          message: validatedData.message,
        },
      });
      submissionId = submission.id;
    } catch (dbError) {
      console.error('Failed to save contact submission to database:', dbError);
      // Continue even if database save fails - we'll still try to send emails
    }

    // Send notification email to business
    const notificationResult = await sendContactNotification(validatedData);
    if (!notificationResult.success) {
      console.error('Failed to send notification email:', notificationResult.error);
      // Log but don't fail the request - submission is saved in DB
    }

    // Send confirmation email to user
    const confirmationResult = await sendContactConfirmation(validatedData);
    if (!confirmationResult.success) {
      console.error('Failed to send confirmation email:', confirmationResult.error);
      // Log but don't fail the request - notification email was sent
    }

    return NextResponse.json(
      { 
        message: 'Message sent successfully',
        submissionId,
      },
      { 
        status: 200,
        headers: {
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
        }
      }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}

