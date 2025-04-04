
import { SignIn } from "@clerk/clerk-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const isClerkAvailable = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  // Mock login for development when Clerk is not available
  const handleDevelopmentLogin = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center py-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold">Welcome to Scent Sense</h1>
            <p className="mt-2 text-muted-foreground">Sign in to discover your perfect fragrance match</p>
          </div>
          
          {isClerkAvailable ? (
            <SignIn
              path="/login"
              routing="path"
              signUpUrl="/sign-up"
              fallbackRedirectUrl="/"
            />
          ) : (
            <div className="p-6 bg-white shadow-md rounded-lg">
              <div className="text-center">
                <h2 className="font-medium text-lg mb-4">Development Mode</h2>
                <p className="text-muted-foreground mb-6">
                  Authentication is disabled because no Clerk publishable key was found.
                </p>
                <Button onClick={handleDevelopmentLogin} className="w-full">
                  Continue as Logged In User
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
