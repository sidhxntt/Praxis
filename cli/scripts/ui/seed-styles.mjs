#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { STYLE_PROFILES } from "./profiles.mjs";

const templatesRoot = path.resolve(process.argv[2] ?? "templates");

for (const profile of STYLE_PROFILES) {
  await seed(profile);
}

async function seed(profile) {
  const sourceName = `DESIGN-${profile.id}.md`;
  const source = await readFile(path.join(templatesRoot, "designs", sourceName), "utf8");
  const palette = paletteFrom(source, profile.theme);
  const moduleRoot = path.join(templatesRoot, `ui.${profile.id}`);
  const assetName = `${profile.id}-composition.svg`;
  const style = createStyle(profile, palette, assetName);
  await write(path.join(moduleRoot, "style.json"), `${JSON.stringify(style, null, 2)}\n`);
  await write(path.join(moduleRoot, "assets", assetName), renderComposition(profile, palette));
  await write(
    path.join(moduleRoot, "DESIGN.md"),
    `# ${profile.brand} — ${title(profile.id)}-Inspired Landing Page Design\n\n`
      + `Source specification: \`templates/designs/${sourceName}\`.\n\n`
      + `This is an original Praxis Flow implementation inspired by the visual principles documented below. It is not affiliated with or endorsed by the referenced company. The fictional ${profile.brand} brand, all page copy, and the local composition artwork are original. No logos, proprietary product copy, or third-party imagery are included.\n\n`
      + `## Generated-page intent\n\n${profile.hero} ${profile.body}\n\n`
      + "## Source design guidance\n\n"
      + source,
  );
}

