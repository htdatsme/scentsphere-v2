
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

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
            <SignedIn>
              <Link to="/quiz" className="text-sm font-medium transition-colors hover:text-primary">
                Find Your Scent
              </Link>
            </SignedIn>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <SignedIn>
            <Link to="/profile">
              <Button variant="ghost">Profile</Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Link to="/login">
              <Button>Sign In</Button>
            </Link>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default Header;
