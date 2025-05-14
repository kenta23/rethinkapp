import type { NextConfig } from 'next'
// const webpack = require("webpack"); 

const nextConfig: NextConfig = {
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'hl1femsdux.ufs.sh',
        pathname: '/f/*'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      }
    ],
  },
}

export default nextConfig
