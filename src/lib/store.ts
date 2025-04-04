
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Fragrance as FragranceData } from './data/fragranceData';
import { ScentProfile } from '@/types/quiz';

export interface Fragrance extends FragranceData {
  // Add optional score for internal use
  score?: number;
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
  
  // Scent profile
  scentProfile: ScentProfile | null;
  
  // Recommendation results
  recommendations: Fragrance[];
  isLoading: boolean;
  
  // User feedback data
  likedNotes: string[];
  dislikedNotes: string[];
  
  // Actions
  setUserPreferences: (preferences: UserPreferences) => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
  setRecommendations: (fragrances: Fragrance[]) => void;
  setLoading: (status: boolean) => void;
  setScentProfile: (profile: ScentProfile) => void;
  addLikedNote: (note: string) => void;
  addDislikedNote: (note: string) => void;
  removeLikedNote: (note: string) => void;
  removeDislikedNote: (note: string) => void;
}

export const useRecommendationStore = create<RecommendationState>()(
  persist(
    (set) => ({
      // Initial state
      userPreferences: null,
      quizCompleted: false,
      scentProfile: null,
      recommendations: [],
      isLoading: false,
      likedNotes: [],
      dislikedNotes: [],
      
      // Actions
      setUserPreferences: (preferences) => set({ userPreferences: preferences }),
      completeQuiz: () => set({ quizCompleted: true }),
      resetQuiz: () => set({ quizCompleted: false, userPreferences: null, scentProfile: null }),
      setRecommendations: (fragrances) => set({ recommendations: fragrances }),
      setLoading: (status) => set({ isLoading: status }),
      setScentProfile: (profile) => set({ scentProfile: profile }),
      addLikedNote: (note) => set((state) => ({ 
        likedNotes: [...state.likedNotes.filter(n => n !== note), note],
        dislikedNotes: state.dislikedNotes.filter(n => n !== note)
      })),
      addDislikedNote: (note) => set((state) => ({
        dislikedNotes: [...state.dislikedNotes.filter(n => n !== note), note],
        likedNotes: state.likedNotes.filter(n => n !== note)
      })),
      removeLikedNote: (note) => set((state) => ({
        likedNotes: state.likedNotes.filter(n => n !== note)
      })),
      removeDislikedNote: (note) => set((state) => ({
        dislikedNotes: state.dislikedNotes.filter(n => n !== note)
      })),
    }),
    {
      name: 'fragrance-recommendations',
      partialize: (state) => ({
        userPreferences: state.userPreferences,
        quizCompleted: state.quizCompleted,
        likedNotes: state.likedNotes,
        dislikedNotes: state.dislikedNotes,
      }),
    }
  )
);
