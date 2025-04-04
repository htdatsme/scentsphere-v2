
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

const RecommendationQuiz = () => {
  const navigate = useNavigate();
  const { setUserPreferences, completeQuiz } = useRecommendationStore();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({
    gender: 'unisex',
    occasions: [],
    notes: [],
    intensity: 5,
    seasonalPreferences: [],
    priceRange: [30, 200],
  });

  const updatePreferences = (key: keyof UserPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const steps = [
    {
      title: "Gender Preference",
      description: "What type of fragrances do you typically prefer?",
      content: (
        <RadioGroup
          value={preferences.gender}
          onValueChange={(value) => updatePreferences('gender', value)}
          className="grid grid-cols-3 gap-4"
        >
          <div>
            <RadioGroupItem value="masculine" id="masculine" className="peer sr-only" />
            <Label
              htmlFor="masculine"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              <span className="text-xl mb-2">♂</span>
              <span>Masculine</span>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem value="feminine" id="feminine" className="peer sr-only" />
            <Label
              htmlFor="feminine"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              <span className="text-xl mb-2">♀</span>
              <span>Feminine</span>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem value="unisex" id="unisex" className="peer sr-only" />
            <Label
              htmlFor="unisex"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              <span className="text-xl mb-2">⚧</span>
              <span>Unisex</span>
            </Label>
          </div>
        </RadioGroup>
      ),
    },
    {
      title: "Occasions",
      description: "When do you typically wear fragrance? (Select all that apply)",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["Everyday", "Work", "Date Night", "Special Occasion", "Outdoor Activities", "Evening Out"].map((occasion) => (
            <div key={occasion} className="flex items-center space-x-2">
              <Checkbox 
                id={occasion} 
                checked={preferences.occasions?.includes(occasion)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updatePreferences('occasions', [...(preferences.occasions || []), occasion]);
                  } else {
                    updatePreferences(
                      'occasions',
                      preferences.occasions?.filter((o) => o !== occasion) || []
                    );
                  }
                }}
              />
              <Label htmlFor={occasion}>{occasion}</Label>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Scent Notes",
      description: "Which scent families do you prefer? (Select all that apply)",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Citrus (lemon, bergamot, orange)",
            "Floral (rose, jasmine, lily)",
            "Woody (cedar, sandalwood)",
            "Oriental (vanilla, amber, spices)",
            "Fresh (sea breeze, green notes)",
            "Fruity (apple, peach, berries)",
            "Gourmand (caramel, chocolate)",
            "Aromatic (lavender, herbs)"
          ].map((note) => (
            <div key={note} className="flex items-center space-x-2">
              <Checkbox 
                id={note} 
                checked={preferences.notes?.includes(note)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updatePreferences('notes', [...(preferences.notes || []), note]);
                  } else {
                    updatePreferences(
                      'notes',
                      preferences.notes?.filter((n) => n !== note) || []
                    );
                  }
                }}
              />
              <Label htmlFor={note}>{note}</Label>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Intensity",
      description: "How strong do you prefer your fragrance to be?",
      content: (
        <div className="space-y-6">
          <Slider
            defaultValue={[preferences.intensity || 5]}
            max={10}
            step={1}
            onValueChange={(value) => updatePreferences('intensity', value[0])}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Subtle</span>
            <span>Moderate</span>
            <span>Strong</span>
          </div>
        </div>
      ),
    },
    {
      title: "Seasonal Preferences",
      description: "When do you plan to wear this fragrance? (Select all that apply)",
      content: (
        <div className="grid grid-cols-2 gap-4">
          {["Spring", "Summer", "Fall", "Winter"].map((season) => (
            <div key={season} className="flex items-center space-x-2">
              <Checkbox 
                id={season} 
                checked={preferences.seasonalPreferences?.includes(season)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updatePreferences('seasonalPreferences', [...(preferences.seasonalPreferences || []), season]);
                  } else {
                    updatePreferences(
                      'seasonalPreferences',
                      preferences.seasonalPreferences?.filter((s) => s !== season) || []
                    );
                  }
                }}
              />
              <Label htmlFor={season}>{season}</Label>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Price Range",
      description: "What's your budget for a fragrance?",
      content: (
        <div className="space-y-6">
          <Slider
            defaultValue={preferences.priceRange}
            min={20}
            max={500}
            step={10}
            onValueChange={(value) => updatePreferences('priceRange', [value[0], value[1]])}
          />
          <div className="flex justify-between">
            <span>
              ${preferences.priceRange ? preferences.priceRange[0] : 20}
            </span>
            <span>
              ${preferences.priceRange ? preferences.priceRange[1] : 500}
            </span>
          </div>
        </div>
      ),
    },
  ];

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Form completed
      setUserPreferences(preferences as UserPreferences);
      completeQuiz();
      navigate("/results");
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-10">
        <div className="max-w-3xl mx-auto">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span>Question {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% complete</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all" 
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-serif">{currentStepData.title}</CardTitle>
              <CardDescription>{currentStepData.description}</CardDescription>
            </CardHeader>
            <CardContent>{currentStepData.content}</CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePrevStep}
                disabled={currentStep === 0}
              >
                Back
              </Button>
              <Button onClick={handleNextStep}>
                {currentStep === steps.length - 1 ? "Complete" : "Next"}
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
