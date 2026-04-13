'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PackageCard from '@/components/packages/PackageCard';
import SearchBar from '@/components/packages/SearchBar';
import FilterSidebar from '@/components/packages/FilterSidebar';
import { Package, PackageCategory, Difficulty } from '@/types';
import PackageCardSkeleton from '@/components/ui/PackageCardSkeleton';

type SortOption = 'price-low' | 'price-high' | 'duration' | 'newest';

export default function PackagesPage() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category') as PackageCategory | null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<PackageCategory[]>(
    categoryFromUrl ? [categoryFromUrl] : []
  );
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  useEffect(() => {
    async function fetchPackages() {
      try {
        const res = await fetch('/api/packages');
        if (res.ok) {
          const data = await res.json();
          setPackages(data);
          const max = Math.max(...data.map((p: Package) => p.price), 5000);
          setPriceRange([0, max]);
        }
      } catch (error) {
        console.error('Failed to fetch packages:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPackages();
  }, []);

  useEffect(() => {
    if (categoryFromUrl && !selectedCategories.includes(categoryFromUrl)) {
      setSelectedCategories([categoryFromUrl]);
    }
  }, [categoryFromUrl]);

  const categories: PackageCategory[] = ['Adventure', 'Culture', 'Relaxation', 'Wellness'];
  const difficulties: Difficulty[] = ['Easy', 'Moderate', 'Challenging'];
  const maxPrice = Math.max(...packages.map(p => p.price), 5000);

  const filteredAndSortedPackages = useMemo(() => {
    let filtered = [...packages];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (pkg) =>
          pkg.name.toLowerCase().includes(query) ||
          pkg.shortDescription.toLowerCase().includes(query) ||
          pkg.location.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((pkg) => selectedCategories.includes(pkg.category));
    }

    // Difficulty filter
    if (selectedDifficulties.length > 0) {
      filtered = filtered.filter((pkg) => selectedDifficulties.includes(pkg.difficulty));
    }

    // Price filter
    filtered = filtered.filter(
      (pkg) => pkg.price >= priceRange[0] && pkg.price <= priceRange[1]
    );

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'duration':
          return parseInt(a.duration) - parseInt(b.duration);
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategories, selectedDifficulties, priceRange, sortBy]);

  const activeFilterCount =
    selectedCategories.length + selectedDifficulties.length + (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0);

  const handleCategoryChange = (category: PackageCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleDifficultyChange = (difficulty: Difficulty) => {
    setSelectedDifficulties((prev) =>
      prev.includes(difficulty)
        ? prev.filter((d) => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedDifficulties([]);
    setPriceRange([0, maxPrice]);
    setSearchQuery('');
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="bg-[#485342] py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white mb-6">
                OUR PACKAGES
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
                Discover unforgettable experiences in Nepal
              </p>
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section ref={sectionRef} className="bg-[#dbe2dd] py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <aside className="lg:w-64 flex-shrink-0">
                <FilterSidebar
                  categories={categories}
                  selectedCategories={selectedCategories}
                  onCategoryChange={handleCategoryChange}
                  difficulties={difficulties}
                  selectedDifficulties={selectedDifficulties}
                  onDifficultyChange={handleDifficultyChange}
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                  maxPrice={maxPrice}
                  onClearFilters={handleClearFilters}
                  activeFilterCount={activeFilterCount}
                />
              </aside>

              {/* Main Content */}
              <div className="flex-1">
                {/* Sort and Results Count */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <p className="text-gray-600">
                    {filteredAndSortedPackages.length} package{filteredAndSortedPackages.length !== 1 ? 's' : ''} found
                  </p>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Sort by:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#485342] bg-white"
                    >
                      <option value="newest">Newest</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="duration">Duration</option>
                    </select>
                  </div>
                </div>

                {/* Packages Grid */}
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => <PackageCardSkeleton key={i} />)}
                  </div>
                ) : filteredAndSortedPackages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                    {filteredAndSortedPackages.map((pkg, index) => (
                      <PackageCard key={pkg.id} package={pkg} index={index} />
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                  >
                    <p className="text-xl text-gray-600 mb-4">No packages found</p>
                    <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
                    <button
                      onClick={handleClearFilters}
                      className="px-6 py-3 border-2 border-[#485342] rounded-full text-[#485342] hover:bg-[#485342] hover:text-white transition-all duration-300 font-semibold"
                    >
                      Clear All Filters
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

