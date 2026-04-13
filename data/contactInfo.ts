import { ContactInfo } from '@/types';

export const contactInfo: ContactInfo = {
  address: {
    street: 'Thamel, Kathmandu',
    city: 'Kathmandu',
    country: 'Nepal',
    postalCode: '44600',
  },
  phone: {
    primary: '+977 1-4412345',
    secondary: '+977 1-4412346',
    emergency: '+977 9801234567',
  },
  email: {
    general: 'info@poveda.com',
    bookings: 'bookings@poveda.com',
    support: 'support@poveda.com',
  },
  hours: {
    days: 'Monday - Saturday',
    time: '9:00 AM - 6:00 PM',
    timezone: 'NPT (Nepal Time)',
  },
  social: [
    {
      platform: 'Facebook',
      url: 'https://www.facebook.com/p/Explore-Vision-Nepal-61568584065637/',
      icon: 'facebook',
    },
    {
      platform: 'Instagram',
      url: 'https://www.instagram.com/explorevisionnepal/?hl=en',
      icon: 'instagram',
    },
    {
      platform: 'TripAdvisor',
      url: 'https://www.tripadvisor.com/Attraction_Review-g293890-d33251166-Reviews-Explore_Vision_Nepal-Kathmandu_Kathmandu_Valley_Bagmati_Zone_Central_Region.html',
      icon: 'tripadvisor',
    },
  ],
  map: {
    latitude: 27.7222649,
    longitude: 85.3061214,
    zoom: 15,
  },
};

