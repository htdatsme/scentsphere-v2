
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import fonts
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/600.css';
import '@fontsource/open-sans/700.css';
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/600.css';
import '@fontsource/playfair-display/700.css';

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

if (!PUBLISHABLE_KEY) {
  console.error("Missing Clerk Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <>
    <FontStyles />
    <ClerkProvider publishableKey={PUBLISHABLE_KEY || 'pk_test_placeholder-key-for-dev'}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ClerkProvider>
  </>
);
