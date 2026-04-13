'use client';

import { motion } from 'framer-motion';

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ categories, selectedCategories, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => {
        const isSelected = selectedCategories.includes(category);
        return (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide transition-all duration-300 ${
              isSelected
                ? 'bg-[#485342] text-white button-shadow'
                : 'bg-white text-[#485342] border-2 border-[#485342] hover:bg-[#485342] hover:text-white'
            }`}
          >
            {category}
          </motion.button>
        );
      })}
    </div>
  );
}

