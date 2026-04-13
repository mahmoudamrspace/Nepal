'use client';

import BlogEditor from '@/components/admin/BlogEditor';

export default function NewBlogPage() {
  return (
    <div className="pt-16">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">Create New Blog Post</h1>
        <p className="text-gray-600">Write and publish a new blog post</p>
      </div>
      <BlogEditor />
    </div>
  );
}

