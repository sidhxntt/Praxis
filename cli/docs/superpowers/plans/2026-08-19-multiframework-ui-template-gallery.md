# Multi-Framework UI Template Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate 40 genuine, responsive landing-page UIs from the approved design specifications across Next.js, Vite React, Vue, Astro, and Angular, with a local visual selector and a clean starter alternative.

**Architecture:** Canonical style definitions contain original content, tokens, section structure, assets, and source design documentation. A deterministic repository generator compiles those definitions into native framework overlays that the existing manifest composer ships and applies at runtime. The normal configuration and prompt flow select starter or style overlay; an optional loopback-only gallery provides visual selection with terminal fallback.

**Tech Stack:** TypeScript, Node.js HTTP and child-process APIs, existing manifest composer, Tailwind CSS, shadcn-compatible local primitives, React/Next.js, Vite React, Vue, Astro, Angular, Vitest, Playwright, axe-core.

**Design specification:** `docs/superpowers/specs/2026-08-19-multiframework-ui-template-gallery-design.md`

---

## File Structure

### Runtime and configuration

- Create `src/ui/catalog.ts`: stable 40-style catalog, metadata validation, and `UiStyleId`.
- Create `src/ui/gallery.ts`: loopback gallery server, selection transport, timeout, cleanup, and browser-launch abstraction.
- Create `src/ui/terminalSelector.ts`: terminal fallback with searchable/paginated style groups.
- Create `src/ui/resolveUi.ts`: coordinates browser gallery and fallback without coupling it to the main questionnaire.
- Modify `src/config/schema.ts`: five frameworks, starter/template UI config, Angular compatibility validation.
- Modify `src/config/load.ts`: normalize old schema-version-1 files to starter mode.
- Modify `src/config/resolver.ts`: resolve the selected catalog ID as an `ui.${style}` overlay such as `ui.apple`.
- Modify `src/workflow/answers.ts`: carry UI answers into normal config.
- Modify `src/workflow/runCreate.ts`: framework/language compatibility and UI selection flow.
- Modify `src/cli/help.ts`: framework, UI template, gallery, and Angular documentation.
- Modify `src/composer/manifest.ts`: recognize all five framework selectors.
- Modify `src/composer/compose.ts`: copy the selected source design to the output as `DESIGN.md` through ordinary overlays; no special-case filesystem path.

### Authoring and generated templates

- Keep `templates/designs/DESIGN-*.md`: 40 authoritative visual specifications.
- Create `templates/ui.catalog/catalog.json`: canonical catalog metadata.
- Create `templates/ui.catalog/gallery/`: bundled gallery HTML, CSS, JavaScript, thumbnails, and full previews.
- Create `templates/ui.shared/schema.json`: canonical style JSON schema.
- Create `templates/ui.shared/render/`: shared accessible section rendering inputs and framework adapter templates.
- Create one `templates/ui.{id}/style.json` per catalog entry, such as `templates/ui.apple/style.json`: canonical content, tokens, layout, media, and accessibility data.
- Create one `templates/ui.{id}/DESIGN.md` per catalog entry: normalized, generated-project-safe copy of its source design specification.
- Create one `templates/ui.{id}/assets/` directory per catalog entry: original local assets only.
- Generate native framework overlays below each `templates/ui.{id}/files/{target}/` directory, such as `templates/ui.apple/files/next-ts/`.
- Create `templates/frontend.vue/`, `templates/frontend.astro/`, and `templates/frontend.angular/`: framework bases.
- Modify `templates/frontend.next/`, `templates/frontend.vite/`, and `templates/styling.tailwind-shadcn/`: stable adapter insertion points and framework-aware styling.
- Create `scripts/ui/generate.mjs`: deterministic adapter and `DESIGN.md` generator.
- Create `scripts/ui/render-previews.mjs`: gallery preview and screenshot generator.
- Create `scripts/ui/verify-generated.mjs`: clean-regeneration gate.

### Tests and CI

- Create `tests/ui/catalog.test.ts`.
- Create `tests/ui/gallery.test.ts`.
- Create `tests/ui/resolveUi.test.ts`.
- Create `tests/ui/canonicalStyles.test.ts`.
- Create `tests/ui/adapters.test.ts`.
- Create `tests/ui/accessibility.test.ts`.
- Create `tests/ui/visual.test.ts`.
- Modify `tests/config/schema.test.ts`, `tests/config/load.test.ts`, `tests/config/resolver.test.ts`, `tests/workflow/answers.test.ts`, `tests/workflow/runCreate.test.ts`, `tests/composer/compose.test.ts`, and `tests/generator/matrix.test.ts`.
- Create `.github/workflows/ui-matrix.yml`: sharded generated-project install/build/a11y/visual verification.
- Modify `.github/workflows/ci.yml`: canonical validation and generated-artifact cleanliness.
- Modify `package.json`, `package-lock.json`, and `README.md`.

## Supported Style IDs

The catalog must contain exactly these stable IDs, in alphabetical display order:

