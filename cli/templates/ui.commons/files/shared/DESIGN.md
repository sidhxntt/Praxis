# Commons: a lawn seen from above

Build the first screen of "Commons", a guide to a city's parks, lawn by lawn. The page IS a lawn on a summer afternoon, seen from straight above and drawn as a flat, grainy editorial illustration. No photograph, no cut paper, no 3D. Over it lies a quiet white nav; the words sit in the shade of a tree that stands just outside the picture, bottom left. The afternoon goes on by itself from the first frame.

## The pictures

Twelve cut-outs with a transparent ground, generated as two sheets of six and split by connected alpha regions (then the outer half pixel of alpha is eroded so no pale fringe shows on the grass). Each is 200 to 600 px on its long side, WebP with alpha.

Style paragraph used for both sheets:

> Flat editorial vector illustration with a fine risograph grain texture, in the manner of a modern magazine illustration: simple flat colour shapes, no outlines, no gradients, no 3D, no paper, no drop shadows, no cast shadows. Limited palette: navy blue, cream white, tomato red, mustard yellow, sky blue, warm pink, and three skin tones, black and dark-brown hair. Every figure is seen from DIRECTLY ABOVE (bird's-eye view, as if from a drone looking straight down at people on a lawn), small simple faces or no faces, long simple limbs. Fully transparent background, a tidy 3 by 2 grid with wide gaps, nothing touching.

Sheet 1: a woman on her back reading a book held above her chest (tomato dress); a man asleep with an open newspaper over his face; someone cross-legged eating a sandwich, a thermos by the knee (mustard sweater); a cyclist on his back, hands behind his head, one knee up; a bicycle lying on its side (tomato frame); a white dog with a brown patch at full stretch.
Sheet 2: a badminton player lunging right, racket arm out; a second one reaching left; someone leaning back holding a kite spool, looking up (tomato jacket); a small child with both arms out (pink shirt, two pigtails); two friends facing each other playing cards; a sunbather face down with headphones (mustard shorts).

Everything else is drawn in code: the grass, the path, the blanket, the towel, the hat, the hoop, the ball, the shuttlecock, the kite and every shadow.

## Layers, back to front

1. Grass: flat `#a4c03a`. An SVG on top (viewBox 1600×1000, slice): five large flat ellipses a little lighter (grass mixed 18% with `#f3f08a`, 40% opacity), about 190 pairs of short blade strokes (grass mixed 30% with `#2a6a1a`, 1.5 px), about 50 daisies in loose groups (cream `#fbf6e6` dot, `#f0c23c` centre). All from one seeded generator so server and browser agree.
2. A gravel path across the bottom right corner: a 48 px cream band `#eadab0` with a darker rim `#d9c48d` and two rows of pebble dots. Box 30cqi × 33cqi anchored bottom right.
3. On the grass: a striped blanket (cream `#f6ecd6`, sky `#6fa5d8`, navy ends `#2c4a8a`, 10.4cqi wide, turned −8°) with a straw hat on its corner; a tomato towel with cream bands.
4. Ground shadows of the ball and the shuttlecock (flat discs in the cast colour).
5. The hoop: a tomato ring with cream dashes, 5cqi, under the child (so her arms are over it).
6. The eleven people. Each casts a HARD flat shadow down and to the left: `drop-shadow(-.4cqi .48cqi 0 cast)` where cast = grass mixed 44% with `#1b4a12`. The shadow is on the outer box and the turn on the inner one, so every shadow points the same way.
7. The dog, then the ball (a real button), then the shuttlecock.
8. The tree's shadow, `mix-blend-mode: multiply`, fill `#8db06a`, in a box 53% × 55% anchored bottom left. A solid mass inside a superellipse (exponent 3) whose corner is the tree, 40 overlapping blobs along its edge, two rings of loose dapples beyond it, and 16 white ellipses near the edge as holes of light (white is neutral under multiply). It lies over everything under the tree, people included.
9. Two cloud shadows: three soft radial gradients each, `rgba(38,84,22,.2)`, 56cqi wide.
10. The kite's shadow (a flat diamond, multiply), the string (1 px white line from the spool to the kite's lower tip), the kite (four flat quarters: tomato `#e4553a`, cream, mustard `#e9b53a`, navy, with a tail of three bows).
11. Grain over all of it: fractal noise, multiply, 55%.
12. The page.

