# Multi-Framework UI Template Gallery Design

## Summary

Praxis Flow's normal CLI will offer five frontend framework targets and an optional catalog of 40 industry-grade landing-page styles. The supported targets are Next.js, Vite React, Vue, Astro, and Angular. Next.js, Vite React, Vue, and Astro support JavaScript and TypeScript. Angular is TypeScript-only, and Praxis must explain that constraint anywhere framework and language compatibility is presented.

The 40 source specifications in `templates/designs/DESIGN-*.md` define visual language, not copied products. Every generated page will use original, neutral Praxis content and locally stored assets. Brand logos, proprietary product copy, and third-party imagery will not be copied.

## Product Scope

Each style generates one complete, responsive, multi-section marketing landing page. A page may contain navigation, hero, social proof, feature sections, product showcases, testimonials or pricing when appropriate to the design, a final call to action, and a footer.

The templates do not generate dashboards, application shells, authentication screens, data-entry forms, or product workflows. Basic newsletter or call-to-action controls may be represented visually only when they are a natural part of a marketing landing page, but the templates do not implement a form-backed product feature.

Normal Praxis Flow remains separate from Praxis Pro. This feature changes only frontend and fullstack projects in the normal flow.

## User Flow

For a frontend or fullstack project, the interactive flow is:

1. Choose project type.
2. Choose JavaScript or TypeScript.
3. Choose Next.js, Vite React, Vue, Astro, or Angular.
4. Resolve framework-language compatibility.
5. Choose whether to use a UI template.
6. If no template is selected, generate the minimal Tailwind CSS and shadcn/ui starter.
7. If templates are requested, offer to open the local visual gallery.
8. Select one of the 40 styles in the gallery or terminal fallback.
9. Complete the existing backend, deployment, package-manager, installation, and Git questions as applicable.

If a user chooses JavaScript and then Angular, Praxis explains that supported Angular applications require TypeScript. The user may continue using TypeScript or return to framework selection. Help output, configuration validation, gallery compatibility labels, and error messages repeat this constraint clearly.

Quick mode continues to use a documented default framework and the starter UI unless a future explicit flag or configuration chooses a style. It must not silently add an opinionated landing-page design.

## Visual Gallery

Praxis starts an ephemeral HTTP server bound only to a loopback address on a random available port, then opens the user's default browser. The bundled gallery provides:

- A searchable grid of all 40 style cards.
- Stable style names and IDs.
- "Inspired by" labeling rather than claims of affiliation.
- Thumbnail screenshots and full-page responsive previews.
- Short descriptions and useful visual attributes such as light, dark, editorial, technical, playful, or luxury.
- Framework compatibility information, including the Angular TypeScript-only notice.
- A clear "Use this style" action.

Choosing a style sends its validated stable ID to the waiting CLI. The CLI acknowledges the selection, shuts down the server, and proceeds. Closing the browser, failing to launch it, timing out, using a headless environment, or declining the browser must lead to a searchable or paginated terminal selector. Cancellation remains possible from either path.

The server must reject unknown style IDs, non-loopback requests where practical, duplicate completion, and requests after selection. It must close its listener and timers on selection, cancellation, timeout, signal, or error.

## Configuration Model

Normal Praxis configuration gains:

- Frontend frameworks: `next`, `vite`, `vue`, `astro`, and `angular`.
- A frontend UI setting with `mode: "starter" | "template"`.
- A stable style ID when `mode` is `template`.

Existing schema-version-1 normal configurations remain valid. A missing UI setting is normalized to starter mode. Existing `vite` continues to mean Vite React. New configurations always serialize the explicit UI mode. Template mode without a valid catalog style is rejected. Starter mode with a style ID is rejected. Angular with JavaScript is rejected with an actionable message.

The implementation must not overload Praxis Pro's schema-version-2 configuration or blur the normal and Pro project types.

## Canonical Style Modules

Each of the 40 `DESIGN-*.md` sources maps to one canonical UI style module. A module owns:

- Catalog metadata and stable ID.
- Its source design specification.
- Neutral landing-page content and section ordering.
- Design tokens for color, typography, spacing, radius, border, shadow, and motion.
- Responsive rules.
- Original local illustrations, icons, textures, or other media.
- Accessibility metadata for media and interactive elements.
- Framework-neutral structural input used by the adapter generator.

The Markdown specifications are authoring references. The released CLI never asks an AI model to interpret them and never parses prose into application code at project-generation time.

No generated template may require a remote image host to render. Font choices must use redistributable local assets, safe system stacks, or documented optional imports that do not prevent an offline build.

## Framework Adapters

A repository build tool converts each canonical style module into native, prebuilt overlays for these nine targets:

1. Next.js JavaScript
2. Next.js TypeScript
3. Vite React JavaScript
4. Vite React TypeScript
5. Vue JavaScript
6. Vue TypeScript
7. Astro JavaScript
8. Astro TypeScript
9. Angular TypeScript

