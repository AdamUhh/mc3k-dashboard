import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },
images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd34cdhvz8rdy3s.cloudfront.net',
      },
    ],
  },
};

export default nextConfig;
