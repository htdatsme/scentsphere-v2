
import * as tf from '@tensorflow/tfjs';
import { Fragrance } from '@/lib/store';
import { ScentProfile } from '@/types/quiz';
import { fragrances } from '@/lib/data/fragranceData';
import { toast } from 'sonner';

// Weights for our hybrid approach
const WEIGHTS = {
  CONTENT_BASED: 0.6,   // 60% 
  COLLABORATIVE: 0.25,  // 25%
  SEASONAL: 0.15        // 15%
};

// Enhanced recommendation engine using TensorFlow.js
export class EnhancedRecommendationEngine {
  private model: tf.Sequential | null = null;
  private isModelReady: boolean = false;
  
  constructor() {
    this.initModel();
  }
  
  async initModel() {
    try {
      // Create a simple neural network for scent profile analysis
      this.model = tf.sequential();
      
      // Input layer for scent profile features (notes, preferences, etc.)
      this.model.add(tf.layers.dense({ 
        units: 32, 
        activation: 'relu',
        inputShape: [20]  // Feature vector size
      }));
      
      // Hidden layer
      this.model.add(tf.layers.dense({ 
        units: 16, 
        activation: 'relu' 
      }));
      
      // Output layer that predicts affinity scores for fragrances
      this.model.add(tf.layers.dense({ 
        units: 10,  // Number of fragrance categories to predict
        activation: 'sigmoid' 
      }));
      
      // Compile the model
      this.model.compile({
        optimizer: tf.train.adam(0.01),
        loss: 'meanSquaredError'
      });
      
      // Mark model as ready
      this.isModelReady = true;
      console.log("Enhanced TensorFlow.js model initialized successfully");
    } catch (error) {
      console.error("Error initializing TensorFlow.js model:", error);
      this.model = null;
    }
  }
  
  // Generate feature vector from scent profile
  private generateFeatureVector(profile: ScentProfile): number[] {
    const features: number[] = [];
    
    // Extract top note preferences (max 10)
    const topNotes = Object.entries(profile.notes)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 10);
    
    // Add note affinities to feature vector
    topNotes.forEach(([_, value]) => {
      features.push(value);
    });
    
    // Fill remaining feature slots if needed
    while (features.length < 10) {
      features.push(0);
    }
    
    // Add seasonal preferences
    features.push(profile.preferences.seasonality.spring);
    features.push(profile.preferences.seasonality.summer);
    features.push(profile.preferences.seasonality.fall);
    features.push(profile.preferences.seasonality.winter);
    
    // Add intensity preference
    features.push(profile.preferences.intensity / 10);
    
    // Add other preference metrics
    features.push(profile.preferences.longevity / 10);
    features.push(profile.preferences.uniqueness / 10);
    
    // Fill to expected size
    while (features.length < 20) {
      features.push(0);
    }
    
