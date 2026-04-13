'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getBlurDataURL } from '@/lib/imageUtils';

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          scale: 1.1,
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        transition={{
          type: 'spring',
          stiffness: 50,
          damping: 20,
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1580424917967-a8867a6e676e?q=80&w=2070&auto=format&fit=crop"
          alt="Nepal mountains landscape"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={getBlurDataURL()}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/40 to-black/60"></div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}></div>
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Decorative line above text */}
        <motion.div
          className="w-20 h-0.5 bg-white/60 mx-auto mb-6 md:mb-8"
          variants={itemVariants}
        />
        
        <motion.p
          className="text-sm md:text-base lg:text-lg font-sans mb-4 md:mb-6 tracking-[0.2em] uppercase font-light text-white/90"
          variants={itemVariants}
        >
          IT&apos;S TIME TO
        </motion.p>
        
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-serif font-bold mb-6 md:mb-8 lg:mb-10 tracking-tight leading-[0.95]"
          variants={itemVariants}
          style={{
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 2px 10px rgba(0, 0, 0, 0.2)',
            letterSpacing: '-0.02em',
          }}
        >
          VISIT NEPAL
        </motion.h1>
        
        <motion.p
          className="max-w-2xl mx-auto text-base md:text-lg lg:text-xl xl:text-2xl font-sans mb-10 md:mb-12 lg:mb-14 leading-relaxed font-light text-white/95 px-4"
          variants={itemVariants}
          style={{
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
          }}
        >
          Crave new adventures, mystical experiences and breathtaking mountain views? You need to visit Nepal. 
          We make sure that you&apos;ll get an experience you&apos;ll never forget.
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/packages"
              className="group inline-block px-8 md:px-12 lg:px-14 py-3 md:py-4 lg:py-5 bg-white text-[#485342] rounded-full text-sm md:text-base lg:text-lg font-sans uppercase tracking-wider hover:bg-[#485342] hover:text-white transition-all duration-300 font-bold button-shadow hover:button-shadow-hover focus:outline-none focus:ring-4 focus:ring-white/50"
              aria-label="View our travel packages"
            >
              OUR PACKAGES
            </Link>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="#licence-to-live"
              onClick={(e) => {
                e.preventDefault();
                const element = document.querySelector('#licence-to-live');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="inline-block px-8 md:px-12 lg:px-14 py-3 md:py-4 lg:py-5 border-2 border-white rounded-full text-sm md:text-base lg:text-lg font-sans uppercase tracking-wider hover:bg-white/10 backdrop-blur-sm transition-all duration-300 font-semibold focus:outline-none focus:ring-4 focus:ring-white/50"
              aria-label="Scroll to explore more content"
            >
              EXPLORE MORE
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
