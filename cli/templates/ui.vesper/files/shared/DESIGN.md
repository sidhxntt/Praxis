# Vesper: a board of floating tiles around one figure

Build the first screen of **Vesper**, a personal system that reads your day (light, sleep, focus, meetings) and shows it as live tiles. One screen, no scroll. The idea is **depth**: a black stage in the middle of a pale page, and thirteen small objects floating around it and over its edges at three distances from the viewer.

## The picture (one, generated)
`figure.webp`, square, 1100 px:

> Studio photograph of a young man with short curly dark hair, no hat, head and shoulders, three-quarter view turned toward camera right, chin slightly down, against a pure black background. Lit ONLY by one saturated deep red rim light from behind and camera left: a glowing red edge along the back of the head, the ear, the jaw line, the neck and the top of the shoulders, with soft red light wrapping onto the cheekbone, the bridge of the nose and the lips; the rest of the face stays in deep black shadow, eyes barely visible. He wears a plain black crew-neck sweater whose shoulders catch the red light. Low-key, very high contrast, real skin texture with pores, fine film grain, 85mm at f/2. The head sits in the left-centre of the frame, empty pure black on the right third and above the head. No text, no logos, no border, no other light sources, no blue.

It must be a photograph (skin, grain), never a 3D mannequin. Because it is red on pure black, another light colour is the same file with `filter: hue-rotate()` (rose −38°, amber +26°, blue +222°).

## The board
Draw everything on a fixed board of **1440×900** and scale the whole board to the space (`scale = min(width/1440, height/900)`), so every distance below is in board pixels.

- **Page**: `#e2e2e0`, with a soft radial lift to `#ececea` in the middle and `#d3d3d1` at the corners.
- **Corners of the page** (15 px, Inter Tight 500): top left `Vesper` (21 px, 600, `#0b0b0c`) + `beta` in `#9a9a98`; top right `Tiles  Sources  Privacy` in `#8a8a88` and `Sign in` in ink 600; bottom left `Main board` grey; bottom right `Vesper` ink + `thirteen live tiles` grey.
- **Stage**: 976×624 at (232, 138), radius 30, `#030303`, a long soft shadow under it. Inside, back to front:
  1. a red glow behind the head: an ellipse of the light colour at 46% → 16% → 0, breathing (opacity .42 ↔ .9, scale .94 ↔ 1.05, 5.2 s, alternate);
  2. the photograph, 104% of the stage height, left edge at 156 px, its right 30% faded out with a mask; its opacity breathes .82 ↔ 1 on the same clock;
  3. a veil: black from the bottom (0 at 56% to .82 at 98%) and a little from both sides, so type reads;
  4. small tabs at (304, 28): **Today** white, `Week  Sources  Notes` at 50% white, 13.5 px 600;
  5. the copy, bottom left (44 px in, 44 px up, 420 wide): a kicker `● Reading 13 signals` (13.5 px, 62% white, the dot in the light colour with a pulsing ring); the headline **Vesper reads / your day.** (60 px, 700, line-height .96, tracking −.038em, two lines); one line `Light, sleep, focus and meetings, as live tiles on your desk.` (16 px, 62% white, 300 wide); a white pill button `Get early access →` (48 px high, 15.5 px 600, ink text).

## The tiles
One tile is **182×218, radius 22**, drawn once and scaled. Its ground is a flat gradient plus two or three big soft radial lobes that drift on their own clocks (9, 11, 13 s, alternate) and a film-grain overlay at 34%; a hairline of white at 10% and a brighter top edge. Top left a two-line label, 13.5 px: the name in 600, a second line at 56% white. Bottom left a word at 62% white, 12.5 px. In the middle ONE instrument.

Readings are set in **round dots** on a 6×9 matrix per glyph (pitch 3.9 px, dot 80% of the pitch, white with a faint glow); when a reading changes the dots flicker in over 520 ms.