`airbnb`, `airtable`, `apple`, `binance`, `bmw-m`, `bmw`, `bugatti`, `cal`, `claude`, `clay`, `clickhouse`, `coinbase`, `cursor`, `dell-1996`, `discord`, `elevenlabs`, `expo`, `ferrari`, `figma`, `framer`, `hp`, `lamborghini`, `lovable`, `mastercard`, `meta`, `mongodb`, `notion`, `nvidia`, `ollama`, `pinterest`, `playstation`, `raycast`, `revolut`, `sentry`, `spacex`, `supabase`, `tesla`, `uber`, `vercel`, `warp`.

## Supported Target Matrix

The adapter target IDs are `next-js`, `next-ts`, `vite-js`, `vite-ts`, `vue-js`, `vue-ts`, `astro-js`, `astro-ts`, and `angular-ts`. Angular JavaScript is intentionally absent and must be rejected before generation.

---

### Task 1: Lock the Catalog and Normal Configuration Contract

**Files:**
- Create: `src/ui/catalog.ts`
- Test: `tests/ui/catalog.test.ts`
- Modify: `src/config/schema.ts`
- Modify: `src/config/load.ts`
- Test: `tests/config/schema.test.ts`
- Test: `tests/config/load.test.ts`

- [ ] **Step 1: Write failing catalog and schema tests**

Add tests that assert exactly 40 unique IDs, source design paths, inspired labels, and configuration behavior:

```ts
expect(UI_STYLES).toHaveLength(40);
expect(new Set(UI_STYLES.map(({ id }) => id)).size).toBe(40);
expect(UI_STYLES.every(({ label }) => label.endsWith(" inspired"))).toBe(true);
expect(UI_STYLES.every(({ id, designFile }) => designFile === `DESIGN-${id}.md`)).toBe(true);

expect(validateConfig({
  ...baseFrontend,
  frontend: {
    framework: "vue",
    styling: "tailwind-shadcn",
    ui: { mode: "template", style: "apple" },
  },
}).frontend?.ui).toEqual({ mode: "template", style: "apple" });

expect(() => validateConfig({
  ...baseFrontend,
  language: "javascript",
  frontend: {
    framework: "angular",
    styling: "tailwind-shadcn",
    ui: { mode: "starter" },
  },
})).toThrow("Angular templates require TypeScript");
```

Add a load test proving an old frontend object without `ui` normalizes to `{ mode: "starter" }`.

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `npx vitest run tests/ui/catalog.test.ts tests/config/schema.test.ts tests/config/load.test.ts`

Expected: FAIL because `src/ui/catalog.ts`, the new framework values, and `frontend.ui` do not exist.

- [ ] **Step 3: Implement the catalog and schema types**

Export these contracts from `src/ui/catalog.ts`:

```ts
export const UI_STYLE_IDS = [
  "airbnb", "airtable", "apple", "binance", "bmw-m", "bmw",
  "bugatti", "cal", "claude", "clay", "clickhouse", "coinbase",
  "cursor", "dell-1996", "discord", "elevenlabs", "expo", "ferrari",
  "figma", "framer", "hp", "lamborghini", "lovable", "mastercard",
  "meta", "mongodb", "notion", "nvidia", "ollama", "pinterest",
  "playstation", "raycast", "revolut", "sentry", "spacex", "supabase",
  "tesla", "uber", "vercel", "warp",
] as const;

export type UiStyleId = typeof UI_STYLE_IDS[number];
export interface UiStyleSummary {
  id: UiStyleId;
  label: string;
  designFile: `DESIGN-${UiStyleId}.md`;
  description: string;
  traits: readonly string[];
  theme: "light" | "dark" | "mixed";
}
```

Define `UI_STYLES` explicitly for all IDs, using neutral descriptions derived from each source specification. Add `isUiStyleId(value: unknown): value is UiStyleId`.

Extend normal frontend configuration with:

```ts
export type FrontendFramework = "next" | "vite" | "vue" | "astro" | "angular";
export type FrontendUi =
  | { mode: "starter" }
  | { mode: "template"; style: UiStyleId };
```

Normalize missing schema-version-1 `frontend.ui` to starter mode in `src/config/load.ts`. Make `quickConfig()` explicit about starter mode. Do not alter Pro schema version 2.

- [ ] **Step 4: Run focused and full tests**

Run: `npx vitest run tests/ui/catalog.test.ts tests/config/schema.test.ts tests/config/load.test.ts`

Expected: PASS.

Run: `npm test`

Expected: existing tests either PASS or fail only at exact old frontend object expectations that must be updated to include starter normalization.

- [ ] **Step 5: Commit**

```bash
git add src/ui/catalog.ts src/config/schema.ts src/config/load.ts tests/ui/catalog.test.ts tests/config/schema.test.ts tests/config/load.test.ts
git commit -m "feat: define frontend UI catalog contract"
```

### Task 2: Add Vue, Astro, and Angular Framework Bases

