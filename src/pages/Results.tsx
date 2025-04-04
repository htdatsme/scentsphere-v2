
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecommendationStore, Fragrance } from "@/lib/store";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for demonstration - in a real app, this would come from your backend
const mockFragrances: Fragrance[] = [
  {
    id: 1,
    name: "Bergamot Bliss",
    brand: "Aromatic Elegance",
    description: "A fresh, citrusy scent with hints of spice and wood. Perfect for everyday wear.",
    notes: ["Bergamot", "Cedar", "Vetiver"],
    imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    price: 85,
    categories: ["Fresh", "Citrus", "Woody"],
    rating: 4.5
  },
  {
    id: 2,
    name: "Velvet Noir",
    brand: "Midnight Collection",
    description: "A deep, sensual fragrance with vanilla and amber notes. Ideal for evening occasions.",
    notes: ["Vanilla", "Amber", "Musk"],
    imageUrl: "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    price: 120,
    categories: ["Oriental", "Gourmand"],
    rating: 4.8
  },
  {
    id: 3,
    name: "Lavender Fields",
    brand: "Provincial Scents",
    description: "A calming aromatic fragrance with lavender and herbal notes. Great for relaxation and everyday wear.",
    notes: ["Lavender", "Sage", "Tonka Bean"],
    imageUrl: "https://images.unsplash.com/photo-1610461888750-10bfc601b874?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    price: 65,
    categories: ["Aromatic", "Fresh"],
    rating: 4.3
  }
];

const Results = () => {
  const { userPreferences, setRecommendations, recommendations, isLoading } = useRecommendationStore();
  const [activeTab, setActiveTab] = useState("recommended");

  useEffect(() => {
    // Simulate loading recommendations
    const loadRecommendations = async () => {
      // In a real app, you would fetch from your API based on userPreferences
      // For now, we'll just wait a bit and then use our mock data
      setTimeout(() => {
        setRecommendations(mockFragrances);
      }, 1000);
    };
    
    loadRecommendations();
  }, [setRecommendations]);

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
          <div className="text-center mb-10">
            <h1 className="text-3xl font-serif font-bold mb-3">Your Fragrance Recommendations</h1>
            <p className="text-muted-foreground">Based on your unique preferences, we've selected these fragrances just for you.</p>
          </div>

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
                    <Card key={fragrance.id} className="overflow-hidden">
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={fragrance.imageUrl} 
                          alt={fragrance.name} 
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="font-serif">{fragrance.name}</CardTitle>
                        <CardDescription>{fragrance.brand}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-4">{fragrance.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {fragrance.notes.map((note) => (
                            <span 
                              key={note} 
                              className="text-xs bg-secondary px-2 py-1 rounded-full"
                            >
                              {note}
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

            <TabsContent value="best-match" className="mt-6">
              {isLoading ? (
                <div className="text-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Finding your best matches...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendations.slice(0, 2).map((fragrance) => (
                    <Card key={fragrance.id} className="overflow-hidden">
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={fragrance.imageUrl} 
                          alt={fragrance.name} 
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="font-serif">{fragrance.name}</CardTitle>
                        <CardDescription>{fragrance.brand}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-4">{fragrance.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {fragrance.notes.map((note) => (
                            <span 
                              key={note} 
                              className="text-xs bg-secondary px-2 py-1 rounded-full"
                            >
                              {note}
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
                    <Card key={fragrance.id} className="overflow-hidden">
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={fragrance.imageUrl} 
                          alt={fragrance.name} 
                          className="w-full h-full object-cover transition-transform hover:scale-105"
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
