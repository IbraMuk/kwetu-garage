/** @type {import('next').NextConfig} */
const backendUrl = (process.env.BACKEND_URL || 'http://localhost:3001').replace(/\/$/, '')

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
    NEXT_PUBLIC_BACKEND_URL: backendUrl,
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: `${backendUrl}/api/:path*`,
        },
      ],
    }
  },
}

module.exports = nextConfig
