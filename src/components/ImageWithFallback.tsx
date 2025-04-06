
import OptimizedImage from '@/components/ui/optimized-image';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  brandName?: string;
  responsive?: boolean;
  sizes?: string;
  priority?: boolean;
}

/**
 * Image component that showcases the proper implementation of fallback strategy
 * with responsive image support for better mobile performance
 */
const ImageWithFallback = ({
  src,
  alt,
  width = 400,
  height = 400,
  className = '',
  brandName,
  responsive = true,
  sizes,
  priority = false
}: ImageWithFallbackProps) => {
  // Construct full alt text with brand name for better fallback support
  const fullAlt = brandName ? `${brandName} - ${alt}` : alt;
  
  // Default responsive sizes based on common breakpoints
  const defaultSizes = '(max-width: 320px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 50vw, 33vw';
  
  return (
    <OptimizedImage
      src={src}
      alt={fullAlt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      responsive={responsive}
      sizes={sizes || defaultSizes}
    />
  );
};

export default ImageWithFallback;
