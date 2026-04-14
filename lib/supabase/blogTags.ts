import type { SupabaseClient } from '@supabase/supabase-js';

export async function replaceBlogPostTags(
  admin: SupabaseClient,
  postId: string,
  tagIds: string[]
) {
  const { error: delErr } = await admin.from('_BlogPostToTag').delete().eq('A', postId);
  if (delErr) throw delErr;
  if (!tagIds.length) return;
  const rows = tagIds.map((B) => ({ A: postId, B }));
  const { error: insErr } = await admin.from('_BlogPostToTag').insert(rows);
  if (insErr) throw insErr;
}
