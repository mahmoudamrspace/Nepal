'use client';

import { use } from 'react';
import BlogEditor from '@/components/admin/BlogEditor';

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="pt-16">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">Edit Blog Post</h1>
        <p className="text-gray-600">Update blog post information</p>
      </div>
      <BlogEditor postId={id} />
    </div>
  );
}

