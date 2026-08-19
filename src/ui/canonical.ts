import { isUiStyleId, UiStyleId } from "./catalog";

export interface DesignTokens {
  colors: {
    background: string;
    surface: string;
    foreground: string;
    muted: string;
    accent: string;
    accentContrast: string;
    darkSurface: string;
    darkForeground: string;
    border: string;
  };
  typography: {
    display: string;
    body: string;
    displayWeight: number;
    bodySize: string;
    displayTracking: string;
  };
  spacing: { container: string; section: string };
  radii: { action: string; card: string };
  motion: { duration: string; easing: string };
}

export interface LocalAsset {
  source: `assets/${string}`;
  alt: string;
  width: number;
  height: number;
  decorative?: boolean;
}

interface SectionBase {
  id: string;
  theme: "light" | "dark" | "accent";
}

export interface NavigationSection extends SectionBase {
  type: "navigation";
  variant: "global" | "global-frosted" | "editorial";
  brand: string;
  links: Array<{ label: string; href: string }>;
  action: { label: string; href: string };
}

export interface HeroSection extends SectionBase {
  type: "hero";
  variant: "centered-product" | "split-editorial" | "immersive";
  eyebrow?: string;
  heading: string;
  body: string;
  primaryAction: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  asset: `assets/${string}`;
}

export interface ShowcaseSection extends SectionBase {
  type: "showcase";
  variant: "dark-stage" | "light-stage" | "split" | "full-bleed";
  eyebrow?: string;
  heading: string;
  body: string;
  action?: { label: string; href: string };
  asset?: `assets/${string}`;
}

export interface FeaturesSection extends SectionBase {
  type: "features";
  variant: "bento" | "grid" | "alternating";
  eyebrow?: string;
  heading: string;
  body?: string;
  items: Array<{ title: string; description: string; marker?: string }>;
}

export interface MetricsSection extends SectionBase {
  type: "metrics";
  variant: "inline" | "grid";
  eyebrow?: string;
  heading: string;
  items: Array<{ value: string; label: string }>;
}

export interface LogoCloudSection extends SectionBase {
  type: "logo-cloud";
  variant: "row" | "ticker";
  heading: string;
  items: string[];
}

export interface TestimonialsSection extends SectionBase {
  type: "testimonials";
  variant: "cards" | "editorial";
  heading: string;
  items: Array<{ quote: string; name: string; role: string }>;
}

export interface PricingSection extends SectionBase {
  type: "pricing";
  variant: "cards" | "comparison";
  heading: string;
  body?: string;
  tiers: Array<{
    name: string;
    price: string;
    description: string;
    features: string[];
  }>;
}

export interface CtaSection extends SectionBase {
  type: "cta";
  variant: "centered" | "band" | "split";
  eyebrow?: string;
  heading: string;
  body: string;
  action: { label: string; href: string };
}

export interface FooterSection extends SectionBase {
  type: "footer";
  variant: "columns" | "minimal";
  brand: string;
  summary: string;
  columns: Array<{
    heading: string;
    links: Array<{ label: string; href: string }>;
  }>;
  legal: string;
}

export type LandingSection =
  | NavigationSection
  | HeroSection
  | ShowcaseSection
  | FeaturesSection
  | MetricsSection
  | LogoCloudSection
  | TestimonialsSection
  | PricingSection
  | CtaSection
  | FooterSection;

export interface CanonicalLandingPage {
  id: UiStyleId;
  name: string;
  sourceDesign: `DESIGN-${UiStyleId}.md`;
  description: string;
  traits: string[];
  theme: "light" | "dark" | "mixed";
  tokens: DesignTokens;
  sections: LandingSection[];
  assets: LocalAsset[];
  accessibility: { reducedMotion: true; skipLink: true };
}

const SECTION_TYPES = new Set([
  "navigation",
  "hero",
  "showcase",
  "features",
  "metrics",
  "logo-cloud",
  "testimonials",
  "pricing",
  "cta",
  "footer",
]);

export function validateCanonicalLandingPage(input: unknown): CanonicalLandingPage {
  if (!isRecord(input)) throw new Error("canonical style must be an object");
  if (!isUiStyleId(input.id)) throw new Error("canonical style id is unsupported");
  if (input.sourceDesign !== `DESIGN-${input.id}.md`) {
    throw new Error("source design must match the canonical style id");
  }
  requireText(input.name, "canonical style name");
  requireText(input.description, "canonical style description");
  if (!Array.isArray(input.traits) || input.traits.length === 0) {
    throw new Error("canonical style must declare traits");
  }
  if (!isRecord(input.tokens)) throw new Error("canonical style tokens are required");
  if (!Array.isArray(input.sections) || input.sections.length < 7) {
    throw new Error("landing page must contain at least seven sections");
  }

  const ids = new Set<string>();
  for (const section of input.sections) {
    if (!isRecord(section) || !SECTION_TYPES.has(String(section.type))) {
      throw new Error("landing page contains an unsupported section");
    }
    requireText(section.id, "section id");
    if (ids.has(section.id as string)) throw new Error("section ids must be unique");
    ids.add(section.id as string);
    if (section.type !== "navigation" && section.type !== "footer") {
      requireText(section.heading, `${section.type} heading`);
    }
  }
  if ((input.sections[0] as Record<string, unknown>).type !== "navigation") {
    throw new Error("landing page must begin with navigation");
  }
  if ((input.sections[input.sections.length - 1] as Record<string, unknown>).type !== "footer") {
    throw new Error("landing page must end with a footer");
  }
  if (!input.sections.some((section) => isRecord(section) && section.type === "hero")) {
    throw new Error("landing page must contain a hero");
  }
  if (!input.sections.some((section) => isRecord(section) && section.type === "cta")) {
    throw new Error("landing page must contain a call to action");
  }

  if (!Array.isArray(input.assets)) throw new Error("canonical style assets are required");
  for (const asset of input.assets) {
    if (!isRecord(asset) || typeof asset.source !== "string") {
      throw new Error("canonical style asset is invalid");
    }
    if (
      !asset.source.startsWith("assets/")
      || asset.source.includes("..")
      || asset.source.includes("://")
    ) {
      throw new Error("asset source must stay inside assets/");
    }
    if (asset.decorative === true ? asset.alt !== "" : typeof asset.alt !== "string" || asset.alt.length === 0) {
      throw new Error("assets must provide appropriate alternative text");
    }
    if (!Number.isFinite(asset.width) || !Number.isFinite(asset.height)) {
      throw new Error("assets must declare intrinsic dimensions");
    }
  }

  if (
    !isRecord(input.accessibility)
    || input.accessibility.reducedMotion !== true
    || input.accessibility.skipLink !== true
  ) {
    throw new Error("canonical style must support reduced motion and skip links");
  }
  return input as unknown as CanonicalLandingPage;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function requireText(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} is required`);
  }
}
