
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-20 flex flex-col items-center justify-center text-center">
        <h1 className="font-serif text-9xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-serif mt-4 mb-6">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md mb-8">
          We couldn't find the page you were looking for. The fragrance you're searching for might have evaporated.
        </p>
        <Link to="/">
          <Button>Return to Home</Button>
        </Link>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
