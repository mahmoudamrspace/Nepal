import { MetadataRoute } from 'next';
import { createAnonClient } from '@/lib/supabase/anon';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://poveda.com';

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/packages`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/adventure`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/culture`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/relaxation`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ];

  try {
    const supabase = createAnonClient();
    const { data: packages } = await supabase.from('packages').select('slug, updatedAt, createdAt');
    const { data: blogPosts } = await supabase
      .from('blog_posts')
      .select('slug, updatedAt, publishedAt')
      .not('publishedAt', 'is', null);

    const packagePages: MetadataRoute.Sitemap = (packages ?? []).map((pkg) => ({
      url: `${baseUrl}/packages/${pkg.slug}`,
      lastModified: new Date(pkg.updatedAt ?? pkg.createdAt ?? Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    const blogPages: MetadataRoute.Sitemap = (blogPosts ?? []).map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt ?? post.publishedAt ?? Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    return [...staticPages, ...packagePages, ...blogPages];
  } catch {
    return staticPages;
  }
}