**Files:**
- Create: `templates/frontend.vue/manifest.json`
- Create: `templates/frontend.vue/files/common/`
- Create: `templates/frontend.vue/files/javascript/`
- Create: `templates/frontend.vue/files/typescript/`
- Create: `templates/frontend.astro/manifest.json`
- Create: `templates/frontend.astro/files/common/`
- Create: `templates/frontend.astro/files/javascript/`
- Create: `templates/frontend.astro/files/typescript/`
- Create: `templates/frontend.angular/manifest.json`
- Create: `templates/frontend.angular/files/common/`
- Create: `templates/frontend.angular/files/typescript/`
- Modify: `templates/styling.tailwind-shadcn/manifest.json`
- Modify: `src/composer/manifest.ts`
- Test: `tests/generator/frameworks.test.ts`

- [ ] **Step 1: Write failing framework generation tests**

Generate starter-mode projects for all nine targets and assert native entry files and scripts:

```ts
const targets = [
  ["next", "javascript", "app/page.jsx", "next build"],
  ["next", "typescript", "app/page.tsx", "next build"],
  ["vite", "javascript", "src/App.jsx", "vite build"],
  ["vite", "typescript", "src/App.tsx", "vite build"],
  ["vue", "javascript", "src/App.vue", "vite build"],
  ["vue", "typescript", "src/App.vue", "vue-tsc -b && vite build"],
  ["astro", "javascript", "src/pages/index.astro", "astro build"],
  ["astro", "typescript", "src/pages/index.astro", "astro check && astro build"],
  ["angular", "typescript", "src/app/app.ts", "ng build"],
] as const;
```

For every target, assert the generated package uses Tailwind, includes the local button primitive appropriate to the framework, and contains no template `DESIGN.md`.

- [ ] **Step 2: Verify RED**

Run: `npx vitest run tests/generator/frameworks.test.ts`

Expected: FAIL on missing Vue, Astro, and Angular manifests and unsupported selectors.

- [ ] **Step 3: Implement framework bases and styling selectors**

Create minimal buildable starter projects pinned to current compatible versions. Vue uses `@vitejs/plugin-vue`; Astro uses `@astrojs/check`; Angular uses standalone components and the supported Angular application builder. The Angular base contains TypeScript only.

Extend `ManifestSelector.framework` to all five framework values and add framework-specific Tailwind integrations. Keep shadcn-compatible primitives local and framework-native; do not add a runtime Praxis dependency.

- [ ] **Step 4: Verify generated starter builds**

Run: `npx vitest run tests/generator/frameworks.test.ts`

Expected: PASS.

Generate one project per target under a temporary directory, run the selected package manager install with lockfiles disabled, then run its production build. Expected: all nine builds exit 0.

- [ ] **Step 5: Commit**

```bash
git add templates/frontend.vue templates/frontend.astro templates/frontend.angular templates/styling.tailwind-shadcn src/composer/manifest.ts tests/generator/frameworks.test.ts
git commit -m "feat: add Vue Astro and Angular starters"
```

### Task 3: Define the Canonical Landing-Page Model

**Files:**
- Create: `src/ui/canonical.ts`
- Create: `templates/ui.shared/schema.json`
- Create: `tests/ui/canonicalStyles.test.ts`
- Create: `templates/ui.apple/style.json`
- Create: `templates/ui.apple/DESIGN.md`
- Create: `templates/ui.apple/assets/`

- [ ] **Step 1: Write failing canonical-model tests**

The tests must require each canonical style to contain at least navigation, hero, three substantive body sections, CTA, and footer; unique accessible copy; tokens; motion preferences; and only confined local asset paths.

```ts
expect(style.sections[0].type).toBe("navigation");
expect(style.sections.at(-1)?.type).toBe("footer");
expect(style.sections.some(({ type }) => type === "hero")).toBe(true);
expect(style.sections.some(({ type }) => type === "cta")).toBe(true);
expect(style.sections.filter(({ type }) => !["navigation", "hero", "cta", "footer"].includes(type))).toHaveLength(3);
expect(style.accessibility.reducedMotion).toBe(true);
expect(style.assets.every(({ source }) => source.startsWith("assets/"))).toBe(true);
```

- [ ] **Step 2: Verify RED**

Run: `npx vitest run tests/ui/canonicalStyles.test.ts`

Expected: FAIL because the canonical schema and pilot style do not exist.

- [ ] **Step 3: Implement the canonical TypeScript contract and JSON schema**

The model must include:

```ts
export interface CanonicalLandingPage {
  id: UiStyleId;
  name: string;
  sourceDesign: `DESIGN-${UiStyleId}.md`;
  description: string;
  traits: string[];
  theme: "light" | "dark" | "mixed";
  tokens: DesignTokens;
  sections: LandingSection[];
  assets: LocalAsset[];
  accessibility: { reducedMotion: true; skipLink: true };
}
```

Use a closed discriminated union for `navigation`, `hero`, `logo-cloud`, `features`, `showcase`, `metrics`, `testimonials`, `pricing`, `cta`, and `footer`. Each section includes a named layout variant rather than arbitrary HTML. Asset records require local source, alt text, width, and height; decorative assets require empty alt text and `decorative: true`.

- [ ] **Step 4: Author the Apple-inspired pilot as a real page**

