import { NextRequest, NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { requireAdminSession } from '@/lib/supabase/adminSession';
import { validateBlogPost } from '@/lib/adminValidations';
import { replaceBlogPostTags } from '@/lib/supabase/blogTags';

async function loadBlogPostWithRelations(admin: SupabaseClient, id: string) {
  const { data: post, error } = await admin.from('blog_posts').select('*').eq('id', id).maybeSingle();
  if (error) return { post: null, error };
  if (!post) return { post: null, error: null };

  const { data: author } = await admin.from('authors').select('*').eq('id', post.authorId).maybeSingle();
  const { data: links } = await admin.from('_BlogPostToTag').select('B').eq('A', id);
  const tagIds = (links ?? []).map((l) => l.B as string);
  const { data: tags } =
    tagIds.length > 0 ? await admin.from('tags').select('*').in('id', tagIds) : { data: [] };

  return { post: { ...post, author: author ?? null, tags: tags ?? [] }, error: null };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const { post, error } = await loadBlogPostWithRelations(auth.admin, id);

  if (error) {
    console.error('Blog post fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const { id } = await params;
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
  const postData = {
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

  const { data: updatedPost, error } = await auth.admin
    .from('blog_posts')
    .update(postData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Blog post update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await replaceBlogPostTags(auth.admin, id, validatedData.tagIds);

  return NextResponse.json(updatedPost);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  await auth.admin.from('_BlogPostToTag').delete().eq('A', id);
  const { error } = await auth.admin.from('blog_posts').delete().eq('id', id);

  if (error) {
    console.error('Blog post delete error:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
