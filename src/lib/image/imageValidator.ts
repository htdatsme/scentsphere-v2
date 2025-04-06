
/**
 * Utility to validate image paths and check for their existence
 */

// Keep track of validated images for performance
const validatedImageCache = new Map<string, boolean>();

/**
 * Validates if an image exists by attempting to load it
 * @param path Image path to validate
 * @returns Promise that resolves to boolean indicating if image exists
 */
export const validateImagePath = async (path: string): Promise<boolean> => {
  // Return from cache if already validated
  if (validatedImageCache.has(path)) {
    return validatedImageCache.get(path) || false;
  }
  
  // Handle different path formats
  const normalizedPath = normalizePath(path);
  
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      validatedImageCache.set(path, true);
      resolve(true);
    };
    
    img.onerror = () => {
      validatedImageCache.set(path, false);
      resolve(false);
    };
    
    // Set crossOrigin for CORS images
    if (normalizedPath.startsWith('http')) {
      img.crossOrigin = 'anonymous';
    }
    
    img.src = normalizedPath;
  });
};

/**
 * Normalizes different path formats to a standard URL
 */
export const normalizePath = (path: string): string => {
  // Handle require() format
  if (typeof path === 'object' && path !== null && 'default' in path) {
    return path.default;
  }
  
  // Handle import.meta.url format
  if (path.includes('import.meta.url')) {
    try {
      // Extract the URL part
      const urlMatch = path.match(/new URL\(['"](.+?)['"], import\.meta\.url\)/);
      if (urlMatch && urlMatch[1]) {
        // Convert relative path to absolute path based on current URL
        const baseUrl = window.location.origin;
        return new URL(urlMatch[1], baseUrl).toString();
      }
    } catch (error) {
      console.error("Failed to process import.meta.url path:", error);
    }
  }
  
  // Return the original path for standard strings
  return path;
};

/**
 * Checks if an image at the given path exists in public directory
 * @param path Relative path from public directory
 */
export const checkPublicImage = async (path: string): Promise<boolean> => {
  if (!path) return false;
  
  // Ensure path starts with / for public directory
  const publicPath = path.startsWith('/') ? path : `/${path}`;
  
  try {
    // Use fetch API to check if file exists
    const response = await fetch(publicPath, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error("Error checking public image:", error);
    return false;
  }
};

/**
 * Gets the most likely valid path from a set of possible paths
 * @param paths Array of possible image paths to check
 * @returns The first valid path or undefined if none are valid
 */
export const getFirstValidPath = async (paths: string[]): Promise<string | undefined> => {
  for (const path of paths) {
    if (await validateImagePath(path)) {
      return path;
    }
  }
  return undefined;
};