Read `templates/designs/DESIGN-apple.md` completely. Author neutral Praxis copy, an original local hero composition, at least seven sections, its complete token set, responsive layout choices, and motion behavior. Normalize the source spec into `templates/ui.apple/DESIGN.md`, adding the inspired/no-affiliation and accessibility-adaptation notes.

- [ ] **Step 5: Verify GREEN**

Run: `npx vitest run tests/ui/canonicalStyles.test.ts`

Expected: PASS for the pilot; the test is parameterized over discovered `templates/ui.*/style.json` modules so it expands automatically.

- [ ] **Step 6: Commit**

```bash
git add src/ui/canonical.ts templates/ui.shared/schema.json templates/ui.apple tests/ui/canonicalStyles.test.ts
git commit -m "feat: define canonical landing page model"
```

### Task 4: Build Native Framework Adapters

**Files:**
- Create: `scripts/ui/generate.mjs`
- Create: `scripts/ui/lib/load-style.mjs`
- Create: `scripts/ui/lib/render-css.mjs`
- Create: `scripts/ui/lib/render-react.mjs`
- Create: `scripts/ui/lib/render-vue.mjs`
- Create: `scripts/ui/lib/render-astro.mjs`
- Create: `scripts/ui/lib/render-angular.mjs`
- Create: `scripts/ui/lib/render-design-doc.mjs`
- Create: `tests/ui/adapters.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Write failing adapter tests for the Apple pilot**

Run the generator into a temporary root and assert all nine outputs contain native components, the same section IDs and neutral copy, framework-specific imports, local assets, responsive CSS, reduced-motion rules, and a generated `DESIGN.md`.

```ts
expect(await read("next-ts/app/page.tsx")).toContain("export default function Home");
expect(await read("vue-ts/src/App.vue")).toContain('<script setup lang="ts">');
expect(await read("astro-ts/src/pages/index.astro")).toContain("---");
expect(await read("angular-ts/src/app/app.ts")).toContain("@Component");
expect(await read("shared/landing.css")).toContain("@media (prefers-reduced-motion: reduce)");
```

- [ ] **Step 2: Verify RED**

Run: `npx vitest run tests/ui/adapters.test.ts`

Expected: FAIL because `scripts/ui/generate.mjs` does not exist.

- [ ] **Step 3: Implement deterministic renderers**

Render semantic native templates from the closed section union. Escape all text. Sort object keys and output paths. Refuse unknown section variants, missing assets, unsafe paths, external media URLs, duplicated IDs, empty headings, or unsupported targets. Generate shared CSS from tokens and section variants rather than embedding source Markdown.

Add scripts:

```json
{
  "ui:generate": "node scripts/ui/generate.mjs",
  "ui:verify": "node scripts/ui/verify-generated.mjs"
}
```

- [ ] **Step 4: Verify deterministic GREEN**

Run the generator twice in separate temporary directories and compare recursive SHA-256 manifests. Expected: identical hashes.

Run: `npx vitest run tests/ui/adapters.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/ui package.json package-lock.json tests/ui/adapters.test.ts
git commit -m "feat: generate native UI framework adapters"
```

### Task 5: Author Styles 1-10

**Files:**
- Create: `templates/ui.airbnb/`
- Create: `templates/ui.airtable/`
- Create: `templates/ui.binance/`
- Create: `templates/ui.bmw-m/`
- Create: `templates/ui.bmw/`
- Create: `templates/ui.bugatti/`
- Create: `templates/ui.cal/`
- Create: `templates/ui.claude/`
- Create: `templates/ui.clay/`
- Create: `templates/ui.clickhouse/`
- Test: `tests/ui/canonicalStyles.test.ts`

- [ ] **Step 1: Expand the expected style-ID test and verify RED**

Require modules for Apple plus these ten IDs. Expected: FAIL listing the ten missing `style.json` files.

- [ ] **Step 2: Read each corresponding source specification completely**

Read the matching `templates/designs/DESIGN-<id>.md` before authoring that style. Record its signature layout, color, typography, geometry, and responsive rules in the canonical definition.

- [ ] **Step 3: Author ten distinct industry-grade landing pages**

Each page must contain original neutral content, at least seven purposeful sections, a distinct hero and section rhythm, complete tokens, responsive behavior, reduced motion, original local assets, and its normalized `DESIGN.md`. Do not reuse Apple's section sequence unchanged.

- [ ] **Step 4: Generate and verify**

Run: `npm run ui:generate && npx vitest run tests/ui/canonicalStyles.test.ts tests/ui/adapters.test.ts`

Expected: PASS for 11 total styles and 99 adapter targets.

- [ ] **Step 5: Commit**

```bash
git add templates/ui.airbnb templates/ui.airtable templates/ui.binance templates/ui.bmw-m templates/ui.bmw templates/ui.bugatti templates/ui.cal templates/ui.claude templates/ui.clay templates/ui.clickhouse tests/ui/canonicalStyles.test.ts
git commit -m "feat: add first UI style collection"
```

### Task 6: Author Styles 11-20

**Files:**
- Create: `templates/ui.coinbase/`
- Create: `templates/ui.cursor/`
- Create: `templates/ui.dell-1996/`
- Create: `templates/ui.discord/`
- Create: `templates/ui.elevenlabs/`
- Create: `templates/ui.expo/`
- Create: `templates/ui.ferrari/`
- Create: `templates/ui.figma/`
- Create: `templates/ui.framer/`
- Create: `templates/ui.hp/`
- Test: `tests/ui/canonicalStyles.test.ts`

- [ ] **Step 1: Require the ten IDs and verify RED**

Run the canonical test. Expected: FAIL listing exactly these missing modules.

- [ ] **Step 2: Read all ten source specifications completely and author distinct canonical pages**

Apply the same quality contract from Task 5, with each specification's own signature component and layout behavior. Use no copied logos, text, or proprietary media.

- [ ] **Step 3: Generate and verify**

Run: `npm run ui:generate && npx vitest run tests/ui/canonicalStyles.test.ts tests/ui/adapters.test.ts`

Expected: PASS for 21 total styles and 189 adapter targets.

- [ ] **Step 4: Commit**

```bash
git add templates/ui.coinbase templates/ui.cursor templates/ui.dell-1996 templates/ui.discord templates/ui.elevenlabs templates/ui.expo templates/ui.ferrari templates/ui.figma templates/ui.framer templates/ui.hp tests/ui/canonicalStyles.test.ts
git commit -m "feat: add second UI style collection"
```

### Task 7: Author Styles 21-30

**Files:**
- Create: `templates/ui.lamborghini/`
- Create: `templates/ui.lovable/`
- Create: `templates/ui.mastercard/`
- Create: `templates/ui.meta/`
- Create: `templates/ui.mongodb/`
- Create: `templates/ui.notion/`
- Create: `templates/ui.nvidia/`
- Create: `templates/ui.ollama/`
- Create: `templates/ui.pinterest/`
- Create: `templates/ui.playstation/`
- Test: `tests/ui/canonicalStyles.test.ts`

- [ ] **Step 1: Require the ten IDs and verify RED**

Run the canonical test. Expected: FAIL listing exactly these missing modules.

- [ ] **Step 2: Read all ten source specifications completely and author distinct canonical pages**

Apply the complete quality contract, preserving visual distinctions while using original neutral content and local assets.

- [ ] **Step 3: Generate and verify**

Run: `npm run ui:generate && npx vitest run tests/ui/canonicalStyles.test.ts tests/ui/adapters.test.ts`

Expected: PASS for 31 total styles and 279 adapter targets.

- [ ] **Step 4: Commit**

```bash
git add templates/ui.lamborghini templates/ui.lovable templates/ui.mastercard templates/ui.meta templates/ui.mongodb templates/ui.notion templates/ui.nvidia templates/ui.ollama templates/ui.pinterest templates/ui.playstation tests/ui/canonicalStyles.test.ts
git commit -m "feat: add third UI style collection"
```

### Task 8: Author Styles 31-40

**Files:**
- Create: `templates/ui.raycast/`
- Create: `templates/ui.revolut/`
- Create: `templates/ui.sentry/`
- Create: `templates/ui.spacex/`
- Create: `templates/ui.supabase/`
- Create: `templates/ui.tesla/`
- Create: `templates/ui.uber/`
- Create: `templates/ui.vercel/`
- Create: `templates/ui.warp/`
- Test: `tests/ui/canonicalStyles.test.ts`

- [ ] **Step 1: Require the remaining nine IDs plus the already-authored Apple style and verify RED**

The complete catalog assertion must now require all 40 IDs. Expected: FAIL until the nine remaining modules exist.

- [ ] **Step 2: Read all nine source specifications completely and author distinct canonical pages**

Apply the complete quality contract. Confirm the final catalog has 40 modules, not 39 or 41.

- [ ] **Step 3: Generate and verify the full adapter set**

Run: `npm run ui:generate && npx vitest run tests/ui/canonicalStyles.test.ts tests/ui/adapters.test.ts`

Expected: PASS for 40 styles and 360 adapter targets.

- [ ] **Step 4: Commit**

```bash
git add templates/ui.raycast templates/ui.revolut templates/ui.sentry templates/ui.spacex templates/ui.supabase templates/ui.tesla templates/ui.uber templates/ui.vercel templates/ui.warp tests/ui/canonicalStyles.test.ts
git commit -m "feat: complete UI style collection"
```

### Task 9: Integrate Style Manifests and Generated DESIGN.md

**Files:**
- Modify: `scripts/ui/generate.mjs`
- Create: one `manifest.json` in each of the 40 `templates/ui.{id}/` modules
- Modify: `src/config/resolver.ts`
- Test: `tests/config/resolver.test.ts`
- Test: `tests/composer/compose.test.ts`
- Test: `tests/generator/matrix.test.ts`

- [ ] **Step 1: Write failing resolution and composition tests**

```ts
expect(resolveModules(templateConfig("apple"))).toContain("ui.apple");
expect(resolveModules(starterConfig())).not.toContain(expect.stringMatching(/^ui\./));
expect(await readFile(path.join(frontendOutput, "DESIGN.md"), "utf8"))
  .toContain("Inspired by Apple");
