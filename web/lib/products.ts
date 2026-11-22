import uiTemplates from "./ui-templates.json";

export type ProductKey = "flow" | "pro";
const HEROES = String(uiTemplates.length);

const WIKI = "https://github.com/sidhxntt/Praxis/wiki/Agent-Guide";

export const products = {
  flow: {
    name: "Praxis Flow",
    shortName: "Flow",
    other: { name: "Praxis Pro", href: "/pro" },
    command: "npx praxiflow",
    wiki: WIKI,
    colors: { brand: "#2563eb", soft: "#bfdbfe", ink: "#1d4ed8", deep: "#172554", shade: "#99a8db", halo: "#dbeafe", paper: "#f3f7ff" },
    hero: {
      line1: "Your whole stack,",
      line2: "composed to order.",
      lede: "Pick the stack. Praxis validates every choice and writes one coherent, reproducible repository.",
      result: "Resolved 8 modules, composed them in staging, then wrote my-app/. Nothing partial.",
      stat: [HEROES, "landing-page heroes ship with the CLI"] as [string, string],
      meta: "Next.js · Vite · Vue · Astro · Angular · Express",
    },
    stackLine: "Praxis Flow generates native projects across the tools teams already use.",
    previewTitle: "Create a project",
    featureTitle: ["Built around", "explicit choices."],
    featureIntro:
      "Choose the parts of your stack. Praxis validates compatibility, composes versioned modules, and writes a complete source tree.",
    features: [
      ["Your frontend, natively generated", "Generate Next.js, Vite React, Vue, Astro, or Angular projects in the framework's own conventions—not through a generic wrapper.", ["Next.js", "Vite React", "Vue", "Astro", "Angular"]],
      [`${HEROES} landing-page heroes`, "Preview each animated hero live, on desktop or phone, then drop it into a Next.js or Vite project exactly as it was designed.", ["Live previews", "Desktop + phone", "DESIGN.md"]],
      ["Backend without lock-in", "Compose Express with PostgreSQL or MongoDB, authentication, Redis or Memcached, email, jobs, and deployment support.", ["Express", "PostgreSQL", "MongoDB", "Redis"]],
      ["Deterministic by design", "The same Praxis version and configuration resolve the same bundled modules, with collision checks before anything is written.", ["praxis.config.json", "--config", "CI"]],
    ],
    metric: [HEROES, "landing-page heroes"],
    metricNote: "Every hero ships as one self-contained React component with its pictures and its design brief in DESIGN.md.",
    tryTitle: ["Try the", "questionnaire."],
    tryIntro: "The same questions the CLI asks. Compatibility rules apply as you go, so the summary is a configuration Praxis would accept.",
    proofTitle: ["One flow.", "Every decision explicit."],
    proofDescription:
      "Praxis Flow keeps generated projects understandable by making every important choice visible in the CLI and configuration file.",
    proofCards: [
      ["Interactive", "Answer a guided questionnaire and see compatibility constraints before generation."],
      ["Config-driven", "Commit praxis.config.json and reproduce the same project in CI or across a team."],
      ["Local gallery", "Template previews and source files ship with the CLI; your choice goes straight back to the terminal."],
      ["Atomic output", "Praxis validates the complete composition before writing the destination directory."],
    ],
    ctaTitle: ["Compose your next project", "in one command."],
    ctaDescription: "Start the guided builder, or commit a configuration for repeatable generation.",
  },
  pro: {
    name: "Praxis Pro",
    shortName: "Pro",
    other: { name: "Praxis Flow", href: "/" },
    command: "npx praxiflow",
    wiki: WIKI,
    colors: { brand: "#047857", soft: "#a7f3d0", ink: "#065f46", deep: "#022c22", shade: "#8fbfae", halo: "#d1fae5", paper: "#f1faf6" },
    hero: {
      line1: "Production APIs,",
      line2: "built by capability.",
      lede: "Django/DRF or Go/Gin with the capabilities you pick, from auth and jobs to Terraform, wired in.",
      result: "Resolved Django + DRF with Redis, jobs and OpenTelemetry, then wrote api/. Nothing partial.",
      stat: ["29", "capabilities to compose"] as [string, string],
      meta: "Django/DRF · Go/Gin · Docker · Kubernetes · Terraform",
    },
    stackLine: "Praxis Pro generates production backends across the tools operations teams already run.",
    previewTitle: "Production Backend (Praxis Pro)",
    featureTitle: ["Capabilities,", "not vendor menus."],
    featureIntro:
      "Select operational capabilities while Praxis resolves opinionated, stack-specific defaults and their dependencies.",
    features: [
      ["Two production stacks", "Choose Python with Django/DRF or Go with Gin. Each output follows its ecosystem's native project and dependency conventions.", ["Django + DRF", "Go + Gin"]],
      ["Capabilities over vendor menus", "Ask for authentication, caching, jobs, email, storage, search, realtime, Kafka, or observability; Praxis selects compatible defaults.", ["Auth", "Jobs", "Search", "Kafka"]],
      ["Operational wiring included", "Generate Docker Compose, health checks, structured configuration, security middleware, and observability alongside application code.", ["Docker Compose", "Health checks", "OpenTelemetry"]],
      ["Cloud-aware infrastructure", "Optionally compose Kubernetes and Terraform for AWS, Azure, or GCP without making infrastructure mandatory.", ["Kubernetes", "AWS", "Azure", "GCP"]],
    ],
    metric: ["29", "capabilities"],
    metricNote: "Each one arrives with the wiring it depends on: Redis before jobs, settings before the patches that extend them.",
    tryTitle: ["Try the", "capability picker."],
    tryIntro: "The Production Backend questions from the CLI. Pick a stack, select capabilities, and see the configuration Praxis would compose.",
    proofTitle: ["Production,", "composed."],
    proofDescription:
      "Every resolved capability is recorded in schema-version-2 configuration and generated from bundled, testable modules.",
    proofCards: [
      ["Capability graph", "Dependencies are resolved before generation, so selected modules arrive with the wiring they require."],
      ["Stack-specific output", "Django and Go implementations share intent while retaining native architecture and tooling."],
      ["Infrastructure optional", "Start with Docker Compose and add Kubernetes or cloud Terraform only when the project needs it."],
      ["Ownership preserved", "Generated source is ordinary application code. Your team owns it, audits it, and evolves it."],
    ],
    ctaTitle: ["Start with production capabilities,", "not boilerplate."],
    ctaDescription: "Choose Production Backend in the Praxis Flow questionnaire and compose the foundation your service needs.",
  },
} as const;

export type ProductContent = (typeof products)[ProductKey];

/** The generation pipeline, as the README describes it. */
export const pipeline = [
  ["Intent", "CLI answers or praxis.config.json"],
  ["Validate", "Schema checks every choice and combination"],
  ["Resolve", "Ordered module IDs and capability closure"],
  ["Compose", "Overlays, packages, env and patches, in staging"],
  ["Publish", "A standalone repository, written all at once"],
] as const;
