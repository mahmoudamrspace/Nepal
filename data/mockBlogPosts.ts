import { BlogPost } from '@/types';

export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'best-time-to-visit-nepal',
    title: 'Best Time to Visit Nepal: A Complete Seasonal Guide',
    excerpt: 'Discover the perfect time to visit Nepal based on weather, festivals, and trekking conditions. Plan your ideal trip with our comprehensive seasonal guide.',
    content: `
      <p>Nepal, a landlocked country nestled in the Himalayas, offers breathtaking landscapes, rich culture, and incredible trekking opportunities. However, choosing the right time to visit can significantly impact your experience.</p>
      
      <h2>Spring (March to May)</h2>
      <p>Spring is one of the best times to visit Nepal. The weather is mild, with clear skies and blooming rhododendrons painting the hillsides in vibrant colors. This is the peak season for trekking, especially to Everest Base Camp and Annapurna Circuit.</p>
      
      <h2>Summer/Monsoon (June to August)</h2>
      <p>The monsoon season brings heavy rainfall, making trekking challenging. However, this is the best time to see the lush green landscapes and experience fewer crowds. The rain typically occurs in the afternoons, so mornings are often clear.</p>
      
      <h2>Autumn (September to November)</h2>
      <p>Autumn is considered the best time to visit Nepal. The weather is stable, skies are clear, and the views of the Himalayas are spectacular. This is also when major festivals like Dashain and Tihar occur.</p>
      
      <h2>Winter (December to February)</h2>
      <p>Winter brings cold temperatures, especially at higher altitudes. However, lower regions like Kathmandu and Pokhara remain pleasant. This is a great time for cultural tours and lower-altitude treks.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2000',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2000',
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=2000',
    ],
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
      bio: 'Travel writer and Nepal enthusiast with over 10 years of experience exploring the Himalayas.',
    },
    category: 'Travel Tips',
    tags: ['Nepal', 'Travel Guide', 'Weather', 'Trekking'],
    publishedAt: '2024-01-15',
    updatedAt: '2024-01-15',
    readingTime: 5,
    featured: true,
    views: 1250,
  },
  {
    id: '2',
    slug: 'nepali-culture-and-traditions',
    title: 'Understanding Nepali Culture and Traditions',
    excerpt: 'Immerse yourself in the rich cultural heritage of Nepal. Learn about festivals, customs, and traditions that make this country unique.',
    content: `
      <p>Nepal is a melting pot of cultures, with over 100 ethnic groups and 123 languages. The country's rich cultural heritage is evident in its festivals, architecture, and daily life.</p>
      
      <h2>Major Festivals</h2>
      <p>Nepal celebrates numerous festivals throughout the year. Dashain, the biggest festival, celebrates the victory of good over evil. Tihar, the festival of lights, follows Dashain and honors various animals and deities.</p>
      
      <h2>Religious Harmony</h2>
      <p>Hinduism and Buddhism coexist peacefully in Nepal. You'll find temples and stupas side by side, and many Nepalis practice elements of both religions.</p>
      
      <h2>Traditional Architecture</h2>
      <p>The Kathmandu Valley is home to seven UNESCO World Heritage Sites, showcasing traditional Newari architecture with intricate wood carvings and pagoda-style temples.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1678628104334-553f672cd8d5?q=80&w=2000',
    images: [
      'https://images.unsplash.com/photo-1678628104334-553f672cd8d5?q=80&w=2000',
    ],
    author: {
      name: 'Rajesh Thapa',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
      bio: 'Cultural historian and Nepal native passionate about sharing local traditions.',
    },
    category: 'Culture',
    tags: ['Culture', 'Traditions', 'Festivals', 'Nepal'],
    publishedAt: '2024-01-10',
    updatedAt: '2024-01-10',
    readingTime: 7,
    featured: true,
    views: 980,
  },
  {
    id: '3',
    slug: 'everest-base-camp-preparation',
    title: 'Complete Guide to Preparing for Everest Base Camp Trek',
    excerpt: 'Everything you need to know before embarking on the iconic Everest Base Camp trek. From fitness preparation to gear checklist.',
    content: `
      <p>The Everest Base Camp trek is a dream for many adventurers. Proper preparation is key to enjoying this incredible journey.</p>
      
      <h2>Physical Preparation</h2>
      <p>Start training at least 3-4 months before your trek. Focus on cardiovascular fitness, leg strength, and endurance. Regular hiking with a loaded backpack is ideal preparation.</p>
      
      <h2>Essential Gear</h2>
      <p>Invest in quality gear: waterproof jacket, warm layers, good hiking boots, sleeping bag rated for cold temperatures, and trekking poles. Don't forget a first aid kit and water purification tablets.</p>
      
      <h2>Altitude Acclimatization</h2>
      <p>Take your time ascending. The trek includes acclimatization days to help your body adjust to higher altitudes. Stay hydrated and listen to your body.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2000',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2000',
      'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?q=80&w=2000',
    ],
    author: {
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200',
      bio: 'Experienced mountaineer and trekking guide with 50+ successful EBC treks.',
    },
    category: 'Adventure',
    tags: ['Everest', 'Trekking', 'Adventure', 'Preparation'],
    publishedAt: '2024-01-08',
    updatedAt: '2024-01-08',
    readingTime: 10,
    featured: true,
    views: 2100,
  },
  {
    id: '4',
    slug: 'nepali-cuisine-guide',
    title: 'A Food Lover\'s Guide to Nepali Cuisine',
    excerpt: 'Explore the flavors of Nepal through its traditional dishes, street food, and regional specialties.',
    content: `
      <p>Nepali cuisine is a delightful blend of flavors influenced by Tibetan, Indian, and local traditions.</p>
      
      <h2>Must-Try Dishes</h2>
      <p>Dal Bhat, the national dish, consists of lentil soup, rice, and vegetables. Momos, steamed dumplings, are a favorite snack. Thukpa, a hearty noodle soup, is perfect for cold mountain days.</p>
      
      <h2>Street Food</h2>
      <p>Kathmandu's streets are filled with food vendors offering everything from sel roti (sweet rice donuts) to chatpate (spicy snack mix).</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?q=80&w=2000',
    images: [],
    author: {
      name: 'Priya Sharma',
      bio: 'Food blogger and culinary enthusiast exploring Asian cuisines.',
    },
    category: 'Food',
    tags: ['Food', 'Cuisine', 'Nepal', 'Culture'],
    publishedAt: '2024-01-05',
    updatedAt: '2024-01-05',
    readingTime: 6,
    featured: false,
    views: 650,
  },
  {
    id: '5',
    slug: 'pokhara-travel-guide',
    title: 'Pokhara: The Gateway to Adventure',
    excerpt: 'Discover Pokhara, Nepal\'s adventure capital, known for its stunning lakes, paragliding, and proximity to the Annapurna range.',
    content: `
      <p>Pokhara, located 200km west of Kathmandu, is a paradise for adventure seekers and nature lovers.</p>
      
      <h2>Things to Do</h2>
      <p>Paragliding over the city offers breathtaking views of the Annapurna range. Boating on Phewa Lake at sunrise is magical. Visit the World Peace Pagoda for panoramic views.</p>
      
      <h2>Adventure Activities</h2>
      <p>From zip-lining to bungee jumping, Pokhara offers numerous adrenaline-pumping activities. It's also the starting point for many treks in the Annapurna region.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?q=80&w=2000',
    images: [],
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
      bio: 'Travel writer and Nepal enthusiast with over 10 years of experience exploring the Himalayas.',
    },
    category: 'Travel Tips',
    tags: ['Pokhara', 'Adventure', 'Travel', 'Nepal'],
    publishedAt: '2024-01-03',
    updatedAt: '2024-01-03',
    readingTime: 8,
    featured: false,
    views: 890,
  },
  {
    id: '6',
    slug: 'wildlife-in-chitwan',
    title: 'Wildlife Safari in Chitwan National Park',
    excerpt: 'Experience the incredible biodiversity of Chitwan National Park, home to rhinos, tigers, and over 500 bird species.',
    content: `
      <p>Chitwan National Park, a UNESCO World Heritage Site, offers one of Asia's best wildlife viewing experiences.</p>
      
      <h2>Wildlife Spotting</h2>
      <p>The park is home to one-horned rhinos, Bengal tigers, sloth bears, and numerous bird species. Early morning and late afternoon are the best times for wildlife viewing.</p>
      
      <h2>Activities</h2>
      <p>Jeep safaris, canoe rides, and jungle walks are popular ways to explore the park. Elephant-back safaris offer a unique perspective.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?q=80&w=2000',
    images: [],
    author: {
      name: 'David Wilson',
      bio: 'Wildlife photographer and conservation advocate.',
    },
    category: 'Adventure',
    tags: ['Wildlife', 'Chitwan', 'Safari', 'Nature'],
    publishedAt: '2024-01-01',
    updatedAt: '2024-01-01',
    readingTime: 5,
    featured: false,
    views: 720,
  },
];