await expect(access(path.join(starterOutput, "DESIGN.md"))).rejects.toThrow();
```

For fullstack output assert `frontend/DESIGN.md`; for frontend-only output assert root `DESIGN.md`.

- [ ] **Step 2: Verify RED**

Run: `npx vitest run tests/config/resolver.test.ts tests/composer/compose.test.ts tests/generator/matrix.test.ts`

Expected: FAIL because style modules are not resolved or composed.

- [ ] **Step 3: Generate manifests and resolve UI modules**

Each generated manifest selects its adapter overlays by framework and language, copies shared CSS and local assets, and copies its normalized source as `DESIGN.md` at frontend scope. Add the style module only for template mode.

- [ ] **Step 4: Verify GREEN**

Run the focused tests. Expected: PASS for representative starter/template frontend and fullstack configurations.

- [ ] **Step 5: Commit**

```bash
git add scripts/ui/generate.mjs templates/ui.* src/config/resolver.ts tests/config/resolver.test.ts tests/composer/compose.test.ts tests/generator/matrix.test.ts
git commit -m "feat: compose selected landing page styles"
```

### Task 10: Build the Loopback Visual Gallery

**Files:**
- Create: `src/ui/gallery.ts`
- Create: `templates/ui.catalog/gallery/index.html`
- Create: `templates/ui.catalog/gallery/gallery.css`
- Create: `templates/ui.catalog/gallery/gallery.js`
- Create: `tests/ui/gallery.test.ts`

- [ ] **Step 1: Write failing server lifecycle and security tests**

Cover random loopback port binding, GET-only static files, JSON catalog, valid one-shot selection, invalid ID rejection, path traversal rejection, timeout, abort signal, duplicate selection, and listener closure.

```ts
const session = await startGallery({ openBrowser: false, timeoutMs: 1000 });
expect(new URL(session.url).hostname).toBe("127.0.0.1");
await expect(postSelection(session.url, "not-a-style")).resolves.toMatchObject({ status: 400 });
await expect(postSelection(session.url, "apple")).resolves.toMatchObject({ status: 204 });
await expect(session.selection).resolves.toBe("apple");
await expect(fetch(session.url)).rejects.toThrow();
```

- [ ] **Step 2: Verify RED**

Run: `npx vitest run tests/ui/gallery.test.ts`

Expected: FAIL because the gallery server does not exist.

- [ ] **Step 3: Implement the gallery server and static application**

Use `node:http`, bind `127.0.0.1` with port `0`, and use no runtime web framework. Serve only a fixed allowlist of bundled files. Validate IDs through `isUiStyleId`. The browser application implements search, trait filters, keyboard navigation, thumbnail cards, full preview, and an explicit selection button.

- [ ] **Step 4: Verify GREEN**

Run: `npx vitest run tests/ui/gallery.test.ts`

Expected: PASS with no open handles.

- [ ] **Step 5: Commit**

```bash
git add src/ui/gallery.ts templates/ui.catalog/gallery tests/ui/gallery.test.ts
git commit -m "feat: add local UI template gallery"
```

### Task 11: Add Browser Launch and Terminal Fallback

**Files:**
- Create: `src/ui/openBrowser.ts`
- Create: `src/ui/terminalSelector.ts`
- Create: `src/ui/resolveUi.ts`
- Test: `tests/ui/resolveUi.test.ts`

- [ ] **Step 1: Write failing coordinator tests**

Test gallery selection, user-declined browser, `CI`/headless environment, launch failure, browser close/timeout, explicit cancellation, and terminal selection. Inject browser and prompt dependencies rather than spawning or prompting in tests.

- [ ] **Step 2: Verify RED**

Run: `npx vitest run tests/ui/resolveUi.test.ts`

Expected: FAIL because the coordinator modules do not exist.

- [ ] **Step 3: Implement safe cross-platform launch and fallback**

Spawn `open` on macOS, `cmd /c start` on Windows, and `xdg-open` on Linux with argument arrays and no shell interpolation. In CI or when launch fails, go directly to the terminal selector. Group the terminal list by traits and allow text filtering before final selection.

- [ ] **Step 4: Verify GREEN**

Run: `npx vitest run tests/ui/resolveUi.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/ui/openBrowser.ts src/ui/terminalSelector.ts src/ui/resolveUi.ts tests/ui/resolveUi.test.ts
git commit -m "feat: resolve UI styles across browser and terminal"
```

### Task 12: Wire the Questionnaire and Configuration Answers

**Files:**
- Modify: `src/workflow/answers.ts`
- Modify: `src/workflow/runCreate.ts`
- Test: `tests/workflow/answers.test.ts`
- Test: `tests/workflow/runCreate.test.ts`

- [ ] **Step 1: Write failing flow tests**

Assert the prompt sequence includes framework then template choice; starter skips gallery; template calls `resolveUiStyle`; backend-only skips all frontend prompts; and Angular with a previous JavaScript choice explains the constraint and provides TypeScript continuation or framework reselection.

```ts
expect(selectMessages).toEqual([
  "Project type",
  "Language",
  "Frontend framework",
  "Use a landing page template?",
  "Database",
  "Authentication",
  "Cache",
  "Package manager",
]);
expect(resolved.frontend?.ui).toEqual({ mode: "template", style: "apple" });
```

- [ ] **Step 2: Verify RED**

Run: `npx vitest run tests/workflow/answers.test.ts tests/workflow/runCreate.test.ts`

Expected: FAIL because UI answers and new framework flow are absent.

- [ ] **Step 3: Implement the flow with injected UI resolver**

Do not put gallery server details in `runCreate.ts`. Add `frontendUi` to `CreateAnswers`, use explicit labels `Vite (React)` and `Angular (TypeScript only)`, and ensure the final config always records starter or template mode.

- [ ] **Step 4: Verify GREEN and regression coverage**

Run the focused tests, then `npm test`. Expected: PASS, including unchanged Pro prompt tests.

- [ ] **Step 5: Commit**

```bash
git add src/workflow/answers.ts src/workflow/runCreate.ts tests/workflow/answers.test.ts tests/workflow/runCreate.test.ts
git commit -m "feat: add landing page selection flow"
```

### Task 13: Generate Preview Gallery Assets

**Files:**
- Create: `scripts/ui/render-previews.mjs`
- Create: `scripts/ui/verify-generated.mjs`
- Create: `templates/ui.catalog/catalog.json`
- Create: `templates/ui.catalog/gallery/previews/`
- Modify: `package.json`
- Test: `tests/ui/previews.test.ts`

- [ ] **Step 1: Write failing preview-manifest tests**

Require a thumbnail and mobile/desktop full preview for each style, exact dimensions, catalog hashes, accessible labels, and no files absent from the manifest.

- [ ] **Step 2: Verify RED**

Run: `npx vitest run tests/ui/previews.test.ts`

Expected: FAIL because previews and hashes do not exist.

- [ ] **Step 3: Render deterministic previews**

Use the Next.js TypeScript adapter as the canonical visual preview target. Build and serve generated pages locally, use Playwright with fixed browser/version, viewport, color scheme, reduced-motion setting, fonts, and clock, then write optimized WebP thumbnails and full previews. Store SHA-256 hashes in catalog metadata.

- [ ] **Step 4: Implement the clean-regeneration verifier**

Generate into a temporary directory and recursively compare it with committed adapters, manifests, docs, catalog JSON, and previews. Print exact stale paths and exit nonzero on differences.

- [ ] **Step 5: Verify GREEN**

Run: `npm run ui:generate && npm run ui:previews && npm run ui:verify && npx vitest run tests/ui/previews.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add scripts/ui templates/ui.catalog package.json package-lock.json tests/ui/previews.test.ts
git commit -m "feat: generate UI gallery previews"
```

### Task 14: Add Accessibility, Responsive, and Visual Gates

**Files:**
- Create: `tests/ui/accessibility.test.ts`
- Create: `tests/ui/responsive.test.ts`
- Create: `tests/ui/visual.test.ts`
- Create: `tests/ui/helpers/generatedApp.ts`
- Modify: `package.json`

- [ ] **Step 1: Write the quality harness against the Apple pilot**

Install/build/serve the generated target, then assert no serious axe violations, correct landmarks and heading order, keyboard-visible focus, no horizontal overflow at 320/375/768/1280/1536 widths, correct reduced-motion behavior, no broken local links, and baseline screenshots.

- [ ] **Step 2: Run the pilot and fix real template defects**

Run: `npx vitest run tests/ui/accessibility.test.ts tests/ui/responsive.test.ts tests/ui/visual.test.ts`

Expected: tests initially expose any pilot defects; change the canonical definition or adapter, regenerate, and rerun until PASS. Do not weaken thresholds to accept defects.

- [ ] **Step 3: Parameterize all 40 styles**

Run quality checks on Next.js TypeScript for all visual styles and structural/accessibility checks on all nine adapters. Store visual baselines with stable names such as `apple/mobile.png` and `apple/desktop.png`.

- [ ] **Step 4: Commit**

```bash
git add tests/ui package.json package-lock.json templates/ui.* templates/ui.catalog
git commit -m "test: verify UI quality and responsiveness"
```

### Task 15: Complete the 360-Combination Generation Matrix

**Files:**
- Modify: `tests/generator/matrix.test.ts`
- Create: `tests/generator/uiMatrix.test.ts`
- Create: `scripts/ui/matrix.mjs`

- [ ] **Step 1: Write the full matrix enumerator**

Assert the Cartesian product is exactly 360 unique styled combinations and nine starter combinations:

```ts
expect(UI_STYLE_IDS.flatMap((style) => ADAPTER_TARGETS.map((target) => `${style}:${target}`)))
  .toHaveLength(360);
