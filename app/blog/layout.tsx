import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Travel Blog - POVEDA | Nepal Travel Tips & Stories',
  description: 'Read travel tips, cultural insights, and adventure stories from Nepal. Get inspired for your next journey to the Himalayas.',
  openGraph: {
    title: 'Travel Blog - POVEDA',
    description: 'Read travel tips, cultural insights, and adventure stories from Nepal.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Travel Blog - POVEDA',
    description: 'Read travel tips, cultural insights, and adventure stories from Nepal.',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

