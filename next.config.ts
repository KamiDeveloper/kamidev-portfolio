import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Enable modern image formats for better compression
    formats: ['image/avif', 'image/webp'],

    // Optimize device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Configure domains if using external images
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'images.unsplash.com',
    //   },
    // ],

    // Minimize layout shift
    minimumCacheTTL: 60,

    // Disable external images from causing issues
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
