import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// CSP Directives configuration
const cspDirectives = {
  directives: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-eval'",
      "'unsafe-inline'",
      'https://www.youtube.com',
      'https://s.ytimg.com',
      'https://www.google.com'
    ],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https://*.amazonaws.com',
      'https://*.ytimg.com',
      'https://*.youtube.com',
      'https://*.vimeo.com'
    ],
    'font-src': ["'self'", 'data:'],
    'frame-src': [
      "'self'",
      'https://*.google.com',
      'https://www.google.com/maps/',
      'https://maps.google.com/',
      'https://www.youtube.com',
      'https://youtube.com',
      'https://player.vimeo.com'
    ],
    'connect-src': [
      "'self'",
      'https://*.amazonaws.com',
      'https://*.amazoncognito.com',
      'https://*.youtube.com'
    ],
    'media-src': ["'self'", 'https://*.youtube.com', 'https://*.vimeo.com'],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'self'"]
  }
};

// Helper function to build CSP string
function buildCspString(directives: typeof cspDirectives.directives): string {
  return Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
}

// Nonce generator for additional security
function generateNonce(): string {
  return Buffer.from(crypto.randomUUID()).toString('base64');
}

export async function middleware(request: NextRequest) {
  // Create the response
  const response = NextResponse.next();
  const nonce = generateNonce();

  // Add nonce to script-src if needed
  cspDirectives.directives['script-src'].push(`'nonce-${nonce}'`);

  // Build and set CSP header
  const cspHeader = buildCspString(cspDirectives.directives);
  
  // Set security headers
  const headers = response.headers;
  headers.set('Content-Security-Policy', cspHeader);
  
  // Additional security headers
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 
    'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()'
  );
  
  // Set HSTS header in production
  if (process.env.NODE_ENV === 'production') {
    headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  return response;
}

// Configuration for paths that should invoke middleware
export const config = {
  matcher: [
    // Only run middleware for pages, exclude static files and API routes
    {
      source: '/((?!api/|_next/|favicon.ico|robots.txt|sitemap.xml|public/).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};

// Types for CSP configuration
type CspDirective = string[];

interface CspConfig {
  directives: {
    [key: string]: CspDirective;
  };
}

// Environment-specific CSP values
const cspValues = {
  development: {
    'script-src': ["'unsafe-eval'"],
    'connect-src': ['http://localhost:*', 'ws://localhost:*'],
  },
  production: {
    'script-src': [],
    'connect-src': [],
  },
} as const;

// Helper function to get environment-specific CSP values
function getEnvCspValues(): typeof cspValues[keyof typeof cspValues] {
  return cspValues[process.env.NODE_ENV as keyof typeof cspValues] 
    ?? cspValues.production;
}