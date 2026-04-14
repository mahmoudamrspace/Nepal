/**
 * Seed Supabase after running supabase/migrations/20250408000000_initial_schema.sql
 * Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from '@supabase/supabase-js';
import { mockPackages } from '../data/mockPackages';
import { mockBlogPosts } from '../data/mockBlogPosts';
import { mockReviews } from '../data/mockReviews';

function rid() {
  return crypto.randomUUID();
}

async function setBlogTags(
  admin: ReturnType<typeof createClient>,
  postId: string,
  tagNames: string[],
  tagMap: Map<string, string>
) {
  await admin.from('_BlogPostToTag').delete().eq('A', postId);
  const rows = tagNames
    .map((name) => {
      const B = tagMap.get(name);
      return B ? { A: postId, B } : null;
    })
    .filter(Boolean) as { A: string; B: string }[];
  if (rows.length) {
    const { error } = await admin.from('_BlogPostToTag').insert(rows);
    if (error) throw error;
  }
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log('🌱 Seeding Supabase...');

  const { data: existingUsers } = await admin.auth.admin.listUsers();
  let userId: string | undefined = existingUsers?.users?.find(
    (u) => u.email === 'admin@nepal.com'
  )?.id;

  if (!userId) {
    const { data, error } = await admin.auth.admin.createUser({
      email: 'admin@nepal.com',
      password: 'admin123',
      email_confirm: true,
      user_metadata: { name: 'Admin User' },
    });
    if (error) {
      console.error('createUser:', error.message);
      process.exit(1);
    }
    userId = data.user?.id;
  }

  if (!userId) {
    console.error('Could not resolve admin user id');
    process.exit(1);
  }

  await admin.from('profiles').upsert(
    {
      id: userId,
      name: 'Admin User',
      role: 'SUPER_ADMIN',
      updatedAt: new Date().toISOString(),
    },
    { onConflict: 'id' }
  );

  console.log('✅ Admin admin@nepal.com — change password in production.');

  const authorMap = new Map<string, string>();
  const uniqueAuthors = new Map<string, (typeof mockBlogPosts)[0]['author']>();
  mockBlogPosts.forEach((post) => {
    if (!uniqueAuthors.has(post.author.name)) {
      uniqueAuthors.set(post.author.name, post.author);
    }
  });

  for (const [, authorData] of uniqueAuthors) {
    const { data: existing } = await admin.from('authors').select('id').eq('name', authorData.name).maybeSingle();
    const id = existing?.id ?? rid();
    const { error } = await admin.from('authors').upsert(
      {
        id,
        name: authorData.name,
        avatar: authorData.avatar,
        bio: authorData.bio,
      },
      { onConflict: 'name' }
    );
    if (error) throw error;
    authorMap.set(authorData.name, id);
    console.log('✅ Author:', authorData.name);
  }

  const tagMap = new Map<string, string>();
  const allTags = new Set<string>();
  mockBlogPosts.forEach((post) => post.tags.forEach((tag) => allTags.add(tag)));

  for (const tagName of allTags) {
    const slug = tagName.toLowerCase().replace(/\s+/g, '-');
    const { data: existing } = await admin.from('tags').select('id').eq('slug', slug).maybeSingle();
    const id = existing?.id ?? rid();
    const { error } = await admin.from('tags').upsert({ id, name: tagName, slug }, { onConflict: 'slug' });
    if (error) throw error;
    tagMap.set(tagName, id);
    console.log('✅ Tag:', tagName);
  }

  for (const post of mockBlogPosts) {
    const authorId = authorMap.get(post.author.name)!;
    const { data: existing } = await admin.from('blog_posts').select('id').eq('slug', post.slug).maybeSingle();
    const id = existing?.id ?? rid();
    const row = {
      id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage,
      images: post.images,
      authorId,
      category: post.category,
      publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString() : null,
      featured: post.featured,
      views: post.views ?? 0,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      readingTime: post.readingTime,
    };
    const { error } = await admin.from('blog_posts').upsert(row, { onConflict: 'slug' });
    if (error) throw error;
    await setBlogTags(admin, id, post.tags, tagMap);
    console.log('✅ Blog:', post.title);
  }

  for (const pkg of mockPackages) {
    const { data: existing } = await admin.from('packages').select('id').eq('slug', pkg.slug).maybeSingle();
    const id = existing?.id ?? rid();
    const row = {
      id,
      slug: pkg.slug,
      name: pkg.name,
      shortDescription: pkg.shortDescription,
      fullDescription: pkg.fullDescription,
      price: pkg.price,
      currency: pkg.currency,
      duration: pkg.duration,
      location: pkg.location,
      difficulty: pkg.difficulty,
      groupSize: pkg.groupSize,
      images: pkg.images,
      featuredImage: pkg.featuredImage,
      category: pkg.category,
      featured: pkg.featured,
      availableDates: pkg.availableDates,
      itinerary: pkg.itinerary,
      included: pkg.included,
      excluded: pkg.excluded,
      faq: pkg.faq,
      highlights: pkg.highlights,
    };
    const { error } = await admin.from('packages').upsert(row, { onConflict: 'slug' });
    if (error) throw error;
    console.log('✅ Package:', pkg.name);
  }

  const { data: existingReviews } = await admin.from('reviews').select('id');
  for (const r of existingReviews ?? []) {
    await admin.from('reviews').delete().eq('id', r.id);
  }
  for (const review of mockReviews) {
    const { error } = await admin.from('reviews').insert({
      id: rid(),
      platform: review.platform,
      reviewerName: review.reviewerName,
      reviewerAvatar: review.reviewerAvatar ?? null,
      rating: review.rating,
      reviewText: review.reviewText,
      date: new Date(review.date).toISOString(),
      reviewUrl: review.reviewUrl ?? null,
      verified: review.verified ?? false,
    });
    if (error) throw error;
    console.log('✅ Review:', review.reviewerName);
  }

  console.log('🎉 Seed complete.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
