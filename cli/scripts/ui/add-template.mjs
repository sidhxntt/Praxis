#!/usr/bin/env node
// Turns one website-hero brief (the text that comes with a hero: steps, picture
// list, the ```tsx component```, then "The full brief of this design") into a
// UI template module at templates/ui.<id>.
//
// The component is copied byte for byte. TypeScript projects get it as-is;
// JavaScript projects get the same file with only its type annotations removed.
// Pictures are listed in template.json; `npm run ui:images` downloads them.
//
//   node scripts/ui/add-template.mjs path/to/brief.txt --id ora
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const cliRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const templatesRoot = path.join(cliRoot, "templates");

export function parseBrief(text) {
  const name = text.match(/^Add this "([^"]+)" website hero/m)?.[1];
  if (!name) throw new Error('brief must start with: Add this "<Name>" website hero');
  const componentPath = text.match(/\(for example (components\/[A-Za-z0-9]+\.tsx)\)/)?.[1];
  if (!componentPath) throw new Error("brief does not name its component file");
  const images = [...text.matchAll(/^\s*- (https:\/\/\S+) → public\/(\S+)$/gm)]
    .map(([, url, target]) => ({ url, path: target }));
  const open = text.indexOf("```tsx\n");
  if (open < 0) throw new Error("brief has no ```tsx block");
  const start = open + "```tsx\n".length;
  const close = text.indexOf("\n```", start);
  if (close < 0) throw new Error("brief's ```tsx block is not closed");
  const source = text.slice(start, close + 1);
  const marker = text.indexOf("The full brief of this design");
  const design = marker < 0 ? "" : text.slice(text.indexOf("\n", marker) + 1).replace(/^\s+/, "");
  return { name, component: path.basename(componentPath, ".tsx"), images, source, design };
}

export function stripTypes(source, fileName) {
  const output = ts.transpileModule(source, {
    fileName,
    compilerOptions: {
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.Preserve,
      removeComments: false,
      verbatimModuleSyntax: false,
    },
  }).outputText;
  return output.replace(/\n\/\/# sourceMappingURL=.*$/, "");
}

const TARGETS = [
  { dir: "next-ts", framework: "next", language: "typescript", component: "components", page: "app/page.tsx", from: "../components" },
  { dir: "next-js", framework: "next", language: "javascript", component: "components", page: "app/page.jsx", from: "../components" },
  { dir: "vite-ts", framework: "vite", language: "typescript", component: "src/components", page: "src/App.tsx", from: "./components" },
  { dir: "vite-js", framework: "vite", language: "javascript", component: "src/components", page: "src/App.jsx", from: "./components" },
];

export async function writeTemplate({ id, brief, description, traits, theme }) {
  const parsed = parseBrief(brief);
  const root = path.join(templatesRoot, `ui.${id}`);
  await rm(path.join(root, "files", "next-ts"), { recursive: true, force: true });
  await rm(path.join(root, "files", "next-js"), { recursive: true, force: true });
  await rm(path.join(root, "files", "vite-ts"), { recursive: true, force: true });
  await rm(path.join(root, "files", "vite-js"), { recursive: true, force: true });
  const js = stripTypes(parsed.source, `${parsed.component}.tsx`);

  for (const target of TARGETS) {
    const ext = target.language === "typescript" ? "tsx" : "jsx";
    const componentFile = path.join(root, "files", target.dir, target.component, `${parsed.component}.${ext}`);
    await write(componentFile, target.language === "typescript" ? parsed.source : js);
    const page = target.framework === "next"
      ? `import ${parsed.component} from "${target.from}/${parsed.component}";\n\nexport default function Home() {\n  return <${parsed.component} />;\n}\n`
      : `import ${parsed.component} from "${target.from}/${parsed.component}";\n\nexport default function App() {\n  return <${parsed.component} />;\n}\n`;
    await write(path.join(root, "files", target.dir, target.page), page);
  }

  await write(path.join(root, "brief.txt"), brief);
  if (parsed.design) await write(path.join(root, "files", "shared", "DESIGN.md"), parsed.design);
  await write(path.join(root, "manifest.json"), `${JSON.stringify({
    id: `ui.${id}`,
    overlays: [
      { scope: "frontend", source: "files/shared" },
      ...TARGETS.map((target) => ({
        scope: "frontend",
        source: `files/${target.dir}`,
        framework: target.framework,
        language: target.language,
        replace: true,
      })),
    ],
  }, null, 2)}\n`);
  await write(path.join(root, "template.json"), `${JSON.stringify({
    id,
    name: parsed.name,
    component: parsed.component,
    description,
    traits,
    theme,
    images: parsed.images,
  }, null, 2)}\n`);
  return parsed;
}

async function write(file, contents) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, contents);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [file, ...rest] = process.argv.slice(2);
  const option = (name) => {
    const index = rest.indexOf(`--${name}`);
    return index >= 0 ? rest[index + 1] : undefined;
  };
  const id = option("id");
  if (!file || !id) {
    console.error("usage: add-template.mjs <brief.txt> --id <id> [--description text] [--traits a,b,c] [--theme light|dark|mixed]");
    process.exit(1);
  }
  const brief = await readFile(file, "utf8");
  const parsed = await writeTemplate({
    id,
    brief,
    description: option("description") ?? "",
    traits: (option("traits") ?? "").split(",").filter(Boolean),
    theme: option("theme") ?? "light",
  });
  console.log(`ui.${id}: ${parsed.name} (${parsed.component}), ${parsed.images.length} picture(s)`);
  console.log(`Add "${id}" to UI_STYLE_IDS and STYLE_DETAILS in src/ui/catalog.ts, then run ui:images, ui:previews and ui:gallery.`);
}
