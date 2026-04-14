/**
 * High-quality stock imagery for local seed / mock data (Nepal travel themed).
 *
 * Sources: Unsplash (https://unsplash.com/license) and Pexels (https://www.pexels.com/license/).
 * Hotlinking is allowed under their terms; prefer uploading your own media in production.
 */

function unsplash(photoPath: string, w: number) {
  return `https://images.unsplash.com/${photoPath}?auto=format&fit=crop&w=${w}&q=85`;
}

function pexels(id: number, w: number) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
}

const W = 1920;
const G = 1200;

/** Package hero + gallery (by slug). */
export const SEED_PACKAGE_IMAGES: Record<string, { featured: string; gallery: string[] }> = {
  'everest-base-camp-trek': {
    featured: unsplash('photo-1544735716-392fe2489ffa', W),
    gallery: [
      unsplash('photo-1506905925346-21bda4d32df4', G),
      pexels(625409, G),
      pexels(2901209, G),
    ],
  },
  'kathmandu-cultural-heritage': {
    featured: pexels(754733, W),
    gallery: [unsplash('photo-1524231757912-21f4fe3a7200', G), unsplash('photo-1548013146-72479768bada', G)],
  },
  'pokhara-wellness-retreat': {
    featured: unsplash('photo-1540555700478-4be289fbecef', W),
    gallery: [unsplash('photo-1506126613408-eca07ce68773', G), pexels(2901208, G)],
  },
  'annapurna-circuit-trek': {
    featured: unsplash('photo-1469474968028-56623f02e42e', W),
    gallery: [
      unsplash('photo-1470071459604-3b5ec3a7fe05', G),
      pexels(7176069, G),
      unsplash('photo-1518495973542-4542c06a5843', G),
    ],
  },
  'chitwan-jungle-safari': {
    featured: pexels(631317, W),
    gallery: [pexels(247376, G), pexels(105808, G)],
  },
  'lumbini-pilgrimage-tour': {
    featured: unsplash('photo-1602002418082-a4443e081dd1', W),
    gallery: [pexels(460672, G), unsplash('photo-1589308078059-be1415eab4c3', G)],
  },
  'langtang-valley-trek': {
    featured: pexels(625409, W),
    gallery: [unsplash('photo-1464822759023-fed622ff2c3b', G), pexels(417173, G)],
  },
  'nagarkot-pokhara-relaxation': {
    featured: unsplash('photo-1518495973542-4542c06a5843', W),
    gallery: [unsplash('photo-1600585154340-be6161a56a0c', G), unsplash('photo-1564501049412-61c2a3083791', G)],
  },
};

/** Blog featured + inline galleries (by slug). */
export const SEED_BLOG_IMAGES: Record<string, { featured: string; gallery: string[] }> = {
  'best-time-to-visit-nepal': {
    featured: unsplash('photo-1470071459604-3b5ec3a7fe05', W),
    gallery: [unsplash('photo-1578662996442-48f60103fc96', G), unsplash('photo-1533174072545-7a4b6ad7a6c3', G)],
  },
  'nepali-culture-and-traditions': {
    featured: unsplash('photo-1524231757912-21f4fe3a7200', W),
    gallery: [unsplash('photo-1548013146-72479768bada', G)],
  },
  'everest-base-camp-preparation': {
    featured: pexels(625409, W),
    gallery: [pexels(417173, G), unsplash('photo-1544735716-392fe2489ffa', G)],
  },
  'nepali-cuisine-guide': {
    featured: pexels(1640777, W),
    gallery: [unsplash('photo-1585937421612-70a008356fbe', G)],
  },
  'pokhara-travel-guide': {
    featured: pexels(2901208, W),
    gallery: [pexels(433149, G)],
  },
  'wildlife-in-chitwan': {
    featured: pexels(631317, W),
    gallery: [pexels(247376, G)],
  },
  'nepal-trekking-permits-explained': {
    featured: unsplash('photo-1464822759023-fed622ff2c3b', W),
    gallery: [unsplash('photo-1544735716-392fe2489ffa', G), pexels(2901209, G)],
  },
  'responsible-travel-nepal': {
    featured: unsplash('photo-1518495973542-4542c06a5843', W),
    gallery: [pexels(1190297, G)],
  },
  'langtang-valley-reborn': {
    featured: unsplash('photo-1469474968028-56623f02e42e', W),
    gallery: [unsplash('photo-1544735716-392fe2489ffa', G), pexels(7176069, G)],
  },
  'annapurna-or-everest-which-trek': {
    featured: unsplash('photo-1506905925346-21bda4d32df4', W),
    gallery: [pexels(625409, G), unsplash('photo-1470071459604-3b5ec3a7fe05', G)],
  },
  'kathmandu-momo-map': {
    featured: pexels(2347311, W),
    gallery: [unsplash('photo-1565557623262-b51c2513a641', G)],
  },
  'lumbini-pilgrimage-first-timers': {
    featured: unsplash('photo-1602002418082-a4443e081dd1', W),
    gallery: [pexels(460672, G), unsplash('photo-1589308078059-be1415eab4c3', G)],
  },
};

function portrait(photoPath: string) {
  return `https://images.unsplash.com/${photoPath}?w=256&h=256&fit=crop&auto=format&q=80`;
}

/** Author profile photos (repeat URLs where the same persona appears in multiple posts). */
export const SEED_AVATARS = {
  sarahJohnson: portrait('photo-1494790108377-be9c29b29330'),
  rajeshThapa: portrait('photo-1507003211169-0a1dd7228f2d'),
  michaelChen: portrait('photo-1472099645785-5658abf4ff4e'),
  priyaSharma: portrait('photo-1438761681033-6461ffad8d80'),
  davidWilson: portrait('photo-1500648767791-00dcc994a43e'),
  anitaGurung: portrait('photo-1534528741775-53994a69daeb'),
  reviewerSm: portrait('photo-1544005313-94ddf0286df2'),
  reviewerJa: portrait('photo-1519345182560-3f2917c472ef'),
  reviewerDc: portrait('photo-1506794778202-cad84cf45f1d'),
  reviewerEt: portrait('photo-1531123897727-8f129e1688ce'),
  reviewerRt: portrait('photo-1507591064344-4c6ce005b128'),
  reviewerLw: portrait('photo-1573496359142-b8d87734a5a2'),
  reviewerTw: portrait('photo-1560250097-0b93528c311a'),
  reviewerOs: portrait('photo-1580489944761-15a19d654956'),
  reviewerMaria: portrait('photo-1551836022-d5d88e9218df'),
  reviewerMichaelBrown: portrait('photo-1519085360753-af0119f7cbe7'),
  reviewerJennifer: portrait('photo-1517841905240-472988babdf9'),
  reviewerKenji: portrait('photo-1612349317150-e413f6a5b16d'),
} as const;
