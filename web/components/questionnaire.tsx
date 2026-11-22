"use client";

import uiTemplates from "@/lib/ui-templates.json";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconArrowLeft, IconCheck, IconRefresh } from "@tabler/icons-react";
import { products, type ProductKey } from "@/lib/products";

type WizardOption = { label: string; description: string };
type WizardStep = { id: string; question: string; options: WizardOption[]; multiple?: boolean };

const projectStep: WizardStep = { id: "project", question: "What do you want to build?", options: [
    { label: "Frontend application", description: "Framework-native frontend with an optional landing page" },
    { label: "Full-stack application", description: "Frontend and Express backend composed together" },
    { label: "Backend service", description: "Express API with database and production modules" },
    { label: "Production backend", description: "Continue with Praxis Pro" },
  ] };

const languageStep: WizardStep = { id: "language", question: "Which language should Praxis use?", options: [
    { label: "TypeScript", description: "Recommended · typed generated source" },
    { label: "JavaScript", description: "Plain JavaScript with modern module conventions" },
  ] };

const frameworkStep: WizardStep = { id: "framework", question: "Choose your frontend framework", options: [
    { label: "Next.js", description: "React framework with App Router" },
    { label: "Vite React", description: "Fast client-side React foundation" },
    { label: "Vue", description: "Vue application with Vite" },
    { label: "Astro", description: "Content-first, multi-framework frontend" },
    { label: "Angular", description: "TypeScript-only application framework" },
  ] };

const templateStep: WizardStep = { id: "template", question: "Start with a landing-page template?", options: [
    { label: `Browse ${uiTemplates.length} UI heroes`, description: "Open the private local gallery with live previews" },
    { label: "Use the starter", description: "Generate raw Tailwind and shadcn-ready foundations" },
  ] };

const uiStyleStep: WizardStep = {
  id: "uiStyle",
  question: `Choose one of ${uiTemplates.length} landing-page heroes`,
  options: uiTemplates.map((t) => ({ label: t.label, description: t.description })),
};

function buildFlowSteps(selections: Record<string, string>): WizardStep[] {
  const project = selections.project;
  const steps: WizardStep[] = [projectStep, languageStep];
  const hasFrontend = project !== "Backend service";
  const hasBackend = project === "Backend service" || project === "Full-stack application";

  if (hasFrontend) {
    steps.push(frameworkStep);
    if (selections.framework === "Angular" && selections.language === "JavaScript") {
      steps.push({ id: "angularLanguage", question: "Angular requires TypeScript", options: [
        { label: "Continue with TypeScript", description: "Update the project language and continue" },
        { label: "Choose another framework", description: "Go back and select a different frontend framework" },
      ] });
    }
    // Templates are React components: offered for Next.js and Vite React only.
    if (selections.framework === "Next.js" || selections.framework === "Vite React") {
      steps.push(templateStep);
      if (selections.template === templateStep.options[0].label) steps.push(uiStyleStep);
    }
  }

  if (hasBackend) {
    steps.push({ id: "database", question: "Choose a database", options: [
      { label: "PostgreSQL", description: "Relational database with Prisma" },
      { label: "MongoDB", description: "Document database integration" },
      { label: "None", description: "Generate without persistence" },
    ] });
    const authOptions = selections.database === "None"
      ? [{ label: "Clerk", description: "Managed authentication" }, { label: "Supabase Auth", description: "Hosted authentication" }, { label: "None", description: "No authentication" }]
      : [{ label: "Self-hosted", description: "Authentication owned by your backend" }, { label: "Clerk", description: "Managed authentication" }, { label: "Supabase Auth", description: "Hosted authentication" }, { label: "None", description: "No authentication" }];
    steps.push({ id: "authentication", question: "Choose authentication", options: authOptions });
    steps.push({ id: "cache", question: "Choose a cache", options: [
      { label: "Redis", description: "Redis-backed application caching" },
      { label: "Memcached", description: "Distributed in-memory caching" },
      { label: "None", description: "No cache module" },
    ] });
  }

  const deployments = project === "Frontend application"
    ? ["Vercel", "Docker"]
    : project === "Backend service"
      ? ["Railway", "Render", "Docker"]
      : ["Vercel", "Railway", "Render", "Docker"];
  steps.push({ id: "deployment", question: "Choose a deployment target", options: deployments.map((label) => ({ label, description: `Generate ${label} deployment support` })) });
  steps.push({ id: "packageManager", question: "Choose a package manager", options: ["npm", "pnpm", "Yarn", "Bun"].map((label) => ({ label, description: `Install and run with ${label}` })) });
  steps.push({ id: "install", question: "Install dependencies?", options: [{ label: "Yes", description: "Install packages after generation" }, { label: "No", description: "Only write the generated source" }] });
  steps.push({ id: "git", question: "Initialize a Git repository?", options: [{ label: "Yes", description: "Create the initial Git repository" }, { label: "No", description: "Leave version control untouched" }] });
  return steps;
}

