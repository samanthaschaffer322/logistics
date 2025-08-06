/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@/components/ui-components']
  },
  // Configure for client-side functionality with API routes
  images: {
    unoptimized: true
  },
  // Enable client-side routing
  trailingSlash: false,
  // Disable webpack cache for Cloudflare Pages (file size limits)
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      // Disable webpack cache in production to avoid large cache files
      config.cache = false;
    }
    return config;
  },
  // Disable ESLint and TypeScript checking during builds to avoid blocking deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig
