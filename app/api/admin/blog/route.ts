import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/supabase/adminSession';
import { validateBlogPost } from '@/lib/adminValidations';
import { fetchBlogPostsAdmin } from '@/lib/supabase/queries';
import { replaceBlogPostTags } from '@/lib/supabase/blogTags';
import { newEntityId } from '@/lib/supabase/queries';

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const { posts, error } = await fetchBlogPostsAdmin(auth.admin);
  if (error) {
    console.error('Blog posts fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }

  return NextResponse.json(posts ?? []);
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
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
      return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
    }

    const validatedData = validationResult.data;
    const id = newEntityId();
    const postRow = {
      id,
      slug: validatedData.slug,
      title: validatedData.title,
      excerpt: validatedData.excerpt,
      content: validatedData.content,
      featuredImage: validatedData.featuredImage,
      images: validatedData.images,
      authorId: validatedData.authorId,
      category: validatedData.category,
      publishedAt: validatedData.publishedAt
        ? new Date(validatedData.publishedAt).toISOString()
        : null,
      featured: validatedData.featured,
      seoTitle: validatedData.seoTitle || null,
      seoDescription: validatedData.seoDescription || null,
      readingTime: Math.ceil((validatedData.content || '').split(/\s+/).filter(Boolean).length / 200) || 5,
    };

    const { data: newPost, error } = await auth.admin.from('blog_posts').insert(postRow).select().single();

    if (error) {
      console.error('Blog post creation error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await replaceBlogPostTags(auth.admin, id, validatedData.tagIds);

    return NextResponse.json(newPost, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to create blog post';
    console.error('Blog post creation error:', e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
