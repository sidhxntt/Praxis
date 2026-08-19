export type ProductKey = "flow" | "pro";

export const products = {
  flow: {
    name: "Praxis Flow",
    shortName: "Flow",
    eyebrow: "Composable project scaffolding",
    headline: "Build the project you actually want.",
    description:
      "Praxis Flow turns explicit frontend, backend, language, infrastructure, and UI choices into one coherent, reproducible project foundation.",
    command: "npm i -g praxiflow",
    previewTitle: "Create a project",
    previewItems: [
      ["Frontend framework", "Next.js · Vite · Vue · Astro · Angular"],
      ["Language", "JavaScript · TypeScript"],
      ["Landing page", "40 selectable UI directions"],
      ["Backend", "Express · database · auth · cache"],
    ],
    featureIntro:
      "Choose the parts of your stack. Praxis validates compatibility, composes versioned modules, and writes a complete source tree.",
    features: [
      ["Your frontend, natively generated", "Generate Next.js, Vite React, Vue, Astro, or Angular projects in the framework's own conventions—not through a generic wrapper."],
      ["40 landing-page directions", "Browse an offline visual gallery, preview desktop and mobile treatments, then scaffold the selected design directly into frontend code."],
      ["Backend without lock-in", "Compose Express with PostgreSQL or MongoDB, authentication, Redis or Memcached, email, jobs, and deployment support."],
      ["Deterministic by design", "The same Praxis version and configuration resolve the same bundled modules, with collision checks before anything is written."],
    ],
    proofTitle: "One flow. Every decision explicit.",
    proofDescription:
      "Praxis Flow keeps generated projects understandable by making every important choice visible in the CLI and configuration file.",
    proofCards: [
      ["Interactive", "Answer a guided questionnaire and see compatibility constraints before generation."],
      ["Config-driven", "Commit praxis.config.json and reproduce the same project in CI or across a team."],
      ["Offline catalog", "Template metadata, previews, and source files ship with the CLI—nothing is uploaded."],
      ["Atomic output", "Praxis validates the complete composition before writing the destination directory."],
    ],
    ctaTitle: "Compose your next project in one command.",
    ctaDescription: "Start the guided builder, or commit a configuration for repeatable generation.",
  },
  pro: {
    name: "Praxis Pro",
    shortName: "Pro",
    eyebrow: "Production backend generator",
    headline: "Generate the backend your operations require.",
    description:
      "Praxis Pro composes a production-oriented Django/DRF or Go/Gin backend from capabilities—not a fixed starter repository.",
    command: "npm i -g praxiflow",
    previewTitle: "Production Backend (Praxis Pro)",
    previewItems: [
      ["Backend stack", "Django + DRF · Go + Gin"],
      ["Capabilities", "Auth · cache · jobs · storage · search"],
      ["Operations", "Docker · observability · security"],
      ["Infrastructure", "Kubernetes · Terraform for AWS, Azure, or GCP"],
    ],
    featureIntro:
      "Select operational capabilities while Praxis resolves opinionated, stack-specific defaults and their dependencies.",
    features: [
      ["Two production stacks", "Choose Python with Django/DRF or Go with Gin. Each output follows its ecosystem's native project and dependency conventions."],
      ["Capabilities over vendor menus", "Ask for authentication, caching, jobs, email, storage, search, realtime, Kafka, or observability; Praxis selects compatible defaults."],
      ["Operational wiring included", "Generate Docker Compose, health checks, structured configuration, security middleware, and observability alongside application code."],
      ["Cloud-aware infrastructure", "Optionally compose Kubernetes and Terraform for AWS, Azure, or GCP without making infrastructure mandatory."],
    ],
    proofTitle: "Production, composed.",
    proofDescription:
      "Every resolved capability is recorded in schema-version-2 configuration and generated from bundled, testable modules.",
    proofCards: [
      ["Capability graph", "Dependencies are resolved before generation, so selected modules arrive with the wiring they require."],
      ["Stack-specific output", "Django and Go implementations share intent while retaining native architecture and tooling."],
      ["Infrastructure optional", "Start with Docker Compose and add Kubernetes or cloud Terraform only when the project needs it."],
      ["Ownership preserved", "Generated source is ordinary application code. Your team owns it, audits it, and evolves it."],
    ],
    ctaTitle: "Start with production capabilities, not boilerplate.",
    ctaDescription: "Choose Production Backend in the Praxis Flow questionnaire and compose the foundation your service needs.",
  },
} as const;

export type ProductContent = (typeof products)[ProductKey];
