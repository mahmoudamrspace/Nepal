import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    const where: any = {
      publishedAt: { not: null },
    };
    if (category) {
      where.category = category;
    }
    if (featured === 'true') {
      where.featured = true;
    }

    const posts = await prisma.blogPost.findMany({
      where,
      include: {
        author: {
          select: {
            name: true,
            avatar: true,
            bio: true,
          },
        },
        tags: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { publishedAt: 'desc' },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Blog posts fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

