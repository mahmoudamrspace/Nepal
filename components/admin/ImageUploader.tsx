'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface ImageUploaderProps {
  onImageSelect: (url: string) => void;
  existingImages?: string[];
}

export default function ImageUploader({ onImageSelect, existingImages = [] }: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      onImageSelect(imageUrl.trim());
      setImageUrl('');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: form,
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || 'Upload failed');
        return;
      }
      if (data.url) {
        onImageSelect(data.url);
        toast.success('Image uploaded');
      }
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Upload image</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
        />
        <motion.button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          whileHover={{ scale: uploading ? 1 : 1.02 }}
          whileTap={{ scale: uploading ? 1 : 0.98 }}
          className="w-full px-4 py-3 border-2 border-dashed border-[#485342]/40 rounded-lg text-[#485342] font-medium hover:bg-[#485342]/5 transition-colors disabled:opacity-50"
        >
          {uploading ? 'Uploading…' : 'Choose file (JPEG, PNG, WebP, GIF — max 5MB)'}
        </motion.button>
        <p className="text-xs text-gray-500 mt-2">
          Files are stored in your Supabase Storage <code className="font-mono">media</code> bucket.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Or paste image URL</label>
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
      </div>

      {existingImages.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Existing Images</label>
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
