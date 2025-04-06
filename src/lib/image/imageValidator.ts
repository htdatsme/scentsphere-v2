
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
    if (normalizedPath && normalizedPath.startsWith('http')) {
      img.crossOrigin = 'anonymous';
    }
    
    img.src = normalizedPath || '';
  });
};

/**
 * Normalizes different path formats to a standard URL
 */
export const normalizePath = (path: string | null | undefined): string => {
  // Handle null or undefined paths
  if (path === null || path === undefined) {
    return '';
  }
  
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

/**
 * Gets the responsive image URLs for different screen sizes
 * @param basePath Base path for the image
 * @param formats Additional formats like webp
 * @returns Object with urls for different screen sizes
 */
export const getResponsiveImageUrls = (
  basePath: string,
  formats: string[] = ['jpg', 'webp']
): Record<string, string> => {
  // If basePath is empty or invalid, return empty object
  if (!basePath) return {};
  
  // Extract file name without extension
  const basePathWithoutExt = basePath.replace(/\.[^/.]+$/, '');
  const result: Record<string, string> = {};
  
  // Common screen breakpoints
  const sizes = {
    sm: '320w',   // Small mobile
    md: '768w',   // Mobile
    lg: '1024w',  // Tablet
    xl: '1440w',  // Desktop
    '2xl': '1920w', // Large desktop
  };
  
  // Generate paths for each size and format
  Object.entries(sizes).forEach(([size, width]) => {
    formats.forEach(format => {
      // For example: path/image-320w.webp
      const key = `${size}_${format}`;
      result[key] = `${basePathWithoutExt}-${width}.${format}`;
    });
  });
  
  return result;
};
