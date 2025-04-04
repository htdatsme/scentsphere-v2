
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t py-8 md:py-12">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-serif text-xl font-bold text-primary">Scent Sense</span>
          <p className="text-sm text-muted-foreground">Find your perfect fragrance match</p>
        </div>

        <div className="flex gap-8 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/quiz" className="hover:text-primary transition-colors">Quiz</Link>
          <Link to="/profile" className="hover:text-primary transition-colors">Profile</Link>
        </div>

        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Scent Sense. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
