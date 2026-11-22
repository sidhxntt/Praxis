import { products, type ProductKey } from "@/lib/products";

export function Footer({ product }: { product: ProductKey }) {
  const content = products[product];
  const isPro = product === "pro";
  const columns = [
    {
      title: "Documentation",
      links: [
        { title: "Overview", href: "https://github.com/sidhxntt/Praxis#readme" },
        { title: "Architecture", href: "https://github.com/sidhxntt/Praxis/tree/main/docs" },
        isPro
          ? { title: "Praxis Pro", href: "https://github.com/sidhxntt/Praxis/blob/main/docs/praxis-pro.md" }
          : { title: "Standard projects", href: "https://github.com/sidhxntt/Praxis/blob/main/docs/standard-projects.md" },
      ],
    },
    {
      title: "Resources",
      links: [
        { title: "GitHub", href: "https://github.com/sidhxntt/Praxis" },
        { title: "Agent Wiki", href: content.wiki },
        { title: "UI templates", href: "/preview" },
      ],
    },
    {
      title: "Products",
      links: [
        { title: "Praxis Flow", href: "/" },
        { title: "Praxis Pro", href: "/pro" },
        { title: "FAQ", href: "#faqs" },
      ],
    },
    {
      title: "Legal",
      links: [{ title: "MIT License", href: "https://github.com/sidhxntt/Praxis/blob/main/LICENSE.txt" }],
    },
  ];

  return (
    <footer className="bg-brand-deep text-white/70">
      <div className="mx-auto max-w-[1200px] px-5 pb-10 pt-20 md:px-11">
        <div className="flex flex-col gap-14 md:flex-row md:justify-between">
          <div>
            <a href="#home" className="flex items-center gap-2.5 text-[18px] font-semibold tracking-[-0.01em] text-white">
              <span className="h-4 w-4 rounded-full bg-white" aria-hidden="true" />
              {content.name}
            </a>
            <p className="mt-4 max-w-[280px] text-[14px] leading-[1.5]">
              A configuration-driven CLI that composes standalone projects from maintained modules.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 text-[14px] sm:grid-cols-4 lg:gap-16">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="font-medium text-white">{col.title}</p>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.title}>
                      <a href={l.href} className="transition hover:text-white">
                        {l.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <p
          aria-hidden="true"
          className="mt-20 select-none font-serif text-[clamp(64px,17vw,220px)] italic leading-[0.8] tracking-[-0.03em] text-white/[0.08]"
        >
          {content.name}
        </p>
        <div className="mt-8 flex flex-col justify-between gap-2 border-t border-white/10 pt-6 text-[12.5px] sm:flex-row">
          <span>MIT licensed · Generated code is yours.</span>
          <span className="font-mono">{content.command}</span>
        </div>
      </div>
    </footer>
  );
}