Adapters produce idiomatic framework files: React components for Next.js and Vite, Vue single-file components, Astro components, and Angular components. They may share content, tokens, assets, and generated CSS, but generated applications must not depend on a Praxis runtime package or a cross-framework web component.

The adapter outputs are generated repository artifacts. Releases bundle those outputs so scaffolding is deterministic and requires no code generation service or network request. CI regenerates them and fails if committed output is stale.

## Template Composition

Module resolution for a styled frontend is:

1. Framework base module.
2. Tailwind CSS and shadcn/ui styling module.
3. Selected UI style overlay.
4. Existing backend and deployment modules where applicable.

Starter mode omits step 3 and produces a clean, minimal Tailwind and shadcn/ui application. A style overlay owns the landing-page entry point and supporting UI files without interfering with backend, deployment, package-manager, or workspace composition.

Composition remains atomic. Missing manifests, stale adapters, conflicting files, invalid selectors, absent assets, or token failures must leave no partial destination.

## Generated Design Documentation

Every styled project includes the chosen design specification as `DESIGN.md`:

- Frontend projects: `<project>/DESIGN.md`
- Fullstack projects: `<project>/frontend/DESIGN.md`

The copied document describes the generated visual system and serves as the customization reference. It must identify the style as inspired by a visual language, explain that generated content and assets are original, and match the exact version of the bundled style. Starter projects do not receive a `DESIGN.md` file.

## Accessibility and Responsive Quality

Every page must provide:

- Semantic landmarks and heading order.
- Keyboard-accessible navigation and controls.
- Visible focus indicators.
- Meaningful alternative text or explicitly decorative media.
- Sufficient text and interactive-state contrast.
- Reduced-motion behavior.
- No horizontal overflow at supported viewport widths.
- Touch targets appropriate for mobile use.
- Responsive layouts for mobile, tablet, laptop, and wide desktop viewports.

Style fidelity does not override accessibility. If a source specification conflicts with these requirements, the accessible behavior wins and the generated `DESIGN.md` records the adaptation.

## Failure Handling

Configuration validation happens before filesystem mutation. The gallery validates all selections against the bundled catalog. Framework adapters validate required canonical inputs and refuse missing assets or unknown tokens. Generation errors name the style and target that failed while preserving the original cause.

Browser launch is optional capability, not a generation dependency. Gallery failures fall back to the terminal. Adapter or composition failures remain fatal and preserve atomic cleanup.

## Testing and Release Gates

Automated coverage includes:

- Schema tests for all frameworks, UI modes, style IDs, backward compatibility, and Angular language rejection.
- Prompt tests for starter/template branching, Angular explanation and recovery, gallery selection, terminal fallback, cancellation, and headless operation.
- Gallery tests for catalog rendering, search, preview navigation, selection transport, ID validation, timeout, and server cleanup.
- Canonical-module contract tests for all 40 styles, required sections, tokens, accessibility metadata, local assets, and source `DESIGN.md` linkage.
- Adapter snapshot or structural tests for every framework and language target.
- A generation matrix covering 40 styles across nine targets, for 360 styled combinations, plus every starter target.
- Verification that the correct `DESIGN.md` is copied to the correct output location and omitted in starter mode.
- Dependency installation and production builds for generated targets.
- Automated accessibility, broken-link, horizontal-overflow, and responsive checks.
- Visual regression screenshots at representative mobile and desktop viewports.
- A clean-regeneration gate that fails when adapters, gallery metadata, or preview screenshots are stale.
- npm package dry-run verification proving all runtime templates, gallery assets, previews, and design documents are shipped.

Full dependency installation and browser-based verification may be sharded in CI, but every supported combination must be covered by a deterministic release gate rather than a rotating sample.

## Documentation

README and CLI help document:

- The five normal frontend targets.
- Vite's meaning as Vite React.
- JavaScript and TypeScript support per framework.
- Angular's TypeScript-only constraint.
- Starter versus template modes.
- How the local gallery and terminal fallback work.
- The 40 available inspired styles.
- Offline behavior and locally bundled assets.
- The generated `DESIGN.md` customization guide.
- Configuration-file examples for starter and template projects.

## Non-Goals

- Reproducing the referenced companies' websites.
- Shipping copied brand assets, copy, or proprietary imagery.
- Adding dashboards, admin interfaces, authentication pages, or application forms to UI styles.
- Dynamically generating templates with AI during a CLI run.
- Maintaining 360 hand-authored implementations.
- Making Angular emit unsupported JavaScript component source.
- Changing the Praxis Pro generator.

## Completion Criteria

The feature is complete only when all 40 styles are selectable through the gallery and terminal fallback, all nine supported targets generate native buildable projects, starter mode remains available, generated design documentation is correct, the full matrix and quality gates pass, the npm package contains every required runtime artifact, and normal Praxis Pro behavior remains unchanged.
