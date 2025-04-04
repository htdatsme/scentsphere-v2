
import { SignIn } from "@clerk/clerk-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Login = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center py-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold">Welcome to Scent Sense</h1>
            <p className="mt-2 text-muted-foreground">Sign in to discover your perfect fragrance match</p>
          </div>
          <SignIn
            path="/login"
            routing="path"
            signUpUrl="/sign-up"
            fallbackRedirectUrl="/"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
