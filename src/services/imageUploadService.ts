/**
 * Image URL validation service
 * This replaces the previous image upload functionality
 */

/**
 * Validates a URL to ensure it's a valid image URL
 * @param url The URL to validate
 * @returns True if the URL is a valid image URL, false otherwise
 */
export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  
  // Check if it's a proper URL format
  try {
    new URL(url);
  } catch (e) {
    return false;
  }
  
  // Check if it starts with http or https
  return url.startsWith('http://') || url.startsWith('https://');
};

/**
 * Validates an array of image URLs
 * @param urls Array of URLs to validate
 * @returns Array of valid image URLs (filters out invalid ones)
 */
export const validateImageUrls = (urls: string[]): string[] => {
  if (!urls || urls.length === 0) return [];
  
  return urls.filter(url => isValidImageUrl(url));
}; 