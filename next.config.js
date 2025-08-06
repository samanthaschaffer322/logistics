/** @type {import('next').NextConfig} */
const nextConfig = {
  // Essential for Cloudflare Pages framework detection
  experimental: {
    optimizePackageImports: ['@/components/ui-components']
  },
  
  // Configure for Cloudflare Pages compatibility
  images: {
    unoptimized: true
  },
  
  // Enable trailing slash for better static hosting compatibility
  trailingSlash: true,
  
  // Disable webpack cache to prevent large files
  webpack: (config, { dev, isServer }) => {
    // Disable webpack cache in production
    if (!dev) {
      config.cache = false;
    }
    
    if (!dev && !isServer) {
      // Optimize for client-side bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  
  // Build configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Output configuration
  distDir: '.next',
  
  // Configure redirects for better routing
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },
  
  // Configure rewrites for API routes
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  
  // Configure headers for better caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
