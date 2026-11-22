# Furrow · field intelligence hero

The first screen of a product that reads a farm every morning (drones, soil probes, satellites) and tells the grower which zone needs them today. One screen, no scroll. Cream page, a slim nav, one sentence, and under it a very large rounded aerial photograph of fields seen from straight above with a white survey grid over it, six coloured sensors standing in the fields, a white panel at its left edge and one white alert card. The page surveys the farm by itself: a line of light sweeps the fields and everything on the screen answers the sensor it has just passed.

Not a dashboard in a card: the photograph is the page. Everything white floats on it.

## Image (one)

`fields.webp`, 1440×960, landscape. Prompt (gpt-image class model):

"Straight-down aerial drone photograph (true nadir, camera pointing vertically at the ground, no horizon) of a patchwork of irregular green crop fields in late-morning sun: about nine fields of young wheat, rice and lush grass in slightly different greens, some with fine parallel planting rows running in different directions, divided by narrow pale earth paths and low grassy banks, and one pale gravel farm track curving through the lower right corner. Rich saturated natural greens, crisp fine detail of rows and plants, soft short shadows, real photograph taken from 120 metres with a 24mm lens, slight natural colour variation, no buildings, no vehicles, no people, no text, no labels, no border, no overlay graphics."

It must look like a real photograph. Reject anything with a horizon, buildings, painted-looking grass or garbled marks. Export as WebP around quality 60 (the fine rows are heavy; keep it under 300 KB).

## Layout at 1440×900

A column: nav (64px), the sentence band, then the photograph filling the rest.

