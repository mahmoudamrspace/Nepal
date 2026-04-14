/**
 * Generic placeholder images when you need a labeled stub (no stock photo).
 * For curated Nepal travel seed imagery, use `@/data/seedMedia` instead.
 *
 * Uses plain placehold.co paths (no `?text=` / `&` query) so URLs stay compatible
 * with Vercel `next/image` optimization. `label` is for call-site documentation only.
 */
/** Wide hero / featured (blog, packages). */
export function phWide(_label: string) {
  return 'https://placehold.co/1920x1080/3a4235/c5cbb8/png';
}

/** Gallery tile. */
export function phGallery(_label: string) {
  return 'https://placehold.co/1200x800/485342/dbe2dd/png';
}

/** Small avatar (authors, reviews). */
export function phAvatar(_label: string) {
  return 'https://placehold.co/256x256/485342/ffffff/png';
}
