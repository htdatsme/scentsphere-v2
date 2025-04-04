
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Check if Clerk is available
const isClerkAvailable = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Mock components for when Clerk is not available
const MockSignedIn = ({ children }) => {
  return <>{children}</>;
};

const MockSignedOut = ({ children }) => {
  if (!isClerkAvailable) {
    return null;
  }
  return children;
};

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/20">
          <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-8">
            <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight tracking-tighter animate-fade-in">
              Discover Your Perfect <span className="text-primary">Fragrance</span>
            </h1>
            <p className="max-w-[700px] text-lg md:text-xl text-muted-foreground animate-fade-in">
              Personalized recommendations based on your preferences, lifestyle, and personality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
              {isClerkAvailable ? (
                <>
                  <MockSignedIn>
                    <Link to="/quiz">
                      <Button size="lg" className="font-medium">Start Your Quiz</Button>
                    </Link>
                  </MockSignedIn>
                  <MockSignedOut>
                    <Link to="/login">
                      <Button size="lg" className="font-medium">Sign In to Begin</Button>
                    </Link>
                  </MockSignedOut>
                </>
              ) : (
                <Link to="/quiz">
                  <Button size="lg" className="font-medium">Start Your Quiz</Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="py-16 bg-background">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-serif font-bold text-center mb-10">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-primary/10 p-4 rounded-full">
                  <div className="w-10 h-10 flex items-center justify-center text-2xl font-medium text-primary">1</div>
                </div>
                <h3 className="text-xl font-bold">Take Our Quiz</h3>
                <p className="text-muted-foreground">Answer a few questions about your preferences and lifestyle.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-primary/10 p-4 rounded-full">
                  <div className="w-10 h-10 flex items-center justify-center text-2xl font-medium text-primary">2</div>
                </div>
                <h3 className="text-xl font-bold">Get Recommendations</h3>
                <p className="text-muted-foreground">Our algorithm analyzes your responses to find your perfect matches.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-primary/10 p-4 rounded-full">
                  <div className="w-10 h-10 flex items-center justify-center text-2xl font-medium text-primary">3</div>
                </div>
                <h3 className="text-xl font-bold">Discover New Scents</h3>
                <p className="text-muted-foreground">Explore your personalized fragrance recommendations.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-serif font-bold mb-6">Ready to Find Your Signature Scent?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-[600px] mx-auto">
              Join thousands who have discovered their perfect fragrance match with our personalized recommendations.
            </p>
            {isClerkAvailable ? (
              <>
                <MockSignedIn>
                  <Link to="/quiz">
                    <Button size="lg" className="font-medium">Start Your Quiz Now</Button>
                  </Link>
                </MockSignedIn>
                <MockSignedOut>
                  <Link to="/login">
                    <Button size="lg" className="font-medium">Sign Up to Begin</Button>
                  </Link>
                </MockSignedOut>
              </>
            ) : (
              <Link to="/quiz">
                <Button size="lg" className="font-medium">Start Your Quiz Now</Button>
              </Link>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
