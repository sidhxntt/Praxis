import {
  IconActivityHeartbeat,
  IconBox,
  IconBrandDjango,
  IconBrandDocker,
  IconBrandGolang,
  IconBrandNextjs,
  IconBrandNodejs,
  IconBrandTerraform,
  IconBrandTypescript,
  IconBrandVercel,
  IconBrandVite,
  IconDatabase,
  IconPalette,
  IconStack2,
} from "@tabler/icons-react";
import { products, type ProductKey } from "@/lib/products";

export function StackStrip({ product }: { product: ProductKey }) {
  const content = products[product];
  const items =
    product === "flow"
      ? ([
          ["Next.js", IconBrandNextjs, "Frontend"],
          ["Vite React", IconBrandVite, "Frontend"],
          ["Express", IconBrandNodejs, "Backend"],
          ["PostgreSQL", IconDatabase, "Data"],
          ["Vercel", IconBrandVercel, "Deploy"],
          ["Docker", IconBrandDocker, "Deploy"],
          ["UI heroes", IconPalette, "Tooling"],
          ["JS + TS", IconBrandTypescript, "Language"],
        ] as const)
      : ([
          ["Django + DRF", IconBrandDjango, "Backend"],
          ["Go + Gin", IconBrandGolang, "Backend"],
          ["PostgreSQL", IconDatabase, "Data"],
          ["Redis", IconStack2, "Data"],
          ["Docker", IconBrandDocker, "Deploy"],
          ["Kubernetes", IconBox, "Deploy"],
          ["Terraform", IconBrandTerraform, "Infra"],
          ["OpenTelemetry", IconActivityHeartbeat, "Observe"],
        ] as const);

  return (
    <section aria-label="Supported stack" className="border-b border-ink/[0.07] bg-white">
      <div className="mx-auto max-w-[1200px] px-5 py-14 md:px-11">
        <p className="mx-auto max-w-[520px] text-center text-[15px] leading-[1.5] text-ink/60">{content.stackLine}</p>
        <ul className="mt-9 grid grid-cols-2 overflow-hidden rounded-[22px] border border-ink/[0.08] sm:grid-cols-4 lg:grid-cols-8">
          {items.map(([name, Icon, category]) => (
            <li
              key={name}
              className="-mb-px -mr-px flex min-h-[124px] flex-col items-center justify-center gap-2 border-b border-r border-ink/[0.08] px-3 text-center"
            >
              <span className="text-[11px] font-medium text-ink/40">{category}</span>
              <Icon size={26} stroke={1.5} className="text-brand" aria-hidden="true" />
              <span className="text-[14px] font-medium tracking-[-0.01em]">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
