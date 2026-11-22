# Alpina · night-train hero

The first screen of a night-train company running sleepers from Zurich to Venice through the Alps. The picture is a real place at sunrise: a curved stone viaduct high over a gorge, snow peaks lit pink behind, mist lying in the valley and a village with a white church far below. It is alive, like footage: the red train really travels across the viaduct, car by car, getting larger as it comes towards you and slipping behind the trees at both ends so the loop never shows; mist rolls through the valley, wisps of cloud drift on the peaks, shafts of low sun fan across the valley, and the scene is built in planes that part slowly on their own and more under the pointer. The one piece of product UI is the booking pill: pick a departure and the fare updates, Book holds the cabin.

## Images (one generated plate, three files cut from it)

Plate prompt (landscape, 1536×1024, gpt-image class model):
"Golden-hour aerial photograph of a curved stone railway viaduct high over a forested Alpine gorge, a red Swiss electric train (locomotive and three red coaches) crossing it, snow-capped peaks lit pink and gold behind under a clear blue sky, the sun rising at the far left horizon with a warm peach glow, a green valley with a village and white church far below on the left with low mist lying in it, a river, conifers in the foreground lower left, a sunlit limestone cliff at the right. 35 mm, drone height, crisp, natural colour, Kodak Portra warmth, real photography. Open sky in the upper left third for a headline. No text, no logos."

Then the same photo edited to remove the train (an image-edit pass: "remove the red train from the viaduct so the empty track, parapet and overhead line continue along the curve, keep everything else identical"). The two are pixel-aligned (phase correlation < 0.2 px).

- `plate.webp`: the empty plate, Lanczos ×1.875 to 2880×1920, unsharp 1.4px 45%, cwebp q86.
- `train.webp` (1387×415, alpha): the train lifted out of the ORIGINAL photo (Apple Vision subject lift on a 4× crop), so its light and grain are the plate's own. It sits at plate (960.5, 492.75) at 4 sprite px per plate px.
- `fg.webp` (1312×1151, alpha): plate pixels cut with painted masks (zones × a foliage key: HSV saturation > .38, hue 35–110°). Rows 0–617 = things at viaduct depth that stand in front of the track (the trees where the track enters the forest at the hairpin, the catenary pole at x 773); rows 618–1150 = the near trees and rock lower left (plate 560–1260 × 740–1024).
- `masks.webp` (768×512): R = depth (0 sky and peaks, 1 everything nearer, feathered 14px), G = where mist may live (five soft ellipses along the valley floor and the slope), B = where cloud may live (two ellipses on the peaks, one on the far ridge).

## Layers (back to front)

1. **Still**: the plate as a CSS background (shown until WebGL draws, kept if WebGL is missing).
2. **WebGL canvas** (one WebGL1 context, DPR ≤ 2, paused off screen). The plate is mapped like `cover` ×1.06 overscan (phone ×1.08, focus x .68 on the viaduct). Fragment shader, ≤ 8 texture reads in any pixel:
   - Parallax: plate uv shifted by mix(far, mid, depth).
   - Mist: fbm of a 256² 4-channel value-noise texture (16 smooth quintic cells per repeat, one octave per channel at ×1, 2.03, 4.11, 8.27), q = (u·.32 − .0034t, v·1.05), domain-warped by one coarse tap, `smoothstep(.38,.68)` × G × .82, colour from cool (.82,.85,.89) to sunlit (1,.92,.82) towards the sun.
   - Cloud: the same at q = (u·.38 + .0026t, v·1.5), `smoothstep(.40,.66)` × B × .78, colour (1,.95,.93).
   - Sun shafts: two taps of the noise along the angle from the sun (−.02, .33), `smoothstep(.48,.82)` × exp(−2.1·dist) below the sun line, + rgb(1,.76,.46) × .2; the sun glow breathes (.09 ± .035, sin .45t).
3. **Train canvas** (2D, DPR ≤ 2). The track is a Catmull-Rom line of 31 hand-placed plate points under the train's near side, each with g (plate px per metre: 6.8 at the near end → 2.3 on the hairpin) and h (train height px: 52 → 25). Distances are integrated in metres, so the train slows and shrinks as it goes away. Each car (locomotive + 7 coaches cycling the three coach cut-outs, 166 m) is cut into 8 vertical strips; each strip is drawn with its own affine matrix that maps its source baseline (where it sat in the photo) and vertical onto the track chord and the local height. Speed 11 m/s × `speed`; trains follow 60 m apart; at 3 s after mount the locomotive sits exactly where the photo had it. Two warm headlamp glows (`lighter`). Then the viaduct-depth occluders from fg.webp.
4. **Near trees** (fg.webp lower part, DOM layer).
5. **Shade** (top 36% → 0 at 42%, bottom 42% dark) and a 9% multiply grain.
6. **Copy, pill, nav.**

Parallax (px at 1440, eased with 1 − e^(−2.6dt)): far 3/2, mid 12/6, near trees 30/12, headline −10/−5 (moves the other way). Ambient dolly with no pointer: x = .42 sin .39t + .18 sin(.17t + 1.3), y = .3 sin(.27t + .6); with a pointer, 85% pointer + 35% dolly.

## Copy

Nav: mountain mark + "Alpina" · Routes · Cabins · Dining · white pill "Book a cabin". Headline "Sleep through / the Alps." Line: "Zurich to Venice overnight. Board at 21:40, wake up at the lagoon." Pill: "Zurich → Venice" | "Fri 14 Mar ⌄" | "Sleeper for 2 · €340" | red "Book" → "✓ Held". Departures (popover above the pill, "Departures · 21:40 from Zürich HB"): Thu 13 €310 4 left · Fri 14 €340 2 left · Sat 15 €385 1 left (red) · Sun 16 €295 6 left · Mon 17 €260 9 left · Tue 18 €260 8 left · Wed 19 €275 7 left.

## Type and colour

Headline **Archivo** 800 at wdth 72, `clamp(56px, 9.17cqi, 140px)` (132px at 1440), line-height .86, uppercase, word-spacing .08em, a soft drop-shadow filter. UI **Inter Tight** 400–600: logo 18/600, nav 14/500, line 17/1.45, pill 14, day chips 11/19/12/10. White on the picture; pill ink #1a1208 on #fff; accent signal red #d4321c (Book, low-seat count, focus ring); selected day #1a1208.

## Layout

1440×810 is the composition: nav 30px from the top, 44px sides; headline at 56/150 over the sky; line 20px below (max 420px); pill 56px left, 44px from the bottom. The viaduct and train fill the centre right. Phone (≤ 640px container): the picture re-framed on the viaduct, headline 17.4cqi in three lines at top 96px, the pill becomes a card (route, date | fare, full-width Book), the departures scroll sideways.

## Motion timings

Entrance (done by 1.5 s): headline lines rise out of masks 1.05 s cubic-bezier(.16,.84,.24,1) at .15/.27 s; nav fades .1 s; line .5 s; pill rises .45 s. Popover pops .32 s cubic-bezier(.3,1.3,.5,1); the fare rolls in .42 s; Book flips to Held .36 s and resets after 2.2 s. Sounds: a 620 Hz tick on open, an 880→1320 Hz triangle blip on pick, a 659 + 988 Hz two-note chime on Book (≤ 60 ms each, peak ≤ .04).

Reduced motion: no entrance, the train stands where the photo has it, nothing drifts.
