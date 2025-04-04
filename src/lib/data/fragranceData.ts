
export type NoteCategory = 'top' | 'middle' | 'base';

export interface FragranceNote {
  name: string;
  category: NoteCategory;
}

export interface Fragrance {
  id: number;
  name: string;
  brand: string;
  description: string;
  notes: FragranceNote[];
  imageUrl: string;
  price: number;
  gender: 'masculine' | 'feminine' | 'unisex';
  categories: string[];
  occasions: string[];
  seasons: string[];
  intensity: number;
  rating: number;
  launchYear?: number;
}

// Sample fragrance data for development purposes
export const fragrances: Fragrance[] = [
  {
    id: 1,
    name: "Bergamot Bliss",
    brand: "Aromatic Elegance",
    description: "A fresh, citrusy scent with hints of spice and wood. Perfect for everyday wear.",
    notes: [
      { name: "Bergamot", category: 'top' },
      { name: "Cardamom", category: 'top' },
      { name: "Lavender", category: 'middle' },
      { name: "Cedar", category: 'base' },
      { name: "Vetiver", category: 'base' },
    ],
    imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    price: 85,
    gender: 'unisex',
    categories: ["Fresh", "Citrus", "Woody"],
    occasions: ["Everyday", "Work", "Outdoor Activities"],
    seasons: ["Spring", "Summer"],
    intensity: 6,
    rating: 4.5,
    launchYear: 2021
  },
  {
    id: 2,
    name: "Velvet Noir",
    brand: "Midnight Collection",
    description: "A deep, sensual fragrance with vanilla and amber notes. Ideal for evening occasions.",
    notes: [
      { name: "Black Pepper", category: 'top' },
      { name: "Saffron", category: 'top' },
      { name: "Rose", category: 'middle' },
      { name: "Amber", category: 'base' },
      { name: "Vanilla", category: 'base' },
      { name: "Musk", category: 'base' },
    ],
    imageUrl: "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    price: 120,
    gender: 'unisex',
    categories: ["Oriental", "Gourmand", "Spicy"],
    occasions: ["Evening Out", "Date Night", "Special Occasion"],
    seasons: ["Fall", "Winter"],
    intensity: 8,
    rating: 4.8
  },
  {
    id: 3,
    name: "Lavender Fields",
    brand: "Provincial Scents",
    description: "A calming aromatic fragrance with lavender and herbal notes. Great for relaxation and everyday wear.",
    notes: [
      { name: "Lavender", category: 'top' },
      { name: "Bergamot", category: 'top' },
      { name: "Sage", category: 'middle' },
      { name: "Geranium", category: 'middle' },
      { name: "Tonka Bean", category: 'base' },
      { name: "Sandalwood", category: 'base' },
    ],
    imageUrl: "https://images.unsplash.com/photo-1610461888750-10bfc601b874?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    price: 65,
    gender: 'feminine',
    categories: ["Aromatic", "Fresh", "Herbal"],
    occasions: ["Everyday", "Relaxation", "Work"],
    seasons: ["Spring", "Summer"],
    intensity: 4,
    rating: 4.3,
    launchYear: 2019
  }
];
