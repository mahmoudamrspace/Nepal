import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/layout/Header';
import Hero from '@/components/sections/Hero';
import Footer from '@/components/layout/Footer';
import { Metadata } from 'next';

// Dynamic imports for heavy components (below the fold)
const LicenceToLive = dynamic(() => import('@/components/sections/LicenceToLive'), {
  loading: () => <div className="h-96 bg-[#dbe2dd] animate-pulse" />,
});

const PlaceToBe = dynamic(() => import('@/components/sections/PlaceToBe'), {
  loading: () => <div className="h-96 bg-white animate-pulse" />,
});

const InLoveWithNepal = dynamic(() => import('@/components/sections/InLoveWithNepal'), {
  loading: () => <div className="h-96 bg-[#dbe2dd] animate-pulse" />,
});

const FeaturedPackages = dynamic(() => import('@/components/sections/FeaturedPackages'), {
  loading: () => <div className="h-96 bg-[#dbe2dd] animate-pulse" />,
});

const FeaturedBlogPosts = dynamic(() => import('@/components/sections/FeaturedBlogPosts'), {
  loading: () => <div className="h-96 bg-white animate-pulse" />,
});

const Reviews = dynamic(() => import('@/components/sections/Reviews'), {
  loading: () => <div className="h-96 bg-[#dbe2dd] animate-pulse" />,
});

const Instagram = dynamic(() => import('@/components/sections/Instagram'), {
  loading: () => <div className="h-96 bg-[#dbe2dd] animate-pulse" />,
});

const Subscribe = dynamic(() => import('@/components/sections/Subscribe'), {
  loading: () => <div className="h-96 bg-white animate-pulse" />,
});

export const metadata: Metadata = {
  title: 'POVEDA - Visit Nepal | Adventure, Culture & Relaxation',
  description: 'Experience the magic of Nepal with POVEDA. Discover adventures, culture, and relaxation in the heart of the Himalayas. Book your unforgettable journey today.',
  keywords: ['Nepal travel', 'Nepal tours', 'Himalayas', 'adventure travel', 'cultural tours', 'Nepal packages'],
  openGraph: {
    title: 'POVEDA - Visit Nepal',
    description: 'Experience the magic of Nepal with POVEDA. Discover adventures, culture, and relaxation in the heart of the Himalayas.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'POVEDA - Visit Nepal',
    description: 'Experience the magic of Nepal with POVEDA. Discover adventures, culture, and relaxation in the heart of the Himalayas.',
  },
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <LicenceToLive />
      <PlaceToBe />
      <InLoveWithNepal />
      <Suspense fallback={<div className="h-96 bg-[#dbe2dd] animate-pulse" />}>
        <FeaturedPackages />
      </Suspense>
      <Suspense fallback={<div className="h-96 bg-white animate-pulse" />}>
        <FeaturedBlogPosts />
      </Suspense>
      <Reviews />
      <Instagram />
      <Subscribe />
      <Footer />
    </main>
  );
}
