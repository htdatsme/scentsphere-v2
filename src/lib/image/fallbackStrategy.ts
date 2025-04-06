
// Define fallback image collections based on known brands
export const brandFallbacks: Record<string, string> = {
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

// Generic high-quality fallbacks for when brand-specific ones aren't available
export const genericFallbacks = [
  'https://i.imgur.com/Py9i90Y.jpg', // Elegant perfume bottle
  'https://i.imgur.com/ZbxZNbw.jpg', // Premium fragrance bottle
  'https://i.imgur.com/RLeMCsa.jpg', // Luxury perfume bottle
  'https://i.imgur.com/MaV0jDj.jpg', // Sophisticated cologne bottle
  'https://i.imgur.com/VXrx0LU.jpg'  // Minimalist fragrance bottle
];

// Default placeholder image - final fallback
export const defaultPlaceholder = '/placeholder.svg';

// Validate if a string is a valid URL
export const isValidUrl = (urlString: string): boolean => {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

// Extract brand name from image alt text if possible
export const extractBrandName = (alt: string): string | undefined => {
  if (!alt) return undefined;
  
  // Pattern: "Brand - Product"
  const brandParts = alt.split(' - ');
  if (brandParts.length > 1) {
    return brandParts[0];
  }
  
  return undefined;
};
