import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { validatePackage } from '@/lib/adminValidations';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const packages = await prisma.package.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        name: true,
        price: true,
        currency: true,
        category: true,
        featured: true,
        createdAt: true,
      },
    });

    return NextResponse.json(packages);
  } catch (error) {
    console.error('Packages fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch packages' },
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

    const newPackage = await prisma.package.create({
      data: packageData,
    });

    return NextResponse.json(newPackage, { status: 201 });
  } catch (error: any) {
    console.error('Package creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create package' },
      { status: 500 }
    );
  }
}

