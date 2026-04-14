import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/supabase/adminSession';
import { validatePackage } from '@/lib/adminValidations';
import { newEntityId } from '@/lib/supabase/queries';

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const { data: packages, error } = await auth.admin
    .from('packages')
    .select('id, slug, name, price, currency, category, featured, createdAt')
    .order('createdAt', { ascending: false });

  if (error) {
    console.error('Packages fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }

  return NextResponse.json(packages ?? []);
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
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
    const id = newEntityId();

    const { data: newPackage, error } = await auth.admin
      .from('packages')
      .insert({ id, ...packageData })
      .select()
      .single();

    if (error) {
      console.error('Package creation error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(newPackage, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to create package';
    console.error('Package creation error:', e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