Desktop positions (centre x%, y%, turn, width in cqi): reader 14.2, 31.5, −8°, 5.5 · eater 26, 45, 14°, 6 · player A 37.5, 27, 10.4 · player B 60.5, 23.5, 11.4 · cyclist 73.5, 27.5, 62°, 5.1 · bike 83.5, 19.5, −12°, 7.8 · kite flyer 89, 43, −18°, 4.7 · child 46, 50, 6.6 · card players 80.5, 68, −14°, 11.2 · sunbather 61, 80.5, 82°, 4.8 · sleeper 41, 66, −62°, 6.2 (in the shade).

## The page

Typeface Figtree (400 to 700). All text white except inside white pills, where it is `#1f4a1b`.

- Nav, 2.6cqi from the top, 4.4cqi from the sides: mark "C." (700, 1.95cqi) · links Parks, Today, Map (600, 1.06cqi, 4.2cqi apart) · pushed right: a white chip "Sunny until 19:40" with a pulsing yellow dot · a white search field, 23cqi wide, 1.5 px white border and a soft white ring, placeholder "Find a lawn near you", a magnifier at its right.
- Bottom left, in the shade: headline "Somewhere to lie down, / ten minutes from anywhere." (600, 2.72cqi, tracking −0.03em, line height 1.06) · lede "Every lawn in the city, with its shade, its crowd and its closing time. Pick a patch of grass and go." (500, 1.06cqi, 92% white) · white pill button "Open the map" with a dark round arrow.
- Footer row, 4.1% from the bottom: "Parco Sempione · east lawn" — hairline — "214 people here now" (the number is tabular and ticks) — hairline — "shade until 16:10". 600, 0.88cqi.

## Motion

Everything runs with no pointer, from the first frame. A `pace` number (0.6 to 1.6) scales all of it.

- Tree shadow: the mass turns ±0.4° in 9 s, the edge blobs ±1° in 6.4 s, the two rings of dapples ±1.8° in 4.9 s and 5.7 s the other way, the holes in 5.3 s, all about the bottom left corner, ease-in-out, alternating. The whole shadow also grows from 0.985 to 1.045 over 38 s and back (it creeps).
- Clouds: each crosses left to right in 18 s, linear; the second starts 9 s later, so one passes every 9 s.
- Kite: a figure of eight, x = sin(ωt)·6.5%, y = sin(2ωt + 0.6)·7.5%, period 12.5 s; it turns 16° ± 11°; its shadow follows 4.6cqi left and 6cqi down; the tail swings ±17° in 1.7 s; the flyer leans in held steps of 4°.
- Shuttlecock: 1.2 s each way between the two racket heads, on an arc 20% of the distance high (drawn higher, 1.3× bigger at the top, its shadow sliding on the grass). The hitter holds three poses (13°, 5°, 0°), the other winds up (−4°, −11°).
- Dog and ball, a loop of about 8 s: the child throws (poses −15°, 9°, 0°); the ball flies 1.45 s with three hops (heights 1, 0.36, 0.12 of 5.2cqi), spinning; the dog turns in 0.3 s, runs out at about 30cqi a second with a two-pose gallop at 7 Hz (stretch 1.04, gather 0.86), wags at the ball, turns, carries it back, the ball hops to her hand in 0.4 s, 1.25 s of wagging, then the next of three spots.
- Small lives: the hoop circles her waist every 0.9 s; the reader turns a page every 4.6 s (the right page folds over the spine); the sleeper's chest rises 3% every 4.2 s; the eater and the cyclist nod in held poses; two notes rise from the headphones.
- The count changes every 2.3 s by one or two.

Pointer: people within 8.5cqi of it turn 6° and grow 5% in two held steps. Press the ball (it is a button, with a wide hit area): it is thrown from wherever it is to the farthest of the three spots, with a soft pop (sine 540 → 230 Hz, 130 ms; silent before a gesture and when the page is muted), and the dog goes after it. The child's own throws wait six seconds after a press or a key.

Paused off screen and in a hidden tab. Reduced motion: one finished frame, nothing loops; pressing the ball still moves the ball and the dog, at once.

## Phone (390 × 844)

A tall crop of the same lawn with six of the people: the two players across the top (30 and 33cqi wide), the reader on her blanket at the left, the child with her hoop and the dog at the right, the sleeper lying across under the blanket, the kite flyer at the right edge with the kite over the middle. No path, no cyclist, no card players, no sunbather. The shade lies across the whole bottom (126% × 45%) with the headline (7.3cqi), the lede, the button and the first two footer labels in it. The nav is the mark, the chip and a round white search key that opens into a field when focused.
