
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from 'crypto-js';

// Utility function for combining Tailwind CSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Field level encryption utilities
export const encryptData = (data: string, secretKey: string): string => {
  return crypto.AES.encrypt(data, secretKey).toString();
};

export const decryptData = (encryptedData: string, secretKey: string): string => {
  const bytes = crypto.AES.decrypt(encryptedData, secretKey);
  return bytes.toString(crypto.enc.Utf8);
};

// Rate limiting utilities
export class RateLimiter {
  private windowMs: number;
  private maxRequests: number;
  private clients: Map<string, number[]>;

  constructor(windowMs = 60000, maxRequests = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.clients = new Map();
  }

  check(clientId: string): boolean {
    const now = Date.now();
    
    // Get or initialize request timestamps for this client
    let requests = this.clients.get(clientId) || [];
    
    // Filter out requests outside the time window
    requests = requests.filter(time => now - time < this.windowMs);
    
    // Check if client has exceeded the rate limit
    if (requests.length >= this.maxRequests) {
      return false;
    }
    
    // Add current request timestamp
    requests.push(now);
    this.clients.set(clientId, requests);
    
    return true;
  }
}
