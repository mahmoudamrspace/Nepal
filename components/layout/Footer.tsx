'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { contactInfo } from '@/data/contactInfo';

export default function Footer() {
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, margin: '-50px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer ref={footerRef} className="bg-[#485342] text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16 mb-12"
        >
          {/* Company Info */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4 hover:opacity-80 transition-opacity">
                POVEDA
              </h3>
            </Link>
            <p className="text-sm md:text-base text-white/80 leading-relaxed mb-6 font-sans">
              Experience the magic of Nepal with unforgettable adventures, cultural immersion, and breathtaking mountain views.
            </p>
            <div className="flex gap-4">
              {contactInfo.social.map((social, index) => {
                const getIcon = (platform: string) => {
                  switch (platform.toLowerCase()) {
                    case 'facebook':
                      return (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                        </svg>
                      );
                    case 'instagram':
                      return (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                        </svg>
                      );
                    case 'twitter':
                      return (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      );
                    case 'linkedin':
                      return (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                        </svg>
                      );
                    case 'tripadvisor':
                      return (
                        <Image
                          src="/Tripadvisor Icons.png"
                          alt="TripAdvisor"
                          width={20}
                          height={20}
                          className="w-5 h-5 object-contain brightness-0 invert"
                        />
                      );
                    default:
                      return null;
                  }
                };

                return (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
                    aria-label={social.platform}
                  >
                    {getIcon(social.platform)}
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg md:text-xl font-serif font-semibold mb-6 text-white">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-3">
              <motion.div variants={itemVariants}>
                <Link
                  href="/about"
                  className="text-sm md:text-base font-sans text-white/80 hover:text-white transition-all duration-300 inline-block hover:translate-x-1"
                >
                  About Us
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link
                  href="/packages"
                  className="text-sm md:text-base font-sans text-white/80 hover:text-white transition-all duration-300 inline-block hover:translate-x-1"
                >
                  Packages
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link
                  href="/blog"
                  className="text-sm md:text-base font-sans text-white/80 hover:text-white transition-all duration-300 inline-block hover:translate-x-1"
                >
                  Blog
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link
                  href="/contact"
                  className="text-sm md:text-base font-sans text-white/80 hover:text-white transition-all duration-300 inline-block hover:translate-x-1"
                >
                  Contact
                </Link>
              </motion.div>
            </nav>
          </motion.div>

          {/* Categories */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg md:text-xl font-serif font-semibold mb-6 text-white">
              Explore
            </h4>
            <nav className="flex flex-col gap-3">
              <motion.div variants={itemVariants}>
                <Link
                  href="/adventure"
                  className="text-sm md:text-base font-sans text-white/80 hover:text-white transition-all duration-300 inline-block hover:translate-x-1"
                >
                  Adventure
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link
                  href="/culture"
                  className="text-sm md:text-base font-sans text-white/80 hover:text-white transition-all duration-300 inline-block hover:translate-x-1"
                >
                  Culture
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link
                  href="/relaxation"
                  className="text-sm md:text-base font-sans text-white/80 hover:text-white transition-all duration-300 inline-block hover:translate-x-1"
                >
                  Relaxation
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link
                  href="/packages"
                  className="text-sm md:text-base font-sans text-white/80 hover:text-white transition-all duration-300 inline-block hover:translate-x-1"
                >
                  All Packages
                </Link>
              </motion.div>
            </nav>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg md:text-xl font-serif font-semibold mb-6 text-white">
              Get in Touch
            </h4>
            <div className="flex flex-col gap-4 text-sm md:text-base font-sans text-white/80">
              <motion.div variants={itemVariants} className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a
                  href={`mailto:${contactInfo.email.general}`}
                  className="hover:text-white transition-colors break-all"
                >
                  {contactInfo.email.general}
                </a>
              </motion.div>
              <motion.div variants={itemVariants} className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a
                  href={`tel:${contactInfo.phone.primary}`}
                  className="hover:text-white transition-colors"
                >
                  {contactInfo.phone.primary}
                </a>
              </motion.div>
              <motion.div variants={itemVariants} className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="text-white/80">
                  <p>{contactInfo.address.street}</p>
                  <p>{contactInfo.address.city}</p>
                  <p>{contactInfo.address.country}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          className="border-t border-white/20 pt-8 mt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/60 font-sans">
              © {currentYear} POVEDA. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm font-sans">
              <Link
                href="/privacy"
                className="text-white/60 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-white/60 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
