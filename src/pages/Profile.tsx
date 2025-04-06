
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useRecommendationStore } from "@/lib/store";
import { SavedFragrances } from "@/components/SavedFragrances";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const { preferences, savedFragrances, loading: profileLoading, updatePreferences } = useUserProfile();
  const { userPreferences, recommendations, resetQuiz } = useRecommendationStore();
  
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Wait for both auth and profile data to load
    if (!authLoading && !profileLoading) {
      setIsLoading(false);
    }
  }, [authLoading, profileLoading]);
  
  if (isLoading) {
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
              src={user?.user_metadata?.avatar_url || "https://i.imgur.com/QVKzs0R.jpg"}
              alt={user?.user_metadata?.full_name || "User"}
              className="w-24 h-24 rounded-full object-cover border-4 border-background shadow-md"
            />
            <div>
              <h1 className="text-3xl font-serif font-bold">
                {user?.user_metadata?.first_name || user?.email?.split('@')[0]}{' '}
                {user?.user_metadata?.last_name || ''}
              </h1>
              {user?.email && (
                <p className="text-muted-foreground">{user.email}</p>
              )}
            </div>
          </div>

          <Tabs defaultValue="preferences">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preferences">Scent Preferences</TabsTrigger>
              <TabsTrigger value="favorites">My Collection</TabsTrigger>
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
                      
                      {userPreferences && preferences && (
                        <SyncPreferencesDialog 
                          userPreferences={userPreferences} 
                          dbPreferences={preferences}
                          updatePreferences={updatePreferences}
                        />
                      )}
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
                  <CardTitle>Your Fragrance Collection</CardTitle>
                  <CardDescription>
                    Fragrances you've saved to your collection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SavedFragrances />
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
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-4">Account Information</h3>
                    <AccountSettings user={user} />
                  </div>

                  <Separator />

                  <div className="pt-4">
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

function SyncPreferencesDialog({ userPreferences, dbPreferences, updatePreferences }) {
  const [isSyncing, setIsSyncing] = useState(false);
  
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await updatePreferences({
        gender_preference: userPreferences.gender,
        intensity: userPreferences.intensity,
        price_min: userPreferences.priceRange[0],
        price_max: userPreferences.priceRange[1],
        seasons: userPreferences.seasonalPreferences,
        occasions: userPreferences.occasions,
        preferred_notes: userPreferences.notes
      });
      toast.success("Preferences synced to your account");
    } catch (error) {
      console.error("Failed to sync preferences:", error);
      toast.error("Failed to sync preferences");
    } finally {
      setIsSyncing(false);
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Save to Account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Preferences to Account</DialogTitle>
          <DialogDescription>
            This will save your current quiz preferences to your account, making them available on all your devices.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Your account will be updated with the following preferences:
          </p>
          <ul className="text-sm space-y-2">
            <li><strong>Gender:</strong> {userPreferences.gender}</li>
            <li><strong>Intensity:</strong> {userPreferences.intensity}/10</li>
            <li><strong>Price Range:</strong> ${userPreferences.priceRange[0]} - ${userPreferences.priceRange[1]}</li>
            <li><strong>Seasons:</strong> {userPreferences.seasonalPreferences.join(", ")}</li>
            <li><strong>Occasions:</strong> {userPreferences.occasions.join(", ")}</li>
            <li><strong>Notes:</strong> {userPreferences.notes.join(", ")}</li>
          </ul>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => {}}>Cancel</Button>
          <Button onClick={handleSync} disabled={isSyncing}>
            {isSyncing ? "Saving..." : "Save Preferences"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const accountFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

function AccountSettings({ user }) {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      firstName: user?.user_metadata?.first_name || "",
      lastName: user?.user_metadata?.last_name || "",
      email: user?.email || "",
    },
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const onSubmit = async (data: AccountFormValues) => {
    setIsSaving(true);
    try {
      // In a real app, we would update the user's information in Supabase here
      // For now, we'll just show a success message
      toast.success("Account information updated");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update account:", error);
      toast.error("Failed to update account information");
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} disabled={true} />
              </FormControl>
              <FormDescription>
                Your email cannot be changed
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-4 pt-2">
          {isEditing ? (
            <>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button 
              type="button" 
              onClick={() => setIsEditing(true)}
            >
              Edit Information
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}

export default Profile;
