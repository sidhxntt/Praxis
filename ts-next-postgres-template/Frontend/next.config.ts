import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "api.microlink.io",
        },
        {
          protocol: "https",
          hostname: "images.unsplash.com",
        },
      ],
    },
};
export default nextConfig;
