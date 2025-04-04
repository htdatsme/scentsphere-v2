import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecommendationStore } from "@/lib/store";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fragrances } from "@/lib/data/fragranceData";
import { generateScentProfile, generateRecommendations } from "@/lib/ml/scentProfileGenerator";
import { scentModel } from "@/lib/ml/tensorflowModel";
import { ScentProfile, UserQuizAnswers } from "@/types/quiz";
import ScentProfileChart from "@/components/ScentProfileChart";
import { toast } from "sonner";
import { Heart, ThumbsUp, ThumbsDown } from "lucide-react";

const Results = () => {
  const { 
    userPreferences, 
    setRecommendations, 
    recommendations, 
    isLoading, 
    setLoading 
  } = useRecommendationStore();
  
  const [activeTab, setActiveTab] = useState("recommended");
  const [scentProfile, setScentProfile] = useState<ScentProfile | null>(null);
  const [likedNotes, setLikedNotes] = useState<string[]>([]);
  const [dislikedNotes, setDislikedNotes] = useState<string[]>([]);

  useEffect(() => {
    // Load recommendations
    const loadRecommendations = async () => {
      if (!userPreferences) return;
      
      setLoading(true);
      
      try {
        // Try to get the raw quiz answers from localStorage for better ML predictions
        const savedAnswers = localStorage.getItem('lastQuizAnswers');
        const quizAnswers: UserQuizAnswers = savedAnswers 
          ? JSON.parse(savedAnswers) 
          : {};
          
        // Generate scent profile
        const profile = await generateScentProfile(quizAnswers);
        setScentProfile(profile);
        
        // Generate recommendations
        const recommendedFragrances = await generateRecommendations(profile);
        setRecommendations(recommendedFragrances);
        
        // Feedback success
        toast.success("Your personalized recommendations are ready!");
      } catch (error) {
        console.error("Error generating recommendations:", error);
        toast.error("There was an issue generating your recommendations");
        
        // Fallback to sample data
        setRecommendations(fragrances);
      } finally {
        setLoading(false);
      }
    };
    
    loadRecommendations();
  }, [userPreferences, setRecommendations, setLoading]);

  // Handle note preference feedback
  const handleNoteFeedback = async (note: string, liked: boolean) => {
    if (!scentProfile) return;
    
    try {
      // Update liked/disliked state
      if (liked) {
        setLikedNotes(prev => [...prev.filter(n => n !== note), note]);
        setDislikedNotes(prev => prev.filter(n => n !== note));
        toast.success(`Added ${note} to your liked notes`);
      } else {
        setDislikedNotes(prev => [...prev.filter(n => n !== note), note]);
        setLikedNotes(prev => prev.filter(n => n !== note));
        toast.success(`Added ${note} to your disliked notes`);
      }
      
      // Get stored quiz answers for ML training
      const savedAnswers = localStorage.getItem('lastQuizAnswers');
      if (savedAnswers) {
        const quizAnswers: UserQuizAnswers = JSON.parse(savedAnswers);
        
        // Train model with this feedback
        await scentModel.learnFromFeedback(
          quizAnswers, 
          liked ? [note] : [], 
          liked ? [] : [note]
        );
      }
    } catch (error) {
      console.error("Error updating preference:", error);
    }
  };

  if (!userPreferences) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container py-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-serif font-bold mb-4">No Preferences Found</h1>
            <p className="mb-6">Please complete the quiz to get your personalized recommendations.</p>
            <Link to="/quiz">
              <Button>Take the Quiz</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-serif font-bold mb-3">Your Fragrance Recommendations</h1>
            <p className="text-muted-foreground">Based on your unique preferences, we've selected these fragrances just for you.</p>
          </div>

          {/* Scent profile visualization */}
          {scentProfile && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="font-serif">Your Scent Profile</CardTitle>
                <CardDescription>This chart shows your affinity to different fragrance notes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-full md:w-1/2">
                    <ScentProfileChart profile={scentProfile} />
                  </div>
                  <div className="w-full md:w-1/2">
                    <h3 className="text-lg font-medium mb-3">Your Top Notes</h3>
                    <div className="space-y-3">
                      {Object.entries(scentProfile.notes)
                        .sort(([_, a], [__, b]) => b - a)
                        .slice(0, 5)
                        .map(([note, value]) => (
                          <div key={note} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span>{note}</span>
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className={`h-6 w-6 ${likedNotes.includes(note) ? 'text-green-500' : ''}`}
                                  onClick={() => handleNoteFeedback(note, true)}
                                >
                                  <ThumbsUp className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className={`h-6 w-6 ${dislikedNotes.includes(note) ? 'text-red-500' : ''}`}
                                  onClick={() => handleNoteFeedback(note, false)}
                                >
                                  <ThumbsDown className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="w-1/2 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-full rounded-full" 
                                style={{ width: `${value * 100}%` }} 
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">
                      <p>Use the thumbs up/down buttons to refine your preferences for future recommendations.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Tabs defaultValue="recommended" className="mb-8">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="recommended" onClick={() => setActiveTab("recommended")}>Recommended</TabsTrigger>
              <TabsTrigger value="best-match" onClick={() => setActiveTab("best-match")}>Best Match</TabsTrigger>
              <TabsTrigger value="popular" onClick={() => setActiveTab("popular")}>Popular</TabsTrigger>
            </TabsList>

            <TabsContent value="recommended" className="mt-6">
              {isLoading ? (
                <div className="text-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Finding your perfect scent...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((fragrance) => (
                    <Card key={fragrance.id} className="overflow-hidden group">
                      <div className="aspect-square overflow-hidden relative">
                        <img 
                          src={fragrance.imageUrl} 
                          alt={fragrance.name} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-background/50 backdrop-blur-sm hover:bg-background/80"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardHeader>
                        <CardTitle className="font-serif">{fragrance.name}</CardTitle>
                        <CardDescription>{fragrance.brand}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-4">{fragrance.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {fragrance.notes.slice(0, 3).map((note) => (
                            <span 
                              key={note.name} 
                              className="text-xs bg-secondary px-2 py-1 rounded-full"
                            >
                              {note.name}
                            </span>
                          ))}
                          {fragrance.notes.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{fragrance.notes.length - 3} more
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">${fragrance.price}</span>
                          <div className="flex items-center">
                            <span className="text-yellow-500 mr-1">★</span>
                            <span>{fragrance.rating}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">Learn More</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="best-match" className="mt-6">
              {isLoading ? (
                <div className="text-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Finding your best matches...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendations.slice(0, 2).map((fragrance) => (
                    <Card key={fragrance.id} className="overflow-hidden group">
                      <div className="aspect-square overflow-hidden relative">
                        <img 
                          src={fragrance.imageUrl} 
                          alt={fragrance.name} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-background/50 backdrop-blur-sm hover:bg-background/80"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardHeader>
                        <CardTitle className="font-serif">{fragrance.name}</CardTitle>
                        <CardDescription>{fragrance.brand}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-4">{fragrance.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {fragrance.notes.slice(0, 3).map((note) => (
                            <span 
                              key={note.name} 
                              className="text-xs bg-secondary px-2 py-1 rounded-full"
                            >
                              {note.name}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">${fragrance.price}</span>
                          <div className="flex items-center">
                            <span className="text-yellow-500 mr-1">★</span>
                            <span>{fragrance.rating}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">Learn More</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="popular" className="mt-6">
              {isLoading ? (
                <div className="text-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading popular fragrances...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[...recommendations].sort((a, b) => b.rating - a.rating).map((fragrance) => (
                    <Card key={fragrance.id} className="overflow-hidden group">
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={fragrance.imageUrl} 
                          alt={fragrance.name} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="font-serif">{fragrance.name}</CardTitle>
                        <CardDescription>{fragrance.brand}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">${fragrance.price}</span>
                          <div className="flex items-center">
                            <span className="text-yellow-500 mr-1">★</span>
                            <span>{fragrance.rating}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">Learn More</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-serif font-bold mb-4">Want to Try Again?</h2>
            <p className="mb-6 text-muted-foreground">Not seeing what you like? Take the quiz again to refine your recommendations.</p>
            <Link to="/quiz">
              <Button variant="outline">Retake Quiz</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Results;
