'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package } from '@/types';
import { getBlurDataURL, getImageSizes } from '@/lib/imageUtils';

interface PackageCardProps {
  package: Package;
  index?: number;
}

export default function PackageCard({ package: pkg, index = 0 }: PackageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-lg overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300"
    >
      <Link href={`/packages/${pkg.slug}`} aria-label={`View details for ${pkg.name}`}>
        <div className="relative h-64 md:h-80 overflow-hidden group">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="relative h-full w-full"
          >
            <Image
              src={pkg.featuredImage}
              alt={pkg.name}
              fill
              className="object-cover"
              sizes={getImageSizes({ mobile: '100vw', tablet: '50vw', desktop: '33vw' })}
              placeholder="blur"
              blurDataURL={getBlurDataURL()}
              loading={index < 6 ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
              pkg.category === 'Adventure' ? 'bg-[var(--nepal-red)] text-white' :
              pkg.category === 'Culture' ? 'bg-blue-500 text-white' :
              pkg.category === 'Wellness' ? 'bg-green-500 text-white' :
              'bg-purple-500 text-white'
            }`}>
              {pkg.category}
            </span>
          </div>
          <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-sm font-medium">{pkg.difficulty}</p>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-serif text-[#2d2d2d] mb-2">{pkg.name}</h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{pkg.shortDescription}</p>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">{pkg.duration}</p>
              <p className="text-sm text-gray-500">{pkg.location}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#485342]">
                {pkg.currency} {pkg.price.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">per person</p>
            </div>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="inline-block w-full text-center px-6 py-3 border-2 border-[#485342] rounded-full text-sm font-sans text-[#485342] uppercase tracking-wide hover:bg-[#485342] hover:text-white transition-all duration-300 font-semibold">
              View Details
            </span>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}

