import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { validateReview } from '@/lib/adminValidations';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const rating = searchParams.get('rating');

    const where: any = {};
    if (platform && platform !== 'all') {
      where.platform = platform;
    }
    if (rating && rating !== 'all') {
      where.rating = parseInt(rating);
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Reviews fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate the review data
    const validationResult = validateReview({
      platform: body.platform,
      reviewerName: body.reviewerName,
      reviewerAvatar: body.reviewerAvatar || null,
      rating: body.rating,
      reviewText: body.reviewText,
      date: body.date,
      reviewUrl: body.reviewUrl || null,
      verified: body.verified || false,
    });

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    const review = await prisma.review.create({
      data: {
        platform: validatedData.platform,
        reviewerName: validatedData.reviewerName,
        reviewerAvatar: validatedData.reviewerAvatar || null,
        rating: validatedData.rating,
        reviewText: validatedData.reviewText,
        date: new Date(validatedData.date),
        reviewUrl: validatedData.reviewUrl || null,
        verified: validatedData.verified,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Review creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create review' },
      { status: 500 }
    );
  }
}

