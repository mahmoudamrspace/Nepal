import { requireAdminSession } from '@/lib/supabase/adminSession';

/** @deprecated Use requireAdminSession from @/lib/supabase/adminSession */
export async function requireAdmin() {
  const result = await requireAdminSession();
  if (!result.ok) return result.response;
  return null;
}
