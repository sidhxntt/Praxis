import { Suspense, type CSSProperties } from "react";
import type { Metadata } from "next";
import { TemplateCarousel } from "@/components/template-carousel";
import { products } from "@/lib/products";
import templates from "@/lib/ui-templates.json";

const title = "UI templates, live — Praxis Flow";
const description = `Play with all ${templates.length} animated landing-page heroes that ship with Praxis Flow, live on desktop or phone, before you generate a Next.js or Vite project with one: ${templates.map((t) => t.label).join(", ")}.`;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/preview" },
  openGraph: { type: "website", url: "/preview", siteName: "Praxis", title, description, locale: "en_US" },
  twitter: { card: "summary_large_image", title, description },
};

export default function PreviewPage() {
  const c = products.flow.colors;
  const style = {
    "--brand": c.brand,
    "--brand-soft": c.soft,
    "--brand-ink": c.ink,
    "--brand-deep": c.deep,
    "--paper": c.paper,
  } as CSSProperties;
  return (
    <div className="site" style={style}>
      <Suspense fallback={<div className="cv" />}>
        <TemplateCarousel />
      </Suspense>
    </div>
  );
}
