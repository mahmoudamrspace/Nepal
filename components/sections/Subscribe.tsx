'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import toast from 'react-hot-toast';

export default function Subscribe() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Thank you for subscribing!');
        setEmail('');
        toast.success('Thank you for subscribing!');
      } else {
        const errorMsg = data.error || 'Something went wrong. Please try again.';
        setMessage(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      const errorMsg = 'Something went wrong. Please try again.';
      setMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <section ref={sectionRef} className="bg-[#485342] py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Text Column */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="flex items-center p-8 md:p-12 lg:p-16 xl:p-20"
          >
            <div>
              <motion.h2
                variants={itemVariants}
                className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-8 md:mb-10"
              >
                SUBSCRIBE
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-base md:text-lg lg:text-xl font-sans text-white leading-relaxed"
              >
                Subscribe to our newsletter to always be the first to hear about recent news, offers and adventures in Nepal.
              </motion.p>
            </div>
          </motion.div>

          {/* Form Column */}
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="flex items-center p-8 md:p-12 lg:p-16 xl:p-20"
          >
            <form onSubmit={handleSubmit} className="w-full">
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm md:text-base font-sans text-white mb-3 font-medium">
                  Email address
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email here"
                  required
                  className="w-full px-5 py-4 rounded-lg bg-white/95 backdrop-blur-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#485342] focus:bg-white transition-all duration-300 shadow-md hover:shadow-lg border border-white/20"
                />
              </div>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white rounded-full text-sm md:text-base font-sans text-white uppercase tracking-wide hover:bg-white hover:text-[#485342] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold button-shadow hover:button-shadow-hover"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    SUBMITTING...
                  </span>
                ) : (
                  'SUBMIT'
                )}
              </motion.button>
              <AnimatePresence>
                {message && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className={`mt-4 text-sm font-sans ${message.includes('Thank you') ? 'text-green-300' : 'text-red-300'}`}
                  >
                    {message}
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
