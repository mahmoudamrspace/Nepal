'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Blog page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl md:text-5xl font-serif text-gray-800 mb-4">
          Failed to load blog
        </h1>
        <p className="text-gray-600 mb-8 font-sans">
          We couldn't load the blog posts. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-[#485342] text-white rounded-full font-semibold hover:bg-[#3a4235] transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 border-2 border-[#485342] text-[#485342] rounded-full font-semibold hover:bg-[#485342] hover:text-white transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

