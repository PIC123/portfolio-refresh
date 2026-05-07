import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pchernerportfoliosa.blob.core.windows.net",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "media.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
    ],
  },
};

export default nextConfig;
