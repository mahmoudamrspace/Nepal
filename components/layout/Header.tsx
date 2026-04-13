'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isVisitOpen, setIsVisitOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsVisitOpen(false);
      }
    };

    if (isVisitOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisitOpen]);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 text-white transition-all duration-500 ${
        scrolled 
          ? 'bg-[#485342]/98 backdrop-blur-lg shadow-xl border-b border-white/10' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        backgroundImage: scrolled 
          ? 'none' 
          : `url('https://images.unsplash.com/photo-1580424917967-a8867a6e676e?q=80&w=2070&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay for readability when using hero image */}
      {!scrolled && (
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Content wrapper with relative positioning */}
      <div className="relative z-10">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Link href="/" className="text-xl md:text-2xl lg:text-3xl font-serif font-bold tracking-tight relative z-10">
              POVEDA
            </Link>
            <motion.div
              className="absolute inset-0 bg-white/10 rounded-lg blur-sm"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <motion.div 
              whileHover={{ y: -2 }} 
              whileTap={{ y: 0 }}
              className="relative group"
            >
              <Link 
                href="/packages"
                className="text-sm lg:text-base font-sans font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 relative"
              >
                <span className="relative z-10">PACKAGES</span>
                <motion.span
                  className="absolute inset-0 bg-white/5 rounded-lg"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
            
            {/* Visit Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <motion.button
                onClick={() => setIsVisitOpen(!isVisitOpen)}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                className="text-sm lg:text-base font-sans font-medium px-3 py-2 rounded-lg hover:bg-white/10 hover:border-b-2 hover:border-nepal-red/40 transition-all duration-300 flex items-center gap-2 relative group"
              >
                <span className="relative z-10">VISIT</span>
                <motion.svg
                  className={`w-4 h-4 transition-transform relative z-10 ${isVisitOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: isVisitOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
                <motion.span
                  className="absolute inset-0 bg-white/5 rounded-lg"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
              
              <AnimatePresence>
                {isVisitOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 bg-[#485342]/98 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl min-w-[180px] overflow-hidden"
                  >
                    <motion.div
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                      className="border-b border-white/10 last:border-b-0"
                    >
                      <Link
                        href="/adventure"
                        onClick={() => setIsVisitOpen(false)}
                        className="block px-5 py-3 text-sm font-sans transition-all duration-200 hover:pl-6"
                      >
                        Adventure
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                      className="border-b border-white/10 last:border-b-0"
                    >
                      <Link
                        href="/culture"
                        onClick={() => setIsVisitOpen(false)}
                        className="block px-5 py-3 text-sm font-sans transition-all duration-200 hover:pl-6"
                      >
                        Culture
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                    >
                      <Link
                        href="/relaxation"
                        onClick={() => setIsVisitOpen(false)}
                        className="block px-5 py-3 text-sm font-sans transition-all duration-200 hover:pl-6"
                      >
                        Relaxation
                      </Link>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div 
              whileHover={{ y: -2 }} 
              whileTap={{ y: 0 }}
              className="relative group"
            >
              <Link 
                href="/about"
                className="text-sm lg:text-base font-sans font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 relative"
              >
                <span className="relative z-10">ABOUT US</span>
                <motion.span
                  className="absolute inset-0 bg-white/5 rounded-lg"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -2 }} 
              whileTap={{ y: 0 }}
              className="relative group"
            >
              <Link 
                href="/contact"
                className="text-sm lg:text-base font-sans font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 relative"
              >
                <span className="relative z-10">CONTACT</span>
                <motion.span
                  className="absolute inset-0 bg-white/5 rounded-lg"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
            whileTap={{ scale: 0.95 }}
          >
            <motion.svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </motion.svg>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden py-4 border-t border-white/20 overflow-hidden bg-[#485342]/50 backdrop-blur-sm"
            >
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Link
                  href="/packages"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-4 text-sm font-sans font-medium hover:bg-white/10 transition-all duration-200 rounded-lg mx-2"
                >
                  PACKAGES
                </Link>
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <Link
                  href="/adventure"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-4 text-sm font-sans font-medium hover:bg-white/10 transition-all duration-200 rounded-lg mx-2"
                >
                  VISIT - Adventure
                </Link>
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  href="/culture"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-4 text-sm font-sans font-medium hover:bg-white/10 transition-all duration-200 rounded-lg mx-2"
                >
                  VISIT - Culture
                </Link>
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <Link
                  href="/relaxation"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-4 text-sm font-sans font-medium hover:bg-white/10 transition-all duration-200 rounded-lg mx-2"
                >
                  VISIT - Relaxation
                </Link>
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-4 text-sm font-sans font-medium hover:bg-white/10 transition-all duration-200 rounded-lg mx-2"
                >
                  ABOUT US
                </Link>
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-4 text-sm font-sans font-medium hover:bg-white/10 transition-all duration-200 rounded-lg mx-2"
                >
                  CONTACT
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        </nav>
      </div>
    </motion.header>
  );
}
