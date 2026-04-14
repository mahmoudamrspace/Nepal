/**
 * Extra seed rows for Supabase (bookings, contacts, newsletter, package→tag links).
 * Content is inspired by real Nepal routes (EBC via Lukla, Kathmandu Valley UNESCO sites, Chitwan, etc.).
 */

/** Maps package slug → tag names (merged with blog tags when seeding `tags`). */
export const PACKAGE_TAG_NAMES_BY_SLUG: Record<string, string[]> = {
  'everest-base-camp-trek': ['Everest', 'Trekking', 'Adventure', 'Nepal'],
  'kathmandu-cultural-heritage': ['Culture', 'UNESCO', 'Heritage Sites', 'Nepal'],
  'pokhara-wellness-retreat': ['Wellness', 'Travel', 'Nepal', 'Adventure'],
  'annapurna-circuit-trek': ['Annapurna', 'Trekking', 'Adventure', 'Nepal'],
  'chitwan-jungle-safari': ['Wildlife', 'Chitwan', 'Safari', 'Nature'],
  'lumbini-pilgrimage-tour': ['Culture', 'Spiritual Travel', 'Pilgrimage', 'Nepal'],
  'langtang-valley-trek': ['Langtang', 'Trekking', 'Adventure', 'Nepal'],
  'nagarkot-pokhara-relaxation': ['Relaxation', 'Pokhara', 'Travel', 'Nepal'],
};

export type SeedBookingDef = {
  bookingNumber: string;
  packageSlug: string;
  selectedDate: string;
  numberOfTravelers: number;
  travelers: Record<string, unknown>[];
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: 'credit_card' | 'bank_transfer' | 'paypal' | null;
  customerEmail: string;
  customerPhone: string;
  specialRequests?: string;
  emergencyContact?: Record<string, string>;
  basePrice: number;
  taxes: number;
  fees: number;
  totalPrice: number;
  currency?: string;
};

export const SEED_BOOKINGS: SeedBookingDef[] = [
  {
    bookingNumber: 'SEED-EBC-24001',
    packageSlug: 'everest-base-camp-trek',
    selectedDate: '2026-10-12',
    numberOfTravelers: 2,
    travelers: [
      {
        firstName: 'Sofia',
        lastName: 'Andersson',
        email: 'sofia.andersson@example.com',
        phone: '+46701234567',
        dateOfBirth: '1988-04-22',
        nationality: 'Swedish',
        passportNumber: 'SE8889911',
        isPrimary: true,
      },
      {
        firstName: 'Erik',
        lastName: 'Andersson',
        email: 'erik.andersson@example.com',
        phone: '+46709876543',
        dateOfBirth: '1990-11-03',
        nationality: 'Swedish',
        passportNumber: 'SE8889922',
        isPrimary: false,
      },
    ],
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    customerEmail: 'sofia.andersson@example.com',
    customerPhone: '+46701234567',
    specialRequests:
      'Vegetarian meals on the trek please. Interested in acclimatization day in Namche — happy to follow guide recommendations for Sagarmatha National Park pacing.',
    emergencyContact: {
      name: 'Ingrid Andersson',
      phone: '+46705551212',
      relationship: 'Sister',
    },
    basePrice: 3798,
    taxes: 493.74,
    fees: 100,
    totalPrice: 4391.74,
  },
  {
    bookingNumber: 'SEED-KTM-24002',
    packageSlug: 'kathmandu-cultural-heritage',
    selectedDate: '2026-04-18',
    numberOfTravelers: 1,
    travelers: [
      {
        firstName: 'James',
        lastName: 'Chen',
        email: 'j.chen.travel@example.com',
        phone: '+61401234567',
        dateOfBirth: '1975-08-14',
        nationality: 'Australian',
        passportNumber: 'PA9876543',
        isPrimary: true,
      },
    ],
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: null,
    customerEmail: 'j.chen.travel@example.com',
    customerPhone: '+61401234567',
    specialRequests:
      'Would like emphasis on Patan Durbar Square and Bhaktapur if possible — read about the Kathmandu Valley UNESCO sites and prefer smaller groups.',
    emergencyContact: {
      name: 'Mei Chen',
      phone: '+61409876543',
      relationship: 'Spouse',
    },
    basePrice: 899,
    taxes: 116.87,
    fees: 50,
    totalPrice: 1065.87,
  },
  {
    bookingNumber: 'SEED-PKR-24003',
    packageSlug: 'pokhara-wellness-retreat',
    selectedDate: '2026-05-05',
    numberOfTravelers: 2,
    travelers: [
      {
        firstName: 'Marie',
        lastName: 'Dubois',
        email: 'marie.dubois@example.fr',
        phone: '+33612345678',
        dateOfBirth: '1992-01-30',
        nationality: 'French',
        passportNumber: 'FR12AB34567',
        isPrimary: true,
      },
      {
        firstName: 'Claire',
        lastName: 'Dubois',
        email: 'claire.dubois@example.fr',
        phone: '+33698765432',
        dateOfBirth: '1995-06-18',
        nationality: 'French',
        passportNumber: 'FR12AB98765',
        isPrimary: false,
      },
    ],
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'paypal',
    customerEmail: 'marie.dubois@example.fr',
    customerPhone: '+33612345678',
    specialRequests: 'Lake-facing room if available; interested in sunrise Sarangkot option.',
    emergencyContact: {
      name: 'Jean Dubois',
      phone: '+33655544332',
      relationship: 'Father',
    },
    basePrice: 2598,
    taxes: 337.74,
    fees: 100,
    totalPrice: 3035.74,
  },
  {
    bookingNumber: 'SEED-CHT-24004',
    packageSlug: 'chitwan-jungle-safari',
    selectedDate: '2026-03-08',
    numberOfTravelers: 3,
    travelers: [
      {
        firstName: 'David',
        lastName: 'Okonkwo',
        email: 'd.okonkwo@example.uk',
        phone: '+447700900123',
        dateOfBirth: '1983-12-05',
        nationality: 'British',
        passportNumber: 'GB123456789',
        isPrimary: true,
      },
      {
        firstName: 'Amara',
        lastName: 'Okonkwo',
        email: 'amara.ok@example.uk',
        phone: '+447700900124',
        dateOfBirth: '2012-07-21',
        nationality: 'British',
        passportNumber: 'GB123456790',
        isPrimary: false,
      },
      {
        firstName: 'Kofi',
        lastName: 'Okonkwo',
        email: 'kofi.ok@example.uk',
        phone: '+447700900125',
        dateOfBirth: '2015-02-11',
        nationality: 'British',
        passportNumber: 'GB123456791',
        isPrimary: false,
      },
    ],
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'bank_transfer',
    customerEmail: 'd.okonkwo@example.uk',
    customerPhone: '+447700900123',
    specialRequests:
      'Family with two children — any junior naturalist activities at Chitwan National Park would be appreciated.',
    emergencyContact: {
      name: 'Grace Okonkwo',
      phone: '+447700900200',
      relationship: 'Mother',
    },
    basePrice: 2097,
    taxes: 272.61,
    fees: 150,
    totalPrice: 2519.61,
  },
  {
    bookingNumber: 'SEED-LNG-24005',
    packageSlug: 'langtang-valley-trek',
    selectedDate: '2026-04-22',
    numberOfTravelers: 1,
    travelers: [
      {
        firstName: 'Elena',
        lastName: 'Volkov',
        email: 'e.volkov@example.ch',
        phone: '+41791234567',
        dateOfBirth: '1991-03-09',
        nationality: 'Swiss',
        passportNumber: 'CH00112233',
        isPrimary: true,
      },
    ],
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    customerEmail: 'e.volkov@example.ch',
    customerPhone: '+41791234567',
    specialRequests:
      'Interested in optional Tserko Ri day hike if weather allows — vegetarian meals on trek.',
    emergencyContact: {
      name: 'Stefan Volkov',
      phone: '+41798765432',
      relationship: 'Brother',
    },
    basePrice: 1199,
    taxes: 155.87,
    fees: 50,
    totalPrice: 1404.87,
  },
];

export const SEED_CONTACT_SUBMISSIONS = [
  {
    id: 'seed-contact-001',
    name: 'Hannah Mueller',
    email: 'h.mueller@example.de',
    phone: '+4917011122233',
    subject: 'general',
    message:
      'We are planning the classic Everest Base Camp route (Lukla, Namche, Tengboche) for autumn 2026. Could you confirm typical trekking hours per day and whether you arrange TIMS/Sagarmatha permits? Vielen Dank!',
  },
  {
    id: 'seed-contact-002',
    name: 'Raj Patel',
    email: 'raj.patel@example.in',
    phone: '+919876543210',
    subject: 'booking',
    message:
      'Interested in combining a short Kathmandu heritage tour (Pashupatinath, Boudhanath) with 2 nights in Pokhara before flying home. Do you offer custom lengths?',
  },
  {
    id: 'seed-contact-003',
    name: 'Yuki Tanaka',
    email: 'y.tanaka@example.jp',
    phone: '+819012345678',
    subject: 'support',
    message:
      'Question about altitude: first time in Nepal above 3000m. Does the Annapurna Circuit package include rest days for acclimatization at Manang?',
  },
  {
    id: 'seed-contact-004',
    name: 'Carlos Mendes',
    email: 'c.mendes@example.pt',
    phone: '+351912345678',
    subject: 'partnership',
    message:
      'We run a small ethical gear shop in Lisbon and would like to explore co-marketing with your Langtang and EBC departures — please share a media kit if available.',
  },
] as const;

export const SEED_NEWSLETTER_EMAILS = [
  { email: 'alpine.wanderer@example.com', active: true },
  { email: 'culture.seeker@example.nz', active: true },
  { email: 'terai.birder@example.ca', active: true },
  { email: 'inactive.old@example.com', active: false },
] as const;
