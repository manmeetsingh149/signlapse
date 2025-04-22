/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    // Enable image optimization which works well with Vercel
    unoptimized: false,
    // Configure remotePatterns if you're using external image sources
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // These are only needed for non-Vercel deployments or custom domains
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // Improve build performance
  swcMinify: true,
  // Enable React strict mode for better development experience
  reactStrictMode: true,
}

module.exports = nextConfig