import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ImageGallery from '@/components/packages/ImageGallery';
import ItineraryAccordion from '@/components/packages/ItineraryAccordion';
import IncludedExcluded from '@/components/packages/IncludedExcluded';
import FAQAccordion from '@/components/packages/FAQAccordion';
import BookingBar from '@/components/packages/BookingBar';
import RelatedPackages from '@/components/packages/RelatedPackages';
import Link from 'next/link';
import { Package } from '@/types';

async function getPackage(slug: string): Promise<Package | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/packages/${slug}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch package:', error);
    return null;
  }
}

async function getAllPackages(): Promise<Package[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/packages`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch packages:', error);
    return [];
  }
}

export default async function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = await getPackage(slug);

  if (!pkg) {
    notFound();
  }

  const allPackages = await getAllPackages();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Adventure':
        return 'bg-red-500';
      case 'Culture':
        return 'bg-blue-500';
      case 'Wellness':
        return 'bg-green-500';
      default:
        return 'bg-purple-500';
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="relative bg-[#485342] py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-white">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide ${getCategoryColor(pkg.category)}`}>
                  {pkg.category}
                </span>
                <span className="px-4 py-2 rounded-full bg-white/20 text-sm font-medium">{pkg.difficulty}</span>
                <span className="px-4 py-2 rounded-full bg-white/20 text-sm font-medium">{pkg.duration}</span>
                <span className="px-4 py-2 rounded-full bg-white/20 text-sm font-medium">{pkg.location}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 leading-tight">{pkg.name}</h1>
              <p className="text-lg md:text-xl opacity-90 max-w-3xl leading-relaxed mb-8">{pkg.shortDescription}</p>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-3xl md:text-4xl font-bold mb-1">
                    {pkg.currency} {pkg.price.toLocaleString()}
                  </p>
                  <p className="text-sm opacity-80">per person</p>
                </div>
                <Link
                  href={`/checkout?package=${pkg.slug}`}
                  className="inline-block px-8 py-4 bg-white text-[#485342] rounded-full font-semibold uppercase tracking-wide hover:bg-gray-100 transition-all duration-300 button-shadow focus:outline-none focus:ring-4 focus:ring-white/50"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Image Gallery */}
        <section className="bg-white py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ImageGallery images={pkg.images} title={pkg.name} />
          </div>
        </section>

        {/* Main Content */}
        <section className="bg-[#dbe2dd] py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8 md:space-y-12">
                {/* Overview */}
                <div className="bg-white rounded-lg p-8 md:p-10 card-shadow">
                  <h2 className="text-3xl md:text-4xl font-serif text-[#2d2d2d] mb-6 md:mb-8">Overview</h2>
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8 md:mb-10">{pkg.fullDescription}</p>
                  
                  {/* Highlights */}
                  <div className="bg-[#dbe2dd] rounded-lg p-6 md:p-8">
                    <h3 className="text-xl md:text-2xl font-serif text-[#2d2d2d] mb-4 md:mb-6">Highlights</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      {pkg.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <svg className="w-6 h-6 text-[#485342] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700 text-base">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Itinerary */}
                <div className="bg-white rounded-lg p-8 md:p-10 card-shadow">
                  <h2 className="text-3xl md:text-4xl font-serif text-[#2d2d2d] mb-6 md:mb-8">Itinerary</h2>
                  <ItineraryAccordion itinerary={pkg.itinerary as any} />
                </div>

                {/* Included/Excluded */}
                <div className="bg-white rounded-lg p-8 md:p-10 card-shadow">
                  <h2 className="text-3xl md:text-4xl font-serif text-[#2d2d2d] mb-6 md:mb-8">What's Included & Excluded</h2>
                  <IncludedExcluded included={pkg.included} excluded={pkg.excluded} />
                </div>

                {/* FAQ */}
                {pkg.faq && Array.isArray(pkg.faq) && pkg.faq.length > 0 && (
                  <div className="bg-white rounded-lg p-8 md:p-10 card-shadow">
                    <h2 className="text-3xl md:text-4xl font-serif text-[#2d2d2d] mb-6 md:mb-8">Frequently Asked Questions</h2>
                    <FAQAccordion faq={pkg.faq as any} />
                  </div>
                )}
              </div>

              {/* Sidebar - Booking Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg p-6 md:p-8 card-shadow sticky top-24">
                  <div className="text-center mb-6 pb-6 border-b border-gray-200">
                    <p className="text-3xl md:text-4xl font-bold text-[#485342] mb-2">
                      {pkg.currency} {pkg.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 font-medium">per person</p>
                  </div>

                  <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Duration</span>
                      <span className="font-semibold text-[#2d2d2d]">{pkg.duration}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Group Size</span>
                      <span className="font-semibold text-[#2d2d2d]">Up to {pkg.groupSize}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Difficulty</span>
                      <span className="font-semibold text-[#2d2d2d]">{pkg.difficulty}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Location</span>
                      <span className="font-semibold text-[#2d2d2d] text-right">{pkg.location}</span>
                    </div>
                  </div>

                  <Link 
                    href={`/checkout?package=${pkg.slug}`}
                    className="block w-full mb-4"
                  >
                    <button className="w-full px-6 py-4 bg-[#485342] text-white rounded-full font-semibold uppercase tracking-wide hover:bg-[#3a4235] transition-all duration-300 button-shadow focus:outline-none focus:ring-4 focus:ring-[#485342]/50">
                      Book Now
                    </button>
                  </Link>

                  <Link
                    href="/contact"
                    className="block w-full"
                  >
                    <button className="w-full px-6 py-3 border-2 border-[#485342] text-[#485342] rounded-full font-semibold uppercase tracking-wide hover:bg-[#485342] hover:text-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#485342]/50">
                      Contact Us
                    </button>
                  </Link>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Need help?</p>
                    <div className="space-y-1">
                      <p className="text-sm text-[#485342] font-medium">email@example.com</p>
                      <p className="text-sm text-[#485342] font-medium">(123) 456 - 7890</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Packages */}
        <RelatedPackages packages={allPackages} currentPackageId={pkg.id} />
      </main>
      <Footer />
      <BookingBar price={pkg.price} currency={pkg.currency} name={pkg.name} slug={pkg.slug} />
    </>
  );
}

