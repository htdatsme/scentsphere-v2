
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-open-sans)", "Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Baskerville", "Georgia", "serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Fragrance-specific color palette
        amber: {
          DEFAULT: "hsl(var(--amber))",
          foreground: "hsl(var(--amber-foreground))",
        },
        floral: {
          DEFAULT: "hsl(var(--floral))",
          foreground: "hsl(var(--floral-foreground))",
        },
        woody: {
          DEFAULT: "hsl(var(--woody))",
          foreground: "hsl(var(--woody-foreground))",
        },
        citrus: {
          DEFAULT: "hsl(var(--citrus))",
          foreground: "hsl(var(--citrus-foreground))",
        },
        aquatic: {
          DEFAULT: "hsl(var(--aquatic))",
          foreground: "hsl(var(--aquatic-foreground))",
        },
        oriental: {
          DEFAULT: "hsl(var(--oriental))",
          foreground: "hsl(var(--oriental-foreground))",
        },
        // New luxury color palette
        royal: {
          50: "hsl(215, 80%, 95%)",
          100: "hsl(215, 80%, 90%)",
          200: "hsl(215, 80%, 80%)",
          300: "hsl(215, 80%, 70%)",
          400: "hsl(215, 70%, 60%)",
          500: "hsl(215, 70%, 50%)",
          600: "hsl(215, 70%, 40%)",
          700: "hsl(215, 70%, 30%)",
          800: "hsl(215, 70%, 20%)",
          900: "hsl(215, 70%, 10%)",
        },
        cream: {
          50: "hsl(40, 40%, 97%)",
          100: "hsl(40, 40%, 95%)",
          200: "hsl(40, 35%, 90%)",
          300: "hsl(40, 30%, 85%)",
          400: "hsl(40, 25%, 80%)",
          500: "hsl(40, 20%, 75%)",
          600: "hsl(40, 15%, 65%)",
          700: "hsl(40, 10%, 55%)",
          800: "hsl(40, 5%, 45%)",
          900: "hsl(40, 5%, 35%)",
        },
        gold: {
          50: "hsl(40, 80%, 95%)",
          100: "hsl(40, 80%, 90%)",
          200: "hsl(40, 75%, 80%)",
          300: "hsl(40, 70%, 70%)",
          400: "hsl(40, 65%, 60%)",
          500: "hsl(40, 60%, 50%)",
          600: "hsl(40, 55%, 40%)",
          700: "hsl(40, 50%, 35%)",
          800: "hsl(40, 45%, 30%)",
          900: "hsl(40, 40%, 25%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "rotate-360": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "slide-up": {
          from: { transform: "translateY(20px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "shimmer": {
          "100%": { transform: "translateX(100%)" },
        },
        "zoom-in": {
          from: { transform: "scale(0.95)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        "shine": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-in-out",
        "float": "float 6s ease-in-out infinite",
        "rotate": "rotate-360 30s linear infinite",
        "pulse-subtle": "pulse-subtle 3s ease-in-out infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "shimmer": "shimmer 2.5s infinite",
        "zoom-in": "zoom-in 0.4s ease-out",
        "shine": "shine 8s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "premium-gradient": "linear-gradient(to right, hsl(var(--primary)), hsl(var(--accent)))",
        "card-gradient": "linear-gradient(to bottom right, hsl(var(--card)), hsl(var(--secondary)/80))",
        "luxury-pattern": "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z' fill='currentColor' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E\")",
        "elegant-pattern": "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        "royal-gradient": "linear-gradient(135deg, hsl(215, 70%, 40%), hsl(225, 60%, 50%))",
        "cream-gradient": "linear-gradient(135deg, hsl(40, 30%, 95%), hsl(30, 25%, 90%))",
      },
      boxShadow: {
        'premium': '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
        'premium-hover': '0 6px 20px rgba(0, 0, 0, 0.15)',
        'card': '0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.05)',
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'luxury': '0 15px 35px -5px rgba(0, 0, 0, 0.1), 0 10px 25px -5px rgba(0, 0, 0, 0.05)',
        'elegant': '0 5px 20px -5px rgba(0, 0, 0, 0.1), 0 2px 10px -5px rgba(0, 0, 0, 0.05)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'hsl(var(--foreground))',
            'h1, h2, h3, h4, h5': {
              fontFamily: 'var(--font-playfair)',
              fontWeight: '600',
              letterSpacing: '-0.025em',
            },
            'p, ul, ol': {
              lineHeight: '1.7',
            },
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
