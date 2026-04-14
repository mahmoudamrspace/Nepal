'use client';

import Image from 'next/image';
import { Author } from '@/types';
import { shouldBypassImageOptimizer } from '@/lib/imageUtils';

interface AuthorBioProps {
  author: Author;
}

export default function AuthorBio({ author }: AuthorBioProps) {
  return (
    <div className="bg-[#dbe2dd] rounded-lg p-6 md:p-8">
      <div className="flex items-start gap-4 md:gap-6">
        {author.avatar && (
          <div className="flex-shrink-0">
            <Image
              src={author.avatar}
              alt={author.name}
              width={80}
              height={80}
              className="rounded-full"
              unoptimized={shouldBypassImageOptimizer(author.avatar)}
            />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-xl md:text-2xl font-serif text-[#2d2d2d] mb-2">About {author.name}</h3>
          {author.bio && (
            <p className="text-gray-700 leading-relaxed">{author.bio}</p>
          )}
        </div>
      </div>
    </div>
  );
}

