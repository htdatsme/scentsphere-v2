
import { UserQuizAnswers, ScentProfile, QuizFactorId } from "@/types/quiz";
import { quizFactors } from "../data/quizFactors";
import { fragrances } from "../data/fragranceData";

// Get Toronto weather data
const getTorontoWeather = async (): Promise<{
  temperature: number;
  humidity: number;
  season: string;
}> => {
  // In a real app, this would fetch from a weather API
  // For demo purposes, we simulate seasonal weather
  const now = new Date();
  const month = now.getMonth();
  
  // Simple seasonal mapping (0-11 months)
  let season = 'spring';
  let temperature = 15;
  let humidity = 60;
  
  if (month >= 2 && month <= 4) {
    season = 'spring';
    temperature = 15;
    humidity = 60;
  } else if (month >= 5 && month <= 7) {
    season = 'summer';
    temperature = 28;
    humidity = 70;
  } else if (month >= 8 && month <= 10) {
    season = 'fall';
    temperature = 12;
    humidity = 55;
  } else {
    season = 'winter';
    temperature = -5;
    humidity = 40;
  }
  
  return { temperature, humidity, season };
};

// Generate a scent profile from quiz answers
export const generateScentProfile = async (
  answers: UserQuizAnswers
): Promise<ScentProfile> => {
  // Initialize empty profile
  const profile: ScentProfile = {
    notes: {},
    factors: { ...answers },
    preferences: {
      intensity: 5,
      longevity: 5,
      uniqueness: 5,
      seasonality: {
        spring: 0.25,
        summer: 0.25,
        fall: 0.25,
        winter: 0.25,
      },
      occasions: {},
    },
  };
  
  // Process each answer to build the note affinities
  for (const factor of quizFactors) {
    const answer = answers[factor.id];
    if (!answer) continue;
    
    const option = factor.options.find((opt) => opt.value === answer);
    if (!option) continue;
    
    // Apply this factor's note affinities to the profile
    for (const affinity of option.note_affinities) {
      const { note, strength } = affinity;
      
      if (!profile.notes[note]) {
        profile.notes[note] = 0;
      }
      
      // Apply the weighted strength
      profile.notes[note] += strength * factor.weight;
    }
    
    // Set specific profile attributes based on factor
    if (factor.id === 'preference_strength') {
      if (answer === 'subtle') profile.preferences.intensity = 3;
      if (answer === 'moderate') profile.preferences.intensity = 5;
      if (answer === 'strong') profile.preferences.intensity = 8;
    }
    
    if (factor.id === 'season') {
      // Reset seasonality
      profile.preferences.seasonality = {
        spring: 0.1,
        summer: 0.1,
        fall: 0.1,
        winter: 0.1,
      };
      
      // Boost selected season
      if (typeof answer === 'string' && answer in profile.preferences.seasonality) {
        profile.preferences.seasonality[answer as keyof typeof profile.preferences.seasonality] = 0.7;
      }
    }
    
    if (factor.id === 'occasion') {
      profile.preferences.occasions[answer] = 0.9;
    }
  }
  
  // Apply Toronto weather patterns (15% influence)
  const weather = await getTorontoWeather();
  
  // Adjust for current Toronto season
  const torontoSeasonInfluence = 0.15; // 15% influence
  
  // Boost notes associated with current Toronto season
  if (weather.season === 'summer') {
    boostNotes(profile, ['Citrus', 'Fresh', 'Aquatic'], torontoSeasonInfluence);
  } else if (weather.season === 'winter') {
    boostNotes(profile, ['Woody', 'Oriental', 'Spicy'], torontoSeasonInfluence);
  } else if (weather.season === 'fall') {
    boostNotes(profile, ['Woody', 'Spicy', 'Amber'], torontoSeasonInfluence);
  } else {
    boostNotes(profile, ['Floral', 'Green', 'Fresh'], torontoSeasonInfluence);
  }
  
  // Normalize note scores to 0-1 range
  normalizeNotes(profile);
  
  return profile;
};

