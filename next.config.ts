import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "pchernerportfoliosa.blob.core.windows.net",
      "raw.githubusercontent.com",
      "media.githubusercontent.com",
      "github.com",
    ],
  },
};

export default nextConfig;
