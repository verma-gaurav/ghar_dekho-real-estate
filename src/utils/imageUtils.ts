/**
 * Utility functions for handling images in the application
 */

/**
 * Validates and processes image URLs for display
 * Returns a fallback image if the URL is invalid
 * 
 * @param url The URL or base64 string to process
 * @returns A safe URL that can be used in img tags
 */
export function getSafeImageUrl(url: string | undefined): string {
  if (!url || url.trim() === '') {
    return 'https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1000&auto=format&fit=crop';
  }

  // If it's already a remote URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If it's a base64 encoded image, return as is
  if (url.startsWith('data:image/')) {
    return url;
  }

  // If it's a Supabase storage URL (just the path), prepend the storage URL
  if (url.startsWith('properties/') || url.startsWith('users/')) {
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://xztmfmtyjtxzlqdmobpw.supabase.co';
    return `${SUPABASE_URL}/storage/v1/object/public/${url}`;
  }

  // If it's a relative URL, assume it's from the app's public folder
  if (url.startsWith('/')) {
    return url;
  }

  // For any other case, return a property placeholder
  return 'https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1000&auto=format&fit=crop';
}

/**
 * Checks if a URL is a valid image URL
 * 
 * @param url The URL to check
 * @returns True if the URL is a valid image URL, false otherwise
 */
export function isImageUrl(url: string | undefined): boolean {
  if (!url) return false;
  
  // Check if it's a proper URL (http, https, relative path, or base64)
  return (
    url.startsWith('http://') || 
    url.startsWith('https://') ||
    url.startsWith('/') ||
    url.startsWith('properties/') || 
    url.startsWith('users/') ||
    url.startsWith('data:image/')
  );
}

/**
 * Validates a file size
 * 
 * @param file File to validate
 * @param maxSizeMB Maximum size in MB
 * @returns True if the file is within the size limit, false otherwise
 */
export function isValidFileSize(file: File, maxSizeMB: number = 5): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
} 