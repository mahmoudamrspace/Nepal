'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import PackageCard from './PackageCard';
import { Package } from '@/types';

interface RelatedPackagesProps {
  packages: Package[];
  currentPackageId: string;
}

export default function RelatedPackages({ packages, currentPackageId }: RelatedPackagesProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const related = packages
    .filter((pkg) => pkg.id !== currentPackageId)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section ref={sectionRef} className="bg-[#dbe2dd] py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-800 text-center mb-12 md:mb-16"
        >
          RELATED PACKAGES
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {related.map((pkg, index) => (
            <PackageCard key={pkg.id} package={pkg} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

