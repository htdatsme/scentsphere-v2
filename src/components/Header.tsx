
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useClerk, SignedIn, SignedOut } from '@clerk/clerk-react';
import { Spray, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import ThemeSwitcher from './ThemeSwitcher';

const Header = () => {
  const { signOut } = useClerk();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if Clerk is available (has publishable key)
  const isClerkAvailable = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  const handleSignOut = () => {
    if (isClerkAvailable) {
      signOut();
    }
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur-md supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Spray className="h-6 w-6 text-primary animate-pulse-subtle" />
          <span className="font-serif text-xl font-bold">ScentSphere</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition">
              Home
            </Link>
            <Link to="/quiz" className="text-sm font-medium hover:text-primary transition">
              Quiz
            </Link>
            <Link to="/results" className="text-sm font-medium hover:text-primary transition">
              Results
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <ThemeSwitcher />
            <SignedIn>
              <div className="flex items-center space-x-2">
                <Link to="/profile">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            </SignedIn>
            <SignedOut>
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button size="sm">Sign In</Button>
                </Link>
              </div>
            </SignedOut>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeSwitcher />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t py-4 animate-fade-in">
          <div className="container space-y-3">
            <Link
              to="/"
              className="block py-2 text-sm font-medium hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/quiz"
              className="block py-2 text-sm font-medium hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Quiz
            </Link>
            <Link
              to="/results"
              className="block py-2 text-sm font-medium hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Results
            </Link>
            <div className="pt-2 border-t">
              <SignedIn>
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/profile"
                    className="block py-2 text-sm font-medium hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="justify-start"
                  >
                    Sign Out
                  </Button>
                </div>
              </SignedIn>
              <SignedOut>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button size="sm" className="w-full">Sign In</Button>
                </Link>
              </SignedOut>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