function buildProSteps(selections: Record<string, string>): WizardStep[] {
  const steps: WizardStep[] = [
  { id: "stack", question: "Choose a production backend stack", options: [
    { label: "Django + DRF", description: "Python, Django ORM, admin, and REST framework" },
    { label: "Go + Gin", description: "Lean Go service with Gin routing" },
  ] },
  { id: "authentication", question: "Authentication and access", multiple: true, options: [
    { label: "JWT authentication", description: "Stateless API authentication" },
    { label: "Social authentication", description: "OAuth provider integration" },
    { label: "Fine-grained authorization", description: "Role and permission controls" },
  ] },
  { id: "application", question: "Application services", multiple: true, options: [
    { label: "Redis caching", description: "Shared application cache" },
    { label: "Background jobs", description: "Asynchronous task processing" },
    { label: "Scheduled jobs", description: "Recurring task execution" },
    { label: "Asynchronous email", description: "Queued email delivery" },
    { label: "Object storage", description: "Cloud-compatible file storage" },
    { label: "Elasticsearch search", description: "Indexed application search" },
    { label: "Realtime WebSockets", description: "Bidirectional live updates" },
    { label: "Kafka streaming", description: "Event-streaming foundation" },
    { label: "Feature flags", description: "Controlled feature rollout" },
    { label: "Development seed data", description: "Repeatable local data" },
  ] },
  { id: "observability", question: "Observability and operations", multiple: true, options: [
    { label: "Sentry", description: "Error monitoring" },
    { label: "Prometheus", description: "Application metrics" },
    { label: "OpenTelemetry", description: "Distributed tracing" },
    { label: "ELK logs", description: "Centralized log aggregation" },
    { label: "Synthetic monitoring", description: "Automated uptime checks" },
    { label: "Load testing", description: "Performance test foundation" },
    { label: "Compliance controls", description: "Audit-oriented controls" },
  ] },
  { id: "deployment", question: "Deployment and reliability", multiple: true, options: [
    { label: "Nginx", description: "Reverse proxy" },
    { label: "Kubernetes", description: "Orchestration manifests" },
    { label: "Terraform", description: "Managed cloud infrastructure" },
    { label: "Autoscaling", description: "Horizontal scaling support" },
    { label: "High availability", description: "Redundant service topology" },
    { label: "Edge protection", description: "Perimeter protection" },
    { label: "Database resilience", description: "Database reliability wiring" },
    { label: "Disaster recovery", description: "Multi-region recovery" },
    { label: "Cloud secrets", description: "Managed secret integration" },
  ] },
  ];
  if (selections.deployment?.includes("Terraform")) {
    steps.push({ id: "cloud", question: "Choose a Terraform cloud", options: [
      { label: "AWS", description: "Amazon Web Services" },
      { label: "Azure", description: "Microsoft Azure" },
      { label: "GCP", description: "Google Cloud Platform" },
    ] });
  }
  steps.push({ id: "install", question: "Install dependencies?", options: [{ label: "Yes", description: "Install the generated stack" }, { label: "No", description: "Only write generated source" }] });
  steps.push({ id: "git", question: "Initialize a Git repository?", options: [{ label: "Yes", description: "Create the initial repository" }, { label: "No", description: "Leave version control untouched" }] });
  return steps;
}

