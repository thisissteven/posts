/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        hostname: 'res.cloudinary.com',
        pathname: '/**',
        port: '',
        protocol: 'https',
      },
      {
        hostname: 'picsum.photos',
        pathname: '/**',
        port: '',
        protocol: 'https',
      },
      {
        hostname: 'cloudflare-ipfs.com',
        pathname: '/ipfs/**',
        port: '',
        protocol: 'https',
      },
      {
        hostname: 'lh3.googleusercontent.com',
        pathname: '/a/**',
        port: '',
        protocol: 'https',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          net: false,
          dns: false,
          tls: false,
          fs: false,
          request: false,
          child_process: false,
        },
      }
    }
    return config
  },
}

module.exports = nextConfig
