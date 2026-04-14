import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/supabase/adminSession';
import { validateReview } from '@/lib/adminValidations';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const { data: review, error } = await auth.admin.from('reviews').select('*').eq('id', id).maybeSingle();

  if (error) {
    console.error('Review fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch review' }, { status: 500 });
  }

  if (!review) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  }

  return NextResponse.json(review);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const { id } = await params;
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

  const { data: review, error } = await auth.admin
    .from('reviews')
    .update({
      platform: validatedData.platform,
      reviewerName: validatedData.reviewerName,
      reviewerAvatar: validatedData.reviewerAvatar || null,
      rating: validatedData.rating,
      reviewText: validatedData.reviewText,
      date: new Date(validatedData.date).toISOString(),
      reviewUrl: validatedData.reviewUrl || null,
      verified: validatedData.verified,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Review update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(review);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const { error } = await auth.admin.from('reviews').delete().eq('id', id);

  if (error) {
    console.error('Review deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
