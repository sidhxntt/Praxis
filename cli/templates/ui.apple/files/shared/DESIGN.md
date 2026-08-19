# Stillform — Apple-Inspired Landing Page Design

This is an original Praxis Flow landing page inspired by Apple's restrained, photography-first visual language. It is not affiliated with or endorsed by Apple. It uses neutral demonstration copy and an original local illustration; no Apple logos, product text, or proprietary imagery are included.

Source specification: `templates/designs/DESIGN-apple.md`.

## Visual direction

- Let the product composition lead while interface chrome recedes.
- Alternate full-bleed white, parchment, and near-black stages to create rhythm without decorative dividers.
- Use one blue action color (`#0066cc`) for links, focus signals, and pill-shaped calls to action.
- Use no decorative gradients and no card shadows. The only drop shadow belongs to the product composition.
- Keep display typography at weight 600 with tight tracking; body copy is 17px and weight 400.

## Tokens

- Canvas: `#ffffff`
- Parchment: `#f5f5f7`
- Ink: `#1d1d1f`
- Dark stage: `#272729`
- Action blue: `#0066cc`
- Dark-surface link blue: `#2997ff`
- Hairline: `#e0e0e0`
- Action radius: full pill
- Card radius: `18px`
- Content maximum: `1440px`

## Landing-page composition

The page contains a slim global navigation, a centered product hero, a dark cinematic showcase, a light bento feature section, a material story, a dark impact-metrics band, a restrained reservation call to action, and a parchment footer.

All text and assets describe the fictional Stillform demonstration brand. The local `stillform-stage.svg` is the primary visual and must retain meaningful alternative text.

## Responsive behavior

- Lock wide content at 1440px.
- Collapse navigation links below tablet width while retaining the main action.
- Reduce hero display type from 56px to 40px, 34px, then 28px across desktop, tablet, phone, and small-phone widths.
- Collapse multi-column feature and metric layouts to one column on phones.
- Keep all interactive targets at least 44px high.

## Accessibility adaptations

The generated implementation includes a skip link, semantic landmarks, visible focus treatment, contrast-safe text, intrinsic image dimensions, and reduced-motion handling. These requirements take priority if a decorative source rule would conflict with accessibility.
