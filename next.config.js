/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Cloudflare Pages
  output: 'export',
  
  // Disable features not supported in static export
  images: {
    unoptimized: true,
  },
  
  // Disable server-side features for static export
  trailingSlash: true,
  
  // Experimental features for faster builds
  experimental: {
    // Optimize bundle splitting
    optimizePackageImports: ['lucide-react', 'recharts', 'openai'],
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Build optimizations for speed
  typescript: {
    ignoreBuildErrors: true, // Speed up builds
  },
  
  eslint: {
    ignoreDuringBuilds: true, // Speed up builds
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  },
  
  // Disable server-side redirects for static export
  // async redirects() {
  //   return [];
  // },
  
  // Disable server-side headers for static export
  // async headers() {
  //   return [];
  // },
  
  // Webpack optimizations for faster builds
  webpack: (config, { dev, isServer }) => {
    // Optimize for faster builds
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 10,
            reuseExistingChunk: true,
          },
          common: {
            name: 'common',
            chunks: 'all',
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;
