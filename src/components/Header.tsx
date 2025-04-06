
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Droplets, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut, loading } = useAuth();

  return (
    <header className="border-b bg-background/95 backdrop-blur-md supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Droplets className="h-6 w-6 text-primary animate-pulse-subtle" />
          <span className="font-serif text-xl font-bold tracking-tight">ScentSphere</span>
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
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-2">
                    <Link to="/profile">
                      <Button variant="ghost" size="sm" className="rounded-full">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="rounded-full" onClick={() => signOut()}>
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link to="/login">
                      <Button size="sm" className="rounded-full">Sign In</Button>
                    </Link>
                  </div>
                )}
              </>
            )}
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
            className="rounded-full"
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
              {!loading && (
                <>
                  {user ? (
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
                          signOut();
                          setMobileMenuOpen(false);
                        }}
                        className="justify-start rounded-full"
                      >
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button size="sm" className="w-full rounded-full">Sign In</Button>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
