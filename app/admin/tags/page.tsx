'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import SearchBar from '@/components/admin/SearchBar';
import Pagination from '@/components/admin/Pagination';
import EmptyState from '@/components/admin/EmptyState';

interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    color: '',
  });

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = () => {
    fetch('/api/admin/tags')
      .then((res) => res.json())
      .then((data) => {
        setTags(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load tags');
        setLoading(false);
      });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingTag ? `/api/admin/tags/${editingTag.id}` : '/api/admin/tags';
    const method = editingTag ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(editingTag ? 'Tag updated!' : 'Tag created!');
        setShowForm(false);
        setEditingTag(null);
        setFormData({ name: '', slug: '', color: '' });
        fetchTags();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to save tag');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      slug: tag.slug,
      color: tag.color || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tag?')) return;

    try {
      const res = await fetch(`/api/admin/tags/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Tag deleted');
        fetchTags();
      } else {
        toast.error('Failed to delete tag');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const filteredTags = useMemo(() => {
    if (!searchQuery) return tags;
    const query = searchQuery.toLowerCase();
    return tags.filter(
      (tag) =>
        tag.name.toLowerCase().includes(query) ||
        tag.slug.toLowerCase().includes(query)
    );
  }, [tags, searchQuery]);

  const totalPages = Math.ceil(filteredTags.length / itemsPerPage);
  const paginatedTags = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTags.slice(start, start + itemsPerPage);
  }, [filteredTags, currentPage]);

  if (loading) {
    return (
      <div className="pt-16">
        <div className="text-center py-12">
          <div className="inline-block w-16 h-16 border-4 border-[#485342] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading tags...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">Tags</h1>
          <p className="text-gray-600">Manage blog post and package tags</p>
        </div>
        <div className="flex items-center gap-4">
          <SearchBar
            placeholder="Search tags..."
            onSearch={setSearchQuery}
            className="w-full md:w-64"
          />
          <motion.button
            onClick={() => {
              setShowForm(!showForm);
              setEditingTag(null);
              setFormData({ name: '', slug: '', color: '' });
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-[#485342] text-white rounded-lg font-semibold hover:bg-[#3a4235] transition-colors shadow-md"
          >
            + New Tag
          </motion.button>
        </div>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 card-shadow mb-8"
        >
          <h2 className="text-xl font-serif font-bold text-gray-800 mb-6">
            {editingTag ? 'Edit Tag' : 'Create New Tag'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tag Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    name: e.target.value,
                    slug: generateSlug(e.target.value),
                  });
                }}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Color (Hex Code)</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="#485342"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342]"
              />
            </div>
            <div className="flex items-center gap-4">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-[#485342] text-white rounded-lg font-semibold hover:bg-[#3a4235] transition-colors button-shadow"
              >
                {editingTag ? 'Update Tag' : 'Create Tag'}
              </motion.button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingTag(null);
                  setFormData({ name: '', slug: '', color: '' });
                }}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {filteredTags.length === 0 && !showForm && (
        <EmptyState
          title="No tags found"
          description="Looks like there are no tags matching your criteria. Try adjusting your search or create a new tag."
          actionLabel="Create New Tag"
          onAction={() => {
            setShowForm(true);
            setEditingTag(null);
            setFormData({ name: '', slug: '', color: '' });
          }}
        />
      )}

      {filteredTags.length > 0 && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Color</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedTags.map((tag, index) => (
                <motion.tr
                  key={tag.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-800">{tag.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{tag.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {tag.color ? (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span className="text-sm text-gray-600">{tag.color}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => handleEdit(tag)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(tag.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                      >
                        Delete
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          </div>
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

