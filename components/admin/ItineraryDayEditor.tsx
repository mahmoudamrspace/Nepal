'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ItineraryDay } from '@/types';
import { ValidationFieldWrapper, CharacterCounter, ArrayLimitIndicator } from './ValidationHelper';
import { LIMITS, ARRAY_LIMITS } from '@/lib/adminValidations';

interface ItineraryDayEditorProps {
  itinerary: ItineraryDay[];
  onChange: (itinerary: ItineraryDay[]) => void;
}

export default function ItineraryDayEditor({ itinerary, onChange }: ItineraryDayEditorProps) {
  const [openDay, setOpenDay] = useState<number | null>(null);
  const [editingDay, setEditingDay] = useState<number | null>(null);

  const addDay = () => {
    if (itinerary.length >= ARRAY_LIMITS.ITINERARY_DAYS) {
      return;
    }
    const newDay: ItineraryDay = {
      day: itinerary.length + 1,
      title: '',
      description: '',
      activities: [''],
      meals: [''],
      accommodation: '',
    };
    onChange([...itinerary, newDay]);
    setEditingDay(newDay.day);
    setOpenDay(newDay.day);
  };

  const canAddMore = itinerary.length < ARRAY_LIMITS.ITINERARY_DAYS;

  const updateDay = (dayNumber: number, updates: Partial<ItineraryDay>) => {
    // Enforce character limits
    if (updates.title !== undefined && updates.title.length > LIMITS.ITINERARY_DAY_TITLE) {
      return;
    }
    if (updates.description !== undefined && updates.description.length > LIMITS.ITINERARY_DAY_DESCRIPTION) {
      return;
    }
    const updated = itinerary.map((day) =>
      day.day === dayNumber ? { ...day, ...updates } : day
    );
    onChange(updated);
  };

  const deleteDay = (dayNumber: number) => {
    if (!confirm('Are you sure you want to delete this day?')) return;
    const updated = itinerary
      .filter((day) => day.day !== dayNumber)
      .map((day, index) => ({ ...day, day: index + 1 }));
    onChange(updated);
    if (openDay === dayNumber) setOpenDay(null);
  };

  const addActivity = (dayNumber: number) => {
    const day = itinerary.find((d) => d.day === dayNumber);
    if (day && day.activities.length < ARRAY_LIMITS.ACTIVITIES_PER_DAY) {
      updateDay(dayNumber, { activities: [...day.activities, ''] });
    }
  };

  const updateActivity = (dayNumber: number, index: number, value: string) => {
    if (value.length > LIMITS.ACTIVITY_MEAL) {
      return; // Prevent typing beyond limit
    }
    const day = itinerary.find((d) => d.day === dayNumber);
    if (day) {
      const updated = [...day.activities];
      updated[index] = value;
      updateDay(dayNumber, { activities: updated });
    }
  };

  const removeActivity = (dayNumber: number, index: number) => {
    const day = itinerary.find((d) => d.day === dayNumber);
    if (day && day.activities.length > 1) {
      const updated = day.activities.filter((_, i) => i !== index);
      updateDay(dayNumber, { activities: updated });
    }
  };

  const addMeal = (dayNumber: number) => {
    const day = itinerary.find((d) => d.day === dayNumber);
    if (day && day.meals.length < ARRAY_LIMITS.MEALS_PER_DAY) {
      updateDay(dayNumber, { meals: [...day.meals, ''] });
    }
  };

  const updateMeal = (dayNumber: number, index: number, value: string) => {
    if (value.length > LIMITS.ACTIVITY_MEAL) {
      return; // Prevent typing beyond limit
    }
    const day = itinerary.find((d) => d.day === dayNumber);
    if (day) {
      const updated = [...day.meals];
      updated[index] = value;
      updateDay(dayNumber, { meals: updated });
    }
  };

  const removeMeal = (dayNumber: number, index: number) => {
    const day = itinerary.find((d) => d.day === dayNumber);
    if (day && day.meals.length > 1) {
      const updated = day.meals.filter((_, i) => i !== index);
      updateDay(dayNumber, { meals: updated });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Itinerary Days</h3>
          <ArrayLimitIndicator
            current={itinerary.length}
            max={ARRAY_LIMITS.ITINERARY_DAYS}
            itemName="days"
            className="mt-1"
          />
        </div>
        <motion.button
          type="button"
          onClick={addDay}
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
          Add Day
        </motion.button>
      </div>

      {itinerary.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
          <p>No itinerary days added yet. Click "Add Day" to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {itinerary.map((day) => (
            <div
              key={day.day}
              className="bg-gray-50 rounded-lg border-2 border-gray-200 overflow-hidden"
            >
              <div
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => setOpenDay(openDay === day.day ? null : day.day)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-[#485342] text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {day.day}
                  </div>
                  <div className="text-left flex-1">
                    <h4 className="text-lg font-semibold text-gray-800 mb-1">
                      {day.title || `Day ${day.day}`}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {day.description || 'No description'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDay(day.day);
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
                      openDay === day.day ? 'rotate-180' : ''
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
                {openDay === day.day && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-5 border-t border-gray-200 bg-white space-y-6">
                      {/* Day Title */}
                      <ValidationFieldWrapper
                        label="Day Title"
                        required
                        characterCount={{ current: day.title.length, max: LIMITS.ITINERARY_DAY_TITLE }}
                      >
                        <input
                          type="text"
                          value={day.title}
                          onChange={(e) => updateDay(day.day, { title: e.target.value })}
                          required
                          placeholder="e.g., Arrival in Kathmandu"
                          maxLength={LIMITS.ITINERARY_DAY_TITLE}
                          className={`w-full px-4 py-2 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342] ${
                            day.title.length >= LIMITS.ITINERARY_DAY_TITLE
                              ? 'border-red-500'
                              : day.title.length > LIMITS.ITINERARY_DAY_TITLE * 0.8
                              ? 'border-yellow-500'
                              : 'border-gray-300'
                          }`}
                        />
                      </ValidationFieldWrapper>

                      {/* Description */}
                      <ValidationFieldWrapper
                        label="Description"
                        required
                        characterCount={{ current: day.description.length, max: LIMITS.ITINERARY_DAY_DESCRIPTION }}
                      >
                        <textarea
                          value={day.description}
                          onChange={(e) => updateDay(day.day, { description: e.target.value })}
                          required
                          rows={3}
                          placeholder="Describe what happens on this day..."
                          maxLength={LIMITS.ITINERARY_DAY_DESCRIPTION}
                          className={`w-full px-4 py-2 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342] resize-none ${
                            day.description.length >= LIMITS.ITINERARY_DAY_DESCRIPTION
                              ? 'border-red-500'
                              : day.description.length > LIMITS.ITINERARY_DAY_DESCRIPTION * 0.8
                              ? 'border-yellow-500'
                              : 'border-gray-300'
                          }`}
                        />
                      </ValidationFieldWrapper>

                      {/* Activities */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700">
                              Activities
                            </label>
                            <ArrayLimitIndicator
                              current={day.activities.length}
                              max={ARRAY_LIMITS.ACTIVITIES_PER_DAY}
                              itemName="activities"
                              className="mt-1"
                            />
                          </div>
                          <motion.button
                            type="button"
                            onClick={() => addActivity(day.day)}
                            disabled={day.activities.length >= ARRAY_LIMITS.ACTIVITIES_PER_DAY}
                            whileHover={day.activities.length < ARRAY_LIMITS.ACTIVITIES_PER_DAY ? { scale: 1.05 } : {}}
                            whileTap={day.activities.length < ARRAY_LIMITS.ACTIVITIES_PER_DAY ? { scale: 0.95 } : {}}
                            className={`text-xs px-2 py-1 rounded transition-colors ${
                              day.activities.length < ARRAY_LIMITS.ACTIVITIES_PER_DAY
                                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            + Add Activity
                          </motion.button>
                        </div>
                        <div className="space-y-2">
                          {day.activities.map((activity, index) => (
                            <div key={index} className="space-y-1">
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={activity}
                                  onChange={(e) => updateActivity(day.day, index, e.target.value)}
                                  placeholder="Activity description"
                                  maxLength={LIMITS.ACTIVITY_MEAL}
                                  className={`flex-1 px-3 py-2 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342] text-sm ${
                                    activity.length >= LIMITS.ACTIVITY_MEAL
                                      ? 'border-red-500'
                                      : activity.length > LIMITS.ACTIVITY_MEAL * 0.8
                                      ? 'border-yellow-500'
                                      : 'border-gray-300'
                                  }`}
                                />
                                {day.activities.length > 1 && (
                                  <motion.button
                                    type="button"
                                    onClick={() => removeActivity(day.day, index)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </motion.button>
                                )}
                              </div>
                              <CharacterCounter current={activity.length} max={LIMITS.ACTIVITY_MEAL} />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Meals */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700">
                              Meals
                            </label>
                            <ArrayLimitIndicator
                              current={day.meals.length}
                              max={ARRAY_LIMITS.MEALS_PER_DAY}
                              itemName="meals"
                              className="mt-1"
                            />
                          </div>
                          <motion.button
                            type="button"
                            onClick={() => addMeal(day.day)}
                            disabled={day.meals.length >= ARRAY_LIMITS.MEALS_PER_DAY}
                            whileHover={day.meals.length < ARRAY_LIMITS.MEALS_PER_DAY ? { scale: 1.05 } : {}}
                            whileTap={day.meals.length < ARRAY_LIMITS.MEALS_PER_DAY ? { scale: 0.95 } : {}}
                            className={`text-xs px-2 py-1 rounded transition-colors ${
                              day.meals.length < ARRAY_LIMITS.MEALS_PER_DAY
                                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            + Add Meal
                          </motion.button>
                        </div>
                        <div className="space-y-2">
                          {day.meals.map((meal, index) => (
                            <div key={index} className="space-y-1">
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={meal}
                                  onChange={(e) => updateMeal(day.day, index, e.target.value)}
                                  placeholder="e.g., Breakfast, Lunch, Dinner"
                                  maxLength={LIMITS.ACTIVITY_MEAL}
                                  className={`flex-1 px-3 py-2 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342] text-sm ${
                                    meal.length >= LIMITS.ACTIVITY_MEAL
                                      ? 'border-red-500'
                                      : meal.length > LIMITS.ACTIVITY_MEAL * 0.8
                                      ? 'border-yellow-500'
                                      : 'border-gray-300'
                                  }`}
                                />
                                {day.meals.length > 1 && (
                                  <motion.button
                                    type="button"
                                    onClick={() => removeMeal(day.day, index)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </motion.button>
                                )}
                              </div>
                              <CharacterCounter current={meal.length} max={LIMITS.ACTIVITY_MEAL} />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Accommodation */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Accommodation <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={day.accommodation}
                          onChange={(e) => updateDay(day.day, { accommodation: e.target.value })}
                          required
                          placeholder="e.g., Hotel in Kathmandu"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342]"
                        />
                      </div>
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

