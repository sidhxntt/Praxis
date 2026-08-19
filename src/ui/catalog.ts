export const UI_STYLE_IDS = [
  "airbnb",
  "airtable",
  "apple",
  "binance",
  "bmw-m",
  "bmw",
  "bugatti",
  "cal",
  "claude",
  "clay",
  "clickhouse",
  "coinbase",
  "cursor",
  "dell-1996",
  "discord",
  "elevenlabs",
  "expo",
  "ferrari",
  "figma",
  "framer",
  "hp",
  "lamborghini",
  "lovable",
  "mastercard",
  "meta",
  "mongodb",
  "notion",
  "nvidia",
  "ollama",
  "pinterest",
  "playstation",
  "raycast",
  "revolut",
  "sentry",
  "spacex",
  "supabase",
  "tesla",
  "uber",
  "vercel",
  "warp",
] as const;

export type UiStyleId = (typeof UI_STYLE_IDS)[number];

export interface UiStyleSummary {
  id: UiStyleId;
  label: string;
  designFile: `DESIGN-${UiStyleId}.md`;
  description: string;
  traits: readonly string[];
  theme: "light" | "dark" | "mixed";
}

type StyleDetails = Omit<UiStyleSummary, "id" | "designFile">;

const STYLE_DETAILS: Record<UiStyleId, StyleDetails> = {
  airbnb: style("Airbnb", "Warm editorial travel storytelling with airy cards and vivid accents.", ["editorial", "travel", "warm"], "light"),
  airtable: style("Airtable", "Colorful modular storytelling with playful product-led sections.", ["colorful", "modular", "playful"], "light"),
  apple: style("Apple", "Minimal product theater with generous space and cinematic typography.", ["minimal", "premium", "editorial"], "mixed"),
  binance: style("Binance", "Dense financial confidence balanced by sharp yellow highlights.", ["finance", "technical", "bold"], "dark"),
  "bmw-m": style("BMW M", "High-performance editorial composition with motorsport color energy.", ["automotive", "performance", "bold"], "dark"),
  bmw: style("BMW", "Precision automotive presentation with disciplined grids and clean surfaces.", ["automotive", "premium", "structured"], "light"),
  bugatti: style("Bugatti", "Dramatic luxury storytelling with sculpted dark surfaces and fine detail.", ["luxury", "automotive", "dramatic"], "dark"),
  cal: style("Cal", "Quiet scheduling clarity with crisp typography and compact product moments.", ["minimal", "productivity", "calm"], "light"),
  claude: style("Claude", "Warm humanist editorial design with thoughtful type and tactile color.", ["editorial", "warm", "human"], "light"),
  clay: style("Clay", "Expressive go-to-market storytelling with saturated color and soft geometry.", ["colorful", "saas", "expressive"], "mixed"),
  clickhouse: style("ClickHouse", "Technical data storytelling with bright yellow signals and dark contrast.", ["data", "technical", "bold"], "dark"),
  coinbase: style("Coinbase", "Trustworthy financial clarity with blue bands and spacious information.", ["finance", "clean", "trustworthy"], "light"),
  cursor: style("Cursor", "Dark developer tooling narrative with code surfaces and restrained motion.", ["developer", "technical", "dark"], "dark"),
  "dell-1996": style("Dell 1996", "Retro web exuberance with ribbons, stickers, and nostalgic framing.", ["retro", "playful", "nostalgic"], "light"),
  discord: style("Discord", "Friendly community energy with bold type, purple accents, and rounded scenes.", ["community", "playful", "bold"], "mixed"),
  elevenlabs: style("ElevenLabs", "Atmospheric audio storytelling with luminous gradients and quiet depth.", ["audio", "atmospheric", "premium"], "dark"),
  expo: style("Expo", "Developer-first product storytelling with device frames and precise dark surfaces.", ["developer", "mobile", "technical"], "dark"),
  ferrari: style("Ferrari", "Editorial racing drama with strong red accents and cinematic pacing.", ["automotive", "editorial", "dramatic"], "mixed"),
  figma: style("Figma", "Collaborative creativity expressed through color blocks and playful geometry.", ["creative", "colorful", "collaborative"], "light"),
  framer: style("Framer", "Polished creative tooling with gradient spotlights and confident typography.", ["creative", "saas", "gradient"], "dark"),
  hp: style("HP", "Accessible technology storytelling with bright photography-inspired compositions.", ["technology", "friendly", "editorial"], "light"),
  lamborghini: style("Lamborghini", "Angular supercar drama with neon accents and aggressive geometry.", ["automotive", "luxury", "angular"], "dark"),
  lovable: style("Lovable", "Soft AI product optimism with rosy gradients and approachable surfaces.", ["ai", "soft", "playful"], "light"),
  mastercard: style("Mastercard", "Human-centered financial storytelling with warm circles and orbital motion.", ["finance", "warm", "geometric"], "light"),
  meta: style("Meta", "Open connected experiences with blue gradients and expansive editorial layouts.", ["technology", "social", "gradient"], "light"),
  mongodb: style("MongoDB", "Developer education and product clarity anchored by rich green accents.", ["developer", "data", "editorial"], "light"),
  notion: style("Notion", "Document-like product storytelling with monochrome illustrations and calm structure.", ["productivity", "minimal", "editorial"], "light"),
  nvidia: style("NVIDIA", "High-impact computing narrative with black fields and electric green signals.", ["technology", "performance", "bold"], "dark"),
  ollama: style("Ollama", "Quiet local-first developer experience with monochrome warmth and simple shapes.", ["developer", "minimal", "calm"], "light"),
  pinterest: style("Pinterest", "Image-led discovery with editorial rhythm, vivid red, and masonry energy.", ["visual", "editorial", "discovery"], "light"),
  playstation: style("PlayStation", "Immersive entertainment storytelling with blue light and cinematic cards.", ["gaming", "cinematic", "bold"], "dark"),
  raycast: style("Raycast", "Precise productivity storytelling with luminous gradients and dense polish.", ["productivity", "gradient", "premium"], "dark"),
  revolut: style("Revolut", "Confident modern finance with oversized type and high-contrast product moments.", ["finance", "bold", "modern"], "mixed"),
  sentry: style("Sentry", "Developer observability told through warm purple, illustration, and technical detail.", ["developer", "observability", "illustrated"], "mixed"),
  spacex: style("SpaceX", "Austere aerospace storytelling with full-bleed darkness and mission scale.", ["aerospace", "cinematic", "minimal"], "dark"),
  supabase: style("Supabase", "Open-source developer confidence with emerald glow and terminal-like surfaces.", ["developer", "open-source", "technical"], "dark"),
  tesla: style("Tesla", "Full-bleed product storytelling with minimal controls and cinematic pacing.", ["automotive", "minimal", "cinematic"], "mixed"),
  uber: style("Uber", "Direct urban storytelling with strong black-and-white typography and utility.", ["urban", "bold", "editorial"], "light"),
  vercel: style("Vercel", "Monochrome developer precision with geometric gradients and rigorous spacing.", ["developer", "minimal", "geometric"], "mixed"),
  warp: style("Warp", "Modern terminal storytelling with vivid gradients and dimensional code surfaces.", ["developer", "terminal", "gradient"], "dark"),
};

export const UI_STYLES: readonly UiStyleSummary[] = UI_STYLE_IDS.map((id) => ({
  id,
  designFile: `DESIGN-${id}.md`,
  ...STYLE_DETAILS[id],
}));

export function isUiStyleId(value: unknown): value is UiStyleId {
  return typeof value === "string" && (UI_STYLE_IDS as readonly string[]).includes(value);
}

function style(
  name: string,
  description: string,
  traits: readonly string[],
  theme: UiStyleSummary["theme"],
): StyleDetails {
  return { label: `${name} inspired`, description, traits, theme };
}
