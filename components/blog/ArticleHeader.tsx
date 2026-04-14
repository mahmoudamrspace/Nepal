'use client';

import Image from 'next/image';
import { BlogPost } from '@/types';
import { getBlurDataURL, shouldBypassImageOptimizer } from '@/lib/imageUtils';

interface ArticleHeaderProps {
  post: BlogPost;
}

export default function ArticleHeader({ post }: ArticleHeaderProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <section className="relative bg-[#485342] py-20 md:py-28">
      <div className="absolute inset-0 z-0">
        <Image
          src={post.featuredImage}
          alt={`${post.title} featured image`}
          fill
          className="object-cover opacity-30"
          sizes="100vw"
          placeholder="blur"
          blurDataURL={getBlurDataURL()}
          priority
          unoptimized={shouldBypassImageOptimizer(post.featuredImage)}
        />
        <div className="absolute inset-0 bg-[#485342]/80" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-white">
          <div className="mb-6">
            <span className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide bg-white/20 backdrop-blur-sm">
              {post.category}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-lg md:text-xl opacity-90 mb-8 leading-relaxed">
            {post.excerpt}
          </p>
          
          <div className="flex flex-wrap items-center gap-6 text-sm md:text-base">
            <div className="flex items-center gap-3">
              {post.author.avatar && (
                <Image
                  src={post.author.avatar}
                  alt={`${post.author.name}'s avatar`}
                  width={48}
                  height={48}
                  className="rounded-full"
                  sizes="48px"
                  placeholder="blur"
                  blurDataURL={getBlurDataURL()}
                  unoptimized={shouldBypassImageOptimizer(post.author.avatar)}
                />
              )}
              <div>
                <p className="font-semibold">{post.author.name}</p>
                <p className="text-sm opacity-80">{formatDate(post.publishedAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{post.readingTime} min read</span>
            </div>
            {post.views && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{post.views.toLocaleString()} views</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

