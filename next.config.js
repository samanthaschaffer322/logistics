/** @type {import('next').NextConfig} */
const nextConfig = {
  // Essential Next.js configuration
  images: {
    unoptimized: true
  },
  
  // Only use static export for production builds
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    trailingSlash: true,
    distDir: 'out',
  }),
  
  // Disable features that don't work with static export
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Webpack configuration
  webpack: (config, { dev }) => {
    if (!dev) {
      config.cache = false;
    }
    return config;
  }
}

module.exports = nextConfig
