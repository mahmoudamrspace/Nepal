'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Activity } from '@/types';
import Icon from '@/components/ui/Icon';

interface ActivitiesListProps {
  activities: Activity[];
}

export default function ActivitiesList({ activities }: ActivitiesListProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} className="bg-[#dbe2dd] py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-800 text-center mb-12 md:mb-16"
        >
          ACTIVITIES & EXPERIENCES
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-lg p-6 md:p-8 card-shadow hover:card-shadow-hover transition-all duration-300"
            >
              {activity.icon && (
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#485342] to-[#3a4235] rounded-2xl flex items-center justify-center shadow-lg">
                    <Icon name={activity.icon} className="text-white" size={32} />
                  </div>
                </div>
              )}
              <h3 className="text-xl md:text-2xl font-serif text-[#2d2d2d] mb-3">
                {activity.name}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {activity.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