// Helper to boost certain notes by a factor
const boostNotes = (profile: ScentProfile, notes: string[], factor: number) => {
  notes.forEach(note => {
    if (!profile.notes[note]) {
      profile.notes[note] = 0;
    }
    profile.notes[note] += factor;
  });
};

// Helper to normalize note scores
const normalizeNotes = (profile: ScentProfile) => {
  // Find max value
  let maxVal = 0;
  for (const note in profile.notes) {
    maxVal = Math.max(maxVal, profile.notes[note]);
  }
  
  // Normalize if max > 0
  if (maxVal > 0) {
    for (const note in profile.notes) {
      profile.notes[note] = profile.notes[note] / maxVal;
    }
  }
};

// Generate recommendations based on profile
export const generateRecommendations = async (
  profile: ScentProfile
): Promise<typeof fragrances> => {
  // Calculate content-based filtering scores (60%)
  const contentScores = fragrances.map(fragrance => {
    let score = 0;
    
    // Match notes
    fragrance.notes.forEach(noteObj => {
      const noteName = noteObj.name.toLowerCase();
      
      // Look for matching notes in the profile
      for (const profileNote in profile.notes) {
        if (noteName.includes(profileNote.toLowerCase())) {
          score += profile.notes[profileNote] * 10;
        }
      }
    });
    
    // Match gender preference if available
    if (profile.factors.gender) {
      if (profile.factors.gender === fragrance.gender || 
          fragrance.gender === 'unisex') {
        score += 5;
      }
    }
    
    // Match season preference
    const matchingSeason = fragrance.seasons.some(season => 
      profile.preferences.seasonality[season.toLowerCase() as keyof typeof profile.preferences.seasonality] > 0.5
    );
    
    if (matchingSeason) {
      score += 3;
    }
    
    // Match intensity
    const intensityDiff = Math.abs(fragrance.intensity - profile.preferences.intensity);
    score -= intensityDiff; // Reduce score based on intensity mismatch
    
    return { fragrance, contentScore: score };
  });

  // Simulate collaborative filtering (25%)
  // In a real app, this would use real user data
  const collaborativeScores = fragrances.map(fragrance => {
    // Placeholder collaborative score based on rating (simulating user data)
    const collab = fragrance.rating * 2;
    return { fragrance, collabScore: collab };
  });

  // Apply Toronto weather influence (15%)
  const weather = await getTorontoWeather();
  const weatherScores = fragrances.map(fragrance => {
    let score = 0;
    
    // For hot weather, prefer fresh/light scents
    if (weather.temperature > 20) {
      if (fragrance.categories.some(c => 
        ['Fresh', 'Citrus', 'Aquatic'].includes(c))) {
        score += 3;
      }
    }
    // For cold weather, prefer warm/heavy scents
    else if (weather.temperature < 10) {
      if (fragrance.categories.some(c => 
        ['Oriental', 'Woody', 'Spicy', 'Gourmand'].includes(c))) {
        score += 3;
      }
    }
    
    // For high humidity, prefer lighter scents
    if (weather.humidity > 65) {
      if (fragrance.intensity < 6) {
        score += 2;
      }
    }
    
    return { fragrance, weatherScore: score };
  });

  // Combine all scores with proper weighting
  const combinedScores = fragrances.map((fragrance, i) => {
    const content = contentScores[i].contentScore * 0.6; // 60%
    const collab = collaborativeScores[i].collabScore * 0.25; // 25%
    const weather = weatherScores[i].weatherScore * 0.15; // 15%
    
    const totalScore = content + collab + weather;
    
    return {
      ...fragrance,
      score: totalScore
    };
  });

  // Sort by score and return top results
  return combinedScores
    .sort((a, b) => b.score - a.score)
    .map(({ score, ...fragrance }) => fragrance);
};
