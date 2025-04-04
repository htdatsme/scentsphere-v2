
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Fragrance {
  id: number;
  name: string;
  brand: string;
  description: string;
  notes: string[];
  imageUrl: string;
  price: number;
  categories: string[];
  rating: number;
}

export interface UserPreferences {
  gender: 'masculine' | 'feminine' | 'unisex';
  occasions: string[];
  notes: string[];
  intensity: number;
  seasonalPreferences: string[];
  priceRange: [number, number];
}

interface RecommendationState {
  // User quiz answers and preferences
  userPreferences: UserPreferences | null;
  quizCompleted: boolean;
  
  // Recommendation results
  recommendations: Fragrance[];
  isLoading: boolean;
  
  // Actions
  setUserPreferences: (preferences: UserPreferences) => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
  setRecommendations: (fragrances: Fragrance[]) => void;
  setLoading: (status: boolean) => void;
}

export const useRecommendationStore = create<RecommendationState>()(
  persist(
    (set) => ({
      // Initial state
      userPreferences: null,
      quizCompleted: false,
      recommendations: [],
      isLoading: false,
      
      // Actions
      setUserPreferences: (preferences) => set({ userPreferences: preferences }),
      completeQuiz: () => set({ quizCompleted: true }),
      resetQuiz: () => set({ quizCompleted: false, userPreferences: null }),
      setRecommendations: (fragrances) => set({ recommendations: fragrances }),
      setLoading: (status) => set({ isLoading: status }),
    }),
    {
      name: 'fragrance-recommendations',
      partialize: (state) => ({
        userPreferences: state.userPreferences,
        quizCompleted: state.quizCompleted,
      }),
    }
  )
);
