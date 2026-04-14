import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/supabase/adminSession';
import { newEntityId } from '@/lib/supabase/queries';

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const { data: tags, error } = await auth.admin.from('tags').select('*').order('name', { ascending: true });

  if (error) {
    console.error('Tags fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }

  return NextResponse.json(tags ?? []);
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const tagData = {
      id: newEntityId(),
      name: body.name,
      slug: body.slug,
      color: body.color || null,
    };

    const { data: newTag, error } = await auth.admin.from('tags').insert(tagData).select().single();

    if (error) {
      console.error('Tag creation error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(newTag, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to create tag';
    console.error('Tag creation error:', e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
