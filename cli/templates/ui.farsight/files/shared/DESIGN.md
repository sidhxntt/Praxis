# Farsight · magazine hero with a ring of photographs

Build the first screen of "Farsight", a quarterly magazine of places photographed from very far away (orbit, aircraft). The page is black and the pictures are its only light: seven tall aerial photographs stand on a ring in real 3D under a thin serif headline. The one in the middle faces the reader, its neighbours turn away, the outer two are slivers. The ring never stops turning, so every picture takes the middle in turn. One screen, no scroll.

## Pictures (seven, portrait 2:3, 640×960 webp, about 100 to 290 KB each)

One prompt tail for all of them: "Real aerial photograph, true nadir view straight down from very high altitude, vertical portrait frame filled edge to edge, vivid saturated natural colour, crisp fine detail, slight film grain, no horizon, no sky, no text, no labels, no border, no people, no overlay graphics."

1. `delta` (glow `#35bfb0`): "A branching river delta seen from orbit: dozens of teal and turquoise water channels dividing like the bronchi of a lung through rust-red and ochre silt flats, with fine dark green veins of mangrove along the channels and milky sediment plumes where they meet a deep blue sea at the bottom of the frame."
2. `salt` (`#ff4d7d`): "Salt evaporation ponds seen from above: a mosaic of large geometric ponds in vivid magenta pink, coral, rust orange, lime green, emerald and milky white, separated by thin pale straight dikes, with fine crystalline salt crusts and swirling mineral patterns inside the ponds."
3. `glacier` (`#6fc9f0`): "A glacier tongue seen from high above: a wide river of luminous blue-white ice with long curved dark moraine stripes and fine crevasse patterns, flowing from the top of the frame between dark charcoal rock walls dusted with snow, ending in a milky turquoise meltwater lake with small white icebergs at the bottom."
4. `dunes` (`#ff7a1f`): "A sand sea seen from orbit: endless long curved orange and deep amber dunes with razor-sharp crests, one side of every dune glowing warm orange in low sun and the other in deep violet-brown shadow, fine wind ripples, a few pale flat salt pans between the dune chains."
5. `reef` (`#12c8c4`): "A coral reef and atoll seen from high above: a ring of pale sand and electric turquoise shallow lagoon with darker teal coral patterns and veins, surrounded by deep saturated cobalt blue ocean, small white wave lines breaking on the outer reef edge."
6. `fields` (`#d6d21f`): "A patchwork of farm fields seen from very high: hundreds of small irregular plots in bright yellow rapeseed, emerald green, lime, terracotta ploughed earth and purple lavender, stitched together by thin pale tracks and dark hedgerows, a few perfect green crop circles, one silver river curling through."
7. `city` (`#ffb14a`): "A dense city at night seen from orbit straight down: a glowing web of amber-gold and warm white street lights, bright arterial roads radiating from a brilliant centre, cool blue-white districts, a dark river with lit bridges winding through, black unlit parks and water. Sharp points of light, deep black between them."

Pick each by one test: at thumbnail size it reads as an abstract painting, at full size as a real photograph. Each picture has one glow colour (above), taken from its most saturated third.

## The unit

Everything is sized from one unit `u = min(1% of the width, 1.6% of the height)`, so 1440×900 gives `u = 14.4px` and a shorter screen shrinks the whole composition instead of cropping it. The composition is a box of 100u × 62.5u centred on the screen; only the nav is pinned to the real edges. All numbers below are in `u` unless they say px.

## Layers (back to front)

