import { Suspense } from 'react';
import Link from 'next/link';
import BlogCard from '../blog/BlogCard';
import BlogCardSkeleton from '../ui/BlogCardSkeleton';
import type { BlogPost } from '@/types';

async function getFeaturedPosts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/blog?featured=true`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    if (!res.ok) return [];
    const posts = await res.json();
    return posts.slice(0, 3);
  } catch (error) {
    console.error('Failed to fetch featured posts:', error);
    return [];
  }
}

export default async function FeaturedBlogPosts() {
  const featuredPosts = await getFeaturedPosts();

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-800 mb-4">
            LATEST FROM OUR BLOG
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover travel tips, cultural insights, and adventure stories from Nepal
          </p>
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
            {[1, 2, 3].map((i) => <BlogCardSkeleton key={i} />)}
          </div>
        }>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
            {featuredPosts.map((post: BlogPost, index: number) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </Suspense>

        <div className="text-center">
          <Link
            href="/blog"
            className="inline-block px-8 py-4 border-2 border-[#485342] rounded-full text-sm md:text-base font-sans text-[#485342] uppercase tracking-wide hover:bg-[#485342] hover:text-white transition-all duration-300 font-semibold button-shadow hover:button-shadow-hover focus:outline-none focus:ring-4 focus:ring-[#485342]/50"
            aria-label="View all blog posts"
          >
            View All Posts
          </Link>
        </div>
      </div>
    </section>
  );
}

