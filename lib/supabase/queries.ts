import type { SupabaseClient } from '@supabase/supabase-js';

export function newEntityId(): string {
  return crypto.randomUUID();
}

type TagRow = { id: string; name: string; slug: string; color?: string | null };

export async function fetchBlogPostsPublished(
  supabase: SupabaseClient,
  opts: { category?: string | null; featured?: boolean }
) {
  let q = supabase
    .from('blog_posts')
    .select('*')
    .not('publishedAt', 'is', null)
    .order('publishedAt', { ascending: false });

  if (opts.category) q = q.eq('category', opts.category);
  if (opts.featured) q = q.eq('featured', true);

  const { data: posts, error } = await q;
  if (error) return { posts: null, error };
  if (!posts?.length) return { posts: [], error: null };

  return { posts: await attachBlogRelations(supabase, posts), error: null };
}

export async function fetchBlogPostPublishedBySlug(supabase: SupabaseClient, slug: string) {
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .not('publishedAt', 'is', null)
    .maybeSingle();

  if (error) return { post: null, error };
  if (!post) return { post: null, error: null };

  const [withRelations] = await attachBlogRelations(supabase, [post]);
  return { post: withRelations, error: null };
}

export async function fetchBlogPostsAdmin(supabase: SupabaseClient) {
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('createdAt', { ascending: false });

  if (error) return { posts: null, error };
  if (!posts?.length) return { posts: [], error: null };

  return { posts: await attachBlogRelations(supabase, posts, true), error: null };
}

async function attachBlogRelations(
  supabase: SupabaseClient,
  posts: Record<string, unknown>[],
  adminTagShape = false
) {
  const ids = posts.map((p) => p.id as string);
  const { data: links } = await supabase.from('_BlogPostToTag').select('A,B').in('A', ids);
  const tagIds = [...new Set((links ?? []).map((l) => l.B as string))];
  const { data: tagRows } = tagIds.length
    ? await supabase.from('tags').select('*').in('id', tagIds)
    : { data: [] as TagRow[] };

  const tagById = Object.fromEntries((tagRows ?? []).map((t) => [t.id, t as TagRow]));
  const tagsByPost: Record<string, TagRow[]> = {};
  for (const l of links ?? []) {
    const a = l.A as string;
    const b = l.B as string;
    if (!tagsByPost[a]) tagsByPost[a] = [];
    const t = tagById[b];
    if (t) tagsByPost[a].push(t);
  }

  const authorIds = [...new Set(posts.map((p) => p.authorId as string))];
  const { data: authors } = await supabase.from('authors').select('*').in('id', authorIds);
  const authorById = Object.fromEntries((authors ?? []).map((a) => [a.id, a]));

  return posts.map((p) => {
    const author = authorById[p.authorId as string] ?? null;
    const rawTags = tagsByPost[p.id as string] ?? [];
    const tags = adminTagShape
      ? rawTags.map((t) => ({ id: t.id, name: t.name }))
      : rawTags.map((t) => ({ name: t.name, slug: t.slug }));
    return { ...p, author, tags };
  });
}

export async function fetchPackages(
  supabase: SupabaseClient,
  opts: { category?: string | null; featured?: boolean }
) {
  let q = supabase.from('packages').select('*').order('createdAt', { ascending: false });
  if (opts.category) q = q.eq('category', opts.category);
  if (opts.featured) q = q.eq('featured', true);

  const { data: packages, error } = await q;
  if (error) return { packages: null, error };
  if (!packages?.length) return { packages: [], error: null };

  return { packages: await attachPackageTags(supabase, packages), error: null };
}

export async function fetchPackageBySlug(supabase: SupabaseClient, slug: string) {
  const { data: pkg, error } = await supabase.from('packages').select('*').eq('slug', slug).maybeSingle();
  if (error) return { package: null, error };
  if (!pkg) return { package: null, error: null };
  const [withTags] = await attachPackageTags(supabase, [pkg]);
  return { package: withTags, error: null };
}

export async function fetchPackageSlugs(supabase: SupabaseClient) {
  const { data, error } = await supabase.from('packages').select('slug');
  if (error) return { slugs: null as string[] | null, error };
  return { slugs: (data ?? []).map((r) => r.slug as string), error: null };
}

export async function fetchPublishedBlogSlugs(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug')
    .not('publishedAt', 'is', null);
  if (error) return { slugs: null as string[] | null, error };
  return { slugs: (data ?? []).map((r) => r.slug as string), error: null };
}

async function attachPackageTags(supabase: SupabaseClient, packages: Record<string, unknown>[]) {
  const ids = packages.map((p) => p.id as string);
  const { data: links } = await supabase.from('_PackageToTag').select('A,B').in('A', ids);
  const tagIds = [...new Set((links ?? []).map((l) => l.B as string))];
  const { data: tagRows } = tagIds.length
    ? await supabase.from('tags').select('*').in('id', tagIds)
    : { data: [] as TagRow[] };

  const tagById = Object.fromEntries((tagRows ?? []).map((t) => [t.id, t as TagRow]));
  const tagsByPackage: Record<string, TagRow[]> = {};
  for (const l of links ?? []) {
    const a = l.A as string;
    const b = l.B as string;
    if (!tagsByPackage[a]) tagsByPackage[a] = [];
    const t = tagById[b];
    if (t) tagsByPackage[a].push(t);
  }

  return packages.map((p) => ({
    ...p,
    tags: tagsByPackage[p.id as string] ?? [],
  }));
}
