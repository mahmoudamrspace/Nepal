'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BlogPost } from '@/types';

interface PostNavigationProps {
  previousPost: BlogPost | null;
  nextPost: BlogPost | null;
}

export default function PostNavigation({ previousPost, nextPost }: PostNavigationProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {previousPost ? (
        <motion.div
          whileHover={{ x: -5 }}
          className="bg-white rounded-lg p-6 card-shadow"
        >
          <Link href={`/blog/${previousPost.slug}`}>
            <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide">Previous Post</p>
            <h3 className="text-xl font-serif text-[#2d2d2d] hover:text-[#485342] transition-colors">
              {previousPost.title}
            </h3>
          </Link>
        </motion.div>
      ) : (
        <div />
      )}
      
      {nextPost ? (
        <motion.div
          whileHover={{ x: 5 }}
          className="bg-white rounded-lg p-6 card-shadow md:text-right"
        >
          <Link href={`/blog/${nextPost.slug}`}>
            <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide">Next Post</p>
            <h3 className="text-xl font-serif text-[#2d2d2d] hover:text-[#485342] transition-colors">
              {nextPost.title}
            </h3>
          </Link>
        </motion.div>
      ) : (
        <div />
      )}
    </div>
  );
}

