# Ora · AI voice receptionist hero

The first screen of Ora, an AI receptionist that answers a small business's phone, books, reschedules and takes messages in the business's name. One saturated electric blue, a centred white headline, and one glossy glass ball in front of it, warm inside (deep red through orange to coral, marbled with paler streaks). The ball is the product's voice and the page's signature: it drifts slowly on a lazy figure-eight across the headline and behaves like a real lens, so the words under it swell, bend and split into a faint rainbow at its rim, then settle as it passes. "Hear it answer" plays a short ring and pick-up and types Ora's greeting.

## Image (one)

- `orb.webp` (1024², transparent): a marbled glass sphere used only as the ball's swirl structure and its fixed gloss (window highlight, sparkles). Prompt: "an iridescent glass marble, marbled swirling interior, rainbow caustic sparkles at the rim, a soft window reflection at the upper left, studio product shot, isolated on transparency." The shader recolours it: a key per pixel `smoothstep(0.38, 0.93, luma − 0.5·(r − b))`, squeezed to 0.1–0.9, mapped through a warm ramp #6e0a0c → #c0230f → #ed4f1c → #ff8a61 → #ffd6c2. Its circle in the image: centre (0.497, 0.503), radius 0.4634 of the width (masked analytically, so no edge halo).

## Layers (back to front)

1. **Ground** (WebGL, far plane): one blue (#0c7bf6), a very soft lift toward white over the bottom 40 % (≤ 22 %), and a wide faint pool of light at (50 %, 42 %). It moves 0.4× the camera offset and drifts ±2.2 % of the width over ~84 s, so the light shifts behind the type.
2. **Type plane**: the headline is real HTML (kept for selection and screen readers, opacity 0 once WebGL is live) and drawn word by word into a canvas texture at the exact DOM positions (font, letter-spacing, colour read from computed style, baseline from the font's ascent/descent), so the shader can refract it. Paragraph, buttons and footer stay HTML on this plane.
3. **The ball** (same shader, nearest plane, moves 1.0× the camera the other way): inside the disc the type is sampled at `c + (p − c)·m`, `m = 0.5 + 0.3·d²` (≈2× at the centre), R/G/B at `m ∓ 0.04·d²` for a chromatic edge, and shows through as warm white (82 %). Interior: the marbling sampled through a slow turn (0.07 rad/s), a swirl that winds and unwinds (`0.55·sin(0.16 t)·(1 − d)²`) and a gentle sine flow, recoloured warm; shaded as a sphere lit from the upper left (0.62–1.12), deeper wine toward the lower-right rim, a soft gloss spot at (−0.36, −0.44), the image's window highlight and sparkles unrotated at 42 %, a thin warm rim light upper left. Outside it, a swell zone to 1.75 R magnifies up to 13 % with a 0.35 % rainbow split.
4. **Light and shadow**: a pale ice halo around the ball on the blue (34 % at the rim, falling off over ~0.4 R), a soft blue shadow offset (0.2 R, 0.5 R) down-right on the type, a small warm orange caustic below it.
5. Film grain: SVG fractal noise at 12 %, overlay.

## Copy

- Nav: ● Ora · Product · Use cases · Pricing · [Try a call]
- H1: "Your phone, answered" / *"before the second ring."*
- Line: "An AI receptionist that books, reschedules and takes messages in your business's name."
- Buttons: [Hear it answer] (phone glyph) · [Get a number]
- Footer: "● 1,284 calls answered today" (ticks up every 4.2 s) · "Avg. pick-up 0.8 s · 31 languages · Keeps your number"
- After the pick-up: **Ora** "Good afternoon, Bianchi Dental. This is Ora, how can I help?"

## Type

Inter Tight 500 74 px (min with 9.6cqi), tracking −0.045em, line-height 1, white; Instrument Serif italic 96 px (min with 11.8cqi), −0.02em, ice #c6f0ff. Body 16/1.5 white at 84 %; buttons 15 px 500; nav 14 px white, logo 18 px 600 with a white dot; footer 12.5 px white at 78 %.

## Colour

Ground #0c7bf6; white #fff; ice #c6f0ff; primary button white with #0846c4 text; secondary button white 14 % with a 1 px white 42 % inner line; live dot #7dffc4; ball #6e0a0c / #c0230f / #ed4f1c / #ff8a61 / #ffd6c2.

## Motion

- Figure-eight drift, period 30 s: `x = centre + 0.4·headlineWidth·sin(ωt)`, `y = rest + (low − rest)·(0.5 + 0.5·sin(2ωt − 0.6))`; the low point keeps the ball's bottom 10 px above the paragraph, the rest point is the slot above the headline (where it sits under reduced motion). Starts mid-path so it's crossing the headline within the first seconds; entrance 1.1 s (fade + scale 0.94 → 1 + rise 18 px).
- Camera parallax: ambient ±6/±3 px, pointer ±16/±10 px, critically damped (k = 1 − e^(−2.6 dt), no overshoot). The pointer also tugs the ball toward it (28 %/22 % of the distance, clamped 130/70 px).
- Hear it answer: two rings (nine 50 ms trills alternating 440/480 Hz, 0.75 s apart), a filtered-noise pick-up click and two rising triangle notes (660, 990 Hz). The ball breathes with each ring (scale ≤ 1.04, a cosine, no overshoot), two white ripples leave its rim per ring, the button reads "Ringing…" then "Ora picked up", and the greeting is typed word by word (85 ms). Resets after 5.2 s.

## Responsive

Container queries. ≤ 860 px: nav links and the footer's right line hide. ≤ 640 px (phone): ball 50cqi (150–220 px), the headline scales by cqi so both lines hold on one line each at 390 px (37 / 46 px), paragraph 15 px in 310 px, buttons 14.5 px, the drift amplitude drops to 0.26 of the headline width. Reduced motion: one still frame, the ball at rest above the headline. No WebGL: the CSS blue, the marbling image warmed with a CSS hue-rotate/saturate and a drop shadow, the HTML headline.
