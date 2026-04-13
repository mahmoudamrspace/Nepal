'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PackageCategory, Difficulty } from '@/types';

interface FilterSidebarProps {
  categories: PackageCategory[];
  selectedCategories: PackageCategory[];
  onCategoryChange: (category: PackageCategory) => void;
  difficulties: Difficulty[];
  selectedDifficulties: Difficulty[];
  onDifficultyChange: (difficulty: Difficulty) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  maxPrice: number;
  onClearFilters: () => void;
  activeFilterCount: number;
}

const FilterContent = ({
  categories,
  selectedCategories,
  onCategoryChange,
  difficulties,
  selectedDifficulties,
  onDifficultyChange,
  priceRange,
  onPriceRangeChange,
  maxPrice,
  onClearFilters,
  activeFilterCount,
}: FilterSidebarProps) => (
  <>
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-serif text-[#2d2d2d]">Filters</h3>
      {activeFilterCount > 0 && (
        <button
          onClick={onClearFilters}
          className="text-sm text-[#485342] hover:underline"
        >
          Clear all
        </button>
      )}
    </div>

    {/* Categories */}
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Category</h4>
      <div className="space-y-2">
        {categories.map((category) => (
          <label
            key={category}
            className="flex items-center cursor-pointer group"
          >
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => onCategoryChange(category)}
              className="w-4 h-4 text-[#485342] border-gray-300 rounded focus:ring-[#485342]"
            />
            <span className="ml-3 text-gray-700 group-hover:text-[#485342] transition-colors">
              {category}
            </span>
          </label>
        ))}
      </div>
    </div>

    {/* Difficulty */}
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Difficulty</h4>
      <div className="space-y-2">
        {difficulties.map((difficulty) => (
          <label
            key={difficulty}
            className="flex items-center cursor-pointer group"
          >
            <input
              type="checkbox"
              checked={selectedDifficulties.includes(difficulty)}
              onChange={() => onDifficultyChange(difficulty)}
              className="w-4 h-4 text-[#485342] border-gray-300 rounded focus:ring-[#485342]"
            />
            <span className="ml-3 text-gray-700 group-hover:text-[#485342] transition-colors">
              {difficulty}
            </span>
          </label>
        ))}
      </div>
    </div>

    {/* Price Range */}
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Price Range</h4>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => onPriceRangeChange([Number(e.target.value), priceRange[1]])}
            min="0"
            max={maxPrice}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#485342]"
            placeholder="Min"
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
            min="0"
            max={maxPrice}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#485342]"
            placeholder="Max"
          />
        </div>
        <div className="text-sm text-gray-600">
          ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
        </div>
      </div>
    </div>
  </>
);

export default function FilterSidebar(props: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-6 py-3 bg-[#485342] text-white rounded-full font-semibold flex items-center justify-between"
        >
          <span>Filters {props.activeFilterCount > 0 && `(${props.activeFilterCount})`}</span>
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.button>
      </div>

      {/* Desktop Filter Panel - Always Visible */}
      <div className="hidden lg:block">
        <div className="bg-white rounded-lg p-6 card-shadow mb-6 lg:mb-0">
          <FilterContent {...props} />
        </div>
      </div>

      {/* Mobile Filter Panel - Toggle */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white rounded-lg p-6 card-shadow mb-6 overflow-hidden"
          >
            <FilterContent {...props} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
