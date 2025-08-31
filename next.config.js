/** @type {import('next').NextConfig} */

// Allow "" or "/sublet-calculator" 
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig = {
  reactStrictMode: true,
  basePath,                       // build-time base path
  assetPrefix: basePath || undefined, // safe SSR asset prefix when basePath is set
  trailingSlash: false,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    typedRoutes: true,
  },
}

module.exports = nextConfig

