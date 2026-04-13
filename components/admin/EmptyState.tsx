'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon = '📭',
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-serif font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-center max-w-md mb-6">{description}</p>
      {(actionLabel && (actionHref || onAction)) && (
        actionHref ? (
          <Link
            href={actionHref}
            className="px-6 py-3 bg-[#485342] text-white rounded-lg font-semibold hover:bg-[#3a4235] transition-colors"
          >
            {actionLabel}
          </Link>
        ) : (
          <motion.button
            onClick={onAction}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-[#485342] text-white rounded-lg font-semibold hover:bg-[#3a4235] transition-colors"
          >
            {actionLabel}
          </motion.button>
        )
      )}
    </motion.div>
  );
}

