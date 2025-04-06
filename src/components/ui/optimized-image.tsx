
import { useState, useEffect } from 'react';
import { useIsMobile, useBreakpoint } from '@/hooks/use-mobile';
import { processImageUrl, processImageUrlSync } from '@/lib/image/imageUrlProcessor';
import { extractBrandName } from '@/lib/image/fallbackStrategy';
import { validateImagePath, getResponsiveImageUrls } from '@/lib/image/imageValidator';

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
  loading?: 'lazy' | 'eager';
  quality?: number;
  responsive?: boolean;
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
  sizes = '(max-width: 320px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 50vw, 33vw',
  loading,
  quality = 80,
  responsive = true,
}: OptimizedImageProps) => {
  const [imgSrc, setImgSrc] = useState<string>(processImageUrlSync(src, extractBrandName(alt)));
  const [srcSet, setSrcSet] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [loadAttempts, setLoadAttempts] = useState<number>(0);
  const isMobile = useIsMobile();
  const breakpoint = useBreakpoint();
  
  // Process the image URL whenever the source changes
  useEffect(() => {
    const brandName = extractBrandName(alt);
    console.log("OptimizedImage - Source changed to:", src);
    
    // Use async process image
    const processImage = async () => {
      const optimizedUrl = await processImageUrl(src, brandName);
      console.log("OptimizedImage - Optimized to:", optimizedUrl);
      
      setImgSrc(optimizedUrl);
      
      // If responsive feature is turned on and it's not a fallback image
      if (responsive && !optimizedUrl.includes('placeholder') && !optimizedUrl.includes('imgur.com')) {
        try {
          // Generate responsive URLs
          const responsiveUrls = getResponsiveImageUrls(optimizedUrl);
          
          // Create srcSet for modern browsers
          const srcSetArray = Object.entries(responsiveUrls)
            .filter(([key]) => key.includes('webp') || key.includes('jpg'))
            .map(([key, url]) => {
              const width = key.split('_')[0].includes('sm') ? '320w' : 
                            key.split('_')[0].includes('md') ? '768w' : 
                            key.split('_')[0].includes('lg') ? '1024w' : 
                            key.split('_')[0].includes('xl') ? '1440w' : '1920w';
              return `${url} ${width}`;
            });
          
          if (srcSetArray.length > 0) {
            setSrcSet(srcSetArray.join(', '));
          }
        } catch (e) {
          console.error("Failed to generate responsive image URLs:", e);
        }
      }
      
      setLoading(true);
      setError(false);
      setLoadAttempts(0);
    };
    
    processImage();
  }, [src, alt, responsive]);

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
      setSrcSet(''); // Clear srcSet for fallback images
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
        maxWidth: '100%' 
      };
    }
    
    // For desktop, use the specified dimensions
    return { 
      width, 
      height 
    };
  };

  const responsiveDimensions = getResponsiveDimensions();
  
  // Determine appropriate loading attribute
  const imgLoading = loading || (priority ? 'eager' : 'lazy');

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
        srcSet={srcSet}
        sizes={sizes}
        alt={alt || "Product image"}
        width={width}
        height={height}
        onLoad={() => {
          console.log("OptimizedImage - Image loaded successfully:", imgSrc);
          setLoading(false);
        }}
        onError={handleError}
        className={`object-cover w-full h-full transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
        loading={imgLoading}
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
