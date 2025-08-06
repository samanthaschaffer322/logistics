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
  // Ensure proper routing
  trailingSlash: false,
  // CRITICAL: Disable webpack cache for Cloudflare Pages (file size limits)
  webpack: (config, { dev, isServer }) => {
    // Disable webpack cache in production to avoid large cache files
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
  // Output configuration for Cloudflare Pages
  distDir: '.next',
  // Ensure API routes work
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
}

module.exports = nextConfig
