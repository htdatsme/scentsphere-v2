
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [loadAttempts, setLoadAttempts] = useState<number>(0);
  const isMobile = useIsMobile();

  // Enhanced brand fallback database with high-quality images
  const brandFallbacks: Record<string, string> = {
    'Le Labo': 'https://i.imgur.com/gXuZmh6.jpg',
    'Creed': 'https://i.imgur.com/jSsGtAs.jpg',
    'Maison Francis Kurkdjian': 'https://i.imgur.com/QVKzs0R.jpg',
    'Chanel': 'https://i.imgur.com/e6FpB9s.jpg',
    'Tom Ford': 'https://i.imgur.com/OfJ5VXo.jpg',
    'Dolce & Gabbana': 'https://i.imgur.com/VYcN5jR.jpg',
    'Dior': 'https://i.imgur.com/hzpYNBk.jpg',
    'Giorgio Armani': 'https://i.imgur.com/VYcN5jR.jpg',
    'Lancôme': 'https://i.imgur.com/zMV5AaD.jpg',
    'Hermès': 'https://i.imgur.com/O7kogyb.jpg',
    'Byredo': 'https://i.imgur.com/m6Xtxel.jpg',
    'Frederic Malle': 'https://i.imgur.com/bLr2Pmt.jpg',
    'Escentric Molecules': 'https://i.imgur.com/zCLm56p.jpg',
    'Viktor&Rolf': 'https://i.imgur.com/bfbELAI.jpg',
    'Carolina Herrera': 'https://i.imgur.com/n4tyvnt.jpg',
    'Yves Saint Laurent': 'https://i.imgur.com/1RLWBaB.jpg',
    'Jo Malone': 'https://i.imgur.com/4uSfuOB.jpg',
    'Guerlain': 'https://i.imgur.com/FVAVBz2.jpg',
    'Diptyque': 'https://i.imgur.com/1oCK6vE.jpg',
    'Parfums de Marly': 'https://i.imgur.com/K1IG8eW.jpg',
    'Xerjoff': 'https://i.imgur.com/5KQiIQi.jpg',
    'Amouage': 'https://i.imgur.com/gjP1YYV.jpg',
    'Penhaligon\'s': 'https://i.imgur.com/QN1FgCQ.jpg',
    'Acqua di Parma': 'https://i.imgur.com/wFd3kgW.jpg',
    'Serge Lutens': 'https://i.imgur.com/QVz0ApU.jpg',
    'Memo Paris': 'https://i.imgur.com/KmSR3NF.jpg',
    'Clive Christian': 'https://i.imgur.com/bTBkf6i.jpg',
    'Bond No. 9': 'https://i.imgur.com/O2g54tw.jpg',
    'Kilian': 'https://i.imgur.com/lYtl0EG.jpg',
    'Tiziana Terenzi': 'https://i.imgur.com/H1gffY3.jpg',
    'Atelier Cologne': 'https://i.imgur.com/iRDx2Zl.jpg',
    'Louis Vuitton': 'https://i.imgur.com/MmC4qLR.jpg',
    'Mancera': 'https://i.imgur.com/hBGMTy6.jpg',
    'Montale': 'https://i.imgur.com/e0eKsD7.jpg',
    'Nishane': 'https://i.imgur.com/sJznUqH.jpg'
  };

  // Generic high-quality fragrance bottle fallbacks
  const genericFallbacks = [
    'https://i.imgur.com/Py9i90Y.jpg', // Elegant perfume bottle
    'https://i.imgur.com/ZbxZNbw.jpg', // Premium fragrance bottle
    'https://i.imgur.com/RLeMCsa.jpg', // Luxury perfume bottle
    'https://i.imgur.com/MaV0jDj.jpg', // Sophisticated cologne bottle
    'https://i.imgur.com/VXrx0LU.jpg'  // Minimalist fragrance bottle
  ];

  // Validate URL function
  const isValidUrl = (urlString: string): boolean => {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Enhanced image URL processing with robust fallback strategy
  const getOptimizedUrl = (url: string, brandName?: string) => {
    // Critical debug console logs
    console.log("IMAGE DEBUG - Processing URL:", url);
    console.log("IMAGE DEBUG - Brand name:", brandName);
    console.log("IMAGE DEBUG - Is valid URL:", isValidUrl(url));
    
    // Handle undefined or null URLs immediately
    if (!url) {
      console.log("IMAGE DEBUG - URL is undefined or null");
      if (brandName && brandFallbacks[brandName]) {
        console.log("IMAGE DEBUG - Using brand fallback for undefined URL:", brandFallbacks[brandName]);
        return brandFallbacks[brandName];
      }
      console.log("IMAGE DEBUG - Using generic fallback for undefined URL");
      return genericFallbacks[0];
    }
    
    // For Lovable uploads, use them directly
    if (url.startsWith('/lovable-uploads')) {
      console.log("IMAGE DEBUG - Using Lovable upload path:", url);
      return url;
    }
    
    // For relative paths
    if (url.startsWith('./') || url.startsWith('/')) {
      // Make sure we're not dealing with a placeholder or undefined path
      if (url.includes('placeholder') || url.includes('undefined')) {
        console.log("IMAGE DEBUG - Relative path contains placeholder or undefined:", url);
        if (brandName && brandFallbacks[brandName]) {
          return brandFallbacks[brandName];
        }
        return genericFallbacks[0];
      }
      
      console.log("IMAGE DEBUG - Using relative URL:", url);
      return url;
    }
    
    // Check if it's an imgur URL (which we know works)
    if (url.includes('i.imgur.com')) {
      console.log("IMAGE DEBUG - Using imgur link directly:", url);
      return url;
    }
    
    // Handle URL that should be absolute
    if (isValidUrl(url)) {
      console.log("IMAGE DEBUG - Using validated absolute URL:", url);
      return url;
    }
    
    // By this point, we have an invalid URL - use fallbacks
    console.log("IMAGE DEBUG - URL is invalid, using fallbacks");
    
    // Brand-specific fallback
    if (brandName && brandFallbacks[brandName]) {
      console.log("IMAGE DEBUG - Falling back to brand image for:", brandName);
      return brandFallbacks[brandName];
    }
    
    // Generic product fallback
    if (loadAttempts < genericFallbacks.length) {
      console.log("IMAGE DEBUG - Using generic fallback image #", loadAttempts);
      return genericFallbacks[loadAttempts % genericFallbacks.length];
    }
    
    // Last resort - default placeholder
    console.log("IMAGE DEBUG - Using default placeholder");
    return placeholder;
  };

  useEffect(() => {
    const brandName = alt?.split(' - ')[0] || undefined;
    
    // Reset state when src changes
    console.log("IMAGE DEBUG - Source changed to:", src);
    const optimizedUrl = getOptimizedUrl(src, brandName);
    console.log("IMAGE DEBUG - Optimized to:", optimizedUrl);
    
    setImgSrc(optimizedUrl);
    setLoading(true);
    setError(false);
    setLoadAttempts(0);
  }, [src, alt]);

  const handleError = () => {
    console.log("IMAGE DEBUG - Error loading image:", imgSrc);
    setError(true);
    setLoadAttempts(prev => prev + 1);
    
    const brandName = alt?.split(' - ')[0] || undefined;
    console.log("IMAGE DEBUG - Load attempts:", loadAttempts + 1);
    
    // Progressive fallback strategy
    if (brandName && brandFallbacks[brandName] && imgSrc !== brandFallbacks[brandName]) {
      // Try brand-specific fallback first
      console.log("IMAGE DEBUG - Trying brand fallback for:", brandName);
      setImgSrc(brandFallbacks[brandName]);
    } 
    else if (brandFallback && imgSrc !== brandFallback) {
      // Try provided fallback next
      console.log("IMAGE DEBUG - Trying provided fallback:", brandFallback);
      setImgSrc(brandFallback);
    } 
    else if (loadAttempts < genericFallbacks.length) {
      // Try generic fallbacks in sequence
      const fallbackUrl = genericFallbacks[loadAttempts % genericFallbacks.length];
      console.log("IMAGE DEBUG - Trying generic fallback:", fallbackUrl);
      setImgSrc(fallbackUrl);
    }
    else if (imgSrc !== placeholder && placeholder) {
      // Fall back to placeholder
      console.log("IMAGE DEBUG - Falling back to placeholder");
      setImgSrc(placeholder);
    }
    else {
      // Absolute last resort fallback
      console.log("IMAGE DEBUG - Last resort fallback");
      setImgSrc('https://i.imgur.com/VYcN5jR.jpg');
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
          console.log("IMAGE DEBUG - Image loaded successfully:", imgSrc);
          setLoading(false);
        }}
        onError={handleError}
        className={`object-cover w-full h-full transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
        loading={priority ? 'eager' : 'lazy'}
        sizes={sizes}
        data-testid="optimized-image"
      />
      
      {error && loadAttempts > genericFallbacks.length && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 text-center">
          {alt?.split(' - ')[1] || alt || "Image failed to load"}
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
