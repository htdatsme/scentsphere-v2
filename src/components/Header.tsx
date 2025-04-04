
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

// Check if Clerk is available
const isClerkAvailable = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Mock components for when Clerk is not available
const MockSignedIn = ({ children }) => {
  if (!isClerkAvailable) {
    return <>{children}</>;
  }
  return <SignedIn>{children}</SignedIn>;
};

const MockSignedOut = ({ children }) => {
  if (!isClerkAvailable) {
    return null;
  }
  return <SignedOut>{children}</SignedOut>;
};

const MockUserButton = () => {
  return (
    <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
      <span className="sr-only">User menu</span>
      <span className="text-sm">👤</span>
    </Button>
  );
};

const Header = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between py-6">
        <div className="flex gap-6 items-center">
          <Link to="/" className="flex items-center">
            <span className="font-serif text-2xl font-bold text-primary">Scent Sense</span>
          </Link>

          <nav className="hidden md:flex gap-6">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <MockSignedIn>
              <Link to="/quiz" className="text-sm font-medium transition-colors hover:text-primary">
                Find Your Scent
              </Link>
            </MockSignedIn>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <MockSignedIn>
            <Link to="/profile">
              <Button variant="ghost">Profile</Button>
            </Link>
            {isClerkAvailable ? <UserButton afterSignOutUrl="/" /> : <MockUserButton />}
          </MockSignedIn>
          <MockSignedOut>
            <Link to="/login">
              <Button>Sign In</Button>
            </Link>
          </MockSignedOut>
        </div>
      </div>
    </header>
  );
};

export default Header;
