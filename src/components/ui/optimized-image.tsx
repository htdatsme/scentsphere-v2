
import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  brandFallback?: string;
  placeholder?: string;
  priority?: boolean;
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
}: OptimizedImageProps) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // Generate optimized URL if it's a direct image URL
  const getOptimizedUrl = (url: string) => {
    // Fix broken image URLs that might be using incorrect placeholders
    if (url.includes('unsplash.com') && (url.includes('placeholder') || url.endsWith('undefined'))) {
      return `/lovable-uploads/682b0349-496e-4ebb-b8a6-f92faa47d542.png`;
    }
    
    // Check if it's a relative path starting with /lovable-uploads
    if (url.startsWith('/lovable-uploads')) {
      return url;
    }
    
    // Check if it's a valid URL
    try {
      new URL(url);
      return url;
    } catch (e) {
      // If not a valid URL, try to use the fallback
      if (brandFallback) return brandFallback;
      return placeholder;
    }
  };

  useEffect(() => {
    setImgSrc(getOptimizedUrl(src));
    setLoading(true);
    setError(false);
  }, [src]);

  const handleError = () => {
    setError(true);
    
    // Try brand fallback first
    if (brandFallback && imgSrc !== brandFallback) {
      setImgSrc(getOptimizedUrl(brandFallback));
    } 
    // Then try placeholder
    else if (imgSrc !== placeholder && placeholder) {
      setImgSrc(placeholder);
    }
    // Last resort - use uploaded image
    else {
      setImgSrc('/lovable-uploads/682b0349-496e-4ebb-b8a6-f92faa47d542.png');
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30 backdrop-blur-sm animate-pulse">
          <span className="sr-only">Loading...</span>
        </div>
      )}
      
      <img
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        onLoad={() => setLoading(false)}
        onError={handleError}
        className={`object-cover w-full h-full transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
};

export default OptimizedImage;
