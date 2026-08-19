"use client";
import Link from "next/link";
import { Logo } from "./logo";
import { usePathname } from "next/navigation";

export function Footer() {
  const isPro = usePathname().startsWith("/pro");
  const documentation = [
    { title: "Overview", href: "https://github.com/sidhxntt/Praxis#readme" },
    { title: "Architecture", href: "https://github.com/sidhxntt/Praxis/tree/main/docs" },
    { title: isPro ? "Praxis Pro" : "Standard projects", href: isPro ? "https://github.com/sidhxntt/Praxis/blob/main/docs/praxis-pro.md" : "https://github.com/sidhxntt/Praxis/blob/main/docs/standard-projects.md" },
  ];

  const resources = [
    { title: "GitHub", href: "https://github.com/sidhxntt/Praxis" },
    { title: "CLI help", href: "https://github.com/sidhxntt/Praxis#cli-reference" },
    { title: "UI templates", href: "https://github.com/sidhxntt/Praxis#landing-page-template-gallery" },
  ];

  const company = [
    { title: "Praxis Flow", href: "/" },
    { title: "Praxis Pro", href: "/pro" },
    { title: "FAQ", href: `${isPro ? "/pro" : ""}/#faqs` },
  ];

  const legal = [
    { title: "MIT License", href: "https://github.com/sidhxntt/Praxis/blob/main/LICENSE" },
  ];

  return (
    <div className="relative border-t border-white/[0.1] px-8 py-20 bg-black w-full overflow-hidden mx-auto max-w-7xl">
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-px flex h-8 items-end overflow-hidden">
        <div className="flex -mb-px h-[2px] w-56">
          <div className="w-full flex-none [background-image:linear-gradient(90deg,rgba(255,255,255,0)_0%,#FFFFFF_32.29%,rgba(255,255,255,0.3)_67.19%,rgba(255,255,255,0)_100%)] blur-xs" />
        </div>
      </div>

      <div className="max-w-7xl my-28 mx-auto text-sm text-neutral-400 flex flex-col justify-between md:px-8">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-10 md:mb-0">
            <Logo />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-20">
            <div className="flex flex-col space-y-4">
              <p className="text-white font-semibold">Documentation</p>
              <ul className="space-y-3">
                {documentation.map((item, idx) => (
                  <li key={`doc-${idx}`}>
                    <Link
                      href={item.href}
                      className="hover:text-white transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col space-y-4">
              <p className="text-white font-semibold">Resources</p>
              <ul className="space-y-3">
                {resources.map((item, idx) => (
                  <li key={`resource-${idx}`}>
                    <Link
                      href={item.href}
                      className="hover:text-white transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col space-y-4">
              <p className="text-white font-semibold">Company</p>
              <ul className="space-y-3">
                {company.map((item, idx) => (
                  <li key={`company-${idx}`}>
                    <Link
                      href={item.href}
                      className="hover:text-white transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col space-y-4">
              <p className="text-white font-semibold">Legal</p>
              <ul className="space-y-3">
                {legal.map((item, idx) => (
                  <li key={`legal-${idx}`}>
                    <Link
                      href={item.href}
                      className="hover:text-white transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
