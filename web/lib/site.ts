import type { Metadata } from "next";
import { products, type ProductKey } from "./products";
import { flowFAQs, proFAQs } from "./faqs";

/** The canonical origin. Override with NEXT_PUBLIC_SITE_URL (e.g. for a custom domain). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://praxissflow.netlify.app").replace(/\/$/, "");

export const REPO_URL = "https://github.com/sidhxntt/Praxis";
export const NPM_URL = "https://www.npmjs.com/package/praxiflow";
export const AUTHOR = { name: "sidhxntt", url: "https://github.com/sidhxntt" };

export const seo = {
  flow: {
    path: "/",
    title: "Praxis Flow — Compose full-stack project foundations from one CLI",
    shortTitle: "Praxis Flow",
    description:
      "Praxis Flow is a free, open-source CLI that composes Next.js, Vite React, Vue, Astro or Angular frontends, Express backends, databases, auth, caching, deployment and animated landing-page heroes into one validated, reproducible repository.",
    keywords: [
      "project generator",
      "scaffolding CLI",
      "full-stack starter",
      "Next.js starter",
      "Vite React template",
      "Vue starter",
      "Astro starter",
      "Angular starter",
      "Express boilerplate",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "landing page templates",
      "praxis.config.json",
      "praxiflow",
      "create app CLI",
    ],
  },
  pro: {
    path: "/pro",
    title: "Praxis Pro — Production Django/DRF and Go/Gin backends, composed by capability",
    shortTitle: "Praxis Pro",
    description:
      "Praxis Pro generates production backends in Django/DRF or Go/Gin from the capabilities you select: JWT and social auth, Redis, background jobs, search, Kafka, OpenTelemetry, Docker, Kubernetes and Terraform for AWS, Azure or GCP.",
    keywords: [
      "Django REST framework boilerplate",
      "Go Gin boilerplate",
      "production backend generator",
      "backend scaffolding",
      "Docker Compose",
      "Kubernetes manifests",
      "Terraform AWS",
      "Terraform Azure",
      "Terraform GCP",
      "OpenTelemetry",
      "background jobs",
      "Kafka",
      "praxiflow",
    ],
  },
} as const;

export function pageMetadata(product: ProductKey): Metadata {
  const s = seo[product];
  const url = `${SITE_URL}${s.path === "/" ? "" : s.path}`;
  return {
    title: { absolute: s.title },
    description: s.description,
    keywords: [...s.keywords],
    alternates: { canonical: s.path },
    openGraph: {
      type: "website",
      url,
      siteName: "Praxis",
      title: s.title,
      description: s.description,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: s.title,
      description: s.description,
    },
  };
}

/** schema.org graph for a product page: the software, the site, its FAQ and its breadcrumb. */
export function structuredData(product: ProductKey) {
  const s = seo[product];
  const p = products[product];
  const url = `${SITE_URL}${s.path === "/" ? "/" : s.path}`;
  const faqs = product === "flow" ? flowFAQs : proFAQs;
  const breadcrumb = [{ name: "Praxis Flow", item: `${SITE_URL}/` }];
  if (product === "pro") breadcrumb.push({ name: "Praxis Pro", item: `${SITE_URL}/pro` });

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: "Praxis",
        alternateName: ["Praxis Flow", "praxiflow"],
        inLanguage: "en",
        publisher: { "@id": `${SITE_URL}/#author` },
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#author`,
        name: AUTHOR.name,
        url: AUTHOR.url,
        sameAs: [AUTHOR.url, REPO_URL],
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${url}#software`,
        name: p.name,
        description: s.description,
        url,
        applicationCategory: "DeveloperApplication",
        applicationSubCategory: "Project generator",
        operatingSystem: "macOS, Linux, Windows (Node.js 20 or later)",
        softwareRequirements: "Node.js >= 20",
        installUrl: NPM_URL,
        downloadUrl: NPM_URL,
        license: "https://opensource.org/licenses/MIT",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        author: { "@id": `${SITE_URL}/#author` },
        sameAs: [REPO_URL, NPM_URL],
        featureList: p.features.map(([title]) => title),
      },
      {
        "@type": "SoftwareSourceCode",
        "@id": `${SITE_URL}/#source`,
        name: "Praxis",
        codeRepository: REPO_URL,
        programmingLanguage: "TypeScript",
        runtimePlatform: "Node.js",
        license: "https://opensource.org/licenses/MIT",
        targetProduct: { "@id": `${url}#software` },
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: s.title,
        description: s.description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${url}#software` },
        primaryImageOfPage: `${url === `${SITE_URL}/` ? SITE_URL : url}/opengraph-image`,
        breadcrumb: { "@id": `${url}#breadcrumb` },
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: breadcrumb.map((b, i) => ({ "@type": "ListItem", position: i + 1, name: b.name, item: b.item })),
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: faqs.map(([q, a]) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
    ],
  };
}
