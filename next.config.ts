import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.weatherapi.com',
      },
      {
        protocol: 'https',
        hostname: '52acd6fcf9b9814fd66c8cd7cadf580f.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: 'bucket.onlyfriendsent.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-dae689407cd34c5d8d2abb53e0d56506.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'th.bing.com',
      },
      {
        protocol: 'https',
        hostname: 'fqnnnnhsfcwanbwrecoq.supabase.co',
      },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
