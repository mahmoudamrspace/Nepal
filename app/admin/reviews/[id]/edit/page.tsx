'use client';

import { use } from 'react';
import ReviewEditor from '@/components/admin/ReviewEditor';

export default function EditReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="pt-16">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">Edit Review</h1>
        <p className="text-gray-600">Update review information</p>
      </div>
      <ReviewEditor reviewId={id} />
    </div>
  );
}

