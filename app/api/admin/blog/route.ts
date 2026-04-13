import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { validateBlogPost } from '@/lib/adminValidations';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            name: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
      },
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

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate the blog post data
    const validationResult = validateBlogPost({
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      featuredImage: body.featuredImage,
      images: body.images || [],
      authorId: body.authorId,
      category: body.category,
      tagIds: body.tagIds || [],
      publishedAt: body.publishedAt || null,
      featured: body.featured || false,
      seoTitle: body.seoTitle || '',
      seoDescription: body.seoDescription || '',
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
    const postData = {
      slug: validatedData.slug,
      title: validatedData.title,
      excerpt: validatedData.excerpt,
      content: validatedData.content,
      featuredImage: validatedData.featuredImage,
      images: validatedData.images,
      authorId: validatedData.authorId,
      category: validatedData.category,
      publishedAt: validatedData.publishedAt ? new Date(validatedData.publishedAt) : null,
      featured: validatedData.featured,
      seoTitle: validatedData.seoTitle || null,
      seoDescription: validatedData.seoDescription || null,
      readingTime: Math.ceil((validatedData.content || '').split(' ').length / 200) || 5,
    };

    const newPost = await prisma.blogPost.create({
      data: {
        ...postData,
        tags: {
          connect: validatedData.tagIds.map((id: string) => ({ id })),
        },
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    console.error('Blog post creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create blog post' },
      { status: 500 }
    );
  }
}

