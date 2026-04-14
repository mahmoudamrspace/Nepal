import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/supabase/adminSession';

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const { data: authors, error } = await auth.admin.from('authors').select('*').order('name', { ascending: true });

  if (error) {
    console.error('Authors fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch authors' }, { status: 500 });
  }

  return NextResponse.json(authors ?? []);
}
