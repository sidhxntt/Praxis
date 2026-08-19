# Product Hunt Navbar Badge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the desktop navbar GitHub CTA with the official Praxis Product Hunt featured badge.

**Architecture:** Preserve the existing animated desktop CTA wrapper and replace only its child control. Use the supplied native anchor and image so the official remote SVG requires no Next.js image-host configuration; add a focused source contract test for the embed.

**Tech Stack:** Next.js, React, Node.js test runner, Product Hunt embed SVG

---

### Task 1: Navbar Product Hunt embed

**Files:**
- Create: `tests/web/product-hunt-navbar.test.mjs`
- Modify: `web/components/navbar.tsx:158-170`

- [x] **Step 1: Write the failing contract test**

Read `web/components/navbar.tsx` and assert it contains the Product Hunt launch URL, featured SVG URL, `250` by `54` dimensions, descriptive alt text, `_blank`, and `noopener noreferrer`.

- [x] **Step 2: Verify the test fails for the missing Product Hunt embed**

Run: `node --test tests/web/product-hunt-navbar.test.mjs`
Expected: FAIL because the navbar still contains the GitHub CTA.

- [x] **Step 3: Replace the desktop GitHub CTA**

Inside the existing animated wrapper, render the supplied external anchor and native image. Retain the existing `hidden md:block` breakpoint behavior and do not change the hero, footer, or mobile navigation.

- [x] **Step 4: Verify the focused test and web checks**

Run: `node --test tests/web/product-hunt-navbar.test.mjs`
Expected: PASS.

Run: `npm --workspace web run lint`
Expected: PASS.

Run: `npm run build:web`
Expected: PASS.

- [x] **Step 5: Inspect the rendered desktop navigation and commit**

Start the web application, confirm the badge is visible at desktop width and its link target is correct, then commit only the plan, test, and navbar implementation.
