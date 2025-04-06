
import { brandFallbacks, genericFallbacks, defaultPlaceholder, isValidUrl } from './fallbackStrategy';
import { validateImagePath, normalizePath, checkPublicImage } from './imageValidator';

/**
 * Processes and optimizes an image URL with fallback strategy
 */
export const processImageUrl = async (
  url: string | undefined, 
  brandName?: string,
  attemptNumber: number = 0
): Promise<string> => {
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
  
  // Normalize the URL (handling require() and import.meta.url)
  const normalizedUrl = normalizePath(url);
  
  // For Lovable uploads, use them directly (already optimized)
  if (normalizedUrl.startsWith('/lovable-uploads')) {
    console.log("Image processing - Using Lovable upload path");
    return normalizedUrl;
  }
  
  // For other relative paths in public folder
  if (normalizedUrl.startsWith('./') || normalizedUrl.startsWith('/')) {
    // Check if the public image exists
    const exists = await checkPublicImage(normalizedUrl);
    
    if (!exists) {
      console.log("Image processing - Public image doesn't exist:", normalizedUrl);
      if (brandName && brandFallbacks[brandName]) {
        return brandFallbacks[brandName];
      }
      return genericFallbacks[0];
    }
    
    // Make sure we're not dealing with a placeholder or undefined path
    if (normalizedUrl.includes('placeholder') || normalizedUrl.includes('undefined')) {
      console.log("Image processing - Relative path contains placeholder or undefined:", normalizedUrl);
      if (brandName && brandFallbacks[brandName]) {
        return brandFallbacks[brandName];
      }
      return genericFallbacks[0];
    }
    
    console.log("Image processing - Using validated relative URL");
    return normalizedUrl;
  }
  
  // Check if it's an imgur URL (which we know works well as CDN)
  if (normalizedUrl.includes('i.imgur.com')) {
    console.log("Image processing - Using imgur link directly");
    // Validate imgur image existence
    const isValid = await validateImagePath(normalizedUrl);
    if (isValid) {
      return normalizedUrl;
    } else {
      console.log("Image processing - Imgur image not valid, falling back");
    }
  }
  
  // Handle URL that should be absolute
  if (isValidUrl(normalizedUrl)) {
    // Validate absolute URL image existence
    const isValid = await validateImagePath(normalizedUrl);
    if (isValid) {
      console.log("Image processing - Using validated absolute URL");
      return normalizedUrl;
    }
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

// Creating a synchronous version for backward compatibility
export const processImageUrlSync = (
  url: string | undefined, 
  brandName?: string,
  attemptNumber: number = 0
): string => {
  // Similar logic but synchronous
  if (!url) {
    if (brandName && brandFallbacks[brandName]) {
      return brandFallbacks[brandName];
    }
    return genericFallbacks[0];
  }
  
  const normalizedUrl = normalizePath(url);
  
  if (normalizedUrl.startsWith('/lovable-uploads')) {
    return normalizedUrl;
  }
  
  if (normalizedUrl.startsWith('./') || normalizedUrl.startsWith('/')) {
    if (normalizedUrl.includes('placeholder') || normalizedUrl.includes('undefined')) {
      if (brandName && brandFallbacks[brandName]) {
        return brandFallbacks[brandName];
      }
      return genericFallbacks[0];
    }
    return normalizedUrl;
  }
  
  if (normalizedUrl.includes('i.imgur.com')) {
    return normalizedUrl;
  }
  
  if (isValidUrl(normalizedUrl)) {
    return normalizedUrl;
  }
  
  if (brandName && brandFallbacks[brandName]) {
    return brandFallbacks[brandName];
  }
  
  if (attemptNumber < genericFallbacks.length) {
    return genericFallbacks[attemptNumber];
  }
  
  return defaultPlaceholder;
};
