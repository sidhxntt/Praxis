#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, posix, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = resolve(repositoryRoot, "docs");
const outputRoot = process.argv[2] ? resolve(process.argv[2]) : undefined;
const repositoryUrl = "https://github.com/sidhxntt/Praxis";

if (!outputRoot) {
  console.error("Usage: node scripts/render-github-wiki.mjs <wiki-directory>");
  process.exit(2);
}

const pages = [
  ["index.md", "Home.md"],
  ["overview.md", "Overview.md"],
  ["architecture.md", "Architecture.md"],
  ["terminology.md", "Terminology.md"],
  ["repository-map.md", "Repository-Map.md"],
  ["code-architecture.md", "Code-Architecture.md"],
  ["generation-pipeline.md", "Generation-Pipeline.md"],
  ["manifest-system.md", "Manifest-System.md"],
  ["standard-projects.md", "Standard-Projects.md"],
  ["praxis-pro.md", "Praxis-Pro.md"],
  ["generated-backends.md", "Generated-Backends.md"],
  ["ui-templates.md", "UI-Templates.md"],
  ["testing.md", "Testing.md"],
  ["agent-guide.md", "Agent-Guide.md"],
  ["wiki-publishing.md", "Wiki-Publishing.md"],
  ["_Sidebar.md", "_Sidebar.md"],
  ["_Footer.md", "_Footer.md"],
];

const pageNames = new Map(
  pages.map(([source, destination]) => [source, destination.replace(/\.md$/, "")]),
);

function rewriteLinks(markdown, source) {
  return markdown.replace(/\[([^\]]+)]\(([^)\s]+)\)/g, (full, text, href) => {
    if (/^(?:https?:|mailto:|#)/i.test(href)) return full;

    const [hrefPath, anchor = ""] = href.split("#", 2);
    const docsTarget = posix.normalize(posix.join(posix.dirname(source), hrefPath));
    const pageName = pageNames.get(docsTarget);
    if (pageName) {
      return anchor
        ? `[${text}](${pageName}#${anchor})`
        : `[[${pageName}|${text}]]`;
    }

    const repositoryPath = posix.normalize(
      posix.join("docs", posix.dirname(source), hrefPath),
    );
    if (repositoryPath.startsWith("../")) return full;
    const view = hrefPath.endsWith("/") ? "tree" : "blob";
    const suffix = anchor ? `#${anchor}` : "";
    return `[${text}](${repositoryUrl}/${view}/main/${repositoryPath}${suffix})`;
  });
}

await mkdir(outputRoot, { recursive: true });
for (const [source, destination] of pages) {
  const contents = await readFile(resolve(sourceRoot, source), "utf8");
  const rendered = source === "index.md"
    ? rewriteLinks(contents.replace(/^# Praxis documentation$/m, "# Praxis"), source)
    : rewriteLinks(contents, source);
  await writeFile(resolve(outputRoot, destination), rendered);
}

console.log(`Rendered ${pages.length} GitHub Wiki pages into ${outputRoot}`);