```

- [ ] **Step 2: Generate every combination without installing**

For each output validate native entry files, package metadata, local assets, source-confined paths, style marker, `DESIGN.md`, and absence of unresolved `{{tokens}}`. Starter outputs must omit style files and `DESIGN.md`.

- [ ] **Step 3: Verify the complete generation matrix**

Run: `npx vitest run tests/generator/uiMatrix.test.ts`

Expected: 369 generated configurations PASS with automatic temporary cleanup.

- [ ] **Step 4: Commit**

```bash
git add tests/generator/matrix.test.ts tests/generator/uiMatrix.test.ts scripts/ui/matrix.mjs
git commit -m "test: cover complete UI generation matrix"
```

### Task 16: Add Sharded Framework Build CI

**Files:**
- Create: `.github/workflows/ui-matrix.yml`
- Modify: `.github/workflows/ci.yml`
- Modify: `package.json`

- [ ] **Step 1: Add a locally runnable shard command**

`node scripts/ui/matrix.mjs --shard 1/9 --install --build` must deterministically select one adapter target, generate all 40 styles plus starter, install with cache reuse, and production-build every output. Invalid shard syntax exits 2.

- [ ] **Step 2: Add nine CI shards**

Use target IDs as the matrix axis, Node 22, npm cache, Playwright cache, and artifact upload on failure. Each shard builds all 40 styles for one target. Run Next.js TypeScript visual checks in a separate shard and all gallery server tests on Windows/macOS to cover browser-launch behavior.

- [ ] **Step 3: Add fast main-CI gates**

Run `npm run ui:verify`, canonical tests, unit tests, TypeScript build, and npm audit in the existing workflow. Do not run 360 dependency installations in the cross-platform fast job.

- [ ] **Step 4: Validate workflow syntax and local shards**

Run at least one React, one Vue/Astro, and Angular shard locally. Expected: all generated projects install and build.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/ui-matrix.yml .github/workflows/ci.yml package.json package-lock.json
git commit -m "ci: verify every UI framework target"
```

