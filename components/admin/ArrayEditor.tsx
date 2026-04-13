'use client';

import { motion } from 'framer-motion';
import { CharacterCounter } from './ValidationHelper';
import { LIMITS } from '@/lib/adminValidations';

interface ArrayEditorProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  label?: string;
  addButtonLabel?: string;
  itemPlaceholder?: string;
  maxItems?: number;
  maxItemLength?: number;
}

export default function ArrayEditor({
  items,
  onChange,
  placeholder = 'Enter item',
  label,
  addButtonLabel = 'Add Item',
  itemPlaceholder = 'Enter item text...',
  maxItems,
  maxItemLength = LIMITS.ARRAY_ITEM,
}: ArrayEditorProps) {
  const addItem = () => {
    if (maxItems && items.length >= maxItems) {
      return;
    }
    onChange([...items, '']);
  };

  const updateItem = (index: number, value: string) => {
    if (value.length > maxItemLength) {
      return; // Prevent typing beyond limit
    }
    const updated = [...items];
    updated[index] = value;
    onChange(updated);
  };

  const canAddMore = maxItems ? items.length < maxItems : true;

  const removeItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-sm font-semibold text-gray-700">{label}</label>
          <motion.button
            type="button"
            onClick={addItem}
            disabled={!canAddMore}
            whileHover={canAddMore ? { scale: 1.05 } : {}}
            whileTap={canAddMore ? { scale: 0.95 } : {}}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
              canAddMore
                ? 'bg-[#485342] text-white hover:bg-[#3a4235]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {addButtonLabel}
          </motion.button>
        </div>
      )}
      {items.length === 0 ? (
        <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-sm">No items added yet. Click "{addButtonLabel}" to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-1"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateItem(index, e.target.value)}
                  placeholder={itemPlaceholder}
                  maxLength={maxItemLength}
                  className={`flex-1 px-4 py-2 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342] ${
                    item.length > maxItemLength * 0.8
                      ? item.length >= maxItemLength
                        ? 'border-red-500'
                        : 'border-yellow-500'
                      : 'border-gray-300'
                  }`}
                />
                <motion.button
                  type="button"
                  onClick={() => removeItem(index)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </motion.button>
              </div>
              <CharacterCounter current={item.length} max={maxItemLength} />
            </motion.div>
          ))}
        </div>
      )}
      {items.length > 0 && (
        <motion.button
          type="button"
          onClick={addItem}
          disabled={!canAddMore}
          whileHover={canAddMore ? { scale: 1.02 } : {}}
          whileTap={canAddMore ? { scale: 0.98 } : {}}
          className={`w-full px-4 py-2 border-2 border-dashed rounded-lg transition-colors text-sm font-semibold flex items-center justify-center gap-2 ${
            canAddMore
              ? 'border-gray-300 text-gray-600 hover:border-[#485342] hover:text-[#485342]'
              : 'border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {canAddMore ? addButtonLabel : `Maximum ${maxItems} items reached`}
        </motion.button>
      )}
    </div>
  );
}

