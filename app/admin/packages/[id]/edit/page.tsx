'use client';

import { use } from 'react';
import PackageEditor from '@/components/admin/PackageEditor';

export default function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="pt-16">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">Edit Package</h1>
        <p className="text-gray-600">Update package information</p>
      </div>
      <PackageEditor packageId={id} />
    </div>
  );
}

