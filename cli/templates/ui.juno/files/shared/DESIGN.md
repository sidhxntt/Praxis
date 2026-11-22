# Juno — a designer's portfolio as a page of her notebook (hero, one screen)

Build the first screen of a product designer's portfolio. It is a sheet of pale lined paper with things stuck on it, and the whole point is that you can pick those things up. No scrolling, no sections: one screen, 1440×900 on desktop, recomposed at 390×844.

## Pictures (three square photographs, shown as polaroids)
Generate them as real, candid 35mm snapshots with soft grain, no readable text, no logos:
1. `juno.webp` — "a woman product designer in her early thirties with short dark curly hair, mustard yellow beanie, dark green overshirt, seen in three-quarter view from behind so only her cheek shows, standing in a bright studio looking at a white wall covered with paper sketches of phone screens and pastel sticky notes with no writing, soft daylight from a window on the left, shallow depth of field".
2. `tram.webp` — "close view of a hand holding a smartphone at a tram stop in Lisbon on a bright day, the screen shows a pale map with one bold red route line and a round marker, a yellow tram passing out of focus behind, pastel tiled buildings".
3. `desk.webp` — "a designer's wooden desk by a window in warm late-afternoon light, a smartphone showing a colourful map with one route line lying on pencil wireframe sketches, a pencil, blank pastel sticky notes, a ceramic coffee cup, a roll of masking tape, three-quarter angle from above".
Export at 640 px wide.

## Type
- Pixel face for small labels: **Silkscreen** 400/700 (Google Fonts), uppercase, letter-spacing .04–.08em, 10–11 px at 1440.
- Handwriting: **Reenie Beanie** (Google Fonts), 23–30 px at 1440.
- Statement: **Inter Tight** 600, 37 px at 1440, tracking −0.022em, line-height 1.16.
- The NAME is not a font. Draw it from a pixel alphabet you define yourself: each letter is 9 rows by 6 columns (M and W 8, N 7), strokes two cells thick, corners notched by one cell, one empty column between letters. Render the lit cells as SVG rects in an `<svg viewBox="0 0 cols 9" preserveAspectRatio="none" shape-rendering="crispEdges">` so the word can be squashed and stretched and stays sharp.

## Colours
Paper `#f1f2ee`; rules `rgba(64,92,140,.13)`, one every 27 px; a faint red margin line `rgba(240,69,46,.16)` at 75 px from the left. Ink `#17181a`. Frame red `#f0452e`. Yellow `#f6d048` / tape yellow `#f6d667`. Mint `#a9e5c5`. Pink `#ff7eb0`. Blue `#2f6bff` (button icon) and `#b9cdf6` (note). Green `#37c47c`. Polaroid white `#fdfdfb`.

