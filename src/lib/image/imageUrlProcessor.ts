
import { brandFallbacks, genericFallbacks, defaultPlaceholder, isValidUrl } from './fallbackStrategy';

/**
 * Processes and optimizes an image URL with fallback strategy
 */
export const processImageUrl = (
  url: string | undefined, 
  brandName?: string,
  attemptNumber: number = 0
): string => {
  // Log initial URL information for debugging
  console.log("Image processing - Input URL:", url);
  console.log("Image processing - Brand name:", brandName);
  
  // Handle undefined or null URLs immediately
  if (!url) {
    console.log("Image processing - URL is undefined or null");
    if (brandName && brandFallbacks[brandName]) {
      console.log("Image processing - Using brand fallback for undefined URL");
      return brandFallbacks[brandName];
    }
    console.log("Image processing - Using generic fallback for undefined URL");
    return genericFallbacks[0];
  }
  
  // For Lovable uploads, use them directly (already optimized)
  if (url.startsWith('/lovable-uploads')) {
    console.log("Image processing - Using Lovable upload path");
    return url;
  }
  
  // For other relative paths in public folder
  if (url.startsWith('./') || url.startsWith('/')) {
    // Make sure we're not dealing with a placeholder or undefined path
    if (url.includes('placeholder') || url.includes('undefined')) {
      console.log("Image processing - Relative path contains placeholder or undefined:", url);
      if (brandName && brandFallbacks[brandName]) {
        return brandFallbacks[brandName];
      }
      return genericFallbacks[0];
    }
    
    console.log("Image processing - Using relative URL");
    return url;
  }
  
  // Check if it's an imgur URL (which we know works well as CDN)
  if (url.includes('i.imgur.com')) {
    console.log("Image processing - Using imgur link directly");
    return url;
  }
  
  // Handle URL that should be absolute
  if (isValidUrl(url)) {
    console.log("Image processing - Using validated absolute URL");
    return url;
  }
  
  // By this point, we have an invalid URL - use fallbacks
  console.log("Image processing - URL is invalid, using fallbacks");
  
  // Brand-specific fallback
  if (brandName && brandFallbacks[brandName]) {
    console.log("Image processing - Falling back to brand image for:", brandName);
    return brandFallbacks[brandName];
  }
  
  // Generic product fallback based on attempt number
  if (attemptNumber < genericFallbacks.length) {
    console.log("Image processing - Using generic fallback image #", attemptNumber);
    return genericFallbacks[attemptNumber];
  }
  
  // Last resort - default placeholder
  console.log("Image processing - Using default placeholder");
  return defaultPlaceholder;
};
