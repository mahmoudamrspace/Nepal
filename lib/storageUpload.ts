export const STORAGE_UPLOAD_MODULES = [
  'packages',
  'blog',
  'reviews',
  'authors',
  'general',
] as const;

export type StorageUploadModule = (typeof STORAGE_UPLOAD_MODULES)[number];

const ALLOWED_SET = new Set<string>(STORAGE_UPLOAD_MODULES);

/** Safe segment: lowercase letters, numbers, hyphen, underscore only. */
const SAFE_SEGMENT = /^[a-z0-9_-]+$/;

/**
 * Resolves FormData / client `module` to a storage folder name.
 * Invalid or missing values default to `general`.
 */
export function parseStorageModule(raw: unknown): StorageUploadModule {
  if (raw == null) return 'general';
  const s = String(raw).trim().toLowerCase();
  if (!s || s.includes('/') || s.includes('\\') || s.includes('..')) {
    return 'general';
  }
  if (!SAFE_SEGMENT.test(s)) return 'general';
  if (!ALLOWED_SET.has(s)) return 'general';
  return s as StorageUploadModule;
}
