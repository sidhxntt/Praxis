# Raycast Landing Pages Design

## Scope

Refactor the existing Next.js marketing surfaces at `/` (Praxis Flow) and `/pro` (Praxis) into the visual system documented by `DESIGN-raycast.md`. The reference document is the sole visual authority; do not run or import the `getdesign` scaffold.

## Product boundaries

- `/` remains Praxis Flow: the interactive CLI and project-scaffolding product.
- `/pro` remains Praxis: the production-backend generator.
- Preserve the existing components and their content responsibilities. Recompose and restyle them rather than replacing the pages with an unrelated template.
- Preserve factual copy, destinations, section anchors, clipboard actions, and responsive behavior. Correct only stale implementation details that contradict repository truth, such as links to removed branches.
- Do not invent testimonials, usage metrics, customers, pricing, or product capabilities.

## Visual direction

Both pages use a continuous near-black canvas, Inter with `ss03`, compact 6–16px radii, `#242728` hairlines, surface-ladder depth instead of shadows, white primary CTAs, and rare semantic accents. Each route uses the red diagonal-stripe motif exactly once in its first viewport.

The first viewport must feel like the product at marketing scale. Praxis Flow uses a command-palette composition centered on `npx praxiflow` and the CLI's framework/project choices. Praxis uses a production-backend command surface centered on capability selection and generated infrastructure. These are authored with HTML/CSS and existing icon libraries, not generated imagery.

## Direction contract

- **THESIS:** The marketing surface is the generated product interface enlarged: visitors understand Praxis by seeing choices resolve inside a command palette.
- **OWN-WORLD:** A continuous `#07080a` canvas, four-step surface ladder, `#242728` hairlines, Inter `ss03`, semantic tool accents, and one three-band red launch motif per route.
- **STORY:** Introduce the product through an active generation choice, expand into supported tools and explicit capabilities, answer architectural questions, then close with the existing product identity and destinations.
- **FIRST VIEWPORT:** Split composition with a decisive product promise and primary action on the left; a high-fidelity Praxis command surface on the right. No decorative pre-heading kicker. One selected command row supplies the restrained authored motion.
- **FORM:** `product-command-palette`, derived from corroborable source seed `Raycast-design-analysis@alpha` in `DESIGN-raycast.md`; implemented independently with Praxis content and no Raycast assets or scaffold output.

## Page composition

### Shared chrome

- Compact, bordered navigation on the dark canvas with route-aware product naming.
- White primary action and low-emphasis monochrome links.
- Shared max-width, spacing, typography, card, keycap, and focus-visible primitives.
- Reduced-motion support and semantic controls.

### Praxis Flow (`/`)

- `Navbar`: product identity, existing section links, GitHub action.
- `CTA`: Raycast-style first viewport with the single red stripe, concise product message, documentation CTA, and copyable CLI command.
- `SpotlightLogoCloud`: supported-tool tiles in the same surface grammar.
- `Benefits`: benefit content as command/result panels.
- `Features`: capability catalog with compact accented glyphs.
- `FrequentlyAskedQuestions`: bordered disclosure rows.
- `Upcoming`: roadmap panels without the incumbent colorful wobble/glow treatment.
- `Footer`: restrained product footer with existing social destinations.

### Praxis (`/pro`)

- `HeroPro`: first viewport with its own single stripe, production-backend message, preserved copy interaction, and product-style generated-system preview.
- `FeaturesPro`: production capabilities presented through the same command-panel vocabulary.
- `FrequentlyAskedQuestionsPro`: bordered disclosure rows.
- Existing Pro navbar/footer components remain available and are restyled consistently where composed.

## Interaction and motion

Use one restrained motion language: short opacity/translate reveals and active-row changes. Remove glow-following, wobble, oversized pill morphing, and excessive gradient animation. Clipboard actions must retain visible copied feedback. Keyboard focus must remain visible.

## Responsive behavior

Desktop uses wide product panels and multi-column content; mobile collapses to a single readable column with a compact navigation menu, full-width actions where helpful, and no horizontal overflow. Hero typography scales down without clipping the stripe composition.

## Acceptance criteria

- Both routes build and render without runtime errors.
- Every currently composed section remains composed after the refactor.
- Existing interactive actions and meaningful links work.
- `DESIGN-raycast.md` tokens and principles are visibly applied across both routes.
- Exactly one red stripe motif appears per route.
- Desktop and mobile screenshots show coherent, responsive pages without overflow.
- No `getdesign` package output or generated concept assets are introduced.
