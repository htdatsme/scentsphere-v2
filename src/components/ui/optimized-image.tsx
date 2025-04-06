
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { processImageUrl, processImageUrlSync } from '@/lib/image/imageUrlProcessor';
import { extractBrandName } from '@/lib/image/fallbackStrategy';
import { validateImagePath } from '@/lib/image/imageValidator';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  brandFallback?: string;
  placeholder?: string;
  priority?: boolean;
  sizes?: string;
}

export const OptimizedImage = ({
  src,
  alt,
  width = 400,
  height = 400,
  className = '',
  brandFallback,
  placeholder = '/placeholder.svg',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
}: OptimizedImageProps) => {
  const [imgSrc, setImgSrc] = useState<string>(processImageUrlSync(src, extractBrandName(alt)));
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [loadAttempts, setLoadAttempts] = useState<number>(0);
  const isMobile = useIsMobile();
  
  // Process the image URL whenever the source changes
  useEffect(() => {
    const brandName = extractBrandName(alt);
    console.log("OptimizedImage - Source changed to:", src);
    
    // Use async process image
    const processImage = async () => {
      const optimizedUrl = await processImageUrl(src, brandName);
      console.log("OptimizedImage - Optimized to:", optimizedUrl);
      
      setImgSrc(optimizedUrl);
      setLoading(true);
      setError(false);
      setLoadAttempts(0);
    };
    
    processImage();
  }, [src, alt]);

  // Handle image loading error with progressive fallback strategy
  const handleError = async () => {
    console.error("OptimizedImage - Error loading image:", imgSrc);
    setError(true);
    
    // Increment attempt counter
    const newAttempt = loadAttempts + 1;
    setLoadAttempts(newAttempt);
    
    // Extract brand name from alt text if available
    const brandName = extractBrandName(alt);
    
    // Get next fallback in the hierarchy
    const nextFallback = await processImageUrl(src, brandName, newAttempt);
    
    // Only update if we have a different URL to try
    if (nextFallback !== imgSrc) {
      console.log("OptimizedImage - Trying next fallback:", nextFallback);
      setImgSrc(nextFallback);
    } else {
      console.log("OptimizedImage - No more fallbacks available");
    }
  };

  // Calculate responsive dimensions based on screen size
  const getResponsiveDimensions = () => {
    if (isMobile === undefined) {
      // Default while loading
      return { 
        width: '100%', 
        height: 'auto',
        maxWidth: width 
      };
    }
    
    if (isMobile) {
      // On mobile, images can take up to 100% width
      return { 
        width: '100%', 
        height: 'auto',
        maxWidth: width 
      };
    }
    return { 
      width, 
      height 
    };
  };

  const responsiveDimensions = getResponsiveDimensions();

  return (
    <div 
      className={`relative overflow-hidden ${className}`} 
      style={responsiveDimensions}
      data-testid="optimized-image-container"
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30 backdrop-blur-sm animate-pulse">
          <span className="sr-only">Loading...</span>
        </div>
      )}
      
      <img
        src={imgSrc}
        alt={alt || "Product image"}
        width={width}
        height={height}
        onLoad={() => {
          console.log("OptimizedImage - Image loaded successfully:", imgSrc);
          setLoading(false);
        }}
        onError={handleError}
        className={`object-cover w-full h-full transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
        loading={priority ? 'eager' : 'lazy'}
        sizes={sizes}
        data-testid="optimized-image"
      />
      
      {error && loadAttempts > 2 && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 text-center">
          {alt?.split(' - ')[1] || alt || "Image failed to load"}
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
