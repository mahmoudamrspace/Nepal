import { NextRequest, NextResponse } from 'next/server';
import { createAnonClient } from '@/lib/supabase/anon';
import { fetchPackages } from '@/lib/supabase/queries';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    const supabase = createAnonClient();
    const { packages, error } = await fetchPackages(supabase, {
      category,
      featured: featured === 'true',
    });

    if (error) {
      console.error('Packages fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
    }

    return NextResponse.json(packages);
  } catch (e) {
    console.error('Packages fetch error:', e);
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}
