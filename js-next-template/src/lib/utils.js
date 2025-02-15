import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price, currency = "CAD") => {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price);
};

export function constructMetadata(options = {}) {
  const {
    title = "Starter Template.",
    description = "Your app description goes here",
    image = "/openGraph.png",
    icons = "/favicon.ico",
  } = options;

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
