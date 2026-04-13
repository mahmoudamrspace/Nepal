'use client';

import PackageEditor from '@/components/admin/PackageEditor';

export default function NewPackagePage() {
  return (
    <div className="pt-16">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">Create New Package</h1>
        <p className="text-gray-600">Add a new travel package to your website</p>
      </div>
      <PackageEditor />
    </div>
  );
}

