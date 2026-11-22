import { pipeline, products, type ProductKey } from "@/lib/products";

export function HowItWorks({ product }: { product: ProductKey }) {
  const content = products[product];
  return (
    <section id="how" className="scroll-mt-24">
      <div className="mx-auto max-w-[1200px] px-5 py-24 md:px-11 md:py-32">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="eyebrow">How it works</p>
            <h2 className="display mt-5 text-[min(64px,11vw)]">
              {content.proofTitle[0]} <em>{content.proofTitle[1]}</em>
            </h2>
          </div>
          <p className="max-w-[460px] text-[16px] leading-[1.5] text-ink/65">{content.proofDescription}</p>
        </div>

        <ol className="relative mt-16 grid gap-6 md:grid-cols-5 md:gap-4" aria-label="Generation pipeline">
          <span aria-hidden="true" className="absolute left-[15px] top-4 bottom-4 w-px bg-ink/10 md:left-4 md:right-4 md:top-[15px] md:bottom-auto md:h-px md:w-auto" />
          {pipeline.map(([name, detail], i) => (
            <li key={name} className="relative flex gap-4 md:flex-col md:gap-5">
              <span
                className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold ${
                  i === pipeline.length - 1 ? "bg-brand text-white" : "bg-white text-brand shadow-[inset_0_0_0_1px_rgba(11,22,48,0.1)]"
                }`}
              >
                {i + 1}
              </span>
              <span>
                <span className="block text-[18px] font-medium tracking-[-0.02em]">{name}</span>
                <span className="mt-1 block max-w-[220px] text-[14px] leading-[1.45] text-ink/60">{detail}</span>
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.proofCards.map(([title, description]) => (
            <article key={title} className="rounded-[24px] bg-white p-6 shadow-[inset_0_0_0_1px_rgba(11,22,48,0.07)]">
              <h3 className="font-serif text-[30px] italic leading-none text-brand">{title}</h3>
              <p className="mt-4 text-[15px] leading-[1.55] text-ink/65">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
