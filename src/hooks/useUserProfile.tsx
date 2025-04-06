
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Fragrance } from '@/lib/store';

type UserPreferences = {
  id: string;
  user_id: string;
  gender_preference: string | null;
  intensity: number | null;
  price_min: number | null;
  price_max: number | null;
  seasons: string[] | null;
  occasions: string[] | null;
  preferred_notes: string[] | null;
};

type FragranceCollection = {
  id: string;
  user_id: string;
  fragrance_id: number;
  notes: string | null;
  created_at: string;
};

export function useUserProfile() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [collection, setCollection] = useState<FragranceCollection[]>([]);
  const [savedFragrances, setSavedFragrances] = useState<Fragrance[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user preferences from Supabase
  useEffect(() => {
    if (!user) {
      setPreferences(null);
      setCollection([]);
      setSavedFragrances([]);
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Fetch preferences
        const { data: preferencesData, error: preferencesError } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (preferencesError) throw preferencesError;
        setPreferences(preferencesData);

        // Fetch collection
        const { data: collectionData, error: collectionError } = await supabase
          .from('fragrance_collections')
          .select('*')
          .eq('user_id', user.id);

        if (collectionError) throw collectionError;
        setCollection(collectionData || []);

        // For now, we'll just set saved fragrances based on IDs
        // In a real app, you'd fetch the full fragrance data from your API
        if (collectionData && collectionData.length > 0) {
          // Here we'd normally fetch the full fragrance data
          // For now, we'll get them from local recommendations
          const { recommendations } = JSON.parse(localStorage.getItem('fragrance-recommendations') || '{"recommendations":[]}');
          
          if (recommendations && recommendations.length > 0) {
            const savedIds = collectionData.map(item => item.fragrance_id);
            const saved = recommendations.filter(fragrance => savedIds.includes(fragrance.id));
            setSavedFragrances(saved);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const saveFragrance = async (fragrance: Fragrance, notes?: string) => {
    if (!user) {
      toast.error('You must be logged in to save fragrances');
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('fragrance_collections')
        .insert({
          user_id: user.id,
          fragrance_id: fragrance.id,
          notes: notes || null
        })
        .select()
        .single();

      if (error) throw error;

      setCollection(prev => [...prev, data]);
      setSavedFragrances(prev => [...prev, fragrance]);
      toast.success(`Added "${fragrance.name}" to your collection`);
      return true;
    } catch (error) {
      console.error('Error saving fragrance:', error);
      toast.error('Failed to save fragrance');
      return false;
    }
  };

  const removeFragrance = async (fragranceId: number) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('fragrance_collections')
        .delete()
        .eq('user_id', user.id)
        .eq('fragrance_id', fragranceId);

      if (error) throw error;

      setCollection(prev => prev.filter(item => item.fragrance_id !== fragranceId));
      setSavedFragrances(prev => prev.filter(item => item.id !== fragranceId));
      toast.success('Removed from collection');
      return true;
    } catch (error) {
      console.error('Error removing fragrance:', error);
      toast.error('Failed to remove fragrance');
      return false;
    }
  };

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_preferences')
        .update(newPreferences)
        .eq('user_id', user.id);

      if (error) throw error;

      setPreferences(prev => prev ? { ...prev, ...newPreferences } : null);
      toast.success('Preferences updated');
      return true;
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
      return false;
    }
  };

  const isFragranceSaved = (fragranceId: number) => {
    return collection.some(item => item.fragrance_id === fragranceId);
  };

  return {
    preferences,
    collection,
    savedFragrances,
    loading,
    saveFragrance,
    removeFragrance,
    updatePreferences,
    isFragranceSaved
  };
}
