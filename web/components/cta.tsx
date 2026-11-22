import { CopyCommand } from "./copy-command";
import { products, type ProductKey } from "@/lib/products";

export default function CTA({ product }: { product: ProductKey }) {
  const content = products[product];
  return (
    <section aria-labelledby="cta-title" className="on-brand relative isolate overflow-hidden bg-brand text-white">
      <div className="grain" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 70% at 50% 42%, rgba(255,255,255,.2), transparent 70%), linear-gradient(180deg, transparent 55%, rgba(255,255,255,.14))",
        }}
      />
      <div className="mx-auto flex max-w-[1000px] flex-col items-center px-5 py-28 text-center md:py-36">
        <h2 id="cta-title" className="display text-[min(64px,10.5vw)]">
          {content.ctaTitle[0]} <em>{content.ctaTitle[1]}</em>
        </h2>
        <p className="mt-6 max-w-[470px] text-[16px] leading-[1.5] text-white/85">{content.ctaDescription}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <a className="pill pill-white" href={content.wiki}>
            Agent Wiki
          </a>
          <CopyCommand command={content.command} className="pill-glass" />
        </div>
      </div>
    </section>
  );
}
