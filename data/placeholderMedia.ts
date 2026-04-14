/**
 * Placeholder images for seed / mock data. Replace in admin (featured image, gallery, avatars)
 * after uploading real photos to Storage or pasting CDN URLs.
 *
 * Uses placehold.co — neutral slate tones matching site green (#485342 family).
 */
function enc(s: string) {
  return encodeURIComponent(s.slice(0, 80));
}

/** Wide hero / featured (blog, packages). */
export function phWide(label: string) {
  return `https://placehold.co/1920x1080/3a4235/c5cbb8/png?font=montserrat&text=${enc(label)}`;
}

/** Gallery tile. */
export function phGallery(label: string) {
  return `https://placehold.co/1200x800/485342/dbe2dd/png?font=montserrat&text=${enc(label)}`;
}

/** Small avatar (authors, reviews). */
export function phAvatar(label: string) {
  return `https://placehold.co/256x256/485342/ffffff/png?font=montserrat&text=${enc(label)}`;
}
