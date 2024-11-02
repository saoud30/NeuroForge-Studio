/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_GEMINI_FLASH_KEY: process.env.GEMINI_FLASH_KEY,
    NEXT_PUBLIC_HUGGING_FACE_KEY: process.env.HUGGING_FACE_KEY,
    NEXT_PUBLIC_GROQ_API_KEY: process.env.GROQ_API_KEY,
  },
  typescript: {
    // Don't change this to true - we want to catch type errors
    ignoreBuildErrors: false,
  },
  eslint: {
    // Don't change this to true - we want to catch lint errors
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig