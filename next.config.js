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
  // Webpack optimization for Cloudflare
  webpack: (config, { dev, isServer }) => {
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
