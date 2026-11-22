import type { Metadata } from "next";
import { ProductPage } from "@/components/product-page";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata("flow");

export default function Home() {
  return <ProductPage product="flow" />;
}