| Tile | Place (x, y), scale, depth | Ground | Instrument and copy |
|---|---|---|---|
| Steadiness / Heart, at rest | (812, 304), 1, far | violet `#7767cf` → `#c49ccc` | dots `62`; two fine cream sine waves on a hairline, a yellow triangle riding the main one; `Even` |
| Sleep / Last night | (1006, 304), 1, far | teal `#18a7a0` → `#0c6f78` | a thin ring (r 44) filled to the percentage, a leaf-like yellow curve swaying across; dots `81` + small `%`; `7 h 12` |
| Mood / Lift since noon | (812, 532), 1, far | magenta `#e0186c`, a dark plum heart | dots `+4`; 25 thin bars flickering, the middle five amber; `Bright` |
| Movement / By the hour | (1006, 532), 1, far | navy `#0a1a3c` with a blue glow | a crosshair and 13 soft blue bubbles that wander; `Early` … `Late` |
| Whole day / All tiles (wide, 300×118) | (246, 744), 1, middle | sand `#8a6a4e` → `#b98c60` | dots `93%`; 13 yellow lines whose widths draw a lens, breathing; a yellow triangle; `An even day` |
| Room light / Colour | (300, 34), 1.16, middle | bottle green `#33705a` → `#0b241b` | a mint disc with 18 tiny rays, on a stem, riding a cool-blue ruler with a triangle under it (±35 px, 9 s); `Neutral 4,200 K` |
| Meetings / Next: Design review | (1000, 78), 1, middle | wine `#2a0716` → fire `#ff7a1f` | dots `14:30`; tall red lines sliding left, four brighter ones breathing; a small ring top right |
| Outside / Right now | (86, 172), 1.06, near | crimson `#d81f3f`, a dark heart, a hot floor | dots `19°`; a ruler of ticks (1 px every 4 px, a taller one every 20) with a yellow needle wandering; `Clear` |
| Focus / Score today | (806, 62), .98, near | dusk: grey `#343a44`, a warm band `#b5633c`, dark below | dots `2.4`; the same ruler and needle; `Deep work` |
| Daylight / Variability | (40, 512), 1.04, near | slate `#5b7a96` → ember `#b95e36`, a dark heart | a ring of 60 fine ticks and a wedge of nine longer yellow ones that sweeps; dots `40`; `Steady` |
| Sun vs screen / Share of your light | (606, 646), 1.04, near | olive `#4d5a0a` with a lime sun | `75%` in light 46 px type; a 2 px track, the filled part and a triangle in `#f3ff7a`; `Screen` … `Sun`; `Mostly daylight` |
| Glass plate (176×176, radius 44) | (1176, 214), near | white glass over the stage's corner (blur 18 px) | four round icons of our own: a clock on mint, a signal on gold, a spark on ember, a white dot on black with a violet rim. Under the glass each has a pool of its colour; the pools light in turn, clockwise, 1.6 s apart |
| App icon (150×150, radius 40) | (1200, 668), near | mint with drifting sky-blue and lemon lobes | a black disc with a lemon crescent and a small star |

Each tile cycles through three readings (for example Outside: 19° Clear, 21° Warm, 17° Breezy).

## Motion (one idea: depth)
- Every floating thing has a depth from 0 to 1 (far .16, middle .42–.55, near .78–1). One loop places them all: `x = pointerX × depth × 30 + sin(t × .34 + phase) × 5 × depth`, `y = pointerY × depth × 22 + cos(t × .42 + phase × 1.7) × 7 × depth`, with the pointer as −1…1 across the screen, eased (6/s under a real pointer, 2.4/s otherwise).
- Under each tile lies a blurred dark copy as its shadow (blur 14–26 px by depth). It slides the OTHER way: `x = −pointerX × depth × 16`, `y = 10 + depth × 20 − pointerY × depth × 12`.
- The stage itself moves 3 px, the photograph 9 px.
- With no pointer, an invisible one travels a slow path (`sin(t × .52) × .9`, `cos(t × .41) × .75`), so the depth shows by itself.
- **Coming forward**: the tile springs to scale 1.1 (520 ms, `cubic-bezier(.3,1.4,.5,1)`), its shadow grows to 1.16 and fades a little, it goes above the others. This happens on hover, on keyboard focus, and by itself: every 2.5 s the next tile in a fixed tour comes forward, 620 ms later its reading changes, at 1.75 s it goes back. Self-play is silent and pauses for 6 s after any press or key.
- A press dips the tile to .965 for 100 ms, changes its reading, and plays a soft two-note tap. On the wave tile the waves run fast and settle; on the bubbles they scatter and regroup; on the plate the next icon sinks and its colour floods the glass.
- Everything pauses off screen. With reduced motion nothing floats or plays by itself; hover, focus and press still work.

## Phone (under 700 px wide)
Recompose on a 390×844 board. The stage becomes the top: 366×348 at (12, 58), radius 26, the photograph filling it from the left, the copy at its lower left without the long line (headline 31 px, button 40 px high); only `Sign in` stays in the nav. Five tiles at scale .8 stand in two staggered columns over the stage's lower edge: right column Room light (216, 290), Movement (216, 470), Sun vs screen (216, 650); left column Outside (28, 420), Sleep (28, 606). They part a third as far as on the desktop.

## Type and colour
Inter Tight (300 for the big percentage, 500 body, 600 labels, 700 headline). Ink `#0b0b0c`, page `#e2e2e0`, stage `#030303`, the light `#ff2a1f`, needle and markers `#ffd94a`.