### Task 17: Update Help, Documentation, and Package Contents

**Files:**
- Modify: `src/cli/help.ts`
- Modify: `README.md`
- Modify: `package.json`
- Test: `tests/cli/help.test.ts`
- Test: `tests/package.test.ts`

- [ ] **Step 1: Write failing help and package tests**

Assert help names all five frameworks, calls Vite `Vite (React)`, labels Angular TypeScript-only, explains starter/template and gallery fallback, and points to generated `DESIGN.md`. Assert `npm pack --dry-run --json` contains all 40 style manifests/docs/assets/adapters and gallery files, with no raw authoring-only temporary output.

- [ ] **Step 2: Verify RED**

Run: `npx vitest run tests/cli/help.test.ts tests/package.test.ts`

Expected: FAIL on missing documentation and package artifacts.

- [ ] **Step 3: Update user documentation**

Document configuration examples for starter and styled UI, all 40 inspired style names, the local gallery privacy/offline behavior, terminal fallback, framework/language matrix, Angular explanation, locally bundled assets, and `DESIGN.md` locations. State clearly that style names describe inspiration and imply no affiliation.

- [ ] **Step 4: Verify package contents**

Run: `npm pack --dry-run --json --cache /private/tmp/praxis-ui-npm-cache`

Expected: package includes runtime templates/gallery/design docs and excludes tests, screenshot test baselines not required at runtime, source specifications not used by the CLI, and repository scripts.

