
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecommendationStore } from "@/lib/store";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OptimizedImage from "@/components/ui/optimized-image";
import { fragrances } from "@/lib/data/fragranceData";
import { enhancedRecommendationEngine } from "@/lib/ml/enhancedRecommendationEngine";
import { ScentProfile, UserQuizAnswers } from "@/types/quiz";
import ScentProfileChart from "@/components/ScentProfileChart";
import RatingFeedback from "@/components/RatingFeedback";
import { toast } from "sonner";
import { Heart, ThumbsUp, ThumbsDown, Star, StarHalf, Info } from "lucide-react";

const Results = () => {
  const { 
    userPreferences, 
    setRecommendations, 
    recommendations, 
    isLoading, 
    setLoading,
    likedNotes,
    dislikedNotes,
    addLikedNote,
    addDislikedNote,
    ratedFragrances,
    rateFragrance
  } = useRecommendationStore();
  
  const [activeTab, setActiveTab] = useState("recommended");
  const [scentProfile, setScentProfile] = useState<ScentProfile | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!userPreferences) return;
      
      setLoading(true);
      
      try {
        const savedAnswers = localStorage.getItem('lastQuizAnswers');
        const quizAnswers: UserQuizAnswers = savedAnswers 
          ? JSON.parse(savedAnswers) 
          : {};
          
        // Use the enhanced recommendation engine
        const profile = await (async () => {
          try {
            // Simulate profile generation with loading delay for better UX
            const profileResult = await import('@/lib/ml/scentProfileGenerator')
              .then(module => module.generateScentProfile(quizAnswers));
            
            return profileResult;
          } catch (error) {
            console.error("Error generating scent profile:", error);
            throw error;
          }
        })();
        
        setScentProfile(profile);
        
        // Use the enhanced recommendation algorithm
        const recommendedFragrances = await enhancedRecommendationEngine.generateRecommendations(profile);
        setRecommendations(recommendedFragrances);
        
        const savedFavorites = localStorage.getItem('favoriteFragrances');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
        
        toast.success("Your personalized recommendations are ready!");
      } catch (error) {
        console.error("Error generating recommendations:", error);
        toast.error("There was an issue generating your recommendations");
        
        setRecommendations(fragrances.slice(0, 6));
      } finally {
        setLoading(false);
      }
    };
    
    loadRecommendations();
  }, [userPreferences, setRecommendations, setLoading]);

  const handleNoteFeedback = async (note: string, liked: boolean) => {
    if (!scentProfile) return;
    
    try {
      if (liked) {
        addLikedNote(note);
        toast.success(`Added ${note} to your liked notes`);
      } else {
        addDislikedNote(note);
        toast.success(`Added ${note} to your disliked notes`);
      }
      
      // If we have user quiz answers, learn from this feedback
      const savedAnswers = localStorage.getItem('lastQuizAnswers');
      if (savedAnswers && scentProfile) {
        const quizAnswers: UserQuizAnswers = JSON.parse(savedAnswers);
        
        // Process through the TensorFlow model in the enhanced engine
        if (liked) {
          enhancedRecommendationEngine.processUserFeedback(
            [], [], scentProfile
          );
        } else {
          enhancedRecommendationEngine.processUserFeedback(
            [], [], scentProfile
          );
        }
      }
    } catch (error) {
      console.error("Error updating preference:", error);
    }
  };

  const toggleFavorite = (id: number) => {
    let newFavorites: number[];
    
    if (favorites.includes(id)) {
      newFavorites = favorites.filter(fav => fav !== id);
      toast.success("Removed from favorites");
    } else {
      newFavorites = [...favorites, id];
      toast.success("Added to favorites");
    }
    
    setFavorites(newFavorites);
    localStorage.setItem('favoriteFragrances', JSON.stringify(newFavorites));
  };

  const handleRating = (id: number, rating: number) => {
    rateFragrance(id, rating);
    
    // If we have a scent profile, send feedback to the model
    if (scentProfile) {
      if (rating >= 4) {
        // User liked this fragrance
        enhancedRecommendationEngine.processUserFeedback(
          [id], [], scentProfile
        );
      } else if (rating <= 2) {
        // User disliked this fragrance
        enhancedRecommendationEngine.processUserFeedback(
          [], [id], scentProfile
        );
      }
    }
  };

  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`star-${i}`} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
        ))}
        {hasHalfStar && <StarHalf className="w-4 h-4 fill-yellow-500 text-yellow-500" />}
        <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (!userPreferences) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container py-10 premium-bg-pattern">
          <div className="max-w-3xl mx-auto text-center glass p-8 rounded-xl">
            <h1 className="text-3xl font-serif font-bold mb-4">No Preferences Found</h1>
            <p className="mb-6 text-muted-foreground">Please complete the quiz to get your personalized recommendations.</p>
            <Link to="/quiz">
              <Button className="premium-button">Take the Quiz</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen luxury-bg">
      <Header />
      <main className="flex-1 container py-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-serif font-bold mb-3 text-gradient">Your Fragrance Recommendations</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Based on your unique preferences, we've selected these premium fragrances just for you.
            </p>
          </div>

          {scentProfile && (
            <Card className="mb-10 premium-card backdrop-blur-sm bg-background/80">
              <CardHeader>
                <CardTitle className="font-serif text-2xl">Your Scent Profile</CardTitle>
                <CardDescription>This chart shows your affinity to different fragrance notes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-8 items-center">
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
                            <div className="w-1/2 bg-muted rounded-full h-2 overflow-hidden">
                              <div 
                                className="bg-primary h-full rounded-full" 
                                style={{ width: `${value * 100}%` }} 
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/30">
                      <p>Use the thumbs up/down buttons to refine your preferences for future recommendations.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Tabs defaultValue="recommended" className="mb-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-6">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {recommendations.map((fragrance) => (
                    <Card key={fragrance.id} className="scent-card overflow-hidden product-card-hover">
                      <div className="aspect-square overflow-hidden relative">
                        <OptimizedImage 
                          src={fragrance.imageUrl} 
                          alt={`${fragrance.brand} - ${fragrance.name}`}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          width={400}
                          height={400}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background/90 z-10 ${
                            favorites.includes(fragrance.id) ? 'text-primary' : ''
                          }`}
                          onClick={() => toggleFavorite(fragrance.id)}
                        >
                          <Heart className={`h-5 w-5 ${favorites.includes(fragrance.id) ? 'fill-primary' : ''}`} />
                        </Button>
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="font-serif">{fragrance.name}</CardTitle>
                            <CardDescription>{fragrance.brand}</CardDescription>
                          </div>
                          <div className="flex items-center">
                            {renderRating(fragrance.rating)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-4 line-clamp-2">{fragrance.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {fragrance.notes.slice(0, 3).map((note) => (
                            <span 
                              key={`${fragrance.id}-${note.name}`} 
                              className="text-xs bg-secondary/70 text-secondary-foreground px-2 py-1 rounded-full"
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
                          <span className="font-medium text-lg">${fragrance.price}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-muted px-2 py-1 rounded-full">{fragrance.gender}</span>
                            <span className="text-xs bg-muted px-2 py-1 rounded-full">{fragrance.intensity}/10</span>
                          </div>
                        </div>
                        
                        {/* Add rating component */}
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-1">Rate this recommendation:</p>
                          <RatingFeedback 
                            fragranceId={fragrance.id} 
                            initialRating={ratedFragrances.get(fragrance.id) || 0}
                          />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="default" className="w-full premium-button">
                          <Info className="mr-2 h-4 w-4" /> Learn More
                        </Button>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {recommendations.slice(0, 2).map((fragrance) => (
                    <Card key={fragrance.id} className="scent-card overflow-hidden product-card-hover">
                      <div className="aspect-square overflow-hidden relative">
                        <OptimizedImage 
                          src={fragrance.imageUrl} 
                          alt={`${fragrance.brand} - ${fragrance.name}`}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          width={500}
                          height={500}
                        />
                        <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                          Top Match
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background/90 z-10 ${
                            favorites.includes(fragrance.id) ? 'text-primary' : ''
                          }`}
                          onClick={() => toggleFavorite(fragrance.id)}
                        >
                          <Heart className={`h-5 w-5 ${favorites.includes(fragrance.id) ? 'fill-primary' : ''}`} />
                        </Button>
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="font-serif">{fragrance.name}</CardTitle>
                            <CardDescription>{fragrance.brand}</CardDescription>
                          </div>
                          <div className="flex items-center">
                            {renderRating(fragrance.rating)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-4">{fragrance.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {fragrance.notes.slice(0, 5).map((note) => (
                            <span 
                              key={note.name} 
                              className="text-xs bg-secondary/70 text-secondary-foreground px-2 py-1 rounded-full"
                            >
                              {note.name}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-lg">${fragrance.price}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-muted px-2 py-1 rounded-full">{fragrance.gender}</span>
                              <span className="text-xs bg-muted px-2 py-1 rounded-full">{fragrance.intensity}/10</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {fragrance.categories.map(category => (
                              <span key={category} className="text-xs text-muted-foreground">
                                {category}{' '}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Add rating component */}
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-1">How well did we match?</p>
                          <RatingFeedback 
                            fragranceId={fragrance.id} 
                            initialRating={ratedFragrances.get(fragrance.id) || 0}
                            showThumbControls={false}
                          />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="default" className="w-full premium-button">
                          <Info className="mr-2 h-4 w-4" /> Learn More
                        </Button>
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
                  {[...recommendations].sort((a, b) => b.rating - a.rating).slice(0, 6).map((fragrance, index) => (
                    <Card key={fragrance.id} className="scent-card overflow-hidden product-card-hover">
                      <div className="aspect-square overflow-hidden relative">
                        <OptimizedImage 
                          src={fragrance.imageUrl} 
                          alt={`${fragrance.brand} - ${fragrance.name}`}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          width={300}
                          height={300}
                        />
                        {index < 3 && (
                          <div className="absolute top-2 left-2 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium">
                            #{index + 1} Popular
                          </div>
                        )}
                      </div>
                      <CardHeader>
                        <CardTitle className="font-serif">{fragrance.name}</CardTitle>
                        <CardDescription>{fragrance.brand}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-medium">${fragrance.price}</span>
                          <div className="flex items-center">
                            {renderRating(fragrance.rating)}
                          </div>
                        </div>
                        
                        {/* Add compact rating */}
                        <RatingFeedback 
                          fragranceId={fragrance.id} 
                          initialRating={ratedFragrances.get(fragrance.id) || 0}
                          showThumbControls={false}
                          className="mt-2"
                        />
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full premium-button">Learn More</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="mt-16 text-center glass p-8 rounded-xl">
            <h2 className="text-2xl font-serif font-bold mb-4">Want to Try Again?</h2>
            <p className="mb-6 text-muted-foreground">Not seeing what you like? Take the quiz again to refine your recommendations.</p>
            <Link to="/quiz">
              <Button variant="outline" className="premium-button">Retake Quiz</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Results;
