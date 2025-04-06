
import { useUser } from "@clerk/clerk-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRecommendationStore } from "@/lib/store";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Profile = () => {
  const [isClerkAvailable, setIsClerkAvailable] = useState(false);
  const [userLoaded, setUserLoaded] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const { userPreferences, recommendations, resetQuiz } = useRecommendationStore();
  
  // Check if Clerk is available
  useEffect(() => {
    const hasClerkKey = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
    setIsClerkAvailable(hasClerkKey);
    
    // If Clerk isn't available, create mock user data
    if (!hasClerkKey) {
      setUserData({
        firstName: "Demo",
        lastName: "User",
        imageUrl: "https://i.imgur.com/QVKzs0R.jpg",
        primaryEmailAddress: { emailAddress: "demo@example.com" }
      });
      setUserLoaded(true);
    }
  }, []);
  
  // Only use Clerk's useUser if Clerk is available
  const clerkUser = isClerkAvailable ? useUser() : { user: null, isLoaded: false };
  
  // Once Clerk user is loaded, set the user data
  useEffect(() => {
    if (isClerkAvailable && clerkUser.isLoaded) {
      setUserData(clerkUser.user);
      setUserLoaded(true);
    }
  }, [isClerkAvailable, clerkUser.isLoaded, clerkUser.user]);
  
  if (!userLoaded) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container py-10">
          <div className="flex justify-center items-center h-full">
            <div className="shimmer-effect h-12 w-48 rounded-md"></div>
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
          <div className="flex items-center gap-6 mb-8">
            <img
              src={userData.imageUrl}
              alt={userData.firstName || "User"}
              className="w-24 h-24 rounded-full object-cover border-4 border-background shadow-md"
            />
            <div>
              <h1 className="text-3xl font-serif font-bold">
                {userData.firstName} {userData.lastName}
              </h1>
              {userData.primaryEmailAddress && (
                <p className="text-muted-foreground">{userData.primaryEmailAddress.emailAddress}</p>
              )}
            </div>
          </div>

          <Tabs defaultValue="preferences">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preferences">Scent Preferences</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="settings">Account Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preferences" className="mt-6">
              {userPreferences ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Fragrance Preferences</CardTitle>
                    <CardDescription>
                      These are the preferences you selected during the quiz.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium mb-2">Gender Preference</h3>
                        <p className="capitalize">{userPreferences.gender}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Intensity</h3>
                        <p>{userPreferences.intensity}/10</p>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Price Range</h3>
                        <p>${userPreferences.priceRange[0]} - ${userPreferences.priceRange[1]}</p>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Seasons</h3>
                        <div className="flex flex-wrap gap-2">
                          {userPreferences.seasonalPreferences.map((season) => (
                            <span key={season} className="text-xs bg-secondary px-2 py-1 rounded-full">
                              {season}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Occasions</h3>
                        <div className="flex flex-wrap gap-2">
                          {userPreferences.occasions.map((occasion) => (
                            <span key={occasion} className="text-xs bg-secondary px-2 py-1 rounded-full">
                              {occasion}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Preferred Notes</h3>
                        <div className="flex flex-wrap gap-2">
                          {userPreferences.notes.map((note) => (
                            <span key={note} className="text-xs bg-secondary px-2 py-1 rounded-full">
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-6 pt-6 border-t">
                      <Button variant="outline" onClick={resetQuiz}>Reset Preferences</Button>
                      <Link to="/quiz">
                        <Button>Update Preferences</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>No Preferences Found</CardTitle>
                    <CardDescription>
                      You haven't taken the fragrance quiz yet.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/quiz">
                      <Button>Take the Quiz</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {recommendations && recommendations.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-serif font-bold mb-6">Your Recommendations</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.map((fragrance) => (
                      <Card key={fragrance.id} className="overflow-hidden">
                        <div className="aspect-square overflow-hidden">
                          <img 
                            src={fragrance.imageUrl} 
                            alt={fragrance.name} 
                            className="w-full h-full object-cover"
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
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="favorites" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Favorite Fragrances</CardTitle>
                  <CardDescription>
                    You haven't saved any fragrances yet.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center py-10">
                  <p className="text-muted-foreground mb-6">
                    When you find fragrances you love, save them here for quick reference.
                  </p>
                  <Link to="/results">
                    <Button>See Your Recommendations</Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Email Notifications</h3>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="email-notif" className="h-4 w-4" />
                      <label htmlFor="email-notif">Receive recommendations and updates by email</label>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Privacy Settings</h3>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="privacy" className="h-4 w-4" defaultChecked />
                      <label htmlFor="privacy">Allow anonymous usage data collection to improve recommendations</label>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-2 text-destructive">Danger Zone</h3>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
