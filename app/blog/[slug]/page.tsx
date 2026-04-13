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
import Link from 'next/link';
import { BlogPost } from '@/types';

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/blog/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const post = await res.json();
    // Transform the post to match BlogPost type
    return {
      ...post,
      tags: post.tags?.map((t: any) => t.name || t) || [],
    };
  } catch (error) {
    console.error('Failed to fetch blog post:', error);
    return null;
  }
}

async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/blog`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const posts = await res.json();
    return posts.map((post: any) => ({
      ...post,
      tags: post.tags?.map((t: any) => t.name || t) || [],
    }));
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return [];
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getAllPosts();
  const currentIndex = allPosts.findIndex(p => p.id === post.id);
  const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const postUrl = `${baseUrl}/blog/${post.slug}`;

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

