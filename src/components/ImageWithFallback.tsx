
import OptimizedImage from '@/components/ui/optimized-image';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  brandName?: string;
}

/**
 * Image component that showcases the proper implementation of fallback strategy
 */
const ImageWithFallback = ({
  src,
  alt,
  width = 400,
  height = 400,
  className = '',
  brandName
}: ImageWithFallbackProps) => {
  // Construct full alt text with brand name for better fallback support
  const fullAlt = brandName ? `${brandName} - ${alt}` : alt;
  
  return (
    <OptimizedImage
      src={src}
      alt={fullAlt}
      width={width}
      height={height}
      className={className}
      priority={false}
    />
  );
};

export default ImageWithFallback;
