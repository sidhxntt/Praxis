"use client";

import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconArrowRight } from "@/icons/arrow-right";
import { products, type ProductKey } from "@/lib/products";

const flowFAQs = [
  ["Is Praxis Flow just another boilerplate generator?", "No. A boilerplate is a fixed repository; Praxis Flow validates an explicit configuration and composes only the framework, language, database, authentication, cache, deployment, and UI modules you select. The same CLI also supports repeatable config-driven generation."],
  ["Why not rely solely on Next.js for every full-stack project?", "Next.js is an excellent frontend and server-rendering framework, and Praxis supports it directly. Some applications still benefit from an independently deployable backend for background jobs, stateful workloads, service boundaries, or scaling. Praxis lets you choose that separation instead of imposing it."],
  ["Can I use Praxis without a frontend template?", "Yes. For supported frontend and full-stack projects, Praxis asks whether you want one of the 40 landing-page styles. Decline and it generates the framework foundation with Tailwind and shadcn-ready conventions instead."],
  ["Which Praxis setup is right for my project?", "Choose frontend for a standalone web experience, backend for an Express service, full-stack when you want both composed together, or Production Backend (Praxis Pro) when you need Django/DRF or Go/Gin with operational capabilities."],
  ["Is Praxis only for SaaS development?", "No. Praxis generates ordinary source repositories and can support marketing sites, internal tools, APIs, web applications, and SaaS products. The right output depends on the capabilities you select."],
  ["Which frontend frameworks and languages are supported?", "Praxis Flow supports Next.js, Vite React, Vue, and Astro in JavaScript or TypeScript. Angular is supported in TypeScript because Angular's current tooling is TypeScript-first; the CLI explains and resolves that constraint if JavaScript was selected earlier."],
  ["How do the 40 UI styles work?", "Choose template mode after selecting a frontend framework. Praxis opens a private offline gallery where you can filter styles, inspect desktop and mobile previews, and return the selected direction directly to the waiting CLI. A terminal selector is available when a browser cannot be opened."],
  ["Does a selected UI style generate real frontend code?", "Yes. The selected style is scaffolded into native code for the chosen framework and language. It is not merely a screenshot or design prompt. The generated project also includes the matching DESIGN.md so humans and coding agents can understand the visual system."],
  ["Can Praxis reproduce a project in CI?", "Yes. Commit a versioned praxis.config.json and run Praxis with --config. A fixed Praxis version and configuration resolve the same bundled module set, making generation suitable for repeatable automation and team workflows."],
  ["What happens if generated modules conflict?", "Praxis resolves module dependencies and checks destination paths before writing output. File collisions or incompatible selections fail during composition rather than leaving a partially generated project behind."],
];

const proFAQs = [
  ["What is the difference between Praxis Flow and Praxis Pro?", "Praxis Flow is the complete interactive project builder for frontend, backend, and full-stack projects. Praxis Pro is the Production Backend project type inside that same CLI, focused on Django/DRF or Go/Gin plus selectable operational capabilities."],
  ["Is Praxis Pro only for SaaS development?", "No. Praxis Pro generates production-oriented backend foundations for any service that benefits from authentication, caching, jobs, storage, search, realtime, observability, security, or infrastructure modules."],
  ["Can a normal Praxis frontend use a Praxis Pro backend?", "Yes. The generated frontend and backend are API-independent source projects. You can pair a Praxis frontend with a Praxis Pro service and deploy or scale each side independently."],
  ["Is Praxis Pro a fixed boilerplate?", "No. It is a capability-driven generator. You choose a backend stack and concerns such as authentication, caching, jobs, observability, Kubernetes, or Terraform; Praxis resolves compatible stack-specific modules and composes the result."],
  ["Does Praxis Pro make an application production-ready automatically?", "It provides executable operational wiring and a strong starting architecture, but production readiness remains contextual. Your team still owns secrets, cloud policy, capacity planning, backups, restore drills, security testing, and dependency maintenance."],
  ["Which backend stacks does Praxis Pro generate?", "Praxis Pro supports Python with Django and Django REST Framework, or Go with Gin. The two stacks share capability intent while keeping native architecture, dependencies, commands, and testing conventions."],
  ["Which capabilities can I select?", "Capabilities include JWT and social authentication, fine-grained authorization, Redis, background and scheduled jobs, asynchronous email, object storage, search, realtime WebSockets, Kafka, feature flags, seed data, observability, security, and reliability modules."],
  ["Are Docker, Kubernetes, and Terraform mandatory?", "No. Docker Compose provides the standard local operational foundation. Kubernetes and Terraform are optional capabilities, so a project can remain simple or include orchestration and managed cloud infrastructure when required."],
  ["Which clouds are supported by Terraform output?", "When Terraform is selected, Praxis asks for AWS, Azure, or Google Cloud because the provider changes the generated resources and operational configuration. Cloud selection is skipped when Terraform is not requested."],
  ["How are secrets handled?", "Praxis writes configuration structure and .env.example files, never live credentials. Generated applications expect secrets to be supplied through your deployment environment or selected cloud-secret capability."],
];

export function FrequentlyAskedQuestions({ product = "flow" }: { product?: ProductKey }) {
  const [open, setOpen] = React.useState<string | null>(null);
  const content = products[product];
  const faqs = product === "flow" ? flowFAQs : proFAQs;
  return (
    <section id="faqs" className="mx-auto my-10 w-full max-w-7xl px-4 py-20 md:px-8">
      <div className="mx-auto max-w-4xl text-center"><h2 className="text-3xl text-neutral-100 md:text-6xl">Questions, answered in detail.</h2><p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-neutral-400">The practical distinctions behind {content.name}, its generated output, and where your team remains in control.</p></div>
      <div className="mx-auto mt-16 max-w-3xl divide-y divide-neutral-800">
        {faqs.map(([question, answer]) => { const isOpen = open === question; return <motion.div key={question} className="cursor-pointer py-6" onClick={() => setOpen(isOpen ? null : question)}><div className="flex items-start justify-between"><div className="pr-10"><h3 className="text-base font-medium text-neutral-200 md:text-lg">{question}</h3><AnimatePresence>{isOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="mt-3 text-sm leading-7 text-neutral-400 md:text-base">{answer}</p></motion.div>}</AnimatePresence></div><motion.div animate={{ rotate: isOpen ? 90 : 0 }}><IconArrowRight className="h-5 w-5 text-neutral-400" /></motion.div></div></motion.div>; })}
      </div>
    </section>
  );
}