    return features;
  }
  
  // Content-based filtering (60% of recommendation weight)
  private contentBasedFiltering(profile: ScentProfile): Map<number, number> {
    const scores = new Map<number, number>();
    
    fragrances.forEach(fragrance => {
      let score = 0;
      
      // Match notes with profile preferences
      fragrance.notes.forEach(noteObj => {
        const noteName = noteObj.name.toLowerCase();
        
        // Look for matching notes in the profile
        Object.entries(profile.notes).forEach(([profileNote, value]) => {
          const profileNoteLower = profileNote.toLowerCase();
          
          // Check for exact match or partial match
          if (noteName === profileNoteLower || 
              noteName.includes(profileNoteLower) || 
              profileNoteLower.includes(noteName)) {
            
            // Weight by note category
            let multiplier = 1;
            if (noteObj.category === 'top') multiplier = 1.5;
            if (noteObj.category === 'middle') multiplier = 1.2; // Changed from 'heart' to 'middle'
            if (noteObj.category === 'base') multiplier = 1.0;
            
            score += value * multiplier * 10;
          }
        });
      });
      
      // Match gender preference
      if (profile.factors.gender && 
         (profile.factors.gender === fragrance.gender || 
          fragrance.gender === 'unisex')) {
        score += 5;
      }
      
      // Match seasonal preference
      const matchingSeason = fragrance.seasons.some(season => 
        profile.preferences.seasonality[season.toLowerCase() as keyof typeof profile.preferences.seasonality] > 0.5
      );
      
      if (matchingSeason) {
        score += 4;
      }
      
      // Match intensity (penalize large differences)
      const intensityDiff = Math.abs(fragrance.intensity - profile.preferences.intensity);
      score -= intensityDiff * 0.5;
      
      // Save score
      scores.set(fragrance.id, score);
    });
    
    return scores;
  }
  
  // Collaborative filtering simulation (25% of recommendation weight)
  private collaborativeFiltering(profile: ScentProfile): Map<number, number> {
    const scores = new Map<number, number>();
    
    // In a real system, this would use actual user data
    // Here we're simulating based on ratings, popularity, etc.
    fragrances.forEach(fragrance => {
      // Use rating as a proxy for collaborative filtering
      let score = fragrance.rating * 2;
      
      // Boost newer fragrances
      const currentYear = new Date().getFullYear();
      if (fragrance.launchYear) {
        const age = currentYear - fragrance.launchYear;
        // Higher score for newer fragrances (max bonus of 3)
        const newnessFactor = Math.max(0, 3 - (age / 2));
        score += newnessFactor;
      }
      
      // Simulate "similar users liked" effect 
      // Match on some key factors like occasion and intensity
      if (profile.factors.occasion) {
        if (fragrance.occasions.includes(profile.factors.occasion)) {
          score += 3;
        }
      }
      
      scores.set(fragrance.id, score);
    });
    
    return scores;
  }
  
  // Seasonal and local trend analysis (15% of recommendation weight)
  private seasonalTrendAnalysis(): Map<number, number> {
    const scores = new Map<number, number>();
    
    // Get current season and local trends
    const now = new Date();
    const month = now.getMonth();
    
    // Determine current season
    let currentSeason: string;
    if (month >= 2 && month <= 4) currentSeason = 'Spring';
    else if (month >= 5 && month <= 7) currentSeason = 'Summer';
    else if (month >= 8 && month <= 10) currentSeason = 'Fall';
    else currentSeason = 'Winter';
    
    fragrances.forEach(fragrance => {
      let score = 0;
      
      // Match current season
      if (fragrance.seasons.includes(currentSeason)) {
        score += 5;
      }
      
      // For each season, adjust score based on season-appropriate notes
      if (currentSeason === 'Summer') {
        // Boost fresh, citrusy scents in summer
        if (fragrance.categories.some(c => 
          ['Fresh', 'Citrus', 'Aquatic', 'Marine'].includes(c))) {
          score += 3;
        }
        // Lower scores for heavy fragrances in summer
        if (fragrance.intensity > 7) {
          score -= 2;
        }
      } else if (currentSeason === 'Winter') {
        // Boost warm, spicy scents in winter
        if (fragrance.categories.some(c => 
          ['Oriental', 'Woody', 'Spicy', 'Gourmand'].includes(c))) {
          score += 3;
        }
        // Higher scores for stronger fragrances in winter
        if (fragrance.intensity > 7) {
          score += 2;
        }
      } else if (currentSeason === 'Fall') {
        // Boost woody, amber scents in fall
        if (fragrance.categories.some(c => 
          ['Woody', 'Amber', 'Spicy', 'Oriental'].includes(c))) {
          score += 3;
        }
      } else {
        // Spring - boost floral, green scents
        if (fragrance.categories.some(c => 
          ['Floral', 'Green', 'Fresh', 'Fruity'].includes(c))) {
          score += 3;
        }
      }
      
      // Toronto location-specific adjustments
      // In a real app, this would use geolocation and local weather
      // For now we'll use a simplified approach based on current month
      
      // Simulated Toronto weather adjustment
      if (month >= 11 || month <= 1) {
        // Cold Toronto winters - boost warmer, deeper scents
        if (fragrance.categories.some(c => ['Woody', 'Oriental', 'Spicy'].includes(c))) {
          score += 2;
        }
      } else if (month >= 6 && month <= 8) {
        // Humid Toronto summers - boost lighter scents
        if (fragrance.intensity < 6 && 
            fragrance.categories.some(c => ['Fresh', 'Citrus', 'Aquatic'].includes(c))) {
          score += 2;
        }
      }
      
      scores.set(fragrance.id, score);
    });
    
    return scores;
  }
  
  // Neural network prediction (enhancement to content-based filtering)
  private async neuralPrediction(profile: ScentProfile): Promise<Map<number, number>> {
    const scores = new Map<number, number>();
    
    if (!this.isModelReady || !this.model) {
      console.log("Neural model not ready, skipping neural prediction");
      return scores;
    }
    
    try {
      // Generate feature vector from profile
      const features = this.generateFeatureVector(profile);
      
      // Create tensor from features
      const inputTensor = tf.tensor2d([features]);
      
      // Make prediction
      const prediction = this.model.predict(inputTensor) as tf.Tensor;
      const predictionData = await prediction.data();
      
      // Map prediction values to fragrances by category
      fragrances.forEach(fragrance => {
        let neuralScore = 0;
        
        // Find matching categories between prediction and fragrance
        fragrance.categories.forEach((category, idx) => {
          const categoryIndex = this.getCategoryIndex(category);
          if (categoryIndex !== -1 && categoryIndex < predictionData.length) {
            neuralScore += predictionData[categoryIndex] * 10;
          }
        });
        
        scores.set(fragrance.id, neuralScore);
      });
      
      // Clean up tensors
      inputTensor.dispose();
      prediction.dispose();
      
    } catch (error) {
      console.error("Error in neural prediction:", error);
    }
    
    return scores;
  }
  
  // Map category name to index in prediction output
  private getCategoryIndex(category: string): number {
    const categories = [
      'Citrus', 'Floral', 'Woody', 'Oriental', 'Fresh',
      'Aquatic', 'Spicy', 'Green', 'Fruity', 'Amber'
    ];
    
    return categories.findIndex(c => 
      c.toLowerCase() === category.toLowerCase() || 
      category.toLowerCase().includes(c.toLowerCase())
    );
  }
  
  // User feedback processing for online learning
  public async processUserFeedback(
    likedFragranceIds: number[],
    dislikedFragranceIds: number[],
    profile: ScentProfile
  ): Promise<void> {
    if (!this.isModelReady || !this.model) {
      console.log("Model not ready, feedback not processed");
      return;
    }
    
    try {
      // Generate training data from feedback
      const featureVector = this.generateFeatureVector(profile);
      const inputTensor = tf.tensor2d([featureVector]);
      
      // Create target output based on liked/disliked fragrances
      const targetOutput = new Array(10).fill(0.5); // Neutral baseline
      
      // Adjust target outputs based on feedback
      likedFragranceIds.forEach(id => {
        const fragrance = fragrances.find(f => f.id === id);
        if (fragrance) {
          fragrance.categories.forEach(category => {
            const categoryIndex = this.getCategoryIndex(category);
            if (categoryIndex !== -1 && categoryIndex < targetOutput.length) {
              targetOutput[categoryIndex] = 0.9; // Strong positive
            }
          });
        }
      });
      
      dislikedFragranceIds.forEach(id => {
        const fragrance = fragrances.find(f => f.id === id);
        if (fragrance) {
          fragrance.categories.forEach(category => {
            const categoryIndex = this.getCategoryIndex(category);
            if (categoryIndex !== -1 && categoryIndex < targetOutput.length) {
              targetOutput[categoryIndex] = 0.1; // Strong negative
            }
          });
        }
      });
      
      const outputTensor = tf.tensor2d([targetOutput]);
      
      // Train the model with this example
      await this.model.fit(inputTensor, outputTensor, {
        epochs: 5,
        verbose: 0
      });
      
      // Clean up tensors
      inputTensor.dispose();
      outputTensor.dispose();
      
      toast.success("Your feedback improved future recommendations");
      console.log("Model updated with user feedback");
      
    } catch (error) {
      console.error("Error processing user feedback:", error);
    }
  }
  
  // Normalize scores to 0-1 range
  private normalizeScores(scores: Map<number, number>): Map<number, number> {
    // Find max score
    let maxScore = 0;
    scores.forEach((score) => {
      maxScore = Math.max(maxScore, score);
    });
    
    // Normalize if max > 0
    if (maxScore > 0) {
      const normalized = new Map<number, number>();
      scores.forEach((score, id) => {
        normalized.set(id, score / maxScore);
      });
      return normalized;
    }
    
    return scores;
  }
  
  // Main recommendation function combining all approaches
  public async generateRecommendations(profile: ScentProfile): Promise<Fragrance[]> {
    try {
      // Get scores from each approach
      const contentScores = this.contentBasedFiltering(profile);
      const collaborativeScores = this.collaborativeFiltering(profile);
      const seasonalScores = this.seasonalTrendAnalysis();
      const neuralScores = await this.neuralPrediction(profile);
      
      // Normalize all scores to 0-1 range
      const normalizedContentScores = this.normalizeScores(contentScores);
      const normalizedCollabScores = this.normalizeScores(collaborativeScores);
      const normalizedSeasonalScores = this.normalizeScores(seasonalScores);
      const normalizedNeuralScores = this.normalizeScores(neuralScores);
      
      // Combine scores using hybrid approach
      const combinedScores = new Map<number, number>();
      
      fragrances.forEach(fragrance => {
        const id = fragrance.id;
        let finalScore = 0;
        
        // Content-based (weighted by CONTENT_BASED factor - 60%)
        if (normalizedContentScores.has(id)) {
          finalScore += (normalizedContentScores.get(id) || 0) * WEIGHTS.CONTENT_BASED;
        }
        
        // Collaborative (weighted by COLLABORATIVE factor - 25%)
        if (normalizedCollabScores.has(id)) {
          finalScore += (normalizedCollabScores.get(id) || 0) * WEIGHTS.COLLABORATIVE;
        }
        
        // Seasonal (weighted by SEASONAL factor - 15%)
        if (normalizedSeasonalScores.has(id)) {
          finalScore += (normalizedSeasonalScores.get(id) || 0) * WEIGHTS.SEASONAL;
        }
        
        // Neural predictions (bonus points - enhance content-based filtering)
        if (normalizedNeuralScores.has(id)) {
          // Add a small bonus based on neural predictions
          finalScore += (normalizedNeuralScores.get(id) || 0) * 0.1;
        }
        
        // Add a small random factor (1-5%) to prevent identical results
        const randomFactor = 1 + (Math.random() * 0.04);
        finalScore *= randomFactor;
        
        combinedScores.set(id, finalScore);
      });
      
      // Sort fragrances by final score
      const sortedResults = fragrances
        .map(fragrance => ({
          ...fragrance,
          score: combinedScores.get(fragrance.id) || 0
        }))
        .sort((a, b) => b.score - a.score);
      
      // Return sorted fragrances (without the score property)
      return sortedResults.map(({ score, ...rest }) => rest);
      
    } catch (error) {
      console.error("Error generating recommendations:", error);
      toast.error("There was an issue with recommendations");
      
      // Fallback to basic recommendations if error occurs
      return fragrances.slice(0, 8);
    }
  }
}

// Create and export singleton instance
export const enhancedRecommendationEngine = new EnhancedRecommendationEngine();
