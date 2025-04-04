
// Quiz factor types
export type QuizFactorId = 
  | 'season' 
  | 'skin_chemistry' 
  | 'occasion' 
  | 'personality' 
  | 'preference_strength' 
  | 'age_range'
  | 'outdoor_activities'
  | 'desired_impression'
  | 'previous_favorites'
  | 'allergies'
  | 'time_of_day'
  | 'environment'
  | 'gender';  // Added gender to the QuizFactorId type

export type NoteAffinity = {
  note: string;
  strength: number; // 0 to 1
};

export type QuizOption = {
  value: string;
  label: string;
  note_affinities: NoteAffinity[];
};

export type QuizFactor = {
  id: QuizFactorId;
  title: string;
  description: string;
  weight: number; // 0.1 to 0.3
  options: QuizOption[];
};

export type UserQuizAnswers = {
  [key in QuizFactorId]?: string;
};

export type ScentProfile = {
  notes: {
    [key: string]: number; // Note name -> affinity (0-1)
  };
  factors: {
    [key in QuizFactorId]?: string;
  };
  preferences: {
    intensity: number;
    longevity: number;
    uniqueness: number;
    seasonality: {
      spring: number;
      summer: number;
      fall: number;
      winter: number;
    };
    occasions: {
      [key: string]: number;
    };
  };
};
