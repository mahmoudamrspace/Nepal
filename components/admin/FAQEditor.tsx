'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQ } from '@/types';
import { ValidationFieldWrapper, CharacterCounter, ArrayLimitIndicator } from './ValidationHelper';
import { LIMITS, ARRAY_LIMITS } from '@/lib/adminValidations';

interface FAQEditorProps {
  faq: FAQ[];
  onChange: (faq: FAQ[]) => void;
}

export default function FAQEditor({ faq, onChange }: FAQEditorProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const addFAQ = () => {
    if (faq.length >= ARRAY_LIMITS.FAQ_ITEMS) {
      return;
    }
    const newFAQ: FAQ = {
      question: '',
      answer: '',
    };
    onChange([...faq, newFAQ]);
    setOpenIndex(faq.length);
  };

  const canAddMore = faq.length < ARRAY_LIMITS.FAQ_ITEMS;

  const updateFAQ = (index: number, updates: Partial<FAQ>) => {
    // Enforce character limits
    if (updates.question !== undefined && updates.question.length > LIMITS.FAQ_QUESTION) {
      return;
    }
    if (updates.answer !== undefined && updates.answer.length > LIMITS.FAQ_ANSWER) {
      return;
    }
    const updated = faq.map((item, i) => (i === index ? { ...item, ...updates } : item));
    onChange(updated);
  };

  const deleteFAQ = (index: number) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    const updated = faq.filter((_, i) => i !== index);
    onChange(updated);
    if (openIndex === index) setOpenIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Frequently Asked Questions</h3>
          <ArrayLimitIndicator
            current={faq.length}
            max={ARRAY_LIMITS.FAQ_ITEMS}
            itemName="FAQ items"
            className="mt-1"
          />
        </div>
        <motion.button
          type="button"
          onClick={addFAQ}
          disabled={!canAddMore}
          whileHover={canAddMore ? { scale: 1.05 } : {}}
          whileTap={canAddMore ? { scale: 0.95 } : {}}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
            canAddMore
              ? 'bg-[#485342] text-white hover:bg-[#3a4235]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add FAQ
        </motion.button>
      </div>

      {faq.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
          <p>No FAQ items added yet. Click "Add FAQ" to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {faq.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg border-2 border-gray-200 overflow-hidden"
            >
              <div
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-100 transition-colors text-left cursor-pointer"
              >
                <h4 className="text-lg font-semibold text-gray-800 pr-4 flex-1">
                  {item.question || `FAQ ${index + 1}`}
                </h4>
                <div className="flex items-center gap-2">
                  <motion.button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFAQ(index);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </motion.button>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-5 border-t border-gray-200 bg-white space-y-4">
                      <ValidationFieldWrapper
                        label="Question"
                        required
                        characterCount={{ current: item.question.length, max: LIMITS.FAQ_QUESTION }}
                      >
                        <input
                          type="text"
                          value={item.question}
                          onChange={(e) => updateFAQ(index, { question: e.target.value })}
                          required
                          placeholder="Enter the question..."
                          maxLength={LIMITS.FAQ_QUESTION}
                          className={`w-full px-4 py-2 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342] ${
                            item.question.length >= LIMITS.FAQ_QUESTION
                              ? 'border-red-500'
                              : item.question.length > LIMITS.FAQ_QUESTION * 0.8
                              ? 'border-yellow-500'
                              : 'border-gray-300'
                          }`}
                        />
                      </ValidationFieldWrapper>
                      <ValidationFieldWrapper
                        label="Answer"
                        required
                        characterCount={{ current: item.answer.length, max: LIMITS.FAQ_ANSWER }}
                      >
                        <textarea
                          value={item.answer}
                          onChange={(e) => updateFAQ(index, { answer: e.target.value })}
                          required
                          rows={4}
                          placeholder="Enter the answer..."
                          maxLength={LIMITS.FAQ_ANSWER}
                          className={`w-full px-4 py-2 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342] resize-none ${
                            item.answer.length >= LIMITS.FAQ_ANSWER
                              ? 'border-red-500'
                              : item.answer.length > LIMITS.FAQ_ANSWER * 0.8
                              ? 'border-yellow-500'
                              : 'border-gray-300'
                          }`}
                        />
                      </ValidationFieldWrapper>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

