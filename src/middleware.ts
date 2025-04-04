
// Create a placeholder middleware file that works with Vite instead of Next.js
// This replaces the Next.js specific middleware with something that works in our environment

// Simple middleware implementation compatible with our Vite setup
export const middleware = () => {
  console.log('Middleware running in non-Next.js environment');
  return null;
};

// Rate limiting implementation (simplified for Vite environment)
export const rateLimiter = {
  counter: new Map<string, { count: number, timestamp: number }>(),
  
  check: (ip: string, limit = 10, windowMs = 60000) => {
    const now = Date.now();
    const record = rateLimiter.counter.get(ip) || { count: 0, timestamp: now };
    
    // Reset if window has passed
    if (now - record.timestamp > windowMs) {
      record.count = 0;
      record.timestamp = now;
    }
    
    record.count++;
    rateLimiter.counter.set(ip, record);
    
    return record.count <= limit;
  }
};

// Export config to avoid errors if referenced
export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