- [ ] **Step 5: Commit**

```bash
git add src/cli/help.ts README.md package.json package-lock.json tests/cli/help.test.ts tests/package.test.ts
git commit -m "docs: explain UI template gallery"
```

### Task 18: Final Completion Audit

**Files:**
- Verify only; modify defects found in their owning files.

- [ ] **Step 1: Verify generated artifacts are current**

Run: `npm run ui:verify`

Expected: PASS with no stale paths.

- [ ] **Step 2: Run the full local quality suite**

Run: `npm run check`

Expected: all unit, canonical, adapter, gallery, generator, accessibility, responsive, and build tests PASS; TypeScript build exits 0.

- [ ] **Step 3: Run the complete no-install matrix**

Run: `node scripts/ui/matrix.mjs`

Expected: 360 styled and nine starter outputs validate successfully.

- [ ] **Step 4: Run all install/build shards**

Run the nine `--install --build` shards. Expected: all 369 target/style builds exit 0.

- [ ] **Step 5: Run visual and accessibility verification**

Run the browser quality commands at fixed Playwright version. Expected: no serious accessibility violations, broken links, overflow, or unexpected visual diffs.

- [ ] **Step 6: Verify CLI behavior manually**

Build and run the CLI through starter, browser-gallery selection, terminal fallback, configuration-file selection, Angular JavaScript recovery, cancellation, frontend-only, and fullstack flows. Confirm the chosen style renders, correct `DESIGN.md` placement, and gallery process cleanup.

- [ ] **Step 7: Verify package and repository hygiene**

Run: `npm pack --dry-run --json --cache /private/tmp/praxis-ui-npm-cache`

Run: `git diff --check`

Run: `git status --short`

Expected: package contains every required runtime artifact; diff check is clean; only intentional changes remain. Confirm concurrent Praxis Pro behavior and tests remain unchanged.

- [ ] **Step 8: Commit any audit fixes and record evidence**

If the audit changes files, return to the owning task, stage its explicitly listed paths, rerun that task's focused and full verification commands, and commit with `fix: close UI template verification gaps`. If the audit changes nothing, do not create an empty commit.

Do not declare completion until every approved specification item has direct evidence from these gates.
