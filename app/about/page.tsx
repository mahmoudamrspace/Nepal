import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CategoryHero from '@/components/categories/CategoryHero';
import OurStory from '@/components/about/OurStory';
import MissionValues from '@/components/about/MissionValues';
import WhyNepal from '@/components/about/WhyNepal';
import OurCommitment from '@/components/about/OurCommitment';
import CategoryCTA from '@/components/categories/CategoryCTA';
import { aboutContent } from '@/data/aboutContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - POVEDA | Your Trusted Nepal Travel Partner',
  description: 'Learn about POVEDA\'s mission to provide unforgettable travel experiences in Nepal. Discover our values, commitment, and why we\'re passionate about sharing Nepal\'s beauty.',
  openGraph: {
    title: 'About Us - POVEDA',
    description: 'Learn about POVEDA\'s mission to provide unforgettable travel experiences in Nepal.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'About Us - POVEDA',
    description: 'Learn about POVEDA\'s mission to provide unforgettable travel experiences in Nepal.',
  },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <CategoryHero
          title={aboutContent.hero.title}
          subtitle={aboutContent.hero.subtitle}
          heroImage={aboutContent.hero.image}
          ctaText="Explore Our Packages"
          ctaHref="/packages"
        />

        <OurStory
          title={aboutContent.story.title}
          content={aboutContent.story.content}
          images={aboutContent.story.images}
        />

        <MissionValues
          mission={aboutContent.mission}
          values={aboutContent.values}
        />

        <WhyNepal
          title={aboutContent.whyNepal.title}
          content={aboutContent.whyNepal.content}
          highlights={aboutContent.whyNepal.highlights}
          image={aboutContent.whyNepal.image}
        />

        <OurCommitment
          title={aboutContent.commitment.title}
          items={aboutContent.commitment.items}
        />

        <CategoryCTA
          title="Ready to Experience Nepal?"
          description="Join us on an unforgettable journey through the Himalayas"
          ctaText="View Our Packages"
          ctaHref="/packages"
        />
      </main>
      <Footer />
    </>
  );
}

