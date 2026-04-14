import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ArticleHeader from '@/components/blog/ArticleHeader';
import ArticleContent from '@/components/blog/ArticleContent';
import AuthorBio from '@/components/blog/AuthorBio';
import ShareButtons from '@/components/blog/ShareButtons';
import TagList from '@/components/blog/TagList';
import RelatedPosts from '@/components/blog/RelatedPosts';
import PostNavigation from '@/components/blog/PostNavigation';
import ReadingProgress from '@/components/blog/ReadingProgress';
import { BlogPost } from '@/types';
import { createAnonClient } from '@/lib/supabase/anon';
import {
  fetchBlogPostPublishedBySlug,
  fetchBlogPostsPublished,
  fetchPublishedBlogSlugs,
} from '@/lib/supabase/queries';
import { absoluteUrl, getSiteUrl } from '@/lib/siteUrl';

export const revalidate = 3600;

function toBlogPost(post: Record<string, unknown>): BlogPost {
  const rawTags = (post.tags as { name?: string }[] | undefined) ?? [];
  return {
    ...post,
    tags: rawTags.map((t) => t.name || String(t)),
  } as BlogPost;
}

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = createAnonClient();
    const { post, error } = await fetchBlogPostPublishedBySlug(supabase, slug);
    if (error || !post) return null;
    void (async () => {
      try {
        await supabase.rpc('increment_post_views', { p_slug: slug });
      } catch {
        /* ignore view counter failures */
      }
    })();
    return toBlogPost(post as Record<string, unknown>);
  } catch (error) {
    console.error('Failed to fetch blog post:', error);
    return null;
  }
}

async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const supabase = createAnonClient();
    const { posts, error } = await fetchBlogPostsPublished(supabase, {});
    if (error || !posts?.length) return [];
    return posts.map((p) => toBlogPost(p as Record<string, unknown>));
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return [];
  }
}

export async function generateStaticParams() {
  try {
    const supabase = createAnonClient();
    const { slugs, error } = await fetchPublishedBlogSlugs(supabase);
    if (error || !slugs?.length) return [];
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const site = getSiteUrl();
  const canonical = `${site}/blog/${slug}`;

  try {
    const supabase = createAnonClient();
    const { post, error } = await fetchBlogPostPublishedBySlug(supabase, slug);
    if (error || !post) {
      return { title: 'Blog', alternates: { canonical } };
    }
    const p = toBlogPost(post as Record<string, unknown>);
    const title = `${p.title} | Nepal Travel Blog`;
    const description = p.excerpt?.slice(0, 160) ?? p.title;
    const ogImage = p.featuredImage || p.images?.[0];
    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        url: canonical,
        type: 'article',
        publishedTime: p.publishedAt,
        modifiedTime: p.updatedAt,
        ...(ogImage ? { images: [{ url: absoluteUrl(ogImage), alt: p.title }] } : {}),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        ...(ogImage ? { images: [absoluteUrl(ogImage)] } : {}),
      },
    };
  } catch {
    return { title: 'Blog', alternates: { canonical } };
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.id === post.id);
  const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const postUrl = `${getSiteUrl()}/blog/${post.slug}`;

  return (
    <>
      <Header />
      <ReadingProgress />
      <main className="min-h-screen pt-20">
        {/* Article Header */}
        <ArticleHeader post={post} />

        {/* Article Content */}
        <section className="bg-white py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg p-8 md:p-10 card-shadow mb-8">
                <ArticleContent content={post.content} />
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mb-8">
                  <TagList tags={post.tags} />
                </div>
              )}

              {/* Share Buttons */}
              <div className="mb-12">
                <ShareButtons url={postUrl} title={post.title} />
              </div>

              {/* Author Bio */}
              <div className="mb-12">
                <AuthorBio author={post.author} />
              </div>

              {/* Post Navigation */}
              {(previousPost || nextPost) && (
                <div className="mb-12">
                  <PostNavigation previousPost={previousPost} nextPost={nextPost} />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Related Posts */}
        <RelatedPosts posts={allPosts} currentPostId={post.id} category={post.category} />
      </main>
      <Footer />
    </>
  );
}
