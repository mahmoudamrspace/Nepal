import { BlogPost } from '@/types';
import { SEED_AVATARS, SEED_BLOG_IMAGES } from '@/data/seedMedia';

/** Blog seed — stock imagery via `seedMedia`; replace in admin after upload. */
export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'best-time-to-visit-nepal',
    title: 'Best Time to Visit Nepal: A Complete Seasonal Guide',
    excerpt:
      'Spring rhododendrons, autumn festivals, monsoon trade-offs — plan around weather, trails, and Dashain & Tihar.',
    content: `
      <p>Nepal stretches from steamy Terai jungle to 8,000m peaks; timing shapes everything from Lukla flights to jungle visibility.</p>

      <h2>Spring (March–May)</h2>
      <p>Warming days, blooming rhododendrons, and strong trekking conditions in Khumbu and Annapurna. Afternoon clouds can build; start early for views.</p>

      <h2>Monsoon (June–August)</h2>
      <p>Heavy rain makes remote trails slippery and leeches common, but the hills are lush and crowds thin. Rain-shadow areas like Upper Mustang see far less precipitation.</p>

      <h2>Autumn (September–November)</h2>
      <p>Stable post-monsoon skies, crisp air, and major festivals: <strong>Dashain</strong> and <strong>Tihar</strong> bring family gatherings and street celebrations. Book teahouses and flights early.</p>

      <h2>Winter (December–February)</h2>
      <p>High passes may close with snow; Kathmandu, Pokhara, Chitwan, and low-altitude culture tours stay pleasant. High camps require warmer sleeping systems.</p>
    `,
    featuredImage: SEED_BLOG_IMAGES['best-time-to-visit-nepal'].featured,
    images: SEED_BLOG_IMAGES['best-time-to-visit-nepal'].gallery,
    author: {
      name: 'Sarah Johnson',
      avatar: SEED_AVATARS.sarahJohnson,
      bio: 'Travel writer and Nepal enthusiast with over 10 years of experience exploring the Himalayas.',
    },
    category: 'Travel Tips',
    tags: ['Nepal', 'Travel Guide', 'Weather', 'Trekking'],
    publishedAt: '2024-01-15',
    updatedAt: '2024-01-15',
    readingTime: 6,
    featured: true,
    views: 1250,
    seoTitle: 'Best Time to Visit Nepal | Seasons & Festivals',
    seoDescription: 'When to trek, avoid monsoon, and catch Dashain and Tihar in Nepal.',
  },
  {
    id: '2',
    slug: 'nepali-culture-and-traditions',
    title: 'Understanding Nepali Culture and Traditions',
    excerpt:
      'Ethnic diversity, living heritage in the Kathmandu Valley, and how Hindu & Buddhist practices overlap in daily life.',
    content: `
      <p>Over 120 ethnic groups shape Nepal’s languages, dress, and festivals — yet a shared mountain courtesy ties communities together.</p>

      <h2>Festivals you may witness</h2>
      <p><strong>Dashain</strong> honors the goddess Durga; <strong>Tihar</strong> celebrates crows, dogs, cows, and siblings. <strong>Holi</strong> splashes color across towns each spring.</p>

      <h2>Kathmandu Valley craftsmanship</h2>
      <p>Newar artisans still carve windows and cast bronzes in Patan and Bhaktapur; support fair-trade workshops when buying souvenirs.</p>

      <h2>Etiquette</h2>
      <p>Use <em>Namaste</em> with palms together; ask before photographing ceremonies; circle stupas clockwise.</p>
    `,
    featuredImage: SEED_BLOG_IMAGES['nepali-culture-and-traditions'].featured,
    images: SEED_BLOG_IMAGES['nepali-culture-and-traditions'].gallery,
    author: {
      name: 'Rajesh Thapa',
      avatar: SEED_AVATARS.rajeshThapa,
      bio: 'Cultural historian and Nepal native passionate about sharing local traditions.',
    },
    category: 'Culture',
    tags: ['Culture', 'Traditions', 'Festivals', 'Nepal'],
    publishedAt: '2024-01-10',
    updatedAt: '2024-01-10',
    readingTime: 8,
    featured: true,
    views: 980,
  },
  {
    id: '3',
    slug: 'everest-base-camp-preparation',
    title: 'Complete Guide to Preparing for Everest Base Camp Trek',
    excerpt:
      'Training blocks, gear that actually matters, and how to stack acclimatization days before Gorak Shep.',
    content: `
      <p>Everest Base Camp (5,364m) is a trekking peak — no climbing ropes — but thin air punishes the underprepared.</p>

      <h2>12-week fitness template</h2>
      <p>Mix stair training with a weighted pack, long weekend hikes, and zone-2 cardio. Add balance work for uneven moraine.</p>

      <h2>Gear priorities</h2>
      <p>Waterproof shell, insulated jacket, broken-in boots, sleeping bag rated to roughly −10°C for teahouses, and a headlamp for pre-dawn summit pushes to Kala Patthar.</p>

      <h2>Altitude hygiene</h2>
      <p>Sleep low when possible, hydrate, avoid alcohol early on, and never mask AMS symptoms — guides are trained to descend if needed.</p>
    `,
    featuredImage: SEED_BLOG_IMAGES['everest-base-camp-preparation'].featured,
    images: SEED_BLOG_IMAGES['everest-base-camp-preparation'].gallery,
    author: {
      name: 'Michael Chen',
      avatar: SEED_AVATARS.michaelChen,
      bio: 'Experienced mountaineer and trekking guide with 50+ successful EBC treks.',
    },
    category: 'Adventure',
    tags: ['Everest', 'Trekking', 'Adventure', 'Preparation'],
    publishedAt: '2024-01-08',
    updatedAt: '2024-01-08',
    readingTime: 11,
    featured: true,
    views: 2100,
    seoTitle: 'Everest Base Camp Trek Preparation Guide',
    seoDescription: 'Fitness, packing list, and altitude tips before trekking to EBC.',
  },
  {
    id: '4',
    slug: 'nepali-cuisine-guide',
    title: "A Food Lover's Guide to Nepali Cuisine",
    excerpt:
      'Dal bhat power 24 hour, momo diplomacy, and where to find Newari feasts in the Valley.',
    content: `
      <p>Nepali plates layer Tibetan, Indian, and indigenous flavors — calories matter at altitude.</p>

      <h2>Staples</h2>
      <p><strong>Dal bhat</strong> (lentils, rice, pickles, vegetables) refuels trekkers daily. <strong>Momos</strong> come steamed, fried, or jhol-style in soup.</p>

      <h2>Valley specialties</h2>
      <p>Newari <em>yomari</em>, <em>chatamari</em> rice crepes, and fiery <em>choila</em> buffalo pair with local aila spirit in Bhaktapur tasting menus.</p>
    `,
    featuredImage: SEED_BLOG_IMAGES['nepali-cuisine-guide'].featured,
    images: SEED_BLOG_IMAGES['nepali-cuisine-guide'].gallery,
    author: {
      name: 'Priya Sharma',
      avatar: SEED_AVATARS.priyaSharma,
      bio: 'Food blogger and culinary enthusiast exploring Asian cuisines.',
    },
    category: 'Food',
    tags: ['Food', 'Cuisine', 'Nepal', 'Culture'],
    publishedAt: '2024-01-05',
    updatedAt: '2024-01-05',
    readingTime: 7,
    featured: false,
    views: 650,
  },
  {
    id: '5',
    slug: 'pokhara-travel-guide',
    title: 'Pokhara: The Gateway to Adventure',
    excerpt:
      'Paragliding thermals, Phewa reflections of Machhapuchhre, and trailheads for Annapurna Sanctuary.',
    content: `
      <p>Pokhara’s lakeside strip balances adventure operators with slow café culture — ideal before or after a trek.</p>

      <h2>Signature activities</h2>
      <p>Morning paragliding from Sarangkot, ultralight flights, zip-lining, and hiring a boat to the World Peace Pagoda trail.</p>

      <h2>Gateway treks</h2>
      <p>Ghorepani–Poon Hill, Mardi Himal, and ABC begin nearby; build buffer days for weather delays on mountain roads.</p>
    `,
    featuredImage: SEED_BLOG_IMAGES['pokhara-travel-guide'].featured,
    images: SEED_BLOG_IMAGES['pokhara-travel-guide'].gallery,
    author: {
      name: 'Sarah Johnson',
      avatar: SEED_AVATARS.sarahJohnson,
      bio: 'Travel writer and Nepal enthusiast with over 10 years of experience exploring the Himalayas.',
    },
    category: 'Travel Tips',
    tags: ['Pokhara', 'Adventure', 'Travel', 'Nepal'],
    publishedAt: '2024-01-03',
    updatedAt: '2024-01-03',
    readingTime: 9,
    featured: false,
    views: 890,
  },
  {
    id: '6',
    slug: 'wildlife-in-chitwan',
    title: 'Wildlife Safari in Chitwan National Park',
    excerpt:
      'UNESCO Terai wilderness: rhinos, tigers, gharials, and ethical alternatives to elephant-back rides.',
    content: `
      <p>Chitwan’s floodplain forests reward patience — dawn jeep drives and silent canoe drifts reveal different species rhythms.</p>

      <h2>Iconic species</h2>
      <p>Greater one-horned rhino, Bengal tiger, gharial crocodile, and hundreds of birds including hornbills and storks.</p>

      <h2>Responsible choices</h2>
      <p>Prioritize jeep, foot, and boat safaris with licensed naturalists; question any operator promising guaranteed cat sightings.</p>
    `,
    featuredImage: SEED_BLOG_IMAGES['wildlife-in-chitwan'].featured,
    images: SEED_BLOG_IMAGES['wildlife-in-chitwan'].gallery,
    author: {
      name: 'David Wilson',
      avatar: SEED_AVATARS.davidWilson,
      bio: 'Wildlife photographer and conservation advocate.',
    },
    category: 'Adventure',
    tags: ['Wildlife', 'Chitwan', 'Safari', 'Nature'],
    publishedAt: '2024-01-01',
    updatedAt: '2024-01-01',
    readingTime: 6,
    featured: false,
    views: 720,
  },
  {
    id: '7',
    slug: 'nepal-trekking-permits-explained',
    title: 'Nepal Trekking Permits Explained (TIMS, ACAP, Sagarmatha)',
    excerpt:
      'Which paperwork you need for Annapurna, Langtang, and Everest — and why guides matter beyond logistics.',
    content: `
      <p>Nepal’s protected areas require permits whose fees fund trail maintenance and conservation rangers.</p>

      <h2>TIMS & route-specific permits</h2>
      <p>Annapurna Conservation Area (ACAP) and Sagarmatha National Park passes are checked at checkpoints. Langtang National Park issues its own entry ticket.</p>

      <h2>Restricted regions</h2>
      <p>Upper Mustang, Manaslu, and other border zones need special trekking permits — itineraries must be pre-approved.</p>

      <h2>2020s reforms</h2>
      <p>Rules evolve; a licensed agency keeps your group compliant if independent TIMS rules change mid-season.</p>
    `,
    featuredImage: SEED_BLOG_IMAGES['nepal-trekking-permits-explained'].featured,
    images: SEED_BLOG_IMAGES['nepal-trekking-permits-explained'].gallery,
    author: {
      name: 'Michael Chen',
      avatar: SEED_AVATARS.michaelChen,
      bio: 'Experienced mountaineer and trekking guide with 50+ successful EBC treks.',
    },
    category: 'Travel Tips',
    tags: ['Nepal', 'Trekking', 'Permits', 'Travel Guide'],
    publishedAt: '2023-12-28',
    updatedAt: '2023-12-28',
    readingTime: 7,
    featured: false,
    views: 1840,
    seoTitle: 'Nepal Trekking Permits | TIMS ACAP Sagarmatha',
    seoDescription: 'Permit basics for Annapurna, Everest, and Langtang regions.',
  },
  {
    id: '8',
    slug: 'responsible-travel-nepal',
    title: 'Traveling Responsibly in Nepal’s Mountains',
    excerpt:
      'Porter weight limits, plastic reduction, and how tipping fairly supports mountain economies.',
    content: `
      <p>Responsible travel protects both people and peaks — small choices compound across thousands of trekkers each season.</p>

      <h2>Porters & guides</h2>
      <p>Insist on fair load weights (often ~20–25kg including porter’s own gear), waterproof duffels, and rest days written into contracts.</p>

      <h2>Waste</h2>
      <p>Carry a refill bottle with purification; say no to double-bagged snacks; pack out batteries and blister packs.</p>

      <h2>Community</h2>
      <p>Buy handicrafts direct from cooperatives, learn a few Nepali phrases, and respect photography boundaries in villages.</p>
    `,
    featuredImage: SEED_BLOG_IMAGES['responsible-travel-nepal'].featured,
    images: SEED_BLOG_IMAGES['responsible-travel-nepal'].gallery,
    author: {
      name: 'Anita Gurung',
      avatar: SEED_AVATARS.anitaGurung,
      bio: 'Sustainable tourism consultant based in Pokhara; former lodge operator on the ABC trail.',
    },
    category: 'Travel Tips',
    tags: ['Nepal', 'Sustainability', 'Trekking', 'Culture'],
    publishedAt: '2023-12-22',
    updatedAt: '2023-12-22',
    readingTime: 8,
    featured: true,
    views: 960,
  },
  {
    id: '9',
    slug: 'langtang-valley-reborn',
    title: 'Langtang Valley: Trekking After Rebirth',
    excerpt:
      'How the valley recovered after 2015, what you’ll see in Kyanjin, and why Tamang heritage endures.',
    content: `
      <p>The 2015 earthquake devastated Langtang village; today teahouses and memorial chortens stand beside replanted forests.</p>

      <h2>Why trek here</h2>
      <p>No Lukla flight — road access from Kathmandu — yet you still reach glacier views near Kyanjin Gompa within a week on trail.</p>

      <h2>Cultural notes</h2>
      <p>Tamang communities share Tibetan Buddhist rituals; cheese factories at Kyanjin offer fresh yak curd tastings.</p>
    `,
    featuredImage: SEED_BLOG_IMAGES['langtang-valley-reborn'].featured,
    images: SEED_BLOG_IMAGES['langtang-valley-reborn'].gallery,
    author: {
      name: 'Rajesh Thapa',
      avatar: SEED_AVATARS.rajeshThapa,
      bio: 'Cultural historian and Nepal native passionate about sharing local traditions.',
    },
    category: 'Adventure',
    tags: ['Langtang', 'Nepal', 'Trekking', 'Culture'],
    publishedAt: '2023-12-18',
    updatedAt: '2023-12-18',
    readingTime: 6,
    featured: false,
    views: 540,
  },
  {
    id: '10',
    slug: 'annapurna-or-everest-which-trek',
    title: 'Annapurna Circuit or Everest Base Camp?',
    excerpt:
      'Compare altitude profiles, logistics, crowds, and scenery to pick the right first Himalayan trek.',
    content: `
      <p>Both routes are world-class — your calendar, budget, and appetite for flying to Lukla usually decide.</p>

      <h2>Logistics</h2>
      <p>EBC hinges on Kathmandu–Lukla flights (weather delays common). Annapurna often starts with a long jeep ride — more flexible if monsoon lingers.</p>

      <h2>High point</h2>
      <p>Thorong La on the full circuit reaches 5,416m — higher than EBC — but you can shorten Annapurna with exits to Jomsom.</p>

      <h2>Vibe</h2>
      <p>EBC feels Sherpa-centric with iconic peak views; Annapurna shifts from subtropical gorges to Mustang-style dryness.</p>
    `,
    featuredImage: SEED_BLOG_IMAGES['annapurna-or-everest-which-trek'].featured,
    images: SEED_BLOG_IMAGES['annapurna-or-everest-which-trek'].gallery,
    author: {
      name: 'Sarah Johnson',
      avatar: SEED_AVATARS.sarahJohnson,
      bio: 'Travel writer and Nepal enthusiast with over 10 years of experience exploring the Himalayas.',
    },
    category: 'Adventure',
    tags: ['Annapurna', 'Everest', 'Trekking', 'Travel'],
    publishedAt: '2023-12-12',
    updatedAt: '2023-12-12',
    readingTime: 9,
    featured: false,
    views: 1420,
  },
  {
    id: '11',
    slug: 'kathmandu-momo-map',
    title: 'Where to Eat Momos in Kathmandu (Without the Tourist Trap)',
    excerpt:
      'From hole-in-the-wall buff counters to Newari courtyard cafés — a starter list for dumpling lovers.',
    content: `
      <p>Momos migrated from Tibet and became Nepal’s national comfort food — steamed, fried, or swimming in jhol soup.</p>

      <h2>What to order</h2>
      <p>Try <em>kothe</em> (pan-fried bottoms), open-top <em>molmo</em>, and buff (water buffalo) fillings for authentic spice.</p>

      <h2>Neighborhoods</h2>
      <p>Explore Patan alleys for family kitchens; Thamel has reliable late-night steamers — always ask for freshly made batches.</p>
    `,
    featuredImage: SEED_BLOG_IMAGES['kathmandu-momo-map'].featured,
    images: SEED_BLOG_IMAGES['kathmandu-momo-map'].gallery,
    author: {
      name: 'Priya Sharma',
      avatar: SEED_AVATARS.priyaSharma,
      bio: 'Food blogger and culinary enthusiast exploring Asian cuisines.',
    },
    category: 'Food',
    tags: ['Food', 'Kathmandu', 'Nepal', 'Cuisine'],
    publishedAt: '2023-12-08',
    updatedAt: '2023-12-08',
    readingTime: 5,
    featured: false,
    views: 2100,
  },
  {
    id: '12',
    slug: 'lumbini-pilgrimage-first-timers',
    title: 'Lumbini for First-Time Pilgrims',
    excerpt:
      'Maya Devi Temple etiquette, cycling the monastic zone, and pairing Lumbini with Chitwan.',
    content: `
      <p>UNESCO-listed Lumbini blends archaeology with living practice — allow two full days minimum in the sacred garden.</p>

      <h2>Sacred garden</h2>
      <p>Remove shoes before Maya Devi Temple; speak quietly around the marker stone; photograph exteriors respectfully.</p>

      <h2>Monastic architecture</h2>
      <p>Rent a bicycle to compare Thai, Chinese, and German monasteries — each compound reflects its sponsor nation’s style.</p>
    `,
    featuredImage: SEED_BLOG_IMAGES['lumbini-pilgrimage-first-timers'].featured,
    images: SEED_BLOG_IMAGES['lumbini-pilgrimage-first-timers'].gallery,
    author: {
      name: 'David Wilson',
      avatar: SEED_AVATARS.davidWilson,
      bio: 'Wildlife photographer and conservation advocate.',
    },
    category: 'Culture',
    tags: ['Lumbini', 'Pilgrimage', 'Nepal', 'Spiritual Travel'],
    publishedAt: '2023-12-04',
    updatedAt: '2023-12-04',
    readingTime: 6,
    featured: false,
    views: 430,
  },
];
