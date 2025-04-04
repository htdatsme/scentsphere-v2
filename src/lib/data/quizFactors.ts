
import { QuizFactor } from "@/types/quiz";

export const quizFactors: QuizFactor[] = [
  {
    id: 'season',
    title: 'Seasonal Preference',
    description: 'In which season do you plan to wear this fragrance most often?',
    weight: 0.25,
    options: [
      {
        value: 'spring',
        label: 'Spring',
        note_affinities: [
          { note: 'Floral', strength: 0.9 },
          { note: 'Green', strength: 0.8 },
          { note: 'Citrus', strength: 0.7 },
          { note: 'Aquatic', strength: 0.6 },
          { note: 'Woody', strength: 0.4 }
        ]
      },
      {
        value: 'summer',
        label: 'Summer',
        note_affinities: [
          { note: 'Citrus', strength: 0.9 },
          { note: 'Aquatic', strength: 0.8 },
          { note: 'Fruity', strength: 0.7 },
          { note: 'Fresh', strength: 0.9 },
          { note: 'Aromatic', strength: 0.5 }
        ]
      },
      {
        value: 'fall',
        label: 'Fall',
        note_affinities: [
          { note: 'Woody', strength: 0.8 },
          { note: 'Spicy', strength: 0.9 },
          { note: 'Amber', strength: 0.7 },
          { note: 'Gourmand', strength: 0.6 },
          { note: 'Earthy', strength: 0.7 }
        ]
      },
      {
        value: 'winter',
        label: 'Winter',
        note_affinities: [
          { note: 'Oriental', strength: 0.9 },
          { note: 'Woody', strength: 0.7 },
          { note: 'Gourmand', strength: 0.8 },
          { note: 'Spicy', strength: 0.7 },
          { note: 'Amber', strength: 0.8 }
        ]
      }
    ]
  },
  {
    id: 'skin_chemistry',
    title: 'Skin Chemistry',
    description: 'How would you describe your skin type?',
    weight: 0.2,
    options: [
      {
        value: 'dry',
        label: 'Dry skin',
        note_affinities: [
          { note: 'Oriental', strength: 0.6 },
          { note: 'Gourmand', strength: 0.7 },
          { note: 'Woody', strength: 0.6 },
          { note: 'Amber', strength: 0.7 }
        ]
      },
      {
        value: 'oily',
        label: 'Oily skin',
        note_affinities: [
          { note: 'Citrus', strength: 0.7 },
          { note: 'Fresh', strength: 0.8 },
          { note: 'Aromatic', strength: 0.7 },
          { note: 'Green', strength: 0.6 }
        ]
      },
      {
        value: 'combination',
        label: 'Combination skin',
        note_affinities: [
          { note: 'Floral', strength: 0.7 },
          { note: 'Fruity', strength: 0.6 },
          { note: 'Woody', strength: 0.5 },
          { note: 'Fresh', strength: 0.6 }
        ]
      },
      {
        value: 'sensitive',
        label: 'Sensitive skin',
        note_affinities: [
          { note: 'Fresh', strength: 0.7 },
          { note: 'Green', strength: 0.6 },
          { note: 'Aquatic', strength: 0.6 },
          { note: 'Light Floral', strength: 0.5 }
        ]
      }
    ]
  },
  {
    id: 'occasion',
    title: 'Primary Occasion',
    description: 'For which occasion are you primarily looking for a fragrance?',
    weight: 0.2,
    options: [
      {
        value: 'everyday',
        label: 'Everyday wear',
        note_affinities: [
          { note: 'Fresh', strength: 0.7 },
          { note: 'Citrus', strength: 0.6 },
          { note: 'Light Floral', strength: 0.5 },
          { note: 'Green', strength: 0.5 }
        ]
      },
      {
        value: 'work',
        label: 'Work/Office',
        note_affinities: [
          { note: 'Fresh', strength: 0.8 },
          { note: 'Clean', strength: 0.8 },
          { note: 'Light Woody', strength: 0.6 },
          { note: 'Subtle Floral', strength: 0.5 }
        ]
      },
      {
        value: 'evening',
        label: 'Evening out',
        note_affinities: [
          { note: 'Oriental', strength: 0.8 },
          { note: 'Woody', strength: 0.7 },
          { note: 'Amber', strength: 0.7 },
          { note: 'Spicy', strength: 0.6 }
        ]
      },
      {
        value: 'date',
        label: 'Romantic date',
        note_affinities: [
          { note: 'Gourmand', strength: 0.7 },
          { note: 'Oriental', strength: 0.7 },
          { note: 'Floral', strength: 0.7 },
          { note: 'Woody', strength: 0.6 }
        ]
      },
      {
        value: 'special',
        label: 'Special occasions',
        note_affinities: [
          { note: 'Oriental', strength: 0.9 },
          { note: 'Rich Floral', strength: 0.8 },
          { note: 'Woody', strength: 0.7 },
          { note: 'Amber', strength: 0.7 }
        ]
      }
    ]
  },
  // Continuing with more factors
  {
    id: 'personality',
    title: 'Your Personality',
    description: 'Which of these best describes your personality?',
    weight: 0.15,
    options: [
      {
        value: 'adventurous',
        label: 'Adventurous & Bold',
        note_affinities: [
          { note: 'Spicy', strength: 0.8 },
          { note: 'Woody', strength: 0.7 },
          { note: 'Leather', strength: 0.7 },
          { note: 'Amber', strength: 0.6 }
        ]
      },
      {
        value: 'elegant',
        label: 'Elegant & Sophisticated',
        note_affinities: [
          { note: 'Rich Floral', strength: 0.8 },
          { note: 'Oriental', strength: 0.7 },
          { note: 'Chypre', strength: 0.7 },
          { note: 'Aldehydic', strength: 0.6 }
        ]
      },
      {
        value: 'playful',
        label: 'Playful & Carefree',
        note_affinities: [
          { note: 'Fruity', strength: 0.8 },
          { note: 'Sweet', strength: 0.7 },
          { note: 'Fresh', strength: 0.7 },
          { note: 'Citrus', strength: 0.6 }
        ]
      },
      {
        value: 'relaxed',
        label: 'Relaxed & Natural',
        note_affinities: [
          { note: 'Fresh', strength: 0.8 },
          { note: 'Green', strength: 0.7 },
          { note: 'Aquatic', strength: 0.7 },
          { note: 'Herbal', strength: 0.6 }
        ]
      }
    ]
  },
  {
    id: 'preference_strength',
    title: 'Preferred Intensity',
    description: 'How noticeable do you want your fragrance to be?',
    weight: 0.15,
    options: [
      {
        value: 'subtle',
        label: 'Subtle - just for me',
        note_affinities: [
          { note: 'Light Floral', strength: 0.7 },
          { note: 'Fresh', strength: 0.7 },
          { note: 'Clean', strength: 0.7 },
          { note: 'Light Citrus', strength: 0.6 }
        ]
      },
      {
        value: 'moderate',
        label: 'Moderate - for close encounters',
        note_affinities: [
          { note: 'Floral', strength: 0.7 },
          { note: 'Fruity', strength: 0.7 },
          { note: 'Woody', strength: 0.6 },
          { note: 'Fresh', strength: 0.6 }
        ]
      },
      {
        value: 'strong',
        label: 'Strong - make a statement',
        note_affinities: [
          { note: 'Oriental', strength: 0.8 },
          { note: 'Spicy', strength: 0.8 },
          { note: 'Woody', strength: 0.7 },
          { note: 'Amber', strength: 0.7 }
        ]
      }
    ]
  },
  // Adding 7 more factors to reach 12 total
  {
    id: 'age_range',
    title: 'Age Range',
    description: 'Which age range do you fall into?',
    weight: 0.1,
    options: [
      {
        value: '18_24',
        label: '18-24',
        note_affinities: [
          { note: 'Fresh', strength: 0.7 },
          { note: 'Sweet', strength: 0.7 },
          { note: 'Fruity', strength: 0.8 },
          { note: 'Aquatic', strength: 0.6 }
        ]
      },
      {
        value: '25_34',
        label: '25-34',
        note_affinities: [
          { note: 'Fresh', strength: 0.7 },
          { note: 'Woody', strength: 0.6 },
          { note: 'Spicy', strength: 0.6 },
          { note: 'Citrus', strength: 0.7 }
        ]
      },
      {
        value: '35_44',
        label: '35-44',
        note_affinities: [
          { note: 'Woody', strength: 0.7 },
          { note: 'Oriental', strength: 0.6 },
          { note: 'Floral', strength: 0.7 },
          { note: 'Green', strength: 0.6 }
        ]
      },
      {
        value: '45_plus',
        label: '45+',
        note_affinities: [
          { note: 'Woody', strength: 0.8 },
          { note: 'Oriental', strength: 0.7 },
          { note: 'Chypre', strength: 0.8 },
          { note: 'Aldehydic', strength: 0.7 }
        ]
      }
    ]
  },
  {
    id: 'outdoor_activities',
    title: 'Outdoor Activities',
    description: 'What outdoor activities do you enjoy?',
    weight: 0.1,
    options: [
      {
        value: 'beach',
        label: 'Beach & Water Sports',
        note_affinities: [
          { note: 'Aquatic', strength: 0.9 },
          { note: 'Citrus', strength: 0.8 },
          { note: 'Fresh', strength: 0.7 },
          { note: 'Coconut', strength: 0.7 }
        ]
      },
      {
        value: 'hiking',
        label: 'Hiking & Nature',
        note_affinities: [
          { note: 'Green', strength: 0.9 },
          { note: 'Woody', strength: 0.8 },
          { note: 'Earthy', strength: 0.8 },
          { note: 'Herbal', strength: 0.7 }
        ]
      },
      {
        value: 'urban',
        label: 'Urban Exploration',
        note_affinities: [
          { note: 'Modern', strength: 0.8 },
          { note: 'Clean', strength: 0.7 },
          { note: 'Woody', strength: 0.6 },
          { note: 'Spicy', strength: 0.6 }
        ]
      },
      {
        value: 'gardening',
        label: 'Gardening & Plants',
        note_affinities: [
          { note: 'Green', strength: 0.9 },
          { note: 'Floral', strength: 0.8 },
          { note: 'Earthy', strength: 0.7 },
          { note: 'Herbal', strength: 0.7 }
        ]
      }
    ]
  },
  {
    id: 'desired_impression',
    title: 'Desired Impression',
    description: 'What impression do you want to give with your fragrance?',
    weight: 0.15,
    options: [
      {
        value: 'confidence',
        label: 'Confidence & Authority',
        note_affinities: [
          { note: 'Woody', strength: 0.8 },
          { note: 'Spicy', strength: 0.7 },
          { note: 'Leather', strength: 0.7 },
          { note: 'Amber', strength: 0.6 }
        ]
      },
      {
        value: 'approachable',
        label: 'Warm & Approachable',
        note_affinities: [
          { note: 'Vanilla', strength: 0.8 },
          { note: 'Amber', strength: 0.7 },
          { note: 'Sweet', strength: 0.7 },
          { note: 'Light Spicy', strength: 0.6 }
        ]
      },
      {
        value: 'mysterious',
        label: 'Mysterious & Intriguing',
        note_affinities: [
          { note: 'Oriental', strength: 0.9 },
          { note: 'Smoky', strength: 0.7 },
          { note: 'Incense', strength: 0.8 },
          { note: 'Dark Woody', strength: 0.7 }
        ]
      },
      {
        value: 'fresh',
        label: 'Fresh & Clean',
        note_affinities: [
          { note: 'Clean', strength: 0.9 },
          { note: 'Citrus', strength: 0.8 },
          { note: 'Aquatic', strength: 0.7 },
          { note: 'Fresh', strength: 0.9 }
        ]
      }
    ]
  },
  {
    id: 'previous_favorites',
    title: 'Previous Favorites',
    description: 'Which type of fragrances have you enjoyed in the past?',
    weight: 0.2,
    options: [
      {
        value: 'floral',
        label: 'Floral scents',
        note_affinities: [
          { note: 'Floral', strength: 0.9 },
          { note: 'Rose', strength: 0.8 },
          { note: 'Jasmine', strength: 0.8 },
          { note: 'Powdery', strength: 0.6 }
        ]
      },
      {
        value: 'woody',
        label: 'Woody scents',
        note_affinities: [
          { note: 'Woody', strength: 0.9 },
          { note: 'Cedar', strength: 0.8 },
          { note: 'Sandalwood', strength: 0.8 },
          { note: 'Vetiver', strength: 0.7 }
        ]
      },
      {
        value: 'oriental',
        label: 'Oriental scents',
        note_affinities: [
          { note: 'Oriental', strength: 0.9 },
          { note: 'Amber', strength: 0.8 },
          { note: 'Vanilla', strength: 0.7 },
          { note: 'Spicy', strength: 0.7 }
        ]
      },
      {
        value: 'fresh',
        label: 'Fresh scents',
        note_affinities: [
          { note: 'Fresh', strength: 0.9 },
          { note: 'Citrus', strength: 0.8 },
          { note: 'Aquatic', strength: 0.8 },
          { note: 'Green', strength: 0.7 }
        ]
      }
    ]
  },
  {
    id: 'allergies',
    title: 'Allergies & Sensitivities',
    description: 'Do you have any allergies or sensitivities to certain ingredients?',
    weight: 0.1,
    options: [
      {
        value: 'none',
        label: 'No allergies',
        note_affinities: []  // Neutral option, no specific affinities
      },
      {
        value: 'musk',
        label: 'Sensitive to musk',
        note_affinities: [
          { note: 'Musk', strength: -0.9 },  // Negative affinity
          { note: 'Floral', strength: 0.6 },
          { note: 'Fresh', strength: 0.7 },
          { note: 'Green', strength: 0.6 }
        ]
      },
      {
        value: 'floral',
        label: 'Sensitive to strong florals',
        note_affinities: [
          { note: 'Strong Floral', strength: -0.9 },  // Negative affinity
          { note: 'Woody', strength: 0.7 },
          { note: 'Fresh', strength: 0.7 },
          { note: 'Citrus', strength: 0.6 }
        ]
      },
      {
        value: 'synthetic',
        label: 'Sensitive to synthetic chemicals',
        note_affinities: [
          { note: 'Natural', strength: 0.9 },
          { note: 'Herbal', strength: 0.7 },
          { note: 'Essential Oils', strength: 0.8 },
          { note: 'Synthetic', strength: -0.9 }  // Negative affinity
        ]
      }
    ]
  },
  {
    id: 'time_of_day',
    title: 'Time of Day',
    description: 'When do you typically wear fragrance?',
    weight: 0.1,
    options: [
      {
        value: 'morning',
        label: 'Morning',
        note_affinities: [
          { note: 'Citrus', strength: 0.9 },
          { note: 'Fresh', strength: 0.8 },
          { note: 'Green', strength: 0.7 },
          { note: 'Aromatic', strength: 0.6 }
        ]
      },
      {
        value: 'daytime',
        label: 'Daytime',
        note_affinities: [
          { note: 'Floral', strength: 0.8 },
          { note: 'Fresh', strength: 0.7 },
          { note: 'Fruity', strength: 0.7 },
          { note: 'Light Woody', strength: 0.6 }
        ]
      },
      {
        value: 'evening',
        label: 'Evening',
        note_affinities: [
          { note: 'Oriental', strength: 0.8 },
          { note: 'Woody', strength: 0.7 },
          { note: 'Amber', strength: 0.7 },
          { note: 'Spicy', strength: 0.6 }
        ]
      },
      {
        value: 'night',
        label: 'Night',
        note_affinities: [
          { note: 'Oriental', strength: 0.9 },
          { note: 'Gourmand', strength: 0.7 },
          { note: 'Amber', strength: 0.8 },
          { note: 'Musk', strength: 0.7 }
        ]
      }
    ]
  },
  {
    id: 'environment',
    title: 'Living Environment',
    description: 'What type of environment do you primarily live in?',
    weight: 0.1,
    options: [
      {
        value: 'urban',
        label: 'Urban city',
        note_affinities: [
          { note: 'Modern', strength: 0.8 },
          { note: 'Clean', strength: 0.7 },
          { note: 'Woody', strength: 0.6 },
          { note: 'Oriental', strength: 0.6 }
        ]
      },
      {
        value: 'suburban',
        label: 'Suburban area',
        note_affinities: [
          { note: 'Fresh', strength: 0.7 },
          { note: 'Floral', strength: 0.7 },
          { note: 'Green', strength: 0.6 },
          { note: 'Light Woody', strength: 0.6 }
        ]
      },
      {
        value: 'coastal',
        label: 'Coastal area',
        note_affinities: [
          { note: 'Aquatic', strength: 0.9 },
          { note: 'Marine', strength: 0.8 },
          { note: 'Citrus', strength: 0.7 },
          { note: 'Fresh', strength: 0.7 }
        ]
      },
      {
        value: 'rural',
        label: 'Rural countryside',
        note_affinities: [
          { note: 'Green', strength: 0.9 },
          { note: 'Earthy', strength: 0.8 },
          { note: 'Woody', strength: 0.7 },
          { note: 'Herbal', strength: 0.7 }
        ]
      }
    ]
  }
];
