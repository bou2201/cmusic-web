import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* Config options here */

  /* Allow all patterns */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
