import { Suspense } from 'react';
import Link from 'next/link';
import PackageCard from '../packages/PackageCard';
import PackageCardSkeleton from '../ui/PackageCardSkeleton';
import type { Package } from '@/types';

async function getFeaturedPackages() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/packages?featured=true`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    if (!res.ok) return [];
    const packages = await res.json();
    return packages.slice(0, 3);
  } catch (error) {
    console.error('Failed to fetch featured packages:', error);
    return [];
  }
}

export default async function FeaturedPackages() {
  const featuredPackages = await getFeaturedPackages();

  return (
    <section className="bg-[#dbe2dd] py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-800 mb-4">
            FEATURED PACKAGES
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of unforgettable experiences in Nepal
          </p>
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
            {[1, 2, 3].map((i) => <PackageCardSkeleton key={i} />)}
          </div>
        }>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
            {featuredPackages.map((pkg: Package, index: number) => (
              <PackageCard key={pkg.id} package={pkg} index={index} />
            ))}
          </div>
        </Suspense>

        <div className="text-center">
          <Link
            href="/packages"
            className="inline-block px-8 py-4 border-2 border-[#485342] rounded-full text-sm md:text-base font-sans text-[#485342] uppercase tracking-wide hover:bg-[#485342] hover:text-white transition-all duration-300 font-semibold button-shadow hover:button-shadow-hover focus:outline-none focus:ring-4 focus:ring-[#485342]/50"
            aria-label="View all packages"
          >
            See All Packages
          </Link>
        </div>
      </div>
    </section>
  );
}

