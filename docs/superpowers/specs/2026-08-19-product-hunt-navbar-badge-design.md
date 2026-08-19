# Product Hunt navbar badge design

## Goal

Replace the desktop navigation's GitHub CTA with the official dark Product Hunt featured badge supplied for the Praxis launch.

## Design

The existing animated CTA container remains unchanged so navbar entrance, exit, and scroll behavior are preserved. Inside it, a standard external anchor opens the Praxis Product Hunt launch in a new tab with `noopener noreferrer`. The supplied `250 × 54` SVG is rendered through a native `img`, preserving the official badge artwork without adding a Next.js remote-image configuration dependency.

The badge is hidden below the existing desktop breakpoint, matching the current GitHub CTA behavior. Hero, footer, mobile navigation, and other GitHub links remain unchanged.

## Verification

- A focused source assertion verifies the Product Hunt launch URL, image URL, accessible alternative text, dimensions, and security attributes.
- The web lint and production build must pass.
- Rendered desktop navigation must show the badge without changing navbar behavior.
