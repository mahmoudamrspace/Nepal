import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/supabase/adminSession';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await request.json();
  const tagData = {
    name: body.name,
    slug: body.slug,
    color: body.color || null,
  };

  const { data: updatedTag, error } = await auth.admin
    .from('tags')
    .update(tagData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Tag update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(updatedTag);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const { error } = await auth.admin.from('tags').delete().eq('id', id);

  if (error) {
    console.error('Tag delete error:', error);
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
