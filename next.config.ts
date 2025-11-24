import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  serverExternalPackages: ['@tensorflow/tfjs', '@tensorflow/tfjs-node'],
};

export default nextConfig;