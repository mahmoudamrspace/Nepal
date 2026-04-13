'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ContactInfo } from '@/types';
import Link from 'next/link';
import Icon from '@/components/ui/Icon';

interface ContactInfoProps {
  contactInfo: ContactInfo;
}

export default function ContactInfoCards({ contactInfo }: ContactInfoProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} className="bg-gradient-to-br from-[#dbe2dd] via-white to-[#dbe2dd] py-16 md:py-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#485342]/5 rounded-full blur-3xl -z-0"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#dbe2dd]/50 rounded-full blur-3xl -z-0"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-800 mb-4">
            GET IN TOUCH
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Multiple ways to reach us - choose what works best for you
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {/* Address */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            whileHover={{ scale: 1.05, y: -10 }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden border-2 border-gray-100 hover:border-[#485342]/30 group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--nepal-red)] via-[var(--nepal-blue)] to-white"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#485342]/10 via-nepal-blue/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#485342] via-nepal-red/20 to-[#3a4235] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-serif text-[#2d2d2d] mb-4 font-bold text-center group-hover:text-[#485342] transition-colors">Address</h3>
              <div className="text-gray-600 space-y-1 text-center">
                <p>{contactInfo.address.street}</p>
                <p>{contactInfo.address.city}</p>
                <p>{contactInfo.address.country}</p>
                {contactInfo.address.postalCode && (
                  <p>{contactInfo.address.postalCode}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Phone */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            whileHover={{ scale: 1.05, y: -10 }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden border-2 border-gray-100 hover:border-[#485342]/30 group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--nepal-red)] via-[var(--nepal-blue)] to-white"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#485342]/10 via-nepal-blue/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#485342] via-nepal-red/20 to-[#3a4235] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-serif text-[#2d2d2d] mb-4 font-bold text-center group-hover:text-[#485342] transition-colors">Phone</h3>
              <div className="text-gray-600 space-y-2 text-center">
                <p>
                  <a href={`tel:${contactInfo.phone.primary}`} className="hover:text-[#485342] transition-colors font-medium">
                    {contactInfo.phone.primary}
                  </a>
                </p>
                {contactInfo.phone.secondary && (
                  <p>
                    <a href={`tel:${contactInfo.phone.secondary}`} className="hover:text-[#485342] transition-colors font-medium">
                      {contactInfo.phone.secondary}
                    </a>
                  </p>
                )}
                {contactInfo.phone.emergency && (
                  <p className="text-sm">
                    Emergency: <a href={`tel:${contactInfo.phone.emergency}`} className="hover:text-[#485342] transition-colors font-semibold">
                      {contactInfo.phone.emergency}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            whileHover={{ scale: 1.05, y: -10 }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden border-2 border-gray-100 hover:border-[#485342]/30 group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--nepal-red)] via-[var(--nepal-blue)] to-white"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#485342]/10 via-nepal-blue/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#485342] via-nepal-red/20 to-[#3a4235] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-serif text-[#2d2d2d] mb-4 font-bold text-center group-hover:text-[#485342] transition-colors">Email</h3>
              <div className="text-gray-600 space-y-2 text-center">
                <p>
                  <a href={`mailto:${contactInfo.email.general}`} className="hover:text-[#485342] transition-colors font-medium break-all">
                    {contactInfo.email.general}
                  </a>
                </p>
                {contactInfo.email.bookings && (
                  <p>
                    <a href={`mailto:${contactInfo.email.bookings}`} className="hover:text-[#485342] transition-colors font-medium break-all">
                      {contactInfo.email.bookings}
                    </a>
                  </p>
                )}
                {contactInfo.email.support && (
                  <p>
                    <a href={`mailto:${contactInfo.email.support}`} className="hover:text-[#485342] transition-colors font-medium break-all">
                      {contactInfo.email.support}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Business Hours */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            whileHover={{ scale: 1.05, y: -10 }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden border-2 border-gray-100 hover:border-[#485342]/30 group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--nepal-red)] via-[var(--nepal-blue)] to-white"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#485342]/10 via-nepal-blue/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#485342] via-nepal-red/20 to-[#3a4235] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-serif text-[#2d2d2d] mb-4 font-bold text-center group-hover:text-[#485342] transition-colors">Business Hours</h3>
              <div className="text-gray-600 space-y-1 text-center">
                <p>{contactInfo.hours.days}</p>
                <p>{contactInfo.hours.time}</p>
                <p className="text-sm">{contactInfo.hours.timezone}</p>
              </div>
            </div>
          </motion.div>

          {/* Response Time */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            whileHover={{ scale: 1.05, y: -10 }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden border-2 border-gray-100 hover:border-[#485342]/30 group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--nepal-red)] via-[var(--nepal-blue)] to-white"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#485342]/10 via-nepal-blue/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#485342] via-nepal-red/20 to-[#3a4235] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-serif text-[#2d2d2d] mb-4 font-bold text-center group-hover:text-[#485342] transition-colors">Response Time</h3>
              <div className="text-gray-600 text-center">
                <p>We typically respond within 24 hours</p>
                <p className="text-sm mt-2">For urgent inquiries, please call us directly</p>
              </div>
            </div>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            whileHover={{ scale: 1.05, y: -10 }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden border-2 border-gray-100 hover:border-[#485342]/30 group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--nepal-red)] via-[var(--nepal-blue)] to-white"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#485342]/10 via-nepal-blue/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#485342] via-nepal-red/20 to-[#3a4235] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-serif text-[#2d2d2d] mb-4 font-bold text-center group-hover:text-[#485342] transition-colors">Follow Us</h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {contactInfo.social.map((social, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-gradient-to-r from-[#485342] to-[#3a4235] text-white rounded-xl text-sm font-semibold hover:from-[#3a4235] hover:to-[#485342] transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                      <Icon name={social.icon} className="text-white" size={20} />
                      <span>{social.platform}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

