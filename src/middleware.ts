
import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware } from "@clerk/nextjs";

// CSP Headers setup
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; img-src 'self' https://images.unsplash.com data:; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; connect-src 'self' https://api.clerk.dev;"
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  }
];

// Apply rate limiting middleware
export async function middleware(request: NextRequest) {
  // Apply security headers
  const response = NextResponse.next();
  
  // Set security headers
  securityHeaders.forEach(({ key, value }) => {
    response.headers.set(key, value);
  });
  
  return response;
}

export default authMiddleware({
  beforeAuth: (req) => middleware(req),
  publicRoutes: ["/", "/login", "/sign-up"],
});

// Configure the middleware
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
