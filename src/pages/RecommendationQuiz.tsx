
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useRecommendationStore, UserPreferences } from "@/lib/store";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { quizFactors } from "@/lib/data/quizFactors";
import { UserQuizAnswers, QuizFactorId } from "@/types/quiz";
import { generateScentProfile } from "@/lib/ml/scentProfileGenerator";
import { scentModel } from "@/lib/ml/tensorflowModel";
import { toast } from "sonner";

const RecommendationQuiz = () => {
  const navigate = useNavigate();
  const { setUserPreferences, completeQuiz, setRecommendations, setLoading } = useRecommendationStore();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<UserQuizAnswers>({});

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

    // Map gender preference
    if (answers.gender) {
      userPreferences.gender = answers.gender as 'masculine' | 'feminine' | 'unisex';
    }

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
      <main className="flex-1 container py-10">
        <div className="max-w-3xl mx-auto">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
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

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-serif">{currentFactor.title}</CardTitle>
              <CardDescription>{currentFactor.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={quizAnswers[currentFactor.id]}
                onValueChange={(value) => updateAnswer(currentFactor.id, value)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
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
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <span className="font-medium mb-1">{option.label}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePrevStep}
                disabled={currentStep === 0}
              >
                Back
              </Button>
              <Button onClick={handleNextStep}>
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
