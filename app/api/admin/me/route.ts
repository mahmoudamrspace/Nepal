import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdminSession } from '@/lib/supabase/adminSession';

export async function GET() {
  const session = await requireAdminSession();
  if (!session.ok) return session.response;

  const supabase = await createClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await session.admin
    .from('profiles')
    .select('name, role')
    .eq('id', session.userId)
    .maybeSingle();

  return NextResponse.json({
    email: user.email,
    name: profile?.name || user.email?.split('@')[0] || 'Admin',
    role: profile?.role ?? 'EDITOR',
  });
}
