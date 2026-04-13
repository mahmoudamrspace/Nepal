'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ImageUploaderProps {
  onImageSelect: (url: string) => void;
  existingImages?: string[];
}

export default function ImageUploader({ onImageSelect, existingImages = [] }: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      onImageSelect(imageUrl);
      setImageUrl('');
    }
  };

  // For now, we'll use URL input. In production, you'd integrate with Cloudinary/AWS S3
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Image URL
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342]"
          />
          <motion.button
            type="button"
            onClick={handleUrlSubmit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-[#485342] text-white rounded-lg font-semibold hover:bg-[#3a4235] transition-colors"
          >
            Add
          </motion.button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Enter an image URL. For production, integrate with Cloudinary or AWS S3 for direct uploads.
        </p>
      </div>

      {existingImages.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Existing Images
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {existingImages.map((url, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={url}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

