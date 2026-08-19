import type { NextConfig } from "next";

import componentTagger from "@acebuilder/component-tagger";

const withTagger = componentTagger();

const nextConfig: NextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.aceternity.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default withTagger(nextConfig);
