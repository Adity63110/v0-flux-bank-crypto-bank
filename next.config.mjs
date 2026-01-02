/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    '*.replit.dev',
    '*.replit.app',
    '*.repl.co',
    '127.0.0.1',
  ],
}

export default nextConfig