'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ContactInfo } from '@/types';

interface MapSectionProps {
  contactInfo: ContactInfo;
}

export default function MapSection({ contactInfo }: MapSectionProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Google Maps link - users can click to open in Google Maps
  const googleMapsLink = 'https://www.google.com/maps/place/Explore+Vision+Nepal+Pvt.+Ltd/@27.7222648,85.3009608,16z/data=!3m1!4b1!4m6!3m5!1s0x33f11bfbe11105:0x259e1769456e2225!8m2!3d27.7222649!4d85.3061214!16s%2Fg%2F11xrxpnx_y?entry=ttu';
  const addressQuery = encodeURIComponent(`${contactInfo.address.street}, ${contactInfo.address.city}, ${contactInfo.address.country}`);
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${addressQuery}`;

  return (
    <section ref={sectionRef} className="bg-gradient-to-br from-white via-[#dbe2dd] to-white py-16 md:py-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#485342]/5 rounded-full blur-3xl -z-0"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#dbe2dd]/50 rounded-full blur-3xl -z-0"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-800 mb-4">
            FIND US
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Visit our office in the heart of Kathmandu
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-100">
            <div className="relative h-64 md:h-96 lg:h-[500px] bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1527004013197-933c4bb611b3?q=80&w=2000')] bg-cover bg-center opacity-20"></div>
              <div className="relative z-10 text-center p-8 bg-white/90 backdrop-blur-sm rounded-2xl mx-4 shadow-lg">
                <div className="w-20 h-20 bg-gradient-to-br from-[#485342] to-[#3a4235] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl md:text-3xl font-serif text-[#2d2d2d] mb-4 font-bold">Our Location</h3>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  {contactInfo.address.street}<br />
                  {contactInfo.address.city}, {contactInfo.address.country}
                  {contactInfo.address.postalCode && ` ${contactInfo.address.postalCode}`}
                </p>
                <motion.a
                  href={googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#485342] to-[#3a4235] text-white rounded-xl font-semibold hover:from-[#3a4235] hover:to-[#485342] transition-all shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open in Google Maps
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

