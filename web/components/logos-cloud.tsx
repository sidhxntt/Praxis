import { products, type ProductKey } from "@/lib/products";
import {
  IconActivityHeartbeat,
  IconBrandDjango,
  IconBrandDocker,
  IconBrandGolang,
  IconBrandNextjs,
  IconBrandNodejs,
  IconBrandTerraform,
  IconBrandVite,
  IconBrandVercel,
  IconBrandTypescript,
  IconBox,
  IconBrandDatabricks,
  IconDatabase,
  IconPalette,
} from "@tabler/icons-react";

export function SpotlightLogoCloud({ product = "flow" }: { product?: ProductKey }) {
  const content = products[product];
  const items = product === "flow"
    ? [
        ["Next.js", IconBrandNextjs, "Frontend"], ["Vite React", IconBrandVite, "Frontend"],
        ["Express", IconBrandNodejs, "Backend"], ["PostgreSQL", IconDatabase, "Backend"],
        ["Vercel", IconBrandVercel, "Deployment"], ["Docker", IconBrandDocker, "Deployment"],
        ["40 UI styles", IconPalette, "Tooling"], ["JavaScript + TypeScript", IconBrandTypescript, "Language"],
      ] as const
    : [
        ["Django + DRF", IconBrandDjango, "Backend"], ["Go + Gin", IconBrandGolang, "Backend"],
        ["PostgreSQL", IconDatabase, "Data"], ["Redis", IconBrandDatabricks, "Data"],
        ["Docker", IconBrandDocker, "Deployment"], ["Kubernetes", IconBox, "Deployment"],
        ["Terraform", IconBrandTerraform, "Infrastructure"], ["OpenTelemetry", IconActivityHeartbeat, "Observability"],
      ] as const;

  return (
    <section className="relative w-full overflow-hidden border-y border-white/[0.07] py-14">
      <p className="mx-auto mb-8 max-w-2xl px-4 text-center text-sm text-neutral-500">{content.name} generates native projects across the tools teams already use.</p>
      <div className="mx-auto grid max-w-6xl grid-cols-2 border-l border-t border-white/[0.07] sm:grid-cols-4">
        {items.map(([name, Icon, category]) => <div key={name} className="flex min-h-28 flex-col items-center justify-center gap-2 border-b border-r border-white/[0.07] px-4 text-center"><span className="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-600">{category}</span><Icon size={27} stroke={1.5} className="text-neutral-200" aria-hidden="true" /><span className="text-sm font-medium text-neutral-300">{name}</span></div>)}
      </div>
    </section>
  );
}
