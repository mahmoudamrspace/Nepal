'use client';

import { motion } from 'framer-motion';

interface CheckoutProgressProps {
  currentStep: number;
  totalSteps?: number;
}

const steps = [
  { number: 1, label: 'Package', key: 'package' },
  { number: 2, label: 'Traveler', key: 'traveler' },
  { number: 3, label: 'Payment', key: 'payment' },
  { number: 4, label: 'Review', key: 'review' },
];

export default function CheckoutProgress({ currentStep, totalSteps = 4 }: CheckoutProgressProps) {
  return (
    <div className="w-full py-6 md:py-8">
      <div className="flex items-center justify-between max-w-3xl mx-auto px-4">
        {steps.map((step, index) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                {/* Step Circle */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                  }}
                  className={`relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-semibold text-sm md:text-base transition-all duration-300 ${
                    isCompleted
                      ? 'bg-[#485342] text-white'
                      : isActive
                      ? 'bg-[#485342] text-white ring-4 ring-[#485342]/20'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </motion.div>
                
                {/* Step Label */}
                <motion.span
                  initial={false}
                  animate={{
                    color: isActive || isCompleted ? '#485342' : '#9CA3AF',
                  }}
                  className="mt-2 text-xs md:text-sm font-medium hidden sm:block"
                >
                  {step.label}
                </motion.span>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div className={`flex-1 h-0.5 mx-2 md:mx-4 transition-colors duration-300 ${
                  isCompleted ? 'bg-[#485342]' : 'bg-gray-200'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

