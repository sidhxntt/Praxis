"use client";

import { useEffect, useState } from "react";
import { products, type ProductKey } from "@/lib/products";

/** A slim bar that takes over once the hero (and its own nav) has scrolled away. */
export function SiteNav({ product }: { product: ProductKey }) {
  const p = products[product];
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Product", href: "#product" },
    { label: "How it works", href: "#how" },
    { label: "FAQ", href: "#faqs" },
    { label: p.other.name, href: p.other.href },
  ];

  return (
    <div
      className={`fixed inset-x-0 top-3 z-50 flex justify-center px-3 transition duration-300 ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"
      }`}
      aria-hidden={!shown}
    >
      <header className="flex w-full max-w-[760px] items-center gap-6 rounded-full bg-white/80 py-2 pl-5 pr-2 text-[14px] font-medium shadow-[0_10px_30px_-14px_rgba(11,22,48,0.35),inset_0_0_0_1px_rgba(11,22,48,0.07)] backdrop-blur-xl backdrop-saturate-150">
        <a href="#home" tabIndex={shown ? 0 : -1} className="mr-auto flex items-center gap-2 text-[16px] font-semibold tracking-[-0.01em] text-ink">
          <span className="h-3.5 w-3.5 rounded-full bg-brand" aria-hidden="true" />
          {p.name}
        </a>
        <nav aria-label="Sections" className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} tabIndex={shown ? 0 : -1} className="text-ink/70 transition hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>
        <a href={p.wiki} tabIndex={shown ? 0 : -1} className="pill pill-brand !px-[18px] !py-[9px] !text-[13.5px]">
          Agent Wiki
        </a>
      </header>
    </div>
  );
}
