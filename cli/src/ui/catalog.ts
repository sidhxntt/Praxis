export const UI_STYLE_IDS = [
  "alpina",
  "apogee",
  "commons",
  "farsight",
  "furrow",
  "hana",
  "juno",
  "leo",
  "limelight",
  "nocturne",
  "ora",
  "quanta",
  "ritaglio",
  "sayso",
  "slate",
  "solene",
  "sora",
  "vesper",
] as const;

export type UiStyleId = (typeof UI_STYLE_IDS)[number];

/** UI templates are React components, so they ship for the React frameworks only. */
export const UI_TEMPLATE_FRAMEWORKS = ["next", "vite"] as const;

export function supportsUiTemplates(framework: string | undefined): boolean {
  return (UI_TEMPLATE_FRAMEWORKS as readonly string[]).includes(framework ?? "");
}

export interface UiStyleSummary {
  id: UiStyleId;
  label: string;
  description: string;
  traits: readonly string[];
  theme: "light" | "dark" | "mixed";
}

type StyleDetails = Omit<UiStyleSummary, "id">;

const STYLE_DETAILS: Record<UiStyleId, StyleDetails> = {
  alpina: style("Alpina", "A night train crossing a stone viaduct at sunrise, alive like footage: the train runs car by car while mist and light move through the valley.", ["travel", "cinematic", "photographic"], "mixed"),
  apogee: style("Apogee", "A weekly letter about the night sky: one living photograph of a tidal flat at dusk with a ringed planet half-set behind the horizon.", ["newsletter", "cinematic", "photographic"], "dark"),
  commons: style("Commons", "A guide to a city's parks drawn as a lawn seen from above, a grainy flat illustration where the afternoon carries on by itself.", ["guide", "illustrated", "calm"], "light"),
  farsight: style("Farsight", "A magazine of places seen from far away: seven aerial photographs turn on a ring in real 3D under a thin serif headline.", ["editorial", "photographic", "3d"], "dark"),
  furrow: style("Furrow", "Field intelligence for growers: a huge aerial photograph of fields with a survey grid, live sensors and a sweep of light across the farm.", ["agritech", "data", "photographic"], "light"),
  hana: style("Hana", "A speaker and advisor's site: a calm portrait on mint paper behind a pane of reeded glass rendered as live refraction.", ["personal", "editorial", "portrait"], "light"),
  juno: style("Juno", "A designer's portfolio as a page of her notebook, with polaroids and notes stuck on lined paper that visitors can pick up.", ["portfolio", "playful", "tactile"], "light"),
  leo: style("Leo", "A film photographer's portfolio: an enormous red greeting and a black-and-white cut-out who turns his head to follow the pointer.", ["portfolio", "playful", "photographic"], "light"),
  limelight: style("Limelight", "A brand studio on a yellow halftone ground: a black silhouette before a giant word, with a moving light revealing the colour photograph.", ["agency", "bold", "colorful"], "light"),
  nocturne: style("Nocturne", "A streaming service whose film is already playing: one picture fills the page and moves like a dolly shot under a floating interface.", ["streaming", "cinematic", "photographic"], "dark"),
  ora: style("Ora", "An AI voice receptionist on electric blue, with a glossy glass ball drifting across the headline and bending the words like a real lens.", ["ai", "saas", "bold"], "dark"),
  quanta: style("Quanta", "A fast reasoning model launch: a ring of light made of thousands of particles orbits a live console, all drawn in code.", ["ai", "developer", "technical"], "dark"),
  ritaglio: style("Ritaglio", "A paper-cut animation studio on black: two huge words beside a cut-paper swimming pool whose pieces move in stop-motion and can be picked up.", ["studio", "illustrated", "playful"], "dark"),
  sayso: style("Sayso", "A product that builds a small app from one spoken sentence: a red moulded device like a toy radio alone on warm paper.", ["ai", "product", "playful"], "light"),
  slate: style("Slate", "An architecture studio showing one house, its name set huge across the sky behind the roofline with a script word in front.", ["architecture", "editorial", "photographic"], "mixed"),
  solene: style("Solène", "A thermal bath house: one rounded, living photograph on a sage page, with a quiet statement and the name set large and thin along the bottom.", ["hospitality", "calm", "photographic"], "light"),
  sora: style("Sora", "A travel-money card floating over a 3D field of enamel tiles that swell red, hopping and flipping to pay while the receipt rolls through cities.", ["finance", "3d", "bold"], "light"),
  vesper: style("Vesper", "A personal system that reads your day, shown as thirteen live tiles floating at three depths around a figure on a black stage.", ["product", "data", "3d"], "mixed"),
};

export const UI_STYLES: readonly UiStyleSummary[] = UI_STYLE_IDS.map((id) => ({
  id,
  ...STYLE_DETAILS[id],
}));

export function isUiStyleId(value: unknown): value is UiStyleId {
  return typeof value === "string" && (UI_STYLE_IDS as readonly string[]).includes(value);
}

function style(
  label: string,
  description: string,
  traits: readonly string[],
  theme: UiStyleSummary["theme"],
): StyleDetails {
  return { label, description, traits, theme };
}
