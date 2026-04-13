'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CheckoutProgress from '@/components/checkout/CheckoutProgress';
import PackageSummary from '@/components/checkout/PackageSummary';
import TravelerInfoForm from '@/components/checkout/TravelerInfoForm';
import PaymentForm from '@/components/checkout/PaymentForm';
import BookingReview from '@/components/checkout/BookingReview';
import { Package, Traveler } from '@/types';
import { PaymentData } from '@/lib/validations';
import { calculateBookingTotal } from '@/lib/bookingUtils';
import toast from 'react-hot-toast';

type CheckoutStep = 1 | 2 | 3 | 4;

export default function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const packageSlug = searchParams.get('package');

  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [numberOfTravelers, setNumberOfTravelers] = useState(1);
  const [travelers, setTravelers] = useState<Traveler[]>([]);
  const [paymentData, setPaymentData] = useState<Partial<PaymentData>>({});
  const [specialRequests, setSpecialRequests] = useState('');

  const handleEditStep = (step: number) => {
    if (step >= 1 && step <= 4) {
      setCurrentStep(step as CheckoutStep);
    }
  };
  const [emergencyContact, setEmergencyContact] = useState<{
    name: string;
    phone: string;
    relationship: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stepValidations, setStepValidations] = useState({
    step2: false,
    step3: false,
  });

  useEffect(() => {
    async function fetchPackage() {
      if (!packageSlug) {
        router.push('/packages');
        return;
      }

      try {
        const res = await fetch(`/api/packages/${packageSlug}`);
        if (res.ok) {
          const pkg = await res.json();
          setSelectedPackage(pkg);
          // Set default date if available
          if (pkg.availableDates && Array.isArray(pkg.availableDates) && pkg.availableDates.length > 0) {
            setSelectedDate(pkg.availableDates[0]);
          }
        } else {
          toast.error('Package not found');
          router.push('/packages');
        }
      } catch (error) {
        console.error('Failed to fetch package:', error);
        toast.error('Failed to load package');
        router.push('/packages');
      } finally {
        setLoading(false);
      }
    }
    fetchPackage();
  }, [packageSlug, router]);

  const pricing = selectedPackage
    ? calculateBookingTotal(selectedPackage.price, numberOfTravelers)
    : { basePrice: 0, taxes: 0, fees: 0, total: 0 };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!selectedDate) {
        toast.error('Please select a date');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!stepValidations.step2) {
        toast.error('Please complete all traveler information');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!stepValidations.step3) {
        toast.error('Please complete payment information');
        return;
      }
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as CheckoutStep);
    }
  };

  const handleSubmit = async () => {
    if (!selectedPackage) return;

    setIsSubmitting(true);

    try {
      const bookingData = {
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        packageSlug: selectedPackage.slug,
        selectedDate,
        numberOfTravelers,
        travelers,
        specialRequests: specialRequests || undefined,
        emergencyContact: emergencyContact || undefined,
        payment: paymentData,
        basePrice: pricing.basePrice,
        taxes: pricing.taxes,
        fees: pricing.fees,
        totalPrice: pricing.total,
        currency: selectedPackage.currency,
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push(`/checkout/confirmation?bookingNumber=${data.booking.bookingNumber}`);
      } else {
        toast.error(data.error || 'Failed to create booking. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !selectedPackage) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-20 flex items-center justify-center bg-[#dbe2dd]">
          <div className="text-center">
            <div className="inline-block w-16 h-16 border-4 border-[#485342] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading package...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#dbe2dd] pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Indicator */}
          <CheckoutProgress currentStep={currentStep} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-xl p-6 md:p-8 card-shadow"
                  >
                    <div>
                      <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-800 mb-2">
                        Package & Date Selection
                      </h2>
                      <p className="text-gray-600 mb-6">
                        Review your selected package and choose your preferred travel date.
                      </p>
                      <div className="flex justify-end">
                        <motion.button
                          onClick={handleNext}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-8 py-3 bg-[#485342] text-white rounded-full font-semibold uppercase tracking-wide hover:bg-[#3a4235] transition-all button-shadow"
                        >
                          Continue
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <TravelerInfoForm
                      numberOfTravelers={numberOfTravelers}
                      travelers={travelers}
                      onTravelersChange={setTravelers}
                      onValidationChange={(isValid) => setStepValidations((prev) => ({ ...prev, step2: isValid }))}
                    />
                    
                    {/* Emergency Contact */}
                    <div className="mt-8 bg-white rounded-xl p-6 md:p-8 card-shadow">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Emergency Contact (Optional)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          placeholder="Name"
                          value={emergencyContact?.name || ''}
                          onChange={(e) => setEmergencyContact({ ...emergencyContact, name: e.target.value, phone: emergencyContact?.phone || '', relationship: emergencyContact?.relationship || '' })}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#485342]"
                        />
                        <input
                          type="tel"
                          placeholder="Phone"
                          value={emergencyContact?.phone || ''}
                          onChange={(e) => setEmergencyContact({ ...emergencyContact, name: emergencyContact?.name || '', phone: e.target.value, relationship: emergencyContact?.relationship || '' })}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#485342]"
                        />
                        <input
                          type="text"
                          placeholder="Relationship"
                          value={emergencyContact?.relationship || ''}
                          onChange={(e) => setEmergencyContact({ ...emergencyContact, name: emergencyContact?.name || '', phone: emergencyContact?.phone || '', relationship: e.target.value })}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#485342]"
                        />
                      </div>
                    </div>

                    {/* Special Requests */}
                    <div className="mt-8 bg-white rounded-xl p-6 md:p-8 card-shadow">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Special Requests (Optional)</h3>
                      <textarea
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder="Any special requests or requirements..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#485342] resize-none"
                      />
                    </div>

                    <div className="flex justify-between mt-8">
                      <motion.button
                        onClick={handleBack}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 border-2 border-[#485342] text-[#485342] rounded-full font-semibold uppercase tracking-wide hover:bg-[#485342] hover:text-white transition-all"
                      >
                        Back
                      </motion.button>
                      <motion.button
                        onClick={handleNext}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={!stepValidations.step2}
                        className="px-8 py-3 bg-[#485342] text-white rounded-full font-semibold uppercase tracking-wide hover:bg-[#3a4235] transition-all button-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <PaymentForm
                      paymentData={paymentData}
                      onPaymentChange={setPaymentData}
                      onValidationChange={(isValid) => setStepValidations((prev) => ({ ...prev, step3: isValid }))}
                    />
                    <div className="flex justify-between mt-8">
                      <motion.button
                        onClick={handleBack}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 border-2 border-[#485342] text-[#485342] rounded-full font-semibold uppercase tracking-wide hover:bg-[#485342] hover:text-white transition-all"
                      >
                        Back
                      </motion.button>
                      <motion.button
                        onClick={handleNext}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={!stepValidations.step3}
                        className="px-8 py-3 bg-[#485342] text-white rounded-full font-semibold uppercase tracking-wide hover:bg-[#3a4235] transition-all button-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Review
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <BookingReview
                      package={selectedPackage}
                      selectedDate={selectedDate}
                      numberOfTravelers={numberOfTravelers}
                      travelers={travelers}
                      paymentData={paymentData as PaymentData}
                      pricing={pricing}
                      specialRequests={specialRequests}
                      emergencyContact={emergencyContact || undefined}
                      onEditStep={handleEditStep}
                    />
                    <div className="flex justify-between mt-8">
                      <motion.button
                        onClick={handleBack}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 border-2 border-[#485342] text-[#485342] rounded-full font-semibold uppercase tracking-wide hover:bg-[#485342] hover:text-white transition-all"
                      >
                        Back
                      </motion.button>
                      <motion.button
                        onClick={handleSubmit}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-[#485342] text-white rounded-full font-semibold uppercase tracking-wide hover:bg-[#3a4235] transition-all button-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          'Confirm Booking'
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar - Package Summary */}
            <div className="lg:col-span-1">
              <PackageSummary
                package={selectedPackage}
                selectedDate={selectedDate}
                numberOfTravelers={numberOfTravelers}
                onDateChange={setSelectedDate}
                onTravelersChange={setNumberOfTravelers}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

