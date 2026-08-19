export function formatHelp(): string {
  return `Praxis Flow

Usage:
  praxiflow                              Start the interactive project builder
  praxiflow [project-name] --quick       Create with recommended defaults
  praxiflow --config <file>              Create from a Praxis configuration file
  praxiflow create [project-name]        Compatibility alias for the builder
  praxiflow create [project-name] --quick
                                        Create with recommended defaults
  praxiflow create --config <file>       Create from a Praxis configuration file
  praxiflow help                         Show this help

Options:
  --custom                              Use the interactive builder (default)
  --quick                               Use recommended defaults
  --config <file>                       Load configuration from a file
  --no-install                          Skip dependency installation
  -h, --help                            Show this help

Frontend UI:
  Frameworks: Next.js, Vite (React), Vue, Astro, Angular (TypeScript only)
  Next.js, Vite, Vue, and Astro support JavaScript and TypeScript.
  Choose a plain Tailwind + shadcn starter or one of 40 landing-page styles.
  Template selection uses a private local visual gallery with a terminal fallback.
  Selected projects include their design guidance in DESIGN.md.

Help forms:
  praxiflow help
  praxiflow --help
  praxiflow -h`;
}
