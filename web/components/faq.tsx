"use client";

import { useState } from "react";
import { products, type ProductKey } from "@/lib/products";
import { flowFAQs, proFAQs } from "@/lib/faqs";

export function FrequentlyAskedQuestions({ product }: { product: ProductKey }) {
  const [open, setOpen] = useState<number | null>(0);
  const content = products[product];
  const faqs = product === "flow" ? flowFAQs : proFAQs;
  return (
    <section id="faqs" className="scroll-mt-24 border-t border-ink/[0.07] bg-white">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-5 py-24 md:px-11 md:py-32 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">FAQ</p>
          <h2 className="display mt-5 text-[min(56px,10vw)]">
            Questions, <em>answered in detail.</em>
          </h2>
          <p className="mt-6 max-w-[420px] text-[16px] leading-[1.5] text-ink/65">
            The practical distinctions behind {content.name}, its generated output, and where your team remains in control.
          </p>
        </div>
        <ul className="divide-y divide-ink/[0.08] border-y border-ink/[0.08]">
          {faqs.map(([question, answer], i) => {
            const isOpen = open === i;
            const id = `faq-${product}-${i}`;
            return (
              <li key={question}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={id}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-start justify-between gap-6 py-5 text-left text-[17px] font-medium tracking-[-0.02em] transition hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    {question}
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[16px] leading-none transition duration-300 ${
                        isOpen ? "rotate-45 bg-brand text-white" : "bg-paper text-brand"
                      }`}
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div
                  id={id}
                  role="region"
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[620px] pb-6 text-[15px] leading-[1.6] text-ink/65">{answer}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
