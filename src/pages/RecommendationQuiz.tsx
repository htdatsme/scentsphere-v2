
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useRecommendationStore, UserPreferences } from "@/lib/store";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { quizFactors } from "@/lib/data/quizFactors";
import { UserQuizAnswers, QuizFactorId } from "@/types/quiz";
import { generateScentProfile } from "@/lib/ml/scentProfileGenerator";
import { scentModel } from "@/lib/ml/tensorflowModel";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserProfile } from "@/hooks/useUserProfile";
import { supabase } from "@/integrations/supabase/client";

const RecommendationQuiz = () => {
  const navigate = useNavigate();
  const { setUserPreferences, completeQuiz, setRecommendations, setLoading } = useRecommendationStore();
  const { updatePreferences } = useUserProfile();
  const isMobile = useIsMobile();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<UserQuizAnswers>({});
  const [syncToAccount, setSyncToAccount] = useState(true);

  // Convert legacy preferences structure to work with existing store
  const convertToLegacyPreferences = (answers: UserQuizAnswers): UserPreferences => {
    const userPreferences: UserPreferences = {
      gender: 'unisex',
      occasions: [],
      notes: [],
      intensity: 5,
      seasonalPreferences: [],
      priceRange: [30, 200],
    };

    // Map occasions
    if (answers.occasion) {
      userPreferences.occasions = [answers.occasion];
    }

    // Map intensity
    if (answers.preference_strength) {
      const strengthMap = { subtle: 3, moderate: 5, strong: 8 };
      userPreferences.intensity = strengthMap[answers.preference_strength as keyof typeof strengthMap] || 5;
    }

    // Map seasonal preferences
    if (answers.season) {
      userPreferences.seasonalPreferences = [answers.season];
    }

    // Handle gender if it exists in the quiz answers
    if (answers.gender) {
      userPreferences.gender = answers.gender as 'masculine' | 'feminine' | 'unisex';
    }

    return userPreferences;
  };

  const updateAnswer = (factor: QuizFactorId, value: string) => {
    setQuizAnswers(prev => ({ ...prev, [factor]: value }));
  };

  const handleNextStep = async () => {
    const factor = quizFactors[currentStep];
    
    // Validate current step has an answer
    if (!quizAnswers[factor.id] && factor.id !== 'allergies') { // allergies can be skipped
      toast.error("Please select an option before continuing");
      return;
    }
    
    if (currentStep < quizFactors.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Form completed - process answers
      setLoading(true);
      
      try {
        // Get TensorFlow.js predictions to enhance profile
        const tfPredictions = await scentModel.predict(quizAnswers);
        
        // Generate scent profile from quiz answers
        const scentProfile = await generateScentProfile(quizAnswers);
        
        // Convert to legacy format for store compatibility
        const legacyPreferences = convertToLegacyPreferences(quizAnswers);
        
        // Save to store
        setUserPreferences(legacyPreferences);
        
        // Store the quiz answers in localStorage to use for later model improvement
        localStorage.setItem('lastQuizAnswers', JSON.stringify(quizAnswers));
        
        // Sync to Supabase if requested
        if (syncToAccount) {
          try {
            await updatePreferences({
              gender_preference: legacyPreferences.gender,
              intensity: legacyPreferences.intensity,
              price_min: legacyPreferences.priceRange[0],
              price_max: legacyPreferences.priceRange[1],
              seasons: legacyPreferences.seasonalPreferences,
              occasions: legacyPreferences.occasions,
              preferred_notes: legacyPreferences.notes
            });
            toast.success("Preferences saved to your account");
          } catch (error) {
            console.error("Failed to save preferences to account:", error);
            // Continue even if sync fails - don't block the user
          }
        }
        
        completeQuiz();
        navigate("/results");
      } catch (error) {
        console.error("Error processing quiz:", error);
        toast.error("There was a problem processing your quiz results");
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Show only the current factor's question
  const currentFactor = quizFactors[currentStep];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-6 md:py-10">
        <div className="max-w-3xl mx-auto px-4 md:px-0">
          {/* Progress indicator */}
          <div className="mb-6 md:mb-8">
            <div className="flex justify-between mb-2 text-sm md:text-base">
              <span>Question {currentStep + 1} of {quizFactors.length}</span>
              <span>{Math.round(((currentStep + 1) / quizFactors.length) * 100)}% complete</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all" 
                style={{ width: `${((currentStep + 1) / quizFactors.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <Card className="border shadow-sm">
            <CardHeader className="pb-4 md:pb-6">
              <CardTitle className="text-xl md:text-2xl font-serif">{currentFactor.title}</CardTitle>
              <CardDescription className="text-sm md:text-base">{currentFactor.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-4 md:pb-6">
              <RadioGroup
                value={quizAnswers[currentFactor.id]}
                onValueChange={(value) => updateAnswer(currentFactor.id, value)}
                className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
              >
                {currentFactor.options.map((option) => (
                  <div key={option.value}>
                    <RadioGroupItem 
                      value={option.value} 
                      id={option.value} 
                      className="peer sr-only" 
                    />
                    <Label
                      htmlFor={option.value}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 md:p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors"
                    >
                      <span className="font-medium mb-1">{option.label}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              
              {currentStep === quizFactors.length - 1 && (
                <div className="mt-6">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="sync-preferences"
                      checked={syncToAccount}
                      onChange={(e) => setSyncToAccount(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <label htmlFor="sync-preferences">
                      Save preferences to my account
                    </label>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between pt-2 md:pt-4">
              <Button 
                variant="outline" 
                onClick={handlePrevStep}
                disabled={currentStep === 0}
                className="px-3 md:px-4"
                size={isMobile ? "sm" : "default"}
              >
                Back
              </Button>
              <Button 
                onClick={handleNextStep}
                className="px-3 md:px-4"
                size={isMobile ? "sm" : "default"}
              >
                {currentStep === quizFactors.length - 1 ? "Complete" : "Next"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RecommendationQuiz;
