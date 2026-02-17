import type { NextConfig } from 'next'

const config: NextConfig = {
    // Image optimization
    images: {
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60,
    },

    // Compression
    compress: true,

    // Enable React strict mode for better development
    reactStrictMode: true,

    // PoweredBy header removal for cleaner responses
    poweredByHeader: false,
}

export default config
