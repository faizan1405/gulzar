import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== 'production';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'next/server': 'next/server.js',
      };
    }
    return config;
  },
  async headers() {
    const cspScript = isDev
      ? "'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://*.gstatic.com"
      : "'self' 'unsafe-inline' https://accounts.google.com https://*.gstatic.com";
    const cspStyle = isDev
      ? "'self' 'unsafe-inline' https://fonts.googleapis.com"
      : "'self' 'unsafe-inline' https://fonts.googleapis.com";

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; script-src ${cspScript}; style-src ${cspStyle}; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://*.googleapis.com https://*.google.com https://*.razorpay.com https://*.public.blob.vercel-storage.com; frame-src 'self' https://*.razorpay.com https://accounts.google.com;`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
