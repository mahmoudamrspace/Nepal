import { NextRequest, NextResponse } from 'next/server';
import { createAnonClient } from '@/lib/supabase/anon';
import { fetchPackageBySlug } from '@/lib/supabase/queries';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = createAnonClient();
    const { package: pkg, error } = await fetchPackageBySlug(supabase, slug);

    if (error) {
      console.error('Package fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch package' }, { status: 500 });
    }

    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    return NextResponse.json(pkg);
  } catch (e) {
    console.error('Package fetch error:', e);
    return NextResponse.json({ error: 'Failed to fetch package' }, { status: 500 });
  }
}
