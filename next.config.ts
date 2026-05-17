import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  webpack: (config) => {
    // Required for pdfjs-dist to work without the optional canvas package
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
