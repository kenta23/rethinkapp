import type { NextConfig } from 'next'
// const webpack = require("webpack"); 

const nextConfig: NextConfig = {
  // webpack: (config) => {
  //   config.resolve.alias.canvas = false;
    
  //   return config;
  //  },
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'utfs.io'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      }
    ],
  },
}

export default nextConfig
