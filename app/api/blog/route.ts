import { NextRequest, NextResponse } from 'next/server';
import { createAnonClient } from '@/lib/supabase/anon';
import { fetchBlogPostsPublished } from '@/lib/supabase/queries';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    const supabase = createAnonClient();
    const { posts, error } = await fetchBlogPostsPublished(supabase, {
      category,
      featured: featured === 'true',
    });

    if (error) {
      console.error('Blog posts fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
    }

    return NextResponse.json(posts);
  } catch (e) {
    console.error('Blog posts fetch error:', e);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}
