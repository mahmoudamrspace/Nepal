import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/supabase/adminSession';
import { validatePackage } from '@/lib/adminValidations';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const { data: pkg, error } = await auth.admin.from('packages').select('*').eq('id', id).maybeSingle();

  if (error) {
    console.error('Package fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch package' }, { status: 500 });
  }

  if (!pkg) {
    return NextResponse.json({ error: 'Package not found' }, { status: 404 });
  }

  return NextResponse.json(pkg);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await request.json();

  const validationResult = validatePackage({
    slug: body.slug,
    name: body.name,
    shortDescription: body.shortDescription,
    fullDescription: body.fullDescription,
    price: parseFloat(body.price),
    currency: body.currency || 'USD',
    duration: body.duration,
    location: body.location,
    difficulty: body.difficulty,
    groupSize: parseInt(body.groupSize, 10),
    images: body.images || [],
    featuredImage: body.featuredImage,
    category: body.category,
    featured: body.featured || false,
    availableDates: body.availableDates || [],
    itinerary: body.itinerary || [],
    included: body.included || [],
    excluded: body.excluded || [],
    faq: body.faq || [],
    highlights: body.highlights || [],
  });

  if (!validationResult.success) {
    const errors = validationResult.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
  }

  const packageData = validationResult.data;

  const { data: updatedPackage, error } = await auth.admin
    .from('packages')
    .update(packageData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Package update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(updatedPackage);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const { error } = await auth.admin.from('packages').delete().eq('id', id);

  if (error) {
    console.error('Package delete error:', error);
    return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
