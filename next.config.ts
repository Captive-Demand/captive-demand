import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  images: {
    // Allow `quality={85}` used across portfolio / homepage `<Image>` components (Next 16 default is [75] only).
    qualities: [75, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "media.brand.dev",
      },
    ],
    // Disable image optimization in development for instant updates
    unoptimized: process.env.NODE_ENV === 'development',
  },
  async redirects() {
    return [
      {
        source: "/shore-partnership",
        destination: "/shore-capital-partnership",
        permanent: true,
      },
      {
        source: "/shore-partnership/",
        destination: "/shore-capital-partnership",
        permanent: true,
      },
      {
        source: "/seo",
        destination: "/services/seo",
        permanent: true,
      },
      {
        source: "/seo/",
        destination: "/services/seo",
        permanent: true,
      },
      {
        source: "/web-analytics-reporting",
        destination: "/services/software",
        permanent: true,
      },
      {
        source: "/web-analytics-reporting/",
        destination: "/services/software",
        permanent: true,
      },
      {
        source: "/content-creation",
        destination: "/",
        permanent: true,
      },
      {
        source: "/content-creation/",
        destination: "/",
        permanent: true,
      },
    ];
  },
  async headers() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
            },
          ],
        },
      ];
    }
    return [
      {
        source: '/:path*.(jpg|jpeg|png|webp|avif|gif|svg|mp4|webm|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