1. **Nav**, padding 0 28px. Left: a 28px dark olive rounded square (radius 9) holding three short lime strokes that lean like furrows, then the wordmark "Furrow" (17px, 600). Centre: Surveys, Sensors, Pricing, Field notes (14px, #3c4130, 30px apart). Right: "Sign in" and a small dark olive button "SEE YOUR FARM".
2. **The sentence band**, padding 10px 28px 22px, two blocks pushed apart and aligned to the bottom.
   - Left: a lime tag "FIELD INTELLIGENCE" (mono 10.5px, tracking .1em, radius 5, padding 4px 8px), then the headline in two lines, 50px, weight 400, tracking -.035em, line-height 1.02: "Know every field" in ink, "before you walk it." in a muted olive (#5c6348).
   - Right, 400px wide: "Furrow reads your drones, probes and satellites before breakfast and names the zone that needs you today." (15.5px, line-height 1.42, #3c4130). Under it the primary button "SEE YOUR FARM" (44px tall) and a text link "Watch a survey" with a small arrow.
3. **The photograph**: margin 0 24px 16px, radius 26, clipped. Layers, back to front:
   - the picture, 12px larger than the frame on every side so it can move;
   - a soft dark wash at the very top and bottom (10–12% black);
   - the survey grid: 1px white lines at 26% opacity, 116px squares. The grid does not move;
   - the line of light (see Motion);
   - six sensors and the alert card. They move with the picture;
   - map keys: a white pill of three 32px keys at the top, just right of the panel (grid on/off, sensors on/off, pause/run), and a white pill with minus and plus at the top right;
   - the panel: white, radius 16, 300px wide, 16px from the frame's left, top and bottom.

### The panel
A 46px rail (the mark, four small icons, the first one on a pale chip, initials "MO" in a pale green circle at the bottom), then:
- "Morning survey" (14.5px, 500) and "North block · 212 ha" (11.5px grey). Three mono chips: ZONE (lime), SOIL, WATER (pale grey). A line with a small calendar: "Flown **Thu 20 Nov, 06:40**".
- A hairline. "Soil health" with the zone's name under it; at the right the score, 22px, with a small "/100".
- The radar chart: a pentagon of four rings and five spokes in hairlines (ink at 11%), axis names in small grey type: Nitrogen (top), Moisture, Organic, pH, Structure (clockwise). Two shapes: last month in pink (#e56cd0, fill 20%), this month in blue (#2aa5e6, fill 22%, on top).
- A legend: "Last month", "This month" with small square swatches.
- A hairline. The table: mono header ZONE / HA / SCORE, then six rows 28px tall with a small coloured square, the name, hectares and score in mono. The row being read has a lime ground.
- A footer line: "Next flight" and "Fri 21 Nov, 06:30".

### The six zones
Name, hectares, colour, position on the picture (percent of the frame, x then y), finding, two chips, this month's five readings (nitrogen, moisture, organic, pH, structure), last month's:

| Zone | ha | Colour | x, y | Finding | Chips | Now | Then |
|---|---|---|---|---|---|---|---|
| Long Acre | 41 | #3ecbf0 | 35, 42 | Nitrogen is running low in the north half. | N 38 kg/ha · Feed by Sat | 34 72 66 81 70 | 58 64 61 78 66 |
| Mill Bank | 28 | #7a74f7 | 43, 85 | A dry band along the east hedge. | Moisture 19% · Water tonight | 71 29 58 74 62 | 69 55 57 73 64 |
| Heron Strip | 17 | #ea6cf2 | 54, 11 | Rust on about 3% of leaves, still early. | Leaf scan 3% · Scout Friday | 77 68 49 62 80 | 74 70 60 70 79 |
| Top Sixteen | 52 | #f5c13d | 69, 79 | Even growth. Ready to cut in four days. | Height 61 cm · Cut Monday | 86 78 82 88 84 | 72 70 77 85 80 |
| Quarry Piece | 33 | #f2885c | 81, 12 | Ground is tight by the gate after the trailers. | Structure 31 · Subsoil here | 64 59 55 70 31 | 66 60 57 71 52 |
| Brook Side | 41 | #e0482f | 90, 48 | Still waterlogged from Tuesday's rain. | Moisture 94% · Keep off | 52 96 63 57 44 | 60 71 64 66 58 |

A zone's score is the mean of its five readings, rounded. Put each sensor inside a field, never on a path.

### A sensor
A 16px disc of the zone's colour with a 5px halo of the same colour at 30% and a soft glow. The one being read grows to 1.3 and gets a 2.5px white ring. Hit area 36px.

### The alert card
White, radius 16, 248px wide, padding 14px, a deep soft shadow. Mono header "FIELD ALERT" with a small four-square glyph and, at the right, a pale chip "Read 06:41". The zone's name (17px, 500) after a small square of its colour. The finding (13px grey). Two outlined mono chips. A full-width dark olive button "PLAN THE FIX" (36px). It stands 22px to the right of its sensor, roughly centred on it, on the left side when the sensor is in the right third, and never leaves the frame.

## Type and colour

- Geist 400/500/600 for everything read; Geist Mono 400/500, uppercase with tracking .08–.1em, for tags, chips, keys and buttons. No serif.
- Cream #f1efe2, ink #171b10, dark olive #2f3a1c (buttons, mark), lime #e4f36a (tag, lit row, the line of light, the done state), muted text #6b6f5e and #8b8e7e, hairlines #eeefe6, white for everything that floats. The six sensor colours and the chart's pink and blue are the only other colours.

## Motion (one idea: the survey)

- **The sweep.** A 3px near-white vertical line with a lime glow travels from the panel's edge to the right edge in 10 seconds, linear, fading in and out over the first and last 5%, then starts again after a short gap. Behind it trails a 240px strip of lime that fades to nothing, the land it has just read.
- **A reading.** When the line crosses a sensor's x: a ring grows out of the sensor (1 → 4.6, 1.1s, fading); the alert card travels to that sensor (left and top, 720ms, `cubic-bezier(.3,1.36,.46,1)`, so it overshoots a little as it lands) and its lines come in again one after another (6px up, 420ms, 40ms apart); the chart's two shapes travel to the zone's readings (720ms with a small overshoot) and the score counts; the zone's row takes the lime ground (350ms).
- **Depth.** The picture, the sensors and the card drift together a few pixels (a slow figure, about ±4px) while the grid stays still; under the pointer they move against it by up to 7px.
- **By hand.** Pointing at a sensor reads it and the sweep waits (dimmed) until the pointer leaves; clicking a sensor or a table row reads it and the sweep waits six seconds. Plus and minus zoom the picture (1, 1.08, 1.16; sensors and card keep their size). The grid key and the sensor key hide and show their layer; the third key pauses the sweep.
- **The button.** "PLAN THE FIX" slides up and out, "ADDED TO TODAY" with a tick slides in on a lime button; in a demo it returns after 1.9s. Once per sweep the page presses it by itself at the fourth zone.
- **Entrance.** Tag and headline rise 14px (600–700ms), the photograph rises 22px (900ms), the panel slides in from the left (800ms, after 250ms).
- **Sound.** A 30ms tick when a visitor reads a sensor, two short notes when they plan a fix. The sweep itself is silent.
- **Reduced motion.** No sweep, no drift, no entrance: one finished frame with Heron Strip read. Pointing and pressing still work, without travel.
- Everything pauses when the hero is off screen or the tab is hidden.

## Shorter and narrower screens

- When the photograph gets shorter the panel sheds lines in this order: the footer, the date line (and rows go to 25px), the chart shrinks to 78% wide, the chips, the legend and the table header, then the chart to 58%.
- Under 1180px wide: the centre links go, the headline is 40px, the rail goes and the panel is 254px.
- **Phone (390×844).** Nav: mark, wordmark and the small button. The tag, the headline at 31px and the line stack; the primary button is only in the nav. The photograph takes the rest of the screen (10px margins, radius 22) with a 78px grid, the three map keys at its top left and no zoom keys. The panel becomes a white sheet across the bottom of the photograph (radius 20 at the top): the chart at the left, "Soil health", the zone's name, a 30px score and the legend at its right, then two rows only, the one being read (lime) and the next. The sensors move to the part of the picture above the sheet (x, y in percent: 11, 43 · 30, 57 · 39, 15 · 63, 41 · 80, 12 · 88, 53). The alert card is 198px wide, without the two chips, and stands under a sensor in the top quarter, over one lower down.
