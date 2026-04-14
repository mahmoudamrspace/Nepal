'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BlogPost } from '@/types';
import { getBlurDataURL, getImageSizes, shouldBypassImageOptimizer } from '@/lib/imageUtils';

interface BlogCardProps {
  post: BlogPost;
  index?: number;
  featured?: boolean;
}

export default function BlogCard({ post, index = 0, featured = false }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-lg overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300"
    >
      <Link href={`/blog/${post.slug}`} aria-label={`Read article: ${post.title}`}>
        <div className={`relative overflow-hidden group ${featured ? 'h-80 md:h-96' : 'h-64 md:h-72'}`}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="relative h-full w-full"
          >
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes={getImageSizes({ 
                mobile: '100vw', 
                tablet: featured ? '100vw' : '50vw', 
                desktop: featured ? '66vw' : '33vw' 
              })}
              placeholder="blur"
              blurDataURL={getBlurDataURL()}
              loading={index < 3 ? 'eager' : 'lazy'}
              unoptimized={shouldBypassImageOptimizer(post.featuredImage)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-[#485342] text-white">
              {post.category}
            </span>
          </div>
        </div>
        <div className="p-6 md:p-8">
          <h3 className={`font-serif text-[#2d2d2d] mb-3 line-clamp-2 ${featured ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>
            {post.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-3">
              {post.author.avatar && (
                <Image
                  src={post.author.avatar}
                  alt={`${post.author.name}'s avatar`}
                  width={32}
                  height={32}
                  className="rounded-full"
                  sizes="32px"
                  placeholder="blur"
                  blurDataURL={getBlurDataURL()}
                  unoptimized={shouldBypassImageOptimizer(post.author.avatar)}
                />
              )}
              <span className="font-medium">{post.author.name}</span>
            </div>
            <span>{post.readingTime} min read</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{formatDate(post.publishedAt)}</span>
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-[#485342] font-semibold text-sm uppercase tracking-wide hover:underline"
            >
              Read More →
            </motion.span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

