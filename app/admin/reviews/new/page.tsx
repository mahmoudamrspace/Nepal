'use client';

import ReviewEditor from '@/components/admin/ReviewEditor';

export default function NewReviewPage() {
  return (
    <div className="pt-16">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">Create New Review</h1>
        <p className="text-gray-600">Add a new guest review from Google or TripAdvisor</p>
      </div>
      <ReviewEditor />
    </div>
  );
}

