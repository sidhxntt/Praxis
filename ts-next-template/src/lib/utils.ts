import { clsx,ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CAD",
  });

  return formatter.format(price);
};

interface MetadataOptions {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
}

export function constructMetadata({
  title = "Starter Template",
  description = "Your app description goes here",
  image = "/openGraph.png",
  icons = "/favicon.ico",
}: MetadataOptions = {}) {
  return {
    title,
    description,
    icons,
    openGraph: {
      title,
      description,
      siteName: "SaaS Landing Page",
      url: "https://saas-landing-page-pied-seven.vercel.app/",
      type: "website",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@yourhandle",
    },
    metadataBase: new URL("https://saas-landing-page-pied-seven.vercel.app/"),
  };
}
