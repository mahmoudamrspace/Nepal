import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { validateBlogPost } from '@/lib/adminValidations';

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
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: true,
        tags: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Blog post fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
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

    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        ...postData,
        tags: {
          set: validatedData.tagIds.map((id: string) => ({ id })),
        },
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error: any) {
    console.error('Blog post update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update blog post' },
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
    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Blog post delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}

