"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import Balancer from "react-wrap-balancer";
import { IconArrowLeft, IconCheck, IconCopy, IconRefresh, IconTerminal2 } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "./button";
import { GlowingEffect } from "./ui/glowing-effect";
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
    { label: "Browse 40 UI styles", description: "Open the private offline visual gallery" },
    { label: "Use the starter", description: "Generate raw Tailwind and shadcn-ready foundations" },
  ] };

const uiStyleNames = [
  "Airbnb", "Airtable", "Apple", "Binance", "BMW M", "BMW", "Bugatti", "Cal", "Claude", "Clay",
  "ClickHouse", "Coinbase", "Cursor", "Dell 1996", "Discord", "ElevenLabs", "Expo", "Ferrari", "Figma", "Framer",
  "HP", "Lamborghini", "Lovable", "Mastercard", "Meta", "MongoDB", "Notion", "NVIDIA", "Ollama", "Pinterest",
  "PlayStation", "Raycast", "Revolut", "Sentry", "SpaceX", "Supabase", "Tesla", "Uber", "Vercel", "Warp",
];

const uiStyleStep: WizardStep = {
  id: "uiStyle",
  question: "Choose one of 40 landing-page styles",
  options: uiStyleNames.map((label) => ({ label, description: `${label}-inspired visual direction` })),
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
    steps.push(templateStep);
    if (selections.template === "Browse 40 UI styles") steps.push(uiStyleStep);
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

export function Hero({ product = "flow" }: { product?: ProductKey }) {
  const router = useRouter();
  const content = products[product];
  const [stepIndex, setStepIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [multiDraft, setMultiDraft] = useState<Record<string, string[]>>({});
  const [copied, setCopied] = useState(false);
  const steps = product === "flow" ? buildFlowSteps(selections) : buildProSteps(selections);
  const complete = stepIndex === steps.length;
  const step = steps[Math.min(stepIndex, steps.length - 1)];

  const choose = (option: WizardOption) => {
    if (product === "flow" && step.id === "project" && option.label === "Production backend") {
      router.push("/pro");
      return;
    }
    if (step.id === "angularLanguage" && option.label === "Continue with TypeScript") {
      setSelections((current) => ({ ...current, language: "TypeScript", angularLanguage: option.label }));
      setStepIndex((current) => current);
      return;
    }
    if (step.id === "angularLanguage" && option.label === "Choose another framework") {
      setSelections((current) => { const next = { ...current }; delete next.framework; delete next.angularLanguage; return next; });
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
        [step.id]: selected.includes(option.label)
          ? selected.filter((label) => label !== option.label)
          : [...selected, option.label],
      };
    });
  };

  const continueMultiple = () => {
    const selected = multiDraft[step.id] ?? [];
    setSelections((current) => ({ ...current, [step.id]: selected.length ? selected.join(", ") : "None" }));
    setStepIndex((current) => Math.min(current + 1, steps.length));
  };

  const back = () => setStepIndex((current) => Math.max(0, current - 1));
  const reset = () => { setSelections({}); setMultiDraft({}); setStepIndex(0); };
  const copyCommand = async () => {
    await navigator.clipboard.writeText(content.command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section id="home" className="relative flex min-h-screen flex-col items-center overflow-hidden bg-black px-4 pb-24 pt-32 md:px-8 md:pb-36 md:pt-44">
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
        {content.eyebrow}
      </motion.p>
      <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="relative z-20 mx-auto max-w-5xl text-center text-4xl font-semibold tracking-[-0.04em] text-neutral-100 md:text-7xl">
        <Balancer>{content.headline}</Balancer>
      </motion.h1>
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="relative z-20 mx-auto mt-6 max-w-2xl text-center text-base leading-7 text-neutral-400 md:text-lg">
        {content.description}
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Button as={Link} href="https://github.com/sidhxntt/Praxis/wiki/Agent-Guide" variant="primary" className="flex h-12 items-center justify-center rounded-full px-7">Agent Wiki</Button>
        <button type="button" onClick={copyCommand} aria-label={`Copy ${content.command}`} className="flex h-12 items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 font-mono text-sm text-neutral-300 transition hover:border-white/25 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><IconTerminal2 size={17} /><span>{content.command}</span>{copied ? <><IconCheck size={15} className="text-emerald-400" /><span className="sr-only" role="status">Copied</span></> : <IconCopy size={15} className="text-neutral-500" />}</button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="relative mx-auto mt-16 w-full max-w-6xl rounded-[28px] border border-white/10 bg-neutral-950 p-2 shadow-2xl md:p-4">
        <GlowingEffect spread={50} glow disabled={false} proximity={80} inactiveZone={0.02} borderWidth={2} />
        <div className="relative overflow-hidden rounded-[20px] border border-white/10 bg-[#0b0b0c]">
          <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4 text-xs text-neutral-500"><span className="h-2.5 w-2.5 rounded-full bg-red-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-300" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /><span className="ml-3">{content.name} — {content.previewTitle}</span></div>
          <div className="p-4 md:p-8">
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-4 text-sm text-neutral-300">
              {stepIndex > 0 && <button type="button" onClick={back} aria-label="Previous question" className="rounded-md p-1 text-neutral-500 transition hover:bg-white/10 hover:text-white"><IconArrowLeft size={17} /></button>}
              <IconTerminal2 size={18} className="text-neutral-500" />
              <span>{complete ? "Your Praxis configuration is ready" : step.question}</span>
              <span className="ml-auto font-mono text-[10px] text-neutral-600">{Math.min(stepIndex + 1, steps.length)} / {steps.length}</span>
            </div>
            <div className="mb-4 flex gap-1" aria-label="Wizard progress">{steps.map((item, index) => <div key={item.id} className={`h-1 flex-1 rounded-full ${index < stepIndex ? "bg-emerald-400" : index === stepIndex && !complete ? "bg-neutral-400" : "bg-white/10"}`} />)}</div>
            <AnimatePresence mode="wait">
              {!complete ? (
                <motion.div key={step.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className={`grid gap-2 md:grid-cols-2 ${step.id === "uiStyle" || step.multiple ? "max-h-[430px] overflow-y-auto pr-1" : ""}`}>
                  {step.options.map((option, index) => {
                    const selected = step.multiple && (multiDraft[step.id] ?? []).includes(option.label);
                    return <button type="button" onClick={() => step.multiple ? toggleMultiple(option) : choose(option)} key={option.label} aria-pressed={step.multiple ? selected : undefined} className={`group flex min-h-24 items-start gap-4 rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${selected ? "border-emerald-400/40 bg-emerald-400/[0.07]" : "border-white/[0.07] bg-white/[0.018] hover:border-white/25 hover:bg-white/[0.06]"}`}><div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-black ${selected ? "border-emerald-400/30" : "border-white/10"}`}>{selected ? <IconCheck size={15} className="text-emerald-400" /> : <span className="font-mono text-xs text-neutral-600 group-hover:text-emerald-400">{String(index + 1).padStart(2, "0")}</span>}</div><div><p className="font-medium text-neutral-200">{option.label}</p><p className="mt-1 text-sm leading-6 text-neutral-500">{option.description}</p></div></button>;
                  })}
                  {step.multiple && <div className="sticky bottom-0 col-span-full mt-2 flex items-center justify-between rounded-xl border border-white/10 bg-neutral-950/95 p-3 backdrop-blur"><span className="text-xs text-neutral-500">{(multiDraft[step.id] ?? []).length} selected · optional</span><button type="button" onClick={continueMultiple} className="rounded-lg bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200">Continue</button></div>}
                </motion.div>
              ) : (
                <motion.div key="complete" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.035] p-5 md:p-6">
                  <div className="grid gap-3 sm:grid-cols-2">{steps.map((item) => <div key={item.id} className="flex items-center gap-3 rounded-lg border border-white/[0.07] bg-black/30 p-3"><IconCheck size={16} className="text-emerald-400" /><div><p className="text-[10px] uppercase tracking-wider text-neutral-600">{item.id}</p><p className="text-sm text-neutral-300">{selections[item.id]}</p></div></div>)}</div>
                  <div className="mt-5 flex flex-col items-center justify-between gap-3 rounded-lg border border-white/10 bg-black p-4 sm:flex-row"><code className="text-sm text-neutral-300">$ {content.command}</code><button type="button" onClick={reset} className="flex items-center gap-2 text-xs text-neutral-500 transition hover:text-white"><IconRefresh size={15} />Start again</button></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
