# Leo · film photographer hero

The first screen of a film photographer's portfolio, Leo Marchetti. A pale wall (#f2f1ee with a faint paper grain), his greeting set enormous in signal red, "HI, I'M LEO", and Leo himself in front of it: a black-and-white waist-up cut-out of a bearded man in a worn canvas work jacket over a flannel shirt, holding a 35 mm SLR at his chest. The idea is the glance. Leo turns his head to look at the visitor: the pointer moves and he follows it (far left, left, centre, right, far right); left alone he glances slowly around the room on his own. The turn must look like a real person turning, never a skew: it is a set of real photographs of the same man at five head angles, and the in-between frames are morphed with optical flow, so the nose, beard and curls rotate.

## Images (three files)

1. **The five angles.** Generate the centre photo first (portrait 2:3, gpt-image class): "Black and white documentary-style photograph of a bearded man in his late twenties holding a vintage 35mm film camera at chest height, wearing a canvas work jacket, slight smile, looking at the viewer, natural light, real film grain, plain light grey background, framed from the waist up." Then make four image-to-image EDITS of that photo (feed it in as the input image; do not generate from scratch): "the man turns his head about 15° / 30° toward the left / right side of the frame. Only the head and neck rotate, his eyes lead the turn. Everything else stays pixel-identical: same face identity, beard, curls, mole, expression, jacket, strap, camera and hands, same light, same grey background, same crop." Check identity across the five.
2. **body.webp** (1024×1536, alpha): the centre photo cut out (Vision "lift subject"), edges refined with a luminance key against the grey and the grey unmixed out of the soft edge (no light halo on red), with the head zone erased above the collar.
3. **heads.webp** (sprite 5 × 5, 25 frames of 504×512, alpha): the head + neck crop (x 200–830, y 0–640 of the 1024×1536 canvas) for 25 angles, far left → far right. Frames 0, 6, 12, 18, 24 are the five photographs (registered to the body with ORB + RANSAC; all greyscale, tone-matched). The 5 frames between each pair are a turn, not a cross-dissolve: an affine fit of one head onto the other, DIS optical flow (medium preset, both directions) on the residual, then the first photograph alone warped along the flow for the first two frames, the second alone for the last two, and one 50/50 frame in the middle, so every frame is sharp. Edges are cleaned (largest shape kept, alpha smoothed). Each frame fades into the body across the collar (rows 505–600 at the neck, 430–500 at the shoulders) so the seam is invisible. On the page two neighbouring frames are shown at once and added exactly (A × (1 − f) + B × f, `mix-blend-mode: plus-lighter` in an isolated group), so the outline never pops.
4. **prints.webp** (1440×960, 2 × 2 of 720×480): four colour film prints. Procida harbour at sunset (Portra 400, Leica M6 35 mm), a red night train on an Alpine viaduct, a freckled woman behind pink peonies in sun, a woman in a white shirt on mint green.

## Layers (back to front)

1. Wall #f2f1ee + a soft white light top-left + paper grain (SVG fractal noise, multiply 10%).
2. **The name** "HI, I'M LEO": Archivo 900, width 62 (variable `wdth`), 20.83cqi (300 px at 1440), line-height .82, tracking −0.01em, #e8321e, centred, top 14.8%.
3. **Leo's shadow** on the wall and letters: the body + centre head, `filter: brightness(0) blur(12px)`, opacity .22, offset 34 / 16 px (scaled), moving less than Leo so it slides across the letters with the dolly.
4. **Leo**: 2:3 box, height 86.4% of the hero, centre at 46.1cqi, bottom −4.9%. The body image, then two head layers from the sprite crossfading between neighbouring frames.
5. **The line** bottom-left (Inter Tight 16/1.45, max 330 px): "I shoot people and places on 35 mm film. Ten years, forty countries, one camera."
6. **The prints** bottom-right (13.2cqi × 9.03cqi each, 6 px white border, two-layer shadow), four fanned slots: (172, 26, 5°) on top, (0, 64, −6°), (96, 8, −1.5°), (130, 0, 2.5°).
7. "ROLL 214 · FRAME 17", JetBrains Mono 12 px, 0.1em, bottom-right; the frame advances with every shuffle.
8. Nav: "Leo Marchetti" (Inter Tight 600 18 px) · Work, Prints, Workshops (14 px 500, 80%) · black pill "Commission".

## Motion

- **The head** (the signature): an angle −1…1, driven by a critically damped spring (k 30 under the pointer, 17 on its own), so it eases in and out like a neck and never overshoots. The angle picks the two nearest frames and crossfades them. Under the pointer the target is the pointer's x relative to his face, snapped to the five photographed angles with hysteresis, so he only ever rests on a real photograph; the morph frames are seen only in motion. With no pointer he glances: centre 1.0 s → far right 1.5 s → centre 0.9 s → far left 1.5 s, each move ~0.95 s. Arrow keys turn him (Home recentres).
- **The dolly**: the name, Leo, his shadow and the prints drift apart on slow sines (15 s horizontal, 11 s vertical) and a little more under the pointer: name +9 px, Leo −10 px, shadow −3 px, prints −26 px per unit.
- **The shuffle**: every 3.2 s the top print lifts clear (168 px up, 70 px right, +7°), swings over and slides in at the back while the others advance one slot (1.15 s, cubic in-out). Hover a print: the shuffle waits, the print lifts 16 px and scales 1.06 with a deeper shadow. Press it: it rises from the pile and lands on top with a soft synthesized shutter (noise curtain + two clicks, peak .05).
- **Entrance** (done by 1.5 s): the three words rise out of masks (1 s, 80 ms stagger), Leo fades in from 1.025 scale, the line and prints follow.
- Paused off screen and in hidden tabs. Reduced motion: no entrance, no drift, no shuffle, he looks at the camera (and still turns to the arrow keys).

## Responsive

- 1440×810 is the composition; at 1440×900 Leo keeps his height ratio and stands lower.
- Phone (≤ 640 px container): nav keeps the name and pill; the line moves under the nav (13.5 px); the name stacks, "HI, I'M" at 34cqi over a huge "LEO" at 66cqi; Leo stands centred-left at 66% height in front of "LEO"; the prints shrink to 27cqi at the bottom right; the roll counter hides.
