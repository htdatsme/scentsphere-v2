
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RecommendationQuiz from "./pages/RecommendationQuiz";
import Results from "./pages/Results";
import Profile from "./pages/Profile";
import Login from "./pages/Login";

// Check if Clerk is available (has publishable key)
const isClerkAvailable = () => {
  return !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
};

// Wrapper components to handle authentication state when Clerk is not available
const MockSignedIn = ({ children }) => {
  if (!isClerkAvailable()) {
    return <>{children}</>;
  }
  return <SignedIn>{children}</SignedIn>;
};

const MockSignedOut = ({ children }) => {
  if (!isClerkAvailable()) {
    return null; // Always consider the user as signed in when Clerk is unavailable
  }
  return <SignedOut>{children}</SignedOut>;
};

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route
          path="/quiz"
          element={
            <>
              <MockSignedIn>
                <RecommendationQuiz />
              </MockSignedIn>
              <MockSignedOut>
                <Login />
              </MockSignedOut>
            </>
          }
        />
        <Route
          path="/results"
          element={
            <>
              <MockSignedIn>
                <Results />
              </MockSignedIn>
              <MockSignedOut>
                <Login />
              </MockSignedOut>
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <MockSignedIn>
                <Profile />
              </MockSignedIn>
              <MockSignedOut>
                <Login />
              </MockSignedOut>
            </>
          }
        />
        
        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
