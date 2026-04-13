import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    const where: any = {};
    if (category) {
      where.category = category;
    }
    if (featured === 'true') {
      where.featured = true;
    }

    const packages = await prisma.package.findMany({
      where,
      orderBy: { createdAt: 'desc' },
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

