import type { Metadata } from "next";
import { ProductPage } from "@/components/product-page";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata("pro");

export default function PraxisProPage() {
  return <ProductPage product="pro" />;
}
