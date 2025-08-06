/** @type {import('next').NextConfig} */
const nextConfig = {
  // Essential Next.js configuration for Cloudflare Pages
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  output: 'export',
  distDir: 'out',
  
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
