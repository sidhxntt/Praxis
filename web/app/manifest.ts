import type { MetadataRoute } from "next";
import { seo } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Praxis Flow",
    short_name: "Praxis",
    description: seo.flow.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f3f7ff",
    theme_color: "#2563eb",
    icons: [
      { src: "/icons/praxis-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/praxis-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/praxis-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
