import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/supabase/adminSession';

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const admin = auth.admin;

  const [
    { count: totalBookings },
    { count: pendingBookings },
    { count: totalPackages },
    { count: totalBlogPosts },
    { data: paidBookings },
  ] = await Promise.all([
    admin.from('bookings').select('*', { count: 'exact', head: true }),
    admin.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    admin.from('packages').select('*', { count: 'exact', head: true }),
    admin.from('blog_posts').select('*', { count: 'exact', head: true }),
    admin
      .from('bookings')
      .select('totalPrice')
      .eq('status', 'confirmed')
      .eq('paymentStatus', 'paid'),
  ]);

  const revenue = (paidBookings ?? []).reduce((sum, b) => sum + Number(b.totalPrice), 0);

  return NextResponse.json({
    totalBookings: totalBookings ?? 0,
    pendingBookings: pendingBookings ?? 0,
    totalPackages: totalPackages ?? 0,
    totalBlogPosts: totalBlogPosts ?? 0,
    revenue,
  });
}
