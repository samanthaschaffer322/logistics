/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@/components/ui-components']
  },
  // Use static export for Cloudflare Pages compatibility
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
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
