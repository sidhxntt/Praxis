import Link from "next/link";
import { products, type ProductKey } from "@/lib/products";

/** The metric card's button to a page of its own. */
const EXPLORE: Partial<Record<ProductKey, { label: string; href: string }>> = {
  flow: { label: "Explore UI templates", href: "/preview" },
};

export function Features({ product }: { product: ProductKey }) {
  const content = products[product];
  const explore = EXPLORE[product];
  return (
    <section id="product" className="scroll-mt-24">
      <div className="mx-auto max-w-[1200px] px-5 py-24 md:px-11 md:py-32">
        <div className="max-w-[720px]">
          <p className="eyebrow">Product</p>
          <h2 className="display mt-5 text-[min(64px,11vw)]">
            {content.featureTitle[0]} <em>{content.featureTitle[1]}</em>
          </h2>
          <p className="mt-6 max-w-[520px] text-[16px] leading-[1.5] text-ink/65">{content.featureIntro}</p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-[1.05fr_1fr_1fr]">
          <article className="on-brand relative isolate flex min-h-[360px] flex-col justify-between overflow-hidden rounded-[28px] bg-brand p-8 text-white lg:row-span-2">
            <div className="grain" aria-hidden="true" />
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full opacity-60 blur-2xl"
              style={{ background: "radial-gradient(circle, rgba(255,255,255,.55), transparent 65%)" }}
            />
            <p className="text-[13px] font-medium text-white/75">{content.name}</p>
            <div>
              <p className="font-serif text-[clamp(120px,16vw,188px)] italic leading-[0.8] tracking-[-0.03em] text-brand-soft">
                {content.metric[0]}
              </p>
              <p className="mt-3 text-[28px] font-medium tracking-[-0.03em]">{content.metric[1]}</p>
              <p className="mt-4 max-w-[340px] text-[15px] leading-[1.5] text-white/80">{content.metricNote}</p>
              {explore && (
                <Link href={explore.href} className="pill pill-white mt-7">
                  {explore.label}
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-[1.8]"><path d="M5 12h14M14 7l5 5-5 5" /></svg>
                </Link>
              )}
            </div>
          </article>

          {content.features.map(([title, description, chips], i) => (
            <article
              key={title}
              className="flex flex-col rounded-[28px] bg-white p-7 shadow-[0_1px_0_rgba(11,22,48,0.04),inset_0_0_0_1px_rgba(11,22,48,0.07)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(11,22,48,0.35),inset_0_0_0_1px_rgba(11,22,48,0.07)]"
            >
              <span className="font-serif text-[34px] italic leading-none text-brand">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-6 text-[22px] font-medium leading-[1.15] tracking-[-0.03em]">{title}</h3>
              <p className="mt-3 text-[15px] leading-[1.55] text-ink/65">{description}</p>
              <ul className="mt-auto flex flex-wrap gap-1.5 pt-6" aria-label={`${title}: examples`}>
                {chips.map((chip) => (
                  <li key={chip} className="rounded-full bg-paper px-3 py-1 text-[12.5px] font-medium text-brand-ink">
                    {chip}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
