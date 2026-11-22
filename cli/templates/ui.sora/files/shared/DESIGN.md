# Sora · travel-money card hero

The first screen of a consumer card for spending abroad: "Money that moves with you". A big red serif headline sits over a field of enamel tiles seen in perspective, drawn as real 3D columns. Slow swells roll across the field: where a swell is high the tiles rise and glaze into enamel red, where it is low they settle back to white. A navy payment card floats above the field in the same 3D space. It hovers, picks up a moving sheen, and its shadow and reflection slide over the tiles under it. Every 2.8 s the card hops to pay: a crouch, a spring up with a full flip over its long axis (edge and back flash past), a drop, and a landing on a damped spring with two small bounces. The landing kicks the field: a ring of tiles pops up, overshoots below and settles as it runs outward, and the receipt in the corner rolls to the next purchase in the next city. No photographs: everything is drawn.

## Layers (back to front)

1. **Ground**: flat #f7f7f5.
2. **Tile field (WebGL2, instanced)**: 60 × 54 columns on a 1-unit pitch (0.86 tile, 0.14 grout), five faces each (top + four sides), plus a floor quad for the grout. Per instance: grid i, j and a random 0–1.
   - Height: `0.14 + pool·(0.95 + 0.40·w) + (1 − pool)·max(0, w)·0.62`, where `w` is three summed sines travelling in different directions (0.27x + 0.19z − 0.8t; −0.15x + 0.30z − 0.55t; a radial one centred far left), and `pool = exp(−|(p − cardXZ)/(8.5, 5.8)|²)`, the red pool that stays under the card.
   - Landing ripples (4 slots): every tile is a damped oscillator kicked when the wave front reaches it: `τ = age − d/7.5`, `h += amp · e^(−2.4τ) · sin(9τ) · e^(−0.045d)` for τ > 0 (amp 1.3, 1.6 when the visitor presses). Ripple and swell clocks run at 1.6× real time.
   - Colour from height: white #f6f3f2 → blush (30 % tone) → tone #c8102e → tone × 0.8 for the highest, ±3 % per tile.
   - Light from upper left behind: wrap diffuse, sides darker toward their base, a glazed white bevel on the top edges, a tight specular, the card mirrored faintly in the glaze (ray-plane hit of the reflected view ray), and the card's shadow (ray from the tile toward the light hits the card's rectangle; softness grows with distance) plus a broad contact shadow straight below.
   - Depth haze: tiles fade to the ground with distance (world z +5 → −31), and the upper half of the frame is hazed 80 % so the headline sits on calm ground.
   - Floor (grout) is ground × 0.8, darkened toward a deep tone inside the pool so tall columns read as solid.
3. **The card (same WebGL scene)**: a 5.5 × 3.47 unit quad (ISO card ratio 1.586) with a rounded-rect SDF edge (radius 5.5 % of width, anti-aliased with fwidth), a darker slab 0.07 behind it for thickness. Its face is drawn once into a 1024 × 646 canvas and uploaded as a texture: navy gradient #1c2142 → #2b3270 → #141731, faint brushed diagonal lines, a large embossed arc, "Sora" in DM Serif Display 92 px, a gold chip, contactless waves, "••••  4821" in JetBrains Mono, two network circles (#eb001b, #f79e1b). In the shader: a diagonal sheen band whose position follows the tilt and drifts slowly, a real specular from the reflected view ray, a soft rim.
   - Pose: lies back −58°, rolled 16°, yawed −6°; centre at (0.2, 3.5, 5.2) on desktop.
   - The back (seen mid-flip): navy enamel #1c2142 → #2b3266 with a near-black magnetic stripe at 16–33 % of the height, the same sheen and specular. It is the thickness slab, which wins the depth test when the card is turned over.
4. **Headline (DOM)**: "Money that" / *"moves with you"* centred, DM Serif Display 400 (second line italic), `clamp(56px, 9.17cqi, 140px)`, line-height .9, tracking −0.03em, colour = tone. Top 96 px.
5. **Foreground UI (DOM)**: receipt bottom-left (56 px / 52 px, 236 px wide, white, radius 14, soft red-tinted shadow): "Coffee · Lisbon" + "Just now" in 55 % ink, then "€3.20" Inter Tight 600 20 px tabular + "0% FX" in #1a8f4c. Right: "One card for 40 currencies. No fees abroad, ever." 15 px, right-aligned, with a white halo so it reads over the tiles.
6. **Nav**: "● Sora" (tone, 600 18 px) left; Card · Savings · Business (14 px, 80 % ink); "Get the card" pill in tone, white text.

Fonts: DM Serif Display (headline, card wordmark), Inter Tight 400/500/600 (UI), JetBrains Mono 500 (card number).

## Camera and depth

Perspective camera, vertical half-angle 19°, eye (0, 15.3, 22.1) looking at (0, 0.5, −4.2). The pointer moves the eye ±2.6 x and ±1.3 y (eased, `1 − e^(−3.2·dt)`), and a slow drift (sin 0.31 t · 0.55, sin 0.23 t · 0.3) keeps it moving without a pointer. Because the camera moves, the near tiles shift more than the far ones and the card, floating higher and closer, more again: true parallax. The headline is translated against the camera by 7 px per unit and the receipt by 1.5 × that, so the type planes sit in front.

## Motion

- Entrance (1.3 s): tiles rise from flat (smoothstep), the card fades in while settling 1.2 units down; the headline lines mask-rise (1 s, second line +120 ms); receipt and copy fade up at 0.5 s / 0.6 s.
- Always on: the swells (one full cycle ≈ 5 s), the card's hover (±0.32 at 1.5 rad/s), roll (±4°) and yaw (±5°), the sheen drifting across.
- Every 2.8 s (first at 1.5 s): the hop. 0–0.14 s crouch 0.32 down (half sine); 0.14–0.52 s rise 1.7 up (ease-out cubic), moving 0.7 toward the camera per unit of lift; 0.52–0.80 s fall (gravity, u²); from 0.14 to 0.80 s a full 360° flip about the card's long axis (smoothstep). On landing a damped spring: `lift = −0.42 · e^(−3.3τ) · sin(13τ)` and the card tips back by `9° · e^(−3.3τ) · sin(13τ + 0.6)`, so it bounces twice and settles. The ripple starts at the landing and the receipt rolls (0.5 s) through Lisbon, Paris, Tokyo, New York, Rome, Berlin, Madrid, Istanbul.
- Pointer: card tilts up to 9° back/forward and 14° sideways toward it on a spring (stiffness 70, damping 9: a small overshoot), the sheen and shadow move with it.
- Press the card (hit-tested against its projected corners) or Tab to it and press Enter: a hop with a bigger ripple and a two-note chime (1318 Hz then 1760 Hz sines, 60 ms each, peak gain 0.045).

## Responsive

- ≤ 900 px: links hidden, copy narrower.
- ≤ 640 px (phone): nav insets 20 px, headline 15.4cqi; the camera pulls up and back (eye y 17.5, z 22.5, a wider lens so the card fits); the card sits at (0.3, 6.6, 10) in the middle of the field; copy and a full-width receipt stack at the bottom.
- Reduced motion: one still frame, no entrance, receipt fixed; a press still pays and redraws once.
- No WebGL2: a CSS card over a soft radial red field.

## Props

brand, cta, tone (#c8102e), waves (1: speed and height of the swells), last4, sound, onCta.
