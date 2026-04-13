import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Travel Packages - POVEDA | Nepal Adventure Tours',
  description: 'Explore our curated selection of Nepal travel packages. From adventure trekking to cultural tours and relaxation retreats, find your perfect Nepal experience.',
  openGraph: {
    title: 'Travel Packages - POVEDA',
    description: 'Explore our curated selection of Nepal travel packages. From adventure trekking to cultural tours and relaxation retreats.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Travel Packages - POVEDA',
    description: 'Explore our curated selection of Nepal travel packages.',
  },
};

export default function PackagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