function createStyle(profile, palette, assetName) {
  const { id, brand, hero, body, archetype, theme, traits } = profile;
  const asset = `assets/${assetName}`;
  const middle = middleSections(profile, asset);
  return {
    id,
    name: `${title(id)} inspired`,
    sourceDesign: `DESIGN-${id}.md`,
    description: `${hero} ${body}`,
    traits,
    theme,
    tokens: {
      colors: palette,
      typography: {
        display: fontStack(archetype),
        body: bodyStack(archetype),
        displayWeight: archetype === "luxury" ? 500 : archetype === "playful" ? 700 : 600,
        bodySize: archetype === "editorial" ? "17px" : "16px",
        displayTracking: archetype === "playful" ? "-0.025em" : archetype === "technical" ? "-0.035em" : "-0.02em",
      },
      spacing: {
        container: archetype === "luxury" ? "1600px" : archetype === "technical" ? "1280px" : "1440px",
        section: archetype === "luxury" ? "clamp(5rem, 11vw, 10rem)" : "clamp(4rem, 9vw, 8rem)",
      },
      radii: {
        action: archetype === "technical" ? "10px" : archetype === "luxury" ? "2px" : "9999px",
        card: archetype === "playful" ? "28px" : archetype === "technical" ? "12px" : "18px",
      },
      motion: {
        duration: archetype === "luxury" ? "500ms" : "240ms",
        easing: archetype === "playful" ? "cubic-bezier(0.34, 1.56, 0.64, 1)" : "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
    },
    sections: [
      navigation(profile),
      heroSection(profile, asset),
      ...middle,
      cta(profile),
      footer(profile),
    ],
    assets: [{
      source: asset,
      alt: `Original abstract composition representing the ${brand} experience`,
      width: 1600,
      height: 900,
    }],
    accessibility: { reducedMotion: true, skipLink: true },
  };
}

function navigation({ brand, archetype }) {
  return {
    id: "top",
    type: "navigation",
    theme: archetype === "technical" || archetype === "luxury" ? "dark" : "light",
    variant: archetype === "editorial" ? "editorial" : archetype === "playful" ? "global-frosted" : "global",
    brand,
    links: [
      { label: "Overview", href: "#overview" },
      { label: "Experience", href: "#experience" },
      { label: "Principles", href: "#principles" },
    ],
    action: { label: actionLabel(archetype), href: "#begin" },
  };
}

function heroSection(profile, asset) {
  return {
    id: "overview",
    type: "hero",
    theme: profile.theme === "dark" ? "dark" : "light",
    variant: profile.archetype === "luxury" ? "immersive" : profile.archetype === "editorial" ? "split-editorial" : "centered-product",
    eyebrow: profile.brand,
    heading: profile.hero,
    body: profile.body,
    primaryAction: { label: actionLabel(profile.archetype), href: "#experience" },
    secondaryAction: { label: "See the story", href: "#principles" },
    asset,
  };
}

function middleSections(profile, asset) {
  const sections = {
    showcase: showcase(profile, asset, "experience", 0),
    showcaseTwo: showcase(profile, undefined, "craft", 1),
    features: features(profile),
    metrics: metrics(profile),
    logos: logos(profile),
    testimonials: testimonials(profile),
  };
  if (profile.archetype === "technical") {
    return [sections.metrics, sections.features, sections.showcase, sections.logos];
  }
  if (profile.archetype === "luxury") {
    return [sections.showcase, sections.showcaseTwo, sections.features, sections.metrics];
  }
  if (profile.archetype === "playful") {
    return [sections.logos, sections.features, sections.showcase, sections.testimonials];
  }
  return [sections.showcase, sections.features, sections.testimonials, sections.showcaseTwo];
}

function showcase(profile, asset, id, index) {
  const headings = profile.archetype === "luxury"
    ? ["Crafted around a singular feeling.", "Material, light, and motion in balance."]
    : profile.archetype === "technical"
      ? ["Clarity at every layer.", "Built to stay fast as ambition grows."]
      : profile.archetype === "playful"
        ? ["Serious capability, joyful by default.", "A system that leaves room for personality."]
        : ["Every detail supports the story.", "Designed for the moments between milestones."];
  return {
    id,
    type: "showcase",
    theme: index === 0 && profile.theme !== "light" ? "dark" : "light",
    variant: index === 0 ? (profile.archetype === "luxury" ? "full-bleed" : "split") : "light-stage",
    eyebrow: index === 0 ? "The experience" : "The craft",
    heading: headings[index],
    body: index === 0
      ? `${profile.brand} brings its most important ideas forward and lets every supporting detail recede.`
      : "Purposeful materials, durable choices, and a precise visual rhythm make the experience feel complete without feeling crowded.",
    action: { label: index === 0 ? "Explore the details" : "Read the principles", href: "#principles" },
    ...(asset ? { asset } : {}),
  };
}

function features(profile) {
  const vocabulary = profile.archetype === "technical"
    ? ["Observable by default", "Fast under pressure", "Open at the edges"]
    : profile.archetype === "luxury"
      ? ["Sculpted proportion", "Purposeful material", "Measured performance"]
      : profile.archetype === "playful"
        ? ["Easy to enter", "Flexible by nature", "Delight in the details"]
        : ["Clear from the start", "Human at every scale", "Made to endure"];
  return {
    id: "principles",
    type: "features",
    theme: "light",
    variant: profile.archetype === "playful" ? "bento" : profile.archetype === "technical" ? "grid" : "alternating",
    eyebrow: "Guiding principles",
    heading: `What makes ${profile.brand} feel different.`,
    body: "A small set of strong decisions creates a recognizable experience across every screen and every moment.",
    items: vocabulary.map((title, index) => ({
      title,
      description: featureDescription(profile, index),
      marker: `0${index + 1}`,
    })),
  };
}

function metrics(profile) {
  return {
    id: "proof",
    type: "metrics",
    theme: "dark",
    variant: profile.archetype === "technical" ? "grid" : "inline",
    eyebrow: "Measured in practice",
    heading: `${profile.brand}, by the numbers.`,
    items: profile.archetype === "technical"
      ? [{ value: "18 ms", label: "typical response" }, { value: "99.99%", label: "service availability" }, { value: "3×", label: "faster iteration" }]
      : [{ value: "42%", label: "less wasted effort" }, { value: "8.7/10", label: "customer delight" }, { value: "24/7", label: "ready when needed" }],
  };
}

function logos(profile) {
  return {
    id: "community",
    type: "logo-cloud",
    theme: "light",
    variant: profile.archetype === "playful" ? "ticker" : "row",
    heading: `Trusted by teams building with ${profile.brand}.`,
    items: ["Northstar", "Common Ground", "Bright Labs", "Open Field", "New Arc", "Good Work"],
  };
}

function testimonials(profile) {
  return {
    id: "voices",
    type: "testimonials",
    theme: profile.theme === "dark" ? "dark" : "light",
    variant: profile.archetype === "editorial" ? "editorial" : "cards",
    heading: `What people notice about ${profile.brand}.`,
    items: [
      { quote: "The experience feels considered from the first moment, but never asks us to learn its logic.", name: "Mara Chen", role: "Design lead" },
      { quote: "We moved faster without sacrificing the quality or clarity our customers expect.", name: "Jon Bell", role: "Product director" },
      { quote: "It gives the team enough structure to stay aligned and enough room to do original work.", name: "Amara Okafor", role: "Studio founder" },
    ],
  };
}

function cta(profile) {
  return {
    id: "begin",
    type: "cta",
    theme: profile.archetype === "luxury" ? "dark" : "light",
    variant: profile.archetype === "editorial" ? "split" : profile.archetype === "technical" ? "band" : "centered",
    eyebrow: "The next step",
    heading: closingHeading(profile),
    body: `Discover how ${profile.brand} can turn a clear idea into an experience people remember.`,
    action: { label: actionLabel(profile.archetype), href: "#top" },
  };
}

function footer(profile) {
  return {
    id: "footer",
    type: "footer",
    theme: "light",
    variant: profile.archetype === "technical" ? "columns" : "minimal",
    brand: profile.brand,
    summary: profile.body,
    columns: [
      { heading: "Explore", links: [{ label: "Overview", href: "#overview" }, { label: "Experience", href: "#experience" }] },
      { heading: "Company", links: [{ label: "Principles", href: "#principles" }, { label: "Contact", href: "#begin" }] },
    ],
    legal: `© 2026 ${profile.brand}. An original Praxis Flow demonstration brand.`,
  };
}

function paletteFrom(source, theme) {
  const hexes = [...new Set([...source.matchAll(/#[0-9a-fA-F]{6}\b/g)].map(([hex]) => hex.toLowerCase()))];
  const find = (...keys) => {
    for (const key of keys) {
      const match = source.match(new RegExp(`(?:^|\\n)\\s*${key}:\\s*["']?(#[0-9a-fA-F]{6})`, "i"));
      if (match) return match[1].toLowerCase();
    }
  };
  const accent = find("primary", "brand", "accent") ?? hexes[0] ?? "#2563eb";
  const background = find("canvas", "background", "surface") ?? (theme === "dark" ? "#0b0b0d" : "#ffffff");
  const foreground = find("ink", "body", "text") ?? (theme === "dark" ? "#f7f7f8" : "#161618");
  const darkSurface = find("surface-black", "surface-dark", "black") ?? (isDark(background) ? background : "#111113");
  return {
    background,
    surface: lightSurface(background, theme),
    foreground,
    muted: find("muted", "body-muted", "text-muted") ?? (theme === "dark" ? "#a3a3aa" : "#696970"),
    accent,
    accentContrast: isDark(accent) ? "#ffffff" : "#111113",
    darkSurface,
    darkForeground: "#ffffff",
    border: find("hairline", "border", "divider") ?? (theme === "dark" ? "#303036" : "#dedee3"),
  };
}

function renderComposition(profile, colors) {
  const safeBrand = xml(profile.brand);
  const variants = {
    technical: `<g fill="none" stroke="${colors.accent}" stroke-width="3"><path d="M220 650 520 240l260 260 220-330 380 480"/><circle cx="520" cy="240" r="22" fill="${colors.accent}"/><circle cx="1000" cy="170" r="22" fill="${colors.accent}"/></g><g fill="${colors.surface}"><rect x="260" y="560" width="280" height="120" rx="14"/><rect x="660" y="590" width="320" height="90" rx="14"/><rect x="1100" y="500" width="220" height="180" rx="14"/></g>`,
    luxury: `<path d="M120 690C420 260 760 170 1480 350v390H120z" fill="${colors.darkSurface}"/><path d="M310 620c180-310 580-390 970-130-270-65-550 5-740 190z" fill="${colors.accent}"/><ellipse cx="800" cy="700" rx="520" ry="54" fill="#000" opacity=".18"/>`,
    playful: `<g><circle cx="360" cy="310" r="190" fill="${colors.accent}"/><rect x="620" y="120" width="430" height="430" rx="110" fill="${colors.darkSurface}"/><path d="M1110 220h270v430h-270z" fill="${colors.surface}"/><circle cx="1215" cy="330" r="56" fill="${colors.accent}"/></g>`,
    editorial: `<rect x="170" y="120" width="560" height="650" fill="${colors.darkSurface}"/><rect x="780" y="210" width="640" height="460" fill="${colors.surface}"/><path d="M840 570c170-260 320-260 510 0z" fill="${colors.accent}"/><circle cx="1100" cy="330" r="92" fill="${colors.background}"/>`,
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-labelledby="title description"><title id="title">${safeBrand} original composition</title><desc id="description">An abstract geometric scene created for the ${safeBrand} demonstration landing page.</desc><rect width="1600" height="900" fill="${colors.background}"/>${variants[profile.archetype]}<text x="120" y="830" fill="${colors.foreground}" font-family="system-ui,sans-serif" font-size="30" font-weight="600">${safeBrand}</text></svg>\n`;
}

function featureDescription(profile, index) {
  const descriptions = [
    `${profile.brand} presents the next useful action clearly, with nothing unnecessary competing for attention.`,
    "Flexible foundations adapt to real work while keeping the experience coherent and recognizable.",
    "Small interactions, responsive pacing, and accessible defaults make quality visible in everyday use.",
  ];
  return descriptions[index];
}

function closingHeading(profile) {
  if (profile.archetype === "luxury") return "Experience the work in its purest form.";
  if (profile.archetype === "technical") return "Put clarity into production.";
  if (profile.archetype === "playful") return "Make the next idea feel possible.";
  return "Begin with a more thoughtful experience.";
}

function actionLabel(archetype) {
  if (archetype === "luxury") return "Discover the collection";
  if (archetype === "technical") return "Start building";
  if (archetype === "playful") return "Create something";
  return "Explore the story";
}

function fontStack(archetype) {
  if (archetype === "technical") return "'IBM Plex Sans', 'SFMono-Regular', ui-sans-serif, system-ui, sans-serif";
  if (archetype === "luxury") return "'Helvetica Neue', 'Arial Narrow', ui-sans-serif, system-ui, sans-serif";
  if (archetype === "editorial") return "Georgia, 'Times New Roman', ui-serif, serif";
  return "Inter, ui-sans-serif, system-ui, sans-serif";
}

function bodyStack(archetype) {
  return archetype === "technical"
    ? "Inter, ui-sans-serif, system-ui, sans-serif"
    : "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
}

function lightSurface(background, theme) {
  if (theme === "dark" || isDark(background)) return "#18181c";
  return background.toLowerCase() === "#ffffff" ? "#f5f5f7" : "#ffffff";
}

function isDark(hex) {
  const value = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((offset) => Number.parseInt(value.slice(offset, offset + 2), 16));
  return (r * 299 + g * 587 + b * 114) / 1000 < 140;
}

function title(id) {
  return id.split("-").map((part) => part.length <= 2 ? part.toUpperCase() : `${part[0].toUpperCase()}${part.slice(1)}`).join(" ");
}

function xml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

async function write(file, contents) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, contents, "utf8");
}
