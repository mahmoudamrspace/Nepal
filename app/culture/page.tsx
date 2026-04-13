'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CategoryHero from '@/components/categories/CategoryHero';
import CategoryOverview from '@/components/categories/CategoryOverview';
import ActivitiesList from '@/components/categories/ActivitiesList';
import CategoryGallery from '@/components/categories/CategoryGallery';
import WhyChooseSection from '@/components/categories/WhyChooseSection';
import CategoryCTA from '@/components/categories/CategoryCTA';
import { cultureContent } from '@/data/categoryContent';
import PackageCard from '@/components/packages/PackageCard';
import PackageCardSkeleton from '@/components/ui/PackageCardSkeleton';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Package } from '@/types';

export default function CulturePage() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [culturePackages, setCulturePackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPackages() {
      try {
        const res = await fetch('/api/packages?category=Culture');
        if (res.ok) {
          const data = await res.json();
          setCulturePackages(data.slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to fetch culture packages:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPackages();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <CategoryHero
          title={cultureContent.title}
          subtitle={cultureContent.subtitle}
          heroImage={cultureContent.heroImage}
          ctaText="Explore Culture Packages"
          ctaHref="/packages?category=Culture"
        />

        <CategoryOverview
          overview={cultureContent.overview}
          highlights={cultureContent.highlights}
        />

        {/* Featured Packages */}
        <section ref={sectionRef} className="bg-[#dbe2dd] py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-800 text-center mb-12 md:mb-16"
            >
              FEATURED CULTURE PACKAGES
            </motion.h2>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
                {[1, 2, 3].map((i) => <PackageCardSkeleton key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
                {culturePackages.map((pkg, index) => (
                  <PackageCard key={pkg.id} package={pkg} index={index} />
                ))}
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/packages?category=Culture"
                  className="inline-block px-8 py-4 border-2 border-[#485342] rounded-full text-sm md:text-base font-sans text-[#485342] uppercase tracking-wide hover:bg-[#485342] hover:text-white transition-all duration-300 font-semibold button-shadow hover:button-shadow-hover"
                >
                  View All Culture Packages
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <ActivitiesList activities={cultureContent.activities} />

        <CategoryGallery images={cultureContent.galleryImages} />

        <WhyChooseSection items={cultureContent.whyChoose} />

        <CategoryCTA
          title={cultureContent.ctaTitle}
          description={cultureContent.ctaDescription}
          ctaText="Explore Culture Packages"
          ctaHref="/packages?category=Culture"
        />
      </main>
      <Footer />
    </>
  );
}

