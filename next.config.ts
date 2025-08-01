import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  output: undefined,
  serverExternalPackages: ['pino', 'pino-pretty'],
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "png.pngtree.com",
        port: ''
      },
      {
        protocol: 'https',
        hostname: "lh3.googleusercontent.com",
        port: ''
      },
      {
        protocol: 'https',
        hostname: "avatars.githubusercontent.com",
        port: ''
      },
      {
        protocol: 'https',
        hostname: "encrypted-tbn0.gstatic.com",
        port: ''
      },
      {
        protocol: 'https',
        hostname: "flagsapi.com",
        port: ''
      },
    ]
  }
};

export default nextConfig;
