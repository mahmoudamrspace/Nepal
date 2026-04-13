export interface NavigationItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

export interface Testimonial {
  quote: string;
  author: string;
}

export interface CardItem {
  title: string;
  imageUrl: string;
  buttonText: string;
  buttonHref?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export type PackageCategory = 'Adventure' | 'Culture' | 'Relaxation' | 'Wellness';
export type Difficulty = 'Easy' | 'Moderate' | 'Challenging';

export interface Package {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  currency: string;
  duration: string;
  location: string;
  difficulty: Difficulty;
  groupSize: number;
  images: string[];
  featuredImage: string;
  itinerary: ItineraryDay[];
  included: string[];
  excluded: string[];
  faq: FAQ[];
  highlights: string[];
  category: PackageCategory;
  featured: boolean;
  availableDates: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  name: string;
  avatar?: string;
  bio?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  images: string[];
  author: Author;
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  featured: boolean;
  views?: number;
  seoTitle?: string;
  seoDescription?: string;
}

export type ReviewPlatform = 'Google' | 'TripAdvisor';

export interface Review {
  id: string;
  platform: ReviewPlatform;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number;
  reviewText: string;
  date: string;
  reviewUrl?: string;
  verified?: boolean;
}

export interface PlatformRatings {
  averageRating: number;
  totalReviews: number;
  profileUrl: string;
}

export interface AggregateRatings {
  google: PlatformRatings;
  tripadvisor: PlatformRatings;
}

export interface Activity {
  name: string;
  description: string;
  icon?: string;
  image?: string;
}

export interface WhyChooseItem {
  title: string;
  description: string;
  icon?: string;
}

export interface CategoryContent {
  id: string;
  title: string;
  slug: string;
  heroImage: string;
  subtitle: string;
  overview: string;
  highlights: string[];
  activities: Activity[];
  galleryImages: string[];
  whyChoose: WhyChooseItem[];
  ctaTitle: string;
  ctaDescription: string;
}

export interface AboutContent {
  hero: {
    title: string;
    subtitle: string;
    image: string;
  };
  story: {
    title: string;
    content: string;
    images: string[];
  };
  mission: {
    title: string;
    statement: string;
    vision: string;
  };
  values: {
    title: string;
    icon: string;
    description: string;
  }[];
  whyNepal: {
    title: string;
    content: string;
    highlights: string[];
    image: string;
  };
  commitment: {
    title: string;
    items: {
      title: string;
      description: string;
      icon: string;
    }[];
  };
}

export interface ContactInfo {
  address: {
    street: string;
    city: string;
    country: string;
    postalCode?: string;
  };
  phone: {
    primary: string;
    secondary?: string;
    emergency?: string;
  };
  email: {
    general: string;
    bookings?: string;
    support?: string;
  };
  hours: {
    days: string;
    time: string;
    timezone: string;
  };
  social: {
    platform: string;
    url: string;
    icon: string;
  }[];
  map: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
}

export interface Traveler {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber?: string;
  isPrimary: boolean;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type PaymentMethod = 'credit_card' | 'bank_transfer' | 'paypal';

export interface Booking {
  id: string;
  bookingNumber: string;
  packageId: string;
  packageName: string;
  packageSlug: string;
  travelers: Traveler[];
  selectedDate: string;
  numberOfTravelers: number;
  basePrice: number;
  taxes: number;
  fees: number;
  totalPrice: number;
  currency: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  createdAt: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}
