
import * as tf from '@tensorflow/core';

// This is a simplified TF.js integration for demonstration purposes
// In a real application, you would use a properly trained model

interface TensorData {
  input: number[];
  output: number[];
}

export class ScentPredictionModel {
  private model: tf.Sequential | null = null;
  private isTraining = false;
  private noteCategories: string[] = [
    'Citrus', 'Floral', 'Woody', 'Oriental', 'Fresh', 
    'Aquatic', 'Spicy', 'Green', 'Fruity', 'Amber'
  ];

  constructor() {
    this.initModel();
  }

  private initModel() {
    try {
      this.model = tf.sequential();
      
      // Simple neural network with 2 layers
      this.model.add(tf.layers.dense({
        inputShape: [20], // Input features (quiz answers encoded)
        units: 16,
        activation: 'relu'
      }));
      
      this.model.add(tf.layers.dense({
        units: 10, // Output is 10 note categories
        activation: 'sigmoid'
      }));
      
      this.model.compile({
        optimizer: tf.train.adam(0.01),
        loss: 'meanSquaredError'
      });
      
      console.log("TensorFlow.js model initialized successfully");
    } catch (error) {
      console.error("Error initializing TensorFlow.js model:", error);
      this.model = null;
    }
  }

  // Convert quiz answers to tensor input
  public encodeQuizAnswers(answers: Record<string, string>): number[] {
    // In a real application, this would be a more sophisticated encoding
    // Here we're doing a very basic encoding for demonstration
    const encoded: number[] = new Array(20).fill(0);
    
    // Simple encoding of answers into numerical values
    let i = 0;
    for (const key in answers) {
      if (i >= 20) break; // Limit to input size
      
      const value = answers[key];
      // Simple hash of string to number between 0 and 1
      encoded[i] = this.hashString(value) / 100;
      i++;
    }
    
    return encoded;
  }

  // Simple string hash function
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash % 100);
  }

  // Predict note affinities from quiz answers
  public async predict(answers: Record<string, string>): Promise<Record<string, number>> {
    if (!this.model) {
      console.error("Model not initialized");
      return this.getFallbackPredictions();
    }
    
    try {
      const input = this.encodeQuizAnswers(answers);
      const inputTensor = tf.tensor2d([input]);
      
      const outputTensor = this.model.predict(inputTensor) as tf.Tensor;
      const output = await outputTensor.data();
      
      // Clean up tensors
      inputTensor.dispose();
      outputTensor.dispose();
      
      // Convert output to note affinities
      const predictions: Record<string, number> = {};
      for (let i = 0; i < this.noteCategories.length; i++) {
        predictions[this.noteCategories[i]] = output[i];
      }
      
      return predictions;
    } catch (error) {
      console.error("Error making prediction:", error);
      return this.getFallbackPredictions();
    }
  }

  // Simple fallback if model fails
  private getFallbackPredictions(): Record<string, number> {
    const predictions: Record<string, number> = {};
    for (const note of this.noteCategories) {
      predictions[note] = Math.random() * 0.5 + 0.25; // Random values between 0.25 and 0.75
    }
    return predictions;
  }

  // Improve model with user feedback
  public async learnFromFeedback(
    answers: Record<string, string>,
    likedNotes: string[],
    dislikedNotes: string[]
  ): Promise<void> {
    if (!this.model || this.isTraining) {
      return;
    }
    
    try {
      this.isTraining = true;
      
      // Prepare training data from feedback
      const trainingData: TensorData = {
        input: this.encodeQuizAnswers(answers),
        output: new Array(10).fill(0.5) // Default neutral
      };
      
      // Adjust output based on liked/disliked notes
      for (let i = 0; i < this.noteCategories.length; i++) {
        const note = this.noteCategories[i];
        if (likedNotes.includes(note)) {
          trainingData.output[i] = 0.9; // Strong preference
        }
        if (dislikedNotes.includes(note)) {
          trainingData.output[i] = 0.1; // Strong aversion
        }
      }
      
      // Train the model on this single example
      // In a real app, you'd batch examples and train more carefully
      const xs = tf.tensor2d([trainingData.input]);
      const ys = tf.tensor2d([trainingData.output]);
      
      await this.model.fit(xs, ys, {
        epochs: 5,
        verbose: 0
      });
      
      // Clean up tensors
      xs.dispose();
      ys.dispose();
      
      console.log("Model updated with user feedback");
    } catch (error) {
      console.error("Error training model:", error);
    } finally {
      this.isTraining = false;
    }
  }
}

// Create and export a singleton instance
export const scentModel = new ScentPredictionModel();
