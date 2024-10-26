import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tihldestorage.blob.core.windows.net",
      },
      {
        protocol: "https",
        hostname: "leptonstoragepro.blob.core.windows.net",
      }
    ]
  },
  // Husk å fjerne denne senere... Jævla authjs gir requests feil types
  typescript: {
    ignoreBuildErrors: true,
  }
  /* config options here */
};

export default nextConfig;
