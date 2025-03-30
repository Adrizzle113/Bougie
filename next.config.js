/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Disable ESLint during build to avoid configuration issues
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Security
  poweredByHeader: false,
  
  // Production optimization
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Image configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'itineraryimages.s3.us-east-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/trips/:id',
        destination: '/dashboard/admin/trips/:id',
        permanent: true,
      },
    ];
  },

  // Enable experimental features
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.netlify.app'],
    },
    typedRoutes: true,
  },
};

export default nextConfig;