import type { CSSProperties } from "react";
import PraxisHero from "./PraxisHero";
import { SiteNav } from "./navbar";
import { StackStrip } from "./logos-cloud";
import { Features } from "./features";
import { Questionnaire } from "./questionnaire";
import { HowItWorks } from "./how-it-works";
import { FrequentlyAskedQuestions } from "./faq";
import CTA from "./cta";
import { Footer } from "./footer";
import { products, type ProductKey } from "@/lib/products";
import { structuredData } from "@/lib/site";

export function navLinks(product: ProductKey) {
  const p = products[product];
  return [
    { label: "Product", href: "#product" },
    { label: "How it works", href: "#how" },
    { label: "FAQ", href: "#faqs" },
    { label: p.other.name, href: p.other.href },
  ];
}

export function ProductPage({ product }: { product: ProductKey }) {
  const p = products[product];
  const c = p.colors;
  const style = {
    "--brand": c.brand,
    "--brand-soft": c.soft,
    "--brand-ink": c.ink,
    "--brand-deep": c.deep,
    "--paper": c.paper,
  } as CSSProperties;

  return (
    <div className="site min-h-screen bg-paper text-ink" style={style}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(product)).replace(/</g, "\\u003c") }}
      />
      <SiteNav product={product} />
      <PraxisHero
        brand={p.name}
        line1={p.hero.line1}
        line2={p.hero.line2}
        lede={p.hero.lede}
        result={p.hero.result}
        stat={[p.hero.stat[0], p.hero.stat[1]]}
        meta={p.hero.meta}
        command={p.command}
        links={navLinks(product)}
        navCta={{ label: "Agent Wiki", href: p.wiki }}
        ground={c.brand}
        accent={c.soft}
        ink={c.ink}
        deep={c.deep}
        shade={c.shade}
        halo={c.halo}
      />
      <main>
        <StackStrip product={product} />
        <Features product={product} />
        <Questionnaire product={product} />
        <HowItWorks product={product} />
        <FrequentlyAskedQuestions product={product} />
        <CTA product={product} />
      </main>
      <Footer product={product} />
    </div>
  );
}
