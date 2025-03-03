import { clsx, ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MetadataOptions } from "./types";

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

export function constructMetadata({
  title,
  description,
  image,
  icons,
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
