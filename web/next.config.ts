import type { NextConfig } from "next";
import path from "node:path";

import componentTagger from "@acebuilder/component-tagger";

const withTagger = componentTagger();

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(import.meta.dirname, ".."),
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
