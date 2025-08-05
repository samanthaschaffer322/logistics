/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@/components/ui']
  },
  webpack: (config, { isServer }) => {
    // Ensure proper module resolution for UI components
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/components/ui/card': require.resolve('./src/components/ui/card.tsx'),
      '@/components/ui/button': require.resolve('./src/components/ui/button.tsx'),
      '@/components/ui/input': require.resolve('./src/components/ui/input.tsx'),
      '@/components/ui/label': require.resolve('./src/components/ui/label.tsx'),
      '@/components/ui/select': require.resolve('./src/components/ui/select.tsx'),
      '@/components/ui/tabs': require.resolve('./src/components/ui/tabs.tsx'),
      '@/components/ui/badge': require.resolve('./src/components/ui/badge.tsx'),
      '@/components/ui/progress': require.resolve('./src/components/ui/progress.tsx'),
      '@/components/ui/alert': require.resolve('./src/components/ui/alert.tsx'),
    }
    return config
  }
}

module.exports = nextConfig
