import { Fragrance } from "../data/fragranceData";
import { UserPreferences } from "../store";

// A simple recommendation engine that filters and scores fragrances based on user preferences
export function generateRecommendations(
  fragrances: Fragrance[],
  preferences: UserPreferences,
  limit: number = 10
): Fragrance[] {
  // Filter fragrances by gender
  let filteredFragrances = fragrances.filter(fragrance => {
    // If user selects unisex, show all unisex plus their preferred gender
    if (preferences.gender === 'unisex') {
      return true;
    }
    // Otherwise show only their gender preference and unisex options
    return fragrance.gender === preferences.gender || fragrance.gender === 'unisex';
  });

  // Filter by price range
  filteredFragrances = filteredFragrances.filter(fragrance => {
    return (
      fragrance.price >= preferences.priceRange[0] && 
      fragrance.price <= preferences.priceRange[1]
    );
  });

  // Calculate match score for each fragrance
  const scoredFragrances = filteredFragrances.map(fragrance => {
    let score = 0;

    // Score based on notes match (simplified for demo)
    const noteMatches = preferences.notes.filter(note => 
      fragrance.notes.some(n => n.name.toLowerCase().includes(note.toLowerCase()))
    );
    score += noteMatches.length * 10;

    // Score based on occasions match
    const occasionMatches = preferences.occasions.filter(occ => 
      fragrance.occasions.includes(occ)
    );
    score += occasionMatches.length * 8;

    // Score based on seasonal preferences
    const seasonMatches = preferences.seasonalPreferences.filter(season => 
      fragrance.seasons.includes(season)
    );
    score += seasonMatches.length * 6;

    // Score based on intensity match (closer is better)
    const intensityDiff = Math.abs(fragrance.intensity - preferences.intensity);
    score += (10 - intensityDiff) * 5;

    return { fragrance, score };
  });

  // Sort by score and return top results
  scoredFragrances.sort((a, b) => b.score - a.score);
  
  return scoredFragrances.slice(0, limit).map(item => item.fragrance);
}
