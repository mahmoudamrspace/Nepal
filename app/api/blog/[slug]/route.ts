import { NextRequest, NextResponse } from 'next/server';
import { createAnonClient } from '@/lib/supabase/anon';
import { fetchBlogPostPublishedBySlug } from '@/lib/supabase/queries';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = createAnonClient();
    const { post, error } = await fetchBlogPostPublishedBySlug(supabase, slug);

    if (error) {
      console.error('Blog post fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
    }

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await supabase.rpc('increment_post_views', { p_slug: slug });

    return NextResponse.json(post);
  } catch (e) {
    console.error('Blog post fetch error:', e);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}
