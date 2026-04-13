"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Traveler } from "@/types";
import { travelerSchema } from "@/lib/validations";
import { z } from "zod";

interface TravelerInfoFormProps {
  numberOfTravelers: number;
  travelers: Traveler[];
  onTravelersChange: (travelers: Traveler[]) => void;
  onValidationChange: (isValid: boolean) => void;
}

export default function TravelerInfoForm({
  numberOfTravelers,
  travelers,
  onTravelersChange,
  onValidationChange,
}: TravelerInfoFormProps) {
  const [errors, setErrors] = useState<Record<number, Record<string, string>>>(
    {}
  );

  // Ensure we have the right number of travelers
  const updatedTravelers = Array.from(
    { length: numberOfTravelers },
    (_, i) =>
      travelers[i] || {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        nationality: "",
        isPrimary: i === 0,
      }
  );

  // Validate all travelers whenever travelers array changes
  useEffect(() => {
    // Ensure we have the right number of travelers
    const currentTravelers = Array.from(
      { length: numberOfTravelers },
      (_, i) =>
        travelers[i] || {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          dateOfBirth: "",
          nationality: "",
          isPrimary: i === 0,
        }
    );

    // Validate each traveler
    const newErrors: Record<number, Record<string, string>> = {};
    let allValid = true;

    currentTravelers.forEach((traveler, index) => {
      try {
        travelerSchema.parse(traveler);
      } catch (error) {
        allValid = false;
        if (error instanceof z.ZodError) {
          const zodError = error as z.ZodError;
          if (zodError.issues && Array.isArray(zodError.issues)) {
            const fieldErrors: Record<string, string> = {};
            zodError.issues.forEach((err: z.ZodIssue) => {
              if (err.path && err.path.length > 0 && err.path[0]) {
                fieldErrors[err.path[0] as string] = err.message;
              }
            });
            if (Object.keys(fieldErrors).length > 0) {
              newErrors[index] = fieldErrors;
            }
          }
        }
      }
    });

    setErrors(newErrors);
    const isValid = allValid && currentTravelers.length === numberOfTravelers;

    onValidationChange(isValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [travelers, numberOfTravelers]);

  const updateTraveler = (
    index: number,
    field: keyof Traveler,
    value: string | boolean
  ) => {
    const updated = [...updatedTravelers];
    if (!updated[index]) {
      updated[index] = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        nationality: "",
        isPrimary: index === 0,
      };
    }
    updated[index] = { ...updated[index], [field]: value };

    // Ensure only one primary traveler
    if (field === "isPrimary" && value === true) {
      updated.forEach((t, i) => {
        if (i !== index) t.isPrimary = false;
      });
    }

    onTravelersChange(updated);
  };

  return (
    <div className='space-y-8'>
      <div>
        <h2 className='text-2xl md:text-3xl font-serif font-bold text-gray-800 mb-2'>
          Traveler Information
        </h2>
        <p className='text-gray-600'>
          Please provide details for all travelers. The first traveler will be
          the primary contact.
        </p>
      </div>

      <AnimatePresence>
        {updatedTravelers.map((traveler, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
            className='bg-white rounded-xl p-6 md:p-8 card-shadow'
          >
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-xl font-serif font-semibold text-gray-800'>
                Traveler {index + 1}{" "}
                {traveler.isPrimary && (
                  <span className='text-sm text-[#485342]'>(Primary)</span>
                )}
              </h3>
              {index === 0 && (
                <span className='text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full'>
                  Primary Contact
                </span>
              )}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  First Name <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={traveler.firstName}
                  onChange={(e) =>
                    updateTraveler(index, "firstName", e.target.value)
                  }
                  className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#485342] transition-all ${
                    errors[index]?.firstName
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  required
                />
                {errors[index]?.firstName && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors[index].firstName}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Last Name <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={traveler.lastName}
                  onChange={(e) =>
                    updateTraveler(index, "lastName", e.target.value)
                  }
                  className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#485342] transition-all ${
                    errors[index]?.lastName
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  required
                />
                {errors[index]?.lastName && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors[index].lastName}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Email <span className='text-red-500'>*</span>
                </label>
                <input
                  type='email'
                  value={traveler.email}
                  onChange={(e) =>
                    updateTraveler(index, "email", e.target.value)
                  }
                  className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#485342] transition-all ${
                    errors[index]?.email ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors[index]?.email && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors[index].email}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Phone <span className='text-red-500'>*</span>
                </label>
                <input
                  type='tel'
                  value={traveler.phone}
                  onChange={(e) =>
                    updateTraveler(index, "phone", e.target.value)
                  }
                  className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#485342] transition-all ${
                    errors[index]?.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors[index]?.phone && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors[index].phone}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Date of Birth <span className='text-red-500'>*</span>
                </label>
                <input
                  type='date'
                  value={traveler.dateOfBirth}
                  onChange={(e) =>
                    updateTraveler(index, "dateOfBirth", e.target.value)
                  }
                  className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#485342] transition-all ${
                    errors[index]?.dateOfBirth
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  required
                />
                {errors[index]?.dateOfBirth && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors[index].dateOfBirth}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Nationality <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={traveler.nationality}
                  onChange={(e) =>
                    updateTraveler(index, "nationality", e.target.value)
                  }
                  className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#485342] transition-all ${
                    errors[index]?.nationality
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  required
                />
                {errors[index]?.nationality && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors[index].nationality}
                  </p>
                )}
              </div>

              <div className='md:col-span-2'>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Passport Number{" "}
                  <span className='text-gray-400 text-xs'>(Optional)</span>
                </label>
                <input
                  type='text'
                  value={traveler.passportNumber || ""}
                  onChange={(e) =>
                    updateTraveler(index, "passportNumber", e.target.value)
                  }
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#485342] transition-all'
                />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
