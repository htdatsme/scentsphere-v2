
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Define font variables for Tailwind
import { createGlobalStyle } from 'styled-components';

const FontStyles = createGlobalStyle`
  :root {
    --font-open-sans: 'Open Sans', sans-serif;
    --font-playfair: 'Playfair Display', serif;
  }
`;

// Ensure you have the environment variable
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Create a client
const queryClient = new QueryClient();

// Log if key is missing for debugging
if (!PUBLISHABLE_KEY) {
  console.warn("Missing Clerk Publishable Key - Authentication features will be disabled");
}

// Use a wrapper component to conditionally apply ClerkProvider
const AppWrapper = () => {
  // If no key available, just render the app without Clerk
  if (!PUBLISHABLE_KEY) {
    return (
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );
  }
  
  // With key, use ClerkProvider
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ClerkProvider>
  );
};

createRoot(document.getElementById("root")!).render(
  <>
    <FontStyles />
    <AppWrapper />
  </>
);
