export const proStacks = ["python-django", "go-gin"] as const;
export type ProStack = (typeof proStacks)[number];

export const cloudProviders = ["aws", "azure", "gcp"] as const;
export type CloudProvider = (typeof cloudProviders)[number];

export const proCapabilities = [
  "jwt-auth",
  "social-auth",
  "fine-grained-auth",
  "redis-cache",
  "background-jobs",
  "scheduled-jobs",
  "email-tasks",
  "object-storage",
  "search",
  "realtime",
  "kafka",
  "feature-flags",
  "seed-data",
  "sentry",
  "prometheus",
  "opentelemetry",
  "elk",
  "synthetic-monitoring",
  "load-testing",
  "compliance-audit",
  "nginx",
  "kubernetes",
  "terraform",
  "autoscaling",
  "high-availability",
  "edge-protection",
  "database-resilience",
  "disaster-recovery",
  "cloud-secrets",
] as const;

export type ProCapability = (typeof proCapabilities)[number];

export interface ProConfig {
  stack: ProStack;
  requestedCapabilities: ProCapability[];
  resolvedCapabilities: ProCapability[];
  cloud?: CloudProvider;
}

export const recommendedProCapabilities: ProCapability[] = [
  "redis-cache",
  "background-jobs",
  "sentry",
  "prometheus",
  "opentelemetry",
  "nginx",
  "autoscaling",
  "high-availability",
  "edge-protection",
  "database-resilience",
  "cloud-secrets",
];

const implications: Partial<Record<ProCapability, ProCapability[]>> = {
  "fine-grained-auth": ["jwt-auth"],
  "background-jobs": ["redis-cache"],
  "scheduled-jobs": ["background-jobs"],
  "email-tasks": ["background-jobs"],
  realtime: ["redis-cache"],
  terraform: [
    "kubernetes",
    "autoscaling",
    "high-availability",
    "edge-protection",
    "database-resilience",
    "cloud-secrets",
  ],
};

export function isProCapability(value: unknown): value is ProCapability {
  return proCapabilities.includes(value as ProCapability);
}

export function resolveProCapabilities(
  capabilities: ProCapability[],
): ProCapability[] {
  const resolved = new Set<ProCapability>();
  const add = (capability: ProCapability): void => {
    if (resolved.has(capability)) return;
    for (const implied of implications[capability] ?? []) add(implied);
    resolved.add(capability);
  };
  for (const capability of capabilities) add(capability);
  return proCapabilities.filter((capability) => resolved.has(capability));
}
