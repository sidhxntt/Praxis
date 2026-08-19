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

Help forms:
  praxiflow help
  praxiflow --help
  praxiflow -h`;
}
