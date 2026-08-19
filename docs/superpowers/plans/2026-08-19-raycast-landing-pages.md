# Raycast Landing Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle and recompose the Praxis Flow and Praxis marketing routes into the complete Raycast-inspired system defined in `DESIGN-raycast.md` while preserving existing component boundaries and behavior.

**Architecture:** Add a small shared set of marketing primitives and CSS tokens, then refactor each existing section component to consume that vocabulary. Keep route composition explicit in the App Router and validate behavior through a production build plus desktop/mobile browser inspection.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Motion/Framer Motion, Lucide and Tabler icons.

---

### Task 1: Establish shared marketing primitives

**Files:**
- Modify: `web/app/globals.css`
- Create: `web/components/raycast-shell.tsx`

- [ ] Add the documented canvas, surface, hairline, text, accent, radius, and spacing tokens to `globals.css` and enable Inter stylistic set `ss03` globally.
- [ ] Add reusable `RaycastPanel`, `CommandKey`, `SectionHeading`, and red `HeroStripe` presentation primitives with semantic class-name extension points.
- [ ] Ensure focus-visible and reduced-motion behavior is defined globally.
- [ ] Run `npm run build` from `web`; expect a successful Next.js production build.

### Task 2: Refactor the shared navigation and footer

**Files:**
- Modify: `web/components/navbar.tsx`
- Modify: `web/components/navbar2.tsx`
- Modify: `web/components/footer.tsx`
- Modify: `web/components/footer2.tsx`
- Modify: `web/components/button.tsx`
- Modify: `web/components/logo.tsx`
- Modify: `web/components/logo2.tsx`

- [ ] Replace morphing/glowing chrome with compact canvas navigation, hairline borders, 8px controls, and white primary actions.
- [ ] Preserve route anchors and mobile menu behavior.
- [ ] Point Praxis actions at current repository/product destinations rather than removed legacy branches.
- [ ] Restyle the existing logos and social links in the shared monochrome vocabulary.

### Task 3: Refactor the Praxis Flow first viewport and sections

**Files:**
- Modify: `web/components/cta.tsx`
- Modify: `web/components/logos-cloud.tsx`
- Modify: `web/components/benefits.tsx`
- Modify: `web/components/feature.tsx`
- Modify: `web/components/faq.tsx`
- Modify: `web/components/wobble-card.tsx`
- Modify: `web/app/page.tsx`

- [ ] Recompose `CTA` as the Praxis Flow product-as-command-palette hero with one `HeroStripe`, the existing documentation destination, and the copyable `npx praxiflow` action.
- [ ] Convert the tool cloud, benefit grid, feature grid, FAQs, and roadmap into bordered surface-ladder panels while retaining their existing content arrays and exports.
- [ ] Keep every currently composed Praxis Flow component in `page.tsx` and apply the shared page canvas.
- [ ] Confirm section anchors match navigation destinations.

### Task 4: Refactor the Praxis first viewport and sections

**Files:**
- Modify: `web/components/hero2.tsx`
- Modify: `web/components/feature2.tsx`
- Modify: `web/components/faq2.tsx`
- Modify: `web/app/pro/page.tsx`
- Modify: `web/app/pro/layout.tsx`

- [ ] Recompose `HeroPro` as the Praxis production-backend command surface with one `HeroStripe` and preserved clipboard feedback.
- [ ] Replace the removed legacy branch clone command with a current `praxiflow` production-backend entry action consistent with repository documentation.
- [ ] Restyle production feature and FAQ content with the same system while keeping Praxis-specific accents and content.
- [ ] Compose existing Pro navigation/footer where appropriate and apply the shared page canvas.

### Task 5: Verify implementation and visual fidelity

**Files:**
- Create: `.impeccable/review/flow-desktop.png`
- Create: `.impeccable/review/flow-mobile.png`
- Create: `.impeccable/review/praxis-desktop.png`
- Create: `.impeccable/review/praxis-mobile.png`

- [ ] Run `npm run build` from `web`; expect both `/` and `/pro` to compile successfully.
- [ ] Start the local app and inspect both routes at desktop and mobile widths with the in-app browser.
- [ ] Verify navigation, FAQ controls, clipboard actions, external links, focus states, and horizontal overflow.
- [ ] Capture and inspect all four screenshots.
- [ ] Run the Impeccable detector once against changed web targets and fix mechanical findings.
- [ ] Run the final design review, apply material fixes, and record the implemented system in the project design documentation.
