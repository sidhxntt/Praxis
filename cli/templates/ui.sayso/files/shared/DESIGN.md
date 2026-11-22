# Sayso · the first screen of a product that builds a small app from one spoken sentence

Build ONE screen (a hero, no scrolling): an almost empty warm paper page with a single object in the middle, a red moulded device like a toy radio. The device is the page. Everything is drawn in CSS and SVG plus one small canvas; there are no pictures.

## The page (designed at 1440×900)
- Ground `#f0ebe4`. Over it one band of window light: a 78% wide, 170% tall strip, `linear-gradient(96deg, transparent 6%, rgba(255,253,248,.9) 34%, rgba(255,253,248,.78) 58%, transparent 86%)`, rotated 24°, blurred 34px, anchored top left. It drifts sideways about 6% of its width over 16 s, back and forth.
- Type: Inter Tight (500, 600, 700). Tiny labels in JetBrains Mono 500.
- Top left, 34px from the top and 44px from the side: the logo. A red speech bubble (rounded square with a small tail bottom left) holding three vertical bars of different heights cut out in the paper colour, then the word "sayso" in lower case, 25px, weight 700, tracking -0.045em, red.
- Top centre: a three-way switch, "Speak", "Gallery", "Your apps". Track `rgba(29,26,25,.06)`, radius 13px, 4px padding. Labels 13px weight 600, 62% ink. The chosen one sits on a red thumb (radius 10px) that slides between them on a spring (420 ms, `cubic-bezier(.3,1.35,.5,1)`) and turns its label white.
- Top right: "Sign in", 14px weight 600, 72% ink.
- Above the device, centred: one line, 21px weight 600, tracking -0.02em: "Say what you need." in ink `#1d1a19`, then "It builds the app." in 42% ink.
- Bottom, centred, 13px weight 500, 50% ink, 34px apart: Examples, Pricing, What's new, Questions, Help, Privacy, Terms.

## The device (348×516 at scale 1; on the page it is scaled to the room left: about 1.16 at 1440×900)
- Body: red `#ee2b1c`, radius 46px. It must read as moulded plastic: a thin bright inner edge on the top and left (`inset 0 2px 1.5px rgba(255,255,255,.38)`), a dark inner edge on the bottom and right (`inset 0 -4px 3px rgba(60,0,0,.26)`), a soft highlight in the top left corner (radial, white 26% to nothing), and a side wall made of three hard shadows 2.5, 5 and 7.5px below it in a darker red (the body colour mixed 66% with `#2a0500`).
- A soft shadow on the paper under and to the right of it (`rgba(86,32,16,.42)`, blurred 30px, offset 10px right and 22px down).
- Screen: 304×316, 22px from the top and sides, radius 30px, `linear-gradient(#f6f4f1, #f1eeea)`, set into the body with an inner shadow (`inset 0 3px 8px rgba(50,10,0,.24)`) and a faint light lip under it. A soft diagonal glare lies across it.
- On the screen, centred: the request in 25px weight 600, tracking -0.025em, grey `#8a8580`, two lines, with a 2.5px red caret after the last letter. At the bottom of the screen a tiny mono label (9.5px, tracking .16em, upper case, `#a09a93`) with a 5px dot before it.
- Speaker grill under the screen: 30 columns by 7 rows of punched holes, 9.6px apart, 2.5px radius, dark red (`rgba(48,0,0,.52)`), each with a hairline of light on its lower edge.
- Three keys in a row at the bottom, each 50px tall with radius 15px, each sitting on a 4px hard shadow so it has travel: a pale keyboard key (46px wide, `#f3f0ec`, keyboard icon), a wide white key (`#fbfaf8`) with a microphone icon and "Hold to speak" in 15px weight 600, and a dark send key (50px, `#2b2221`, white arrow up). Pressed, a key drops 3.5px and its hard shadow closes.

## The one motion: it listens and builds (it plays by itself, about 6.5 s a request)
1. Listen (about 1.7 s). The request types onto the screen one letter every 46 ms. The white key is down, its microphone turns red and its label reads "Listening"; the label on the screen reads "LISTENING" with a red dot. The grill is a level meter: each column is a bar that rises from the bottom row, fast up and slow down, with one hole held at its peak; lit holes run from hot red to warm white (`rgb(255,118,84)` to `rgb(255,246,236)`) with a faint glow around them.
2. Send (0.4 s). The dark key goes down; the request lifts 16px, shrinks to 94% and fades.
3. Build (1.65 s). The screen label reads "BUILDING" with a blinking ink dot. A tiny app assembles in six strokes, one every 210 ms, each rising 9px on a springy curve (`cubic-bezier(.3,1.45,.5,1)`).
4. Show (2.1 s). A ring of lit holes runs out from the middle of the grill. The label reads "BUILT IN 4 SECONDS" with a green dot. The app finishes itself: boxes tick, a bar fills, days light up, one after another every 380 ms.
5. Clear (0.44 s), then the next request.
While idle between steps a faint ring keeps leaving the middle of the grill (holes get shallower as it passes).

The four requests and their apps (all drawn with rounded rectangles, circles and short text; accents in the body colour):
- "A packing list that knows the weather": a white strip "Lisbon, Fri to Sun / 24° and clear" with a red dot, then four rows with a box: "Linen shirts, three", "Sunglasses", "A jacket for the evenings", and "Umbrella" struck through in grey with "NO RAIN" in mono at the right. The first two boxes tick themselves.
- "Track the water I drink today": "Water today", a 13px ring that draws to five eighths in red around "1.5" (38px, weight 700) and "of 2.4 litres", a row of eight small glasses (five red, a sixth fills itself), a dark pill "Add a glass".
- "Split the rent between the four of us": "Rent, December" and "€1,680", then four rows (Ines, Tomás, Wren, You) with a round initial, a thin bar and "€420"; three of the bars fill.
- "Tell me when the plants are thirsty": "Watering", "December", the letters M T W T F S S, four rows of seven rounded day squares, every third or fourth day turns red with a white dot, and a white strip "Next: Thursday" with "Fern and basil".

The device leans toward the pointer: up to 8° left and right and 6° up and down, with the perspective inside the transform (`perspective(1500px) rotateX() rotateY()`, no preserve-3d, so the type stays sharp). The corner highlight, the side wall, the glare on the screen and the shadow on the paper all shift with the lean. With no pointer it sways slowly on two sine waves.

## Interaction
- Press and hold the white key: step 1 runs for as long as it is held (no microphone is opened; the levels are made up). Letting go sends. Space or Enter held on the key does the same.
- The keyboard key and a tap on the screen type the next request without the grill (label "TYPING").
- The send key sends what is there, or clears a finished app.
- "Gallery" and "Your apps" move the thumb and show the next finished app straight away.
- After any touch, self-play waits 6 s before it carries on.
- Sound: a small rising blip when the key goes down, a tick per typed letter, a falling blip on send, two soft notes when the app is built. Quiet (peak 0.045), silent before the first user gesture and when the page is muted.

## Phone (390×844)
The logo and "Sign in" stay on the first row; the switch drops to a second row, centred. The line wraps into two (19px), the second half on its own line. The device is scaled to the width (about 0.89) and stays centred. The footer keeps the first four links.

## Reduced motion
Nothing plays by itself, the device does not lean, the light does not drift. The request is shown whole; pressing the white key shows the finished app at once.
