import { NextRequest, NextResponse } from 'next/server';
import { createAnonClient } from '@/lib/supabase/anon';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');

    const supabase = createAnonClient();
    let q = supabase.from('reviews').select('*').order('date', { ascending: false });
    if (platform && platform !== 'All') {
      q = q.eq('platform', platform);
    }

    const { data: reviews, error } = await q;
    if (error) {
      console.error('Reviews fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }

    const list = reviews ?? [];
    const { data: allReviews } = await supabase.from('reviews').select('*');
    const all = allReviews ?? [];

    const googleReviews = all.filter((r) => r.platform === 'Google');
    const tripadvisorReviews = all.filter((r) => r.platform === 'TripAdvisor');

    const aggregateRatings = {
      google: {
        averageRating:
          googleReviews.length > 0
            ? googleReviews.reduce((sum, r) => sum + r.rating, 0) / googleReviews.length
            : 0,
        totalReviews: googleReviews.length,
        profileUrl:
          'https://www.google.com/maps/place/Explore+Vision+Nepal+Pvt.+Ltd/@27.7222648,85.3009608,16z/data=!3m1!4b1!4m6!3m5!1s0x33f11bfbe11105:0x259e1769456e2225!8m2!3d27.7222649!4d85.3061214!16s%2Fg%2F11xrxpnx_y?entry=ttu',
      },
      tripadvisor: {
        averageRating:
          tripadvisorReviews.length > 0
            ? tripadvisorReviews.reduce((sum, r) => sum + r.rating, 0) / tripadvisorReviews.length
            : 0,
        totalReviews: tripadvisorReviews.length,
        profileUrl:
          'https://www.tripadvisor.com/Attraction_Review-g293890-d33251166-Reviews-Explore_Vision_Nepal-Kathmandu_Kathmandu_Valley_Bagmati_Zone_Central_Region.html',
      },
    };

    return NextResponse.json({
      reviews: list,
      aggregateRatings,
    });
  } catch (e) {
    console.error('Reviews fetch error:', e);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
