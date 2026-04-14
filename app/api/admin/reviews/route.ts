import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdminSession } from '@/lib/supabase/adminSession';
import { validateReview } from '@/lib/adminValidations';
import { newEntityId } from '@/lib/supabase/queries';

export async function GET(request: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform');
  const rating = searchParams.get('rating');

  let q = auth.admin.from('reviews').select('*').order('date', { ascending: false });
  if (platform && platform !== 'all') {
    q = q.eq('platform', platform);
  }
  if (rating && rating !== 'all') {
    q = q.eq('rating', parseInt(rating, 10));
  }

  const { data: reviews, error } = await q;
  if (error) {
    console.error('Reviews fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }

  return NextResponse.json(reviews ?? []);
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
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
      return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
    }

    const validatedData = validationResult.data;
    const row = {
      id: newEntityId(),
      platform: validatedData.platform,
      reviewerName: validatedData.reviewerName,
      reviewerAvatar: validatedData.reviewerAvatar || null,
      rating: validatedData.rating,
      reviewText: validatedData.reviewText,
      date: new Date(validatedData.date).toISOString(),
      reviewUrl: validatedData.reviewUrl || null,
      verified: validatedData.verified,
    };

    const { data: review, error } = await auth.admin.from('reviews').insert(row).select().single();

    if (error) {
      console.error('Review creation error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(review, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: e.issues }, { status: 400 });
    }
    const message = e instanceof Error ? e.message : 'Failed to create review';
    console.error('Review creation error:', e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
