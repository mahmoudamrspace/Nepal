/**
 * Utility functions for image optimization
 */

/**
 * Generate a blur placeholder data URL
 * This is a tiny 1x1 pixel image that can be used as a placeholder
 */
export function getBlurDataURL(): string {
  return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';
}

/**
 * Get appropriate sizes prop for Image component based on breakpoints
 */
export function getImageSizes(breakpoints: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
  large?: string;
}): string {
  const { mobile = '100vw', tablet = '50vw', desktop = '33vw', large = '33vw' } = breakpoints;
  return `(max-width: 640px) ${mobile}, (max-width: 1024px) ${tablet}, (max-width: 1280px) ${desktop}, ${large}`;
}

