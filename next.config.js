/** @type {import('next').NextConfig} */
const nextConfig = {
  // Essential Next.js 15 configuration
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
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
  
  // Enable Turbopack for Next.js 15
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  
  // React 18 compatibility
  reactStrictMode: true,
  
  // Output file tracing root to fix warnings
  outputFileTracingRoot: __dirname,
  
  // Webpack configuration for Next.js 15
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      config.cache = false;
    }
    
    // Handle SVG files
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    return config;
  },
}

module.exports = nextConfig
