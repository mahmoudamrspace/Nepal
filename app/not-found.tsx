import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CategoryHero from '@/components/categories/CategoryHero';

/** Himalayan peaks — same imagery family as category heroes (images.unsplash.com). */
const NOT_FOUND_HERO_IMAGE =
  'https://images.unsplash.com/photo-1585898175463-4bb8b8a9dea2?q=80&w=2234&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const quickLinks = [
  { href: '/packages', label: 'Packages' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
  { href: '/about', label: 'About' },
] as const;

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <CategoryHero
          title="404 — Trail not found"
          subtitle="This page isn’t on the map. The journey continues—head home or explore POVEDA’s Nepal experiences."
          heroImage={NOT_FOUND_HERO_IMAGE}
          ctaText="Back to home"
          ctaHref="/"
        />

        <section
          className="bg-[#dbe2dd] py-10 md:py-12"
          aria-label="Popular pages"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm uppercase tracking-widest text-[#485342]/80 mb-4 font-sans">
              You might be looking for
            </p>
            <nav aria-label="Quick links">
              <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                {quickLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-[#485342] font-semibold underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#485342] focus-visible:ring-offset-2 rounded-sm"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
