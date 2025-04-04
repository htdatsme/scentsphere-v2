
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
  likedFragrances: number[];
  dislikedFragrances: number[];
  ratedFragrances: Map<number, number>;
  
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
  addLikedFragrance: (id: number) => void;
  addDislikedFragrance: (id: number) => void;
  removeLikedFragrance: (id: number) => void;
  removeDislikedFragrance: (id: number) => void;
  rateFragrance: (id: number, rating: number) => void;
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
      likedFragrances: [],
      dislikedFragrances: [],
      ratedFragrances: new Map(),
      
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
      addLikedFragrance: (id) => set((state) => ({
        likedFragrances: [...state.likedFragrances.filter(fid => fid !== id), id],
        dislikedFragrances: state.dislikedFragrances.filter(fid => fid !== id)
      })),
      addDislikedFragrance: (id) => set((state) => ({
        dislikedFragrances: [...state.dislikedFragrances.filter(fid => fid !== id), id],
        likedFragrances: state.likedFragrances.filter(fid => fid !== id)
      })),
      removeLikedFragrance: (id) => set((state) => ({
        likedFragrances: state.likedFragrances.filter(fid => fid !== id)
      })),
      removeDislikedFragrance: (id) => set((state) => ({
        dislikedFragrances: state.dislikedFragrances.filter(fid => fid !== id)
      })),
      rateFragrance: (id, rating) => set((state) => {
        const newRatedFragrances = new Map(state.ratedFragrances);
        newRatedFragrances.set(id, rating);
        
        // Update liked/disliked based on rating
        let likedFragrances = [...state.likedFragrances];
        let dislikedFragrances = [...state.dislikedFragrances];
        
        if (rating >= 4) {
          // Add to liked, remove from disliked
          if (!likedFragrances.includes(id)) {
            likedFragrances.push(id);
          }
          dislikedFragrances = dislikedFragrances.filter(fid => fid !== id);
        } else if (rating <= 2) {
          // Add to disliked, remove from liked
          if (!dislikedFragrances.includes(id)) {
            dislikedFragrances.push(id);
          }
          likedFragrances = likedFragrances.filter(fid => fid !== id);
        } else {
          // Rating is neutral, remove from both
          likedFragrances = likedFragrances.filter(fid => fid !== id);
          dislikedFragrances = dislikedFragrances.filter(fid => fid !== id);
        }
        
        return {
          ratedFragrances: newRatedFragrances,
          likedFragrances,
          dislikedFragrances
        };
      }),
    }),
    {
      name: 'fragrance-recommendations',
      partialize: (state) => ({
        userPreferences: state.userPreferences,
        quizCompleted: state.quizCompleted,
        likedNotes: state.likedNotes,
        dislikedNotes: state.dislikedNotes,
        likedFragrances: state.likedFragrances,
        dislikedFragrances: state.dislikedFragrances,
        ratedFragrances: Array.from(state.ratedFragrances.entries()),
      }),
      // Convert Map to array when storing and back when retrieving
      onRehydrateStorage: (state) => {
        return (rehydratedState, error) => {
          if (error) {
            console.error('Error rehydrating store:', error);
          } else if (rehydratedState) {
            // Convert the array back to a Map
            const ratedArray = rehydratedState.ratedFragrances;
            if (Array.isArray(ratedArray)) {
              rehydratedState.ratedFragrances = new Map(ratedArray);
            } else {
              rehydratedState.ratedFragrances = new Map();
            }
          }
        };
      }
    }
  )
);
