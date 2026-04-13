import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { validatePackage } from '@/lib/adminValidations';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const pkg = await prisma.package.findUnique({
      where: { id },
    });

    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    return NextResponse.json(pkg);
  } catch (error) {
    console.error('Package fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch package' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Validate the package data
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
      groupSize: parseInt(body.groupSize),
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
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    const packageData = validationResult.data;

    const updatedPackage = await prisma.package.update({
      where: { id },
      data: packageData,
    });

    return NextResponse.json(updatedPackage);
  } catch (error: any) {
    console.error('Package update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update package' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.package.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Package delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete package' },
      { status: 500 }
    );
  }
}

