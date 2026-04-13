'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface TagListProps {
  tags: string[];
}

export default function TagList({ tags }: TagListProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Tags:</span>
      {tags.map((tag, index) => (
        <motion.div
          key={tag}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link
            href={`/blog?tag=${encodeURIComponent(tag)}`}
            className="px-4 py-2 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-[#485342] hover:text-white transition-all duration-300 font-medium"
          >
            #{tag}
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

