import { Review, AggregateRatings } from '@/types';
import { SEED_AVATARS } from '@/data/seedMedia';

/** Review seed — stock avatars via `seedMedia`; replace in admin after upload. */
export const mockReviews: Review[] = [
  {
    id: '1',
    platform: 'Google',
    reviewerName: 'Sarah Mitchell',
    reviewerAvatar: SEED_AVATARS.reviewerSm,
    rating: 5,
    reviewText:
      'EBC with this team was flawless — Lukla delays happen, but they rebooked us same day. Our guide knew every teahouse owner from Phakding to Gorak Shep.',
    date: '2024-01-15',
    reviewUrl: 'https://www.google.com/maps/reviews',
    verified: true,
  },
  {
    id: '2',
    platform: 'TripAdvisor',
    reviewerName: 'James Anderson',
    reviewerAvatar: SEED_AVATARS.reviewerJa,
    rating: 5,
    reviewText:
      'Annapurna Circuit: Thorong La day started at 4am and felt tough but safe — hot lemon at every stop. Muktinath apples tasted amazing after the pass.',
    date: '2024-01-12',
    reviewUrl: 'https://www.tripadvisor.com/reviews',
    verified: true,
  },
  {
    id: '3',
    platform: 'Google',
    reviewerName: 'Maria Garcia',
    reviewerAvatar: SEED_AVATARS.reviewerMaria,
    rating: 5,
    reviewText:
      'Kathmandu heritage tour hit all the UNESCO squares without rushing. Our guide explained Newar festivals in Patan — we timed Tihar lights perfectly.',
    date: '2024-01-10',
    reviewUrl: 'https://www.google.com/maps/reviews',
    verified: true,
  },
  {
    id: '4',
    platform: 'TripAdvisor',
    reviewerName: 'David Chen',
    reviewerAvatar: SEED_AVATARS.reviewerDc,
    rating: 5,
    reviewText:
      'Chitwan jeep safari at dawn — we watched a rhino cross the Rapti from the canoe the same afternoon. Naturalist knew every bird call.',
    date: '2024-01-08',
    reviewUrl: 'https://www.tripadvisor.com/reviews',
    verified: true,
  },
  {
    id: '5',
    platform: 'Google',
    reviewerName: 'Emma Thompson',
    reviewerAvatar: SEED_AVATARS.reviewerEt,
    rating: 5,
    reviewText:
      'Pokhara wellness week reset my nervous system. Sunrise yoga facing Machhapuchhre — then actual silence. Staff coordinated ethical paragliding add-on.',
    date: '2024-01-05',
    reviewUrl: 'https://www.google.com/maps/reviews',
    verified: true,
  },
  {
    id: '6',
    platform: 'TripAdvisor',
    reviewerName: 'Michael Brown',
    reviewerAvatar: SEED_AVATARS.reviewerMichaelBrown,
    rating: 4,
    reviewText:
      'Great value Langtang trek; road to Syabrubesi was long but driver was careful. Only nit: wish we had one more acclimatization day at Kyanjin.',
    date: '2024-01-03',
    reviewUrl: 'https://www.tripadvisor.com/reviews',
    verified: true,
  },
  {
    id: '7',
    platform: 'Google',
    reviewerName: 'Lisa Wang',
    reviewerAvatar: SEED_AVATARS.reviewerLw,
    rating: 5,
    reviewText:
      'Lumbini cycling day through the monastic zone was peaceful — Maya Devi Temple at sunrise almost empty. Combined with Chitwan afterward seamlessly.',
    date: '2024-01-01',
    reviewUrl: 'https://www.google.com/maps/reviews',
    verified: true,
  },
  {
    id: '8',
    platform: 'TripAdvisor',
    reviewerName: 'Robert Taylor',
    reviewerAvatar: SEED_AVATARS.reviewerRt,
    rating: 5,
    reviewText:
      'Nagarkot–Pokhara easy trip for my parents — no hard trekking, real mountain glimpses, and lovely lakeside hotels. Exactly what we needed.',
    date: '2023-12-28',
    reviewUrl: 'https://www.tripadvisor.com/reviews',
    verified: true,
  },
  {
    id: '9',
    platform: 'Google',
    reviewerName: 'Jennifer Lee',
    reviewerAvatar: SEED_AVATARS.reviewerJennifer,
    rating: 5,
    reviewText:
      'Transparent pricing on permits and domestic flights. Felt like they advocated for us when weather stacked Lukla cancellations.',
    date: '2023-12-25',
    reviewUrl: 'https://www.google.com/maps/reviews',
    verified: true,
  },
  {
    id: '10',
    platform: 'TripAdvisor',
    reviewerName: 'Thomas Wilson',
    reviewerAvatar: SEED_AVATARS.reviewerTw,
    rating: 5,
    reviewText:
      'Safety briefing on AMS was thorough; guide carried pulse oximeter daily. Culture nights in Namche were a bonus we did not expect.',
    date: '2023-12-22',
    reviewUrl: 'https://www.tripadvisor.com/reviews',
    verified: true,
  },
  {
    id: '11',
    platform: 'Google',
    reviewerName: 'Olivia Schmidt',
    reviewerAvatar: SEED_AVATARS.reviewerOs,
    rating: 5,
    reviewText:
      'Full Annapurna circuit — Manang rest day hike to Ice Lake was tough but views insane. Poon Hill sunrise on the way out capped the trip.',
    date: '2023-12-18',
    reviewUrl: 'https://www.google.com/maps/reviews',
    verified: true,
  },
  {
    id: '12',
    platform: 'TripAdvisor',
    reviewerName: 'Kenji Morita',
    reviewerAvatar: SEED_AVATARS.reviewerKenji,
    rating: 4,
    reviewText:
      'Excellent communication in English and patient with our mixed fitness group. Would book again for ABC next spring.',
    date: '2023-12-14',
    reviewUrl: 'https://www.tripadvisor.com/reviews',
    verified: true,
  },
];

export const aggregateRatings: AggregateRatings = {
  google: {
    averageRating: 4.9,
    totalReviews: 187,
    profileUrl: 'https://www.google.com/maps/place/your-business',
  },
  tripadvisor: {
    averageRating: 4.9,
    totalReviews: 241,
    profileUrl: 'https://www.tripadvisor.com/your-business',
  },
};
