import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tihldestorage.blob.core.windows.net",
      }
    ]
  }
  /* config options here */
};

export default nextConfig;