## Layers, top to bottom of the screen (1440×900)
1. **Nav**: a white bar with a 1 px ink hairline, 39 px high, inset 32 px from the sides, 22 px from the top. Left: a pink round button, then four pixel tabs with tiny pixel icons: HOME (yellow fill, active), ABOUT, WORK, PLAYGROUND. Right: three round buttons (yellow, pink, green, each with a dark pixel mark) and a bordered CONTACT pill.
2. **"my name is"** in handwriting, centred at y≈173, with a drawn curved underline.
3. **The selection frame**, centred, 389×150 at y≈221: a 1.7 px red rule, a half-transparent white fill, eight 11 px square handles (white, red border) on the corners and edge middles, and a red readout tag under it ("389 × 150", pixel face, white). Inside, with 14×18 px padding, the name **JUNO** in the pixel alphabet, ink.
4. **Four washi-tape labels** around the frame, each a strip with torn zigzag ends at a small angle: "MAKES THINGS" (mint, pixel face, top left), "SWEATS THE DETAILS" (yellow, pixel face, top right), "Product designer" (yellow, handwriting, left of the frame), "Lisbon, PT" (mint, handwriting, right of the frame). Three hand-drawn ink arrows curve from the labels to the frame.
5. A status line under the readout: a pulsing green dot and "OPEN TO NEW WORK FROM JANUARY" in the pixel face.
6. **The statement**, centred at y≈454, two lines: "I make software you stop noticing" + a small green target sticker, "because it just works." + a pink pixel flower. Both stickers turn slowly.
7. **The button** at y≈569: a dark rectangle, no radius, a blue square with a white pixel arrow, "SEE THE WORK" in the pixel face, a hard offset shadow (4 px, 4 px, 18% ink). Hover lifts it 1.5 px, press pushes it into its shadow.
8. **Three polaroids**, each 193 px wide (the third 176), white with a square photograph, a handwritten caption and one strip of translucent tape with torn ends across the top edge: "that's me" (left, −5°), "Tramline, 2026" (top right, +4.5°), "desk, most days" (lower right, −3°).
9. **Three torn notes** along the bottom (blue, yellow, green, torn left and right edges, small angles), each a big figure, one line and a tiny pixel caption: "3.2× more trips planned · TRAMLINE", "−41% taps to split a bill · TALLY", "11 apps shipped since 2019 · AND COUNTING".
10. **A sticker** at the lower left: a yellow twelve-point scalloped badge with an ink outline and a pixel smiley; and in handwriting "pick anything up" with a drawn arrow to it.

## Motion (one idea: the page is a desk you can touch)
- **Pick up anything** that is taped or framed (labels, polaroids, notes, sticker, the frame itself). While held it follows the pointer, casts a deeper, softer shadow and tilts with its speed (up to ±9°). On release a spring takes it home (stiffness 96, damping 11.5: one small overshoot).
- **Polaroids hang from their tape**: `transform-origin: 50% 1%`, and the angle is a pendulum driven by the hinge's horizontal acceleration: `ω += (−46·θ − 4.2·ω + a·0.0042)·dt`. They swing behind the hand and settle in about a second.
- **The frame's handles** resize it like a design tool: each of the four sides is its own spring; a handle pulls one or two sides, the name stretches with the frame, the readout counts. On release the sides return (stiffness 210, damping 13, a visible bounce). Limits: −32% to +50% wide, +70% tall.
- **Tape labels peel** on hover and focus: the label is two clipped copies of itself, the free 62% turns around the fold with `rotateY(−52deg) rotateZ(−3deg)` under a parent `perspective`, brightens 8% and uncovers a blurred shadow; 500 ms, `cubic-bezier(.3,1.5,.5,1)`.
- **Self-play** when nobody has touched it for 6 s, in a 14 s loop, silent: 0.7 s a polaroid is pulled 144 px down-left and let go; 3.1 s the frame's bottom-right handle is pulled out and let go; 5.5 s the labels peel one after another, 230 ms apart; 7.5 s the smiley winks and hops; 8.3 s the left polaroid is pulled up-right; 10.3 s a note; 11.7 s the frame's left handle.
- Everything stops off screen and in a hidden tab. Reduced motion: no self-play, no peel, no bounce (a dropped thing is simply back).
- Sound: a short noise tick on pick-up, a softer one on release, a low tap when the frame lets go; each under 60 ms and quiet, never before a user gesture.

## Keyboard
Every piece is a Tab stop with a label. Arrow keys nudge it (it springs back); on the frame the arrows push its right and bottom sides instead.

## Phone (390×844)
Nav: the pink button, HOME, WORK and CONTACT only, 39 px high. "my name is" at y≈128, the frame 242×94 at y≈174 with "MAKES THINGS" above its left corner and "Lisbon, PT" above its right. Status line under the readout. The statement at 28 px in three centred lines, the button 41 px high. At the bottom two polaroids (152 px wide) overlap, −6° and +5°, with the sticker between their top corners. The notes, the arrows, two labels and the third polaroid are left out.