export function Questionnaire({ product }: { product: ProductKey }) {
  const router = useRouter();
  const content = products[product];
  const [stepIndex, setStepIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [multiDraft, setMultiDraft] = useState<Record<string, string[]>>({});
  const steps = product === "flow" ? buildFlowSteps(selections) : buildProSteps(selections);
  const complete = stepIndex === steps.length;
  const step = steps[Math.min(stepIndex, steps.length - 1)];

  const choose = (option: WizardOption) => {
    if (product === "flow" && step.id === "project" && option.label === "Production backend") {
      router.push("/pro#try");
      return;
    }
    if (step.id === "angularLanguage" && option.label === "Continue with TypeScript") {
      setSelections((current) => ({ ...current, language: "TypeScript", angularLanguage: option.label }));
      return;
    }
    if (step.id === "angularLanguage" && option.label === "Choose another framework") {
      setSelections((current) => {
        const next = { ...current };
        delete next.framework;
        delete next.angularLanguage;
        return next;
      });
      setStepIndex(2);
      return;
    }
    setSelections((current) => ({ ...current, [step.id]: option.label }));
    setStepIndex((current) => Math.min(current + 1, steps.length));
  };

  const toggleMultiple = (option: WizardOption) => {
    setMultiDraft((current) => {
      const selected = current[step.id] ?? [];
      return {
        ...current,
        [step.id]: selected.includes(option.label) ? selected.filter((label) => label !== option.label) : [...selected, option.label],
      };
    });
  };

  const continueMultiple = () => {
    const selected = multiDraft[step.id] ?? [];
    setSelections((current) => ({ ...current, [step.id]: selected.length ? selected.join(", ") : "None" }));
    setStepIndex((current) => Math.min(current + 1, steps.length));
  };

  const back = () => setStepIndex((current) => Math.max(0, current - 1));
  const reset = () => {
    setSelections({});
    setMultiDraft({});
    setStepIndex(0);
  };
  const scroll = step.id === "uiStyle" || step.multiple;

  return (
    <section id="try" className="scroll-mt-24 border-y border-ink/[0.07] bg-white">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-5 py-24 md:px-11 md:py-32 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">{content.previewTitle}</p>
          <h2 className="display mt-5 text-[min(56px,10vw)]">
            {content.tryTitle[0]} <em>{content.tryTitle[1]}</em>
          </h2>
          <p className="mt-6 max-w-[440px] text-[16px] leading-[1.5] text-ink/65">{content.tryIntro}</p>
          <p className="mt-8 font-mono text-[13px] text-ink/50">
            <span className="text-brand">$</span> {content.command}
          </p>
        </div>

        <div className="overflow-hidden rounded-[28px] bg-paper shadow-[inset_0_0_0_1px_rgba(11,22,48,0.07)]">
          <div className="flex items-center gap-3 border-b border-ink/[0.07] bg-white/70 px-5 py-4 text-[14px]">
            {stepIndex > 0 && (
              <button
                type="button"
                onClick={back}
                aria-label="Previous question"
                className="-ml-1 rounded-full p-1.5 text-ink/50 transition hover:bg-paper hover:text-ink focus-visible:outline-2 focus-visible:outline-brand"
              >
                <IconArrowLeft size={17} />
              </button>
            )}
            <span className="font-medium" aria-live="polite">
              {complete ? "Your Praxis configuration is ready" : step.question}
            </span>
            <span className="ml-auto font-mono text-[11px] text-ink/40">
              {Math.min(stepIndex + 1, steps.length)} / {steps.length}
            </span>
          </div>
          <div className="flex gap-1 px-5 pt-4" aria-hidden="true">
            {steps.map((item, index) => (
              <div
                key={item.id}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  index < stepIndex || complete ? "bg-brand" : index === stepIndex ? "bg-brand/35" : "bg-ink/[0.08]"
                }`}
              />
            ))}
          </div>

          <div className="p-5">
            {!complete ? (
              <div key={step.id} className={`grid gap-2 sm:grid-cols-2 ${scroll ? "max-h-[430px] overflow-y-auto pr-1" : ""}`}>
                {step.options.map((option, index) => {
                  const selected = step.multiple && (multiDraft[step.id] ?? []).includes(option.label);
                  return (
                    <button
                      type="button"
                      key={option.label}
                      onClick={() => (step.multiple ? toggleMultiple(option) : choose(option))}
                      aria-pressed={step.multiple ? selected : undefined}
                      className={`group flex min-h-[88px] items-start gap-3.5 rounded-[18px] p-4 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                        selected
                          ? "bg-white shadow-[inset_0_0_0_1.5px_var(--brand)]"
                          : "bg-white shadow-[inset_0_0_0_1px_rgba(11,22,48,0.07)] hover:-translate-y-px hover:shadow-[0_12px_24px_-18px_rgba(11,22,48,0.4),inset_0_0_0_1px_rgba(11,22,48,0.12)]"
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[11px] ${
                          selected ? "bg-brand text-white" : "bg-paper text-ink/45 group-hover:text-brand"
                        }`}
                      >
                        {selected ? <IconCheck size={14} /> : String(index + 1).padStart(2, "0")}
                      </span>
                      <span>
                        <span className="block text-[15px] font-medium tracking-[-0.01em]">{option.label}</span>
                        <span className="mt-1 block text-[13.5px] leading-[1.45] text-ink/55">{option.description}</span>
                      </span>
                    </button>
                  );
                })}
                {step.multiple && (
                  <div className="sticky bottom-0 col-span-full mt-1 flex items-center justify-between rounded-[18px] bg-white/95 p-3 shadow-[inset_0_0_0_1px_rgba(11,22,48,0.07)] backdrop-blur">
                    <span className="pl-1 text-[12.5px] text-ink/50">{(multiDraft[step.id] ?? []).length} selected · optional</span>
                    <button type="button" onClick={continueMultiple} className="pill pill-brand !px-5 !py-2.5 !text-[14px]">
                      Continue
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <dl className="grid gap-2 sm:grid-cols-2">
                  {steps.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 rounded-[16px] bg-white p-3.5 shadow-[inset_0_0_0_1px_rgba(11,22,48,0.07)]">
                      <IconCheck size={16} className="mt-0.5 shrink-0 text-brand" />
                      <div>
                        <dt className="text-[11px] font-medium text-ink/45">{item.id}</dt>
                        <dd className="text-[14px]">{selections[item.id]}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
                <div className="on-brand mt-4 flex flex-col items-center justify-between gap-3 rounded-[18px] bg-brand-deep p-4 sm:flex-row">
                  <code className="font-mono text-[14px] text-white">
                    <span className="text-brand-soft">$</span> {content.command}
                  </code>
                  <button type="button" onClick={reset} className="flex items-center gap-2 text-[13px] text-white/70 transition hover:text-white">
                    <IconRefresh size={15} />
                    Start again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