1. **Ground**: `#000`.
2. **Room light**: seven stacked radial gradients (86 × 56, centred at y = 41), one per picture: its glow colour at 42% in the middle, 17% at 42% of the radius, transparent at the edge. The opacity of each is the weight `w` of its picture (1 when it is in the middle, 0 one card away), so the room changes colour as the ring turns.
3. **Headline** (centred, top at 8.9): three lines, "Seven places / you can only see / from far away". Fraunces 300 at optical size 144, 3.72 (53.5px), line-height 1.085, tracking −0.022em, white.
4. **Floor**: a strip 6.3 high from y = 56.2, white 5.5% fading down, faded out at both ends. On it, one **pool** of colour under every card: a 34 × 9.2 radial gradient (the glow colour at 70% lifted 8% toward white in the middle, 38% at a third, transparent), blended `screen`, placed at the card's x after perspective and squeezed as the card turns.
5. **The ring** (a 3D context: perspective 112, origin 50% 42%, the row starts at y = 24.6). Seven cards, each 23.2 × 31 with a 1.55 radius. A card that is `a` cards from the middle (the ring position is a real number, so `a` is too) stands at:

   | a | x | z | turned | visible | shade |
   |---|---|---|---|---|---|
   | 0 | 0 | 0 | 0° | 1 | 0 |
   | 1 | 27 | −5 | 28° | 1 | 14% black |
   | 2 | 49 | −17 | 48° | 0.92 | 34% |
   | 3 | 59 | −30 | 64° | 0 | 66% |

   Interpolate straight between rows. Cards on the right turn their right edge away, cards on the left their left edge (a ring seen from outside). With `w = smoothstep(1 − a)`:
   - the card is scaled by `1 + 0.035w` and its face is `0.9 + 0.1w` as wide (the picture and the caption are counter-scaled, so only the frame opens);
   - the photograph is bigger than its frame (scale `1.16 + 0.07w`) and slides inside it by `−5.2% × d` (d is the signed distance), plus a slow drift of ±1.6% and ±2.2% on two sine clocks of about 30 s and 37 s with a different phase per card: like a view through a window;
   - a band of light (a 100° white gradient, peak 62%, blended `screen`) crosses the card as it passes the middle: its x is `−150% × d`, its opacity `0.6 × max(0, 1 − 1.5|d|)`;
   - the caption (two centred lines at the foot, Fraunces 400, 1.5 (21.6px), line-height 1.08, on a black gradient to 62%) rises 0.9 and goes from 62% to full white as the card arrives;
   - behind the face a halo of the glow colour (36%), and under it the **mirror**: the same picture upside down, 0.42 below the card, 50% opacity, masked from 62% at the card's edge to nothing at 21% of its height.
   - hairline: inset 1px white 16%, with a brighter top edge (28%).
   The whole ring also sways (±0.9° on a 20 s sine) and leans with the pointer (up to 3.2° around y, 1.6° around x).
6. **UI** (Inter Tight)
   - Nav, 2.9 from the top, 4.1 from the sides: "Farsight" 1.16 (16.7px) 600 followed by a white dash 1.9 long; links Issues, Places, Photographers, About at 0.98 (14px) 500, white 86%; a white pill "Subscribe" 0.98 600, ink `#0a0a0a`, padding 0.72 × 1.35.
   - Bottom left (4.1 in, 2.5 up, 21 wide): "**Issue 14** · Winter. A quarterly of places photographed from orbit, from aircraft and from very tall ladders." 0.92 (13.2px), line-height 1.38, white 56%, "Issue 14" in white 600.
   - Bottom right: a rolling counter "02 — 07" in tabular figures (the first number is a column of 01…07,01 moved by the ring position, so it rolls exactly as the ring turns), then a hairline divider and "Drag to turn". 0.98, white 56%, the live number white.

## Motion

- **Travel**: the ring position `p` obeys `dp/dt = (1 − 0.8·cos 2πp) · 1.667 / 2.2 s`. It never stops: it crawls as a picture reaches the middle (about 0.15 cards a second) and runs between two (about 1.36), one picture every 2.2 s. `pace` divides the 2.2.
- **In the hand**: dragging the row moves `p` by the pointer's travel divided by one card step (27u, in screen pixels). On release it goes on to `round(p + 0.28 × speed)` (at most three cards), easing with `1 − e^(−6.5·dt)`. A click on a side card brings it to the middle; a click on the middle card opens it (a short dip of the card, 0.5 s, and the `onOpen` callback).
- **Pointer**: its position in the hero (−1…1) is eased with `1 − e^(−6·dt)`; it leans the ring, tilts the middle card (7° and 5°), nudges the band of light, and moves the headline against it by 0.5 × 0.3.
- **After a touch** (drag, click, key) the travel waits 6 s, then comes back over 1.2 s.
- **Entrance**: the three headline lines rise 1.2 and fade in over 0.9 s, 70 ms apart. The ring, the light and the floor are there from the first frame.
- **Sound**: one triangle tick (880 → 620 Hz, 70 ms, gain 0.035) each time a new picture reaches the middle while the visitor is driving; a higher one (1320 → 1760 Hz) on open. Never during the travel by itself, never before a user gesture.
- Paused off screen and in a hidden tab. Reduced motion: no travel, no drift, no entrance; drag, click and keys move the ring at once.

## Keyboard

One tab stop in the row: the card in the middle (it moves with the ring, and focus follows it). Left/Right step, Home/End go to the first and last, Enter or Space opens. Focus ring: 2px black then 2px white around the card. A polite live region reads "3 of 7: A glacier, one day from the sea".

## Phone (container under 640px)

`u = min(2.564% of the width, 1.185% of the height)` (10px at 390×844), composition 39 × 84.4. Nav: wordmark 1.7 and the pill only. Headline at y = 15.2, size 4.25. The row starts at 32.2 with perspective 78; cards 25.2 × 34.4; the side cards stand 0.6 as far apart and turn 2.15 times as much, so the neighbours are slivers at the screen's edges and the next ones face away and are hidden (`backface-visibility: hidden`). Note and counter at the bottom, 1.22 and 1.3; "Drag to turn" is dropped.
