/** @type {import('next').NextConfig} */
const nextConfig = {
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
