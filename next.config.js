/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
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
    serverActions: true,
    typedRoutes: true,
  },
};

export default nextConfig;