import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message is too long'),
});

export const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const travelerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50, 'First name is too long'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50, 'Last name is too long'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  nationality: z.string().min(2, 'Nationality is required'),
  passportNumber: z.string().optional(),
  isPrimary: z.boolean().default(false),
});

export const paymentSchema = z.object({
  paymentMethod: z.enum(['credit_card', 'bank_transfer', 'paypal']),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
  cardName: z.string().optional(),
  billingAddress: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
  }).optional(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
  privacyAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the privacy policy',
  }),
}).refine((data) => {
  if (data.paymentMethod === 'credit_card') {
    return data.cardNumber && data.cardExpiry && data.cardCvv && data.cardName;
  }
  return true;
}, {
  message: 'Credit card information is required',
  path: ['cardNumber'],
});

export const bookingSchema = z.object({
  packageId: z.string().min(1, 'Package ID is required'),
  selectedDate: z.string().min(1, 'Please select a date'),
  numberOfTravelers: z.number().min(1, 'At least one traveler is required').max(20, 'Maximum 20 travelers allowed'),
  travelers: z.array(travelerSchema).min(1, 'At least one traveler is required'),
  specialRequests: z.string().max(500, 'Special requests are too long').optional(),
  emergencyContact: z.object({
    name: z.string().min(2, 'Emergency contact name is required'),
    phone: z.string().min(10, 'Emergency contact phone is required'),
    relationship: z.string().min(2, 'Relationship is required'),
  }).optional(),
  payment: paymentSchema,
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type SubscribeData = z.infer<typeof subscribeSchema>;
export type TravelerData = z.infer<typeof travelerSchema>;
export type PaymentData = z.infer<typeof paymentSchema>;
export type BookingData = z.infer<typeof bookingSchema>;

