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
    'Carolina Herrera': 'https://i.imgur.com/n4tyvnt.jpg'
  };

  const getOptimizedUrl = (url: string, brandName?: string) => {
    if (url === brandFallback && brandFallback) {
      return brandFallback;
    }
    
    if (url.startsWith('/lovable-uploads')) {
      return url;
    }
    
    if ((url.includes('placeholder') || url.endsWith('undefined') || 
        url.includes('user-uploaded') || !url || url === '/') && brandName) {
      return brandFallbacks[brandName] || 'https://i.imgur.com/VYcN5jR.jpg';
    }
    
    if (url.includes('i.imgur.com')) {
      return url;
    }
    
    try {
      new URL(url);
      return url;
    } catch (e) {
      if (brandName && brandFallbacks[brandName]) {
        return brandFallbacks[brandName];
      }
      
      return placeholder;
    }
  };

  useEffect(() => {
    const brandName = alt.split(' - ')[0] || undefined;
    
    setImgSrc(getOptimizedUrl(src, brandName));
    setLoading(true);
    setError(false);
  }, [src, alt]);

  const handleError = () => {
    setError(true);
    
    const brandName = alt.split(' - ')[0] || undefined;
    
    if (brandName && brandFallbacks[brandName]) {
      setImgSrc(brandFallbacks[brandName]);
    } 
    else if (brandFallback && imgSrc !== brandFallback) {
      setImgSrc(brandFallback);
    } 
    else if (imgSrc !== placeholder && placeholder) {
      setImgSrc(placeholder);
    }
    else {
      setImgSrc('https://i.imgur.com/VYcN5jR.jpg');
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
