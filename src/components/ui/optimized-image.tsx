
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

  // Generate optimized Cloudinary URL if it's a Cloudinary image
  const getOptimizedUrl = (url: string) => {
    if (url.includes('cloudinary.com')) {
      // Extract the base URL and transformation parts
      const urlParts = url.split('/upload/');
      if (urlParts.length === 2) {
        // Add auto format and quality transformations
        return `${urlParts[0]}/upload/c_scale,w_${width},q_auto,f_auto/${urlParts[1]}`;
      }
    }
    return url;
  };

  useEffect(() => {
    setImgSrc(getOptimizedUrl(src));
  }, [src, width]);

  const handleError = () => {
    setError(true);
    
    // Try brand fallback first
    if (brandFallback && imgSrc !== brandFallback) {
      setImgSrc(getOptimizedUrl(brandFallback));
    } 
    // Then placeholder
    else if (imgSrc !== placeholder) {
      setImgSrc(placeholder);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
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
