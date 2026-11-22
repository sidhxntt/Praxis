import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/pro`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/preview`, lastModified, changeFrequency: "weekly", priority: 0.8 },
  ];
}
