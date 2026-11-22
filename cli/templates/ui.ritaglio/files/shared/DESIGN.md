# Ritaglio: a paper-cut animation studio, first screen

Build the first screen of "Ritaglio", a stop-motion studio in Bologna that cuts its films out of paper. One screen, no scroll. A black field with an oval tag, two huge words and a button; beside it, the film on the table right now, a swimming pool made of cut paper whose loose pieces move in stop-motion and can be picked up.

## The pictures (all hand-cut paper collage, felt-like matte paper, visible fibres, uneven scissor edges, small soft shadows between layers, naive children's-book figures with very simple faces, flat colours)

1. `pool.webp` (portrait 2:3, 1024 px wide): "Top-down view of an outdoor swimming pool made entirely as a hand-cut paper collage, photographed flat from directly above in soft even daylight. A large sheet of matte turquoise-blue paper is the water and fills the frame. A few short wavy strips of lighter blue paper as ripples near the edges; one lane rope straight across the lower third made of alternating tomato-red and cream paper discs; along the top edge a band of pale butter-yellow paper cut into square tiles; a small red-and-cream striped paper towel on the tiles top right. No people, no text. The middle of the water is empty."
2. Six loose pieces, generated together on a TRANSPARENT background in a 3 by 2 grid with wide gaps, then cut apart into separate transparent files: `swimmer` (front crawl, body horizontal pointing left, red-and-cream striped swimsuit, yellow cap), `floater` (on her back, arms wide, pink cap, navy swimsuit), `diver` (upright, both arms straight up, mint swimsuit, red cap), `ball` (beach ball, red, yellow, cream), `ring` (red-and-cream lifebuoy), `umbrella` (sun umbrella from above, yellow and cream).
3. Three 360 px square stills for the film list: `lido` (a crop of the pool with swimmer, ball, ring on it), `market` (night market: navy sheet, two rows of paper lanterns, three stalls with striped awnings, figures with baskets, a cream crescent moon), `parade` (five children on paper bicycles on butter yellow, bunting, one cream flag).

## Layout at 1440 × 900

- Ground #0e0d0c. Right 40% of the width, full height: the pool sheet (object-fit cover, anchored to the top). Left 60%: the black field, padding 3.3% of the width.
- Pieces on the sheet, centre in % of the sheet and width in % of its width: umbrella 21/10.5 w37, diver 70/18.5 w12.5 (standing on the tile edge), swimmer 50/38.5 w47, floater 29/62 w45, ball 77/60 w25, ring 70/89 w29 (below the rope). Bottom left of the sheet, a cream paper label turned −2°: **LIDO** · FRAME 0031 · 12 FPS, the number counting every pose.
- Nav (86 px): a tomato square turned −6° + "Ritaglio" (Archivo 800, width 125, 18 px); links Films, Workshop, Studio (13 px, cream 60%); outlined pill "Commission a film".
- Middle, left aligned: a tomato (#e9462f) ellipse turned −4° with two centred lines "PAPER-CUT / ANIMATION STUDIO" (Archivo 600 width 125, 12 px, +5% tracking, cream). Under it the headline, two lines: "paper" / "Moves" in Archivo 900 at width 125, 178 px, line-height .92, tracking −3.5%, cream #f3ecdc. A butter-yellow (#f5c63c) six-arm asterisk, 60 px, floats at the headline's top right.
- Under the headline, one row: "A stop-motion studio in Bologna. Every film is cut from paper and moved by hand, twelve frames a second." (17 px / 1.42, cream 78%, max 430 px) and the button: cream pill, black text "▶ Watch the reel" (Archivo 700 width 125, 15 px).
- Bottom strip, hairline on top (cream 16%), three columns divided by hairlines: a 63 px square still turned −2° / +1.5°, then a yellow number (01, 02, 03), a title (Archivo 700 width 125, 14 px) and a grey line: Lido, "4 min · on the table now"; Night market, "7 min · 2025"; The parade, "11 min · 2024".
- Behind everything on the black, a giant asterisk in #161513 (490 px) bleeding off the bottom right of the field.

One typeface only: Archivo (variable, width 62–125, weight 400–900). Small text at normal width, everything loud at width 125.

## Motion: stop-motion, never a glide

A clock ticks 12 times a second (prop `fps`, 6–14). On every tick each piece is PUT at a new place and held; there are no transitions on the pieces. Poses are held for two ticks ("on twos").

- Swimmer: lengths. 60 ticks across (22% of the sheet width each side of the middle), body rocking ±3° and ±0.45% every stroke, a 12-tick pause at the wall in which it flips, 60 ticks back.
- Diver: every 48 ticks a hop of 8 poses (up to 3.6% of the width, with a small lean).
- Floater: drifts a little and turns 2.5° every third tick. Lifebuoy: −4° every third tick. Umbrella: sways ±3°. Ball: bobs and turns 6° per pose.
- The performance, every 16 s: the ball is lifted (4 ticks: scale to 1.06, its shadow goes from 1 px / 1.4 px / blur 0.7 to 6 px / 10 px / blur 7), carried 14% to the left in 12 steps, put down; later carried back.
- Shadows are `drop-shadow` on a wrapper that is only translated; the picture inside it is rotated and flipped, so the light always comes from the top left.
- The pointer is a hand: the piece under it lifts; drag it and it follows, read once a tick (stepped), and it stays where you put it. A paper tap (45 ms of band-passed noise, peak 0.045) when it lands. After 6 quiet seconds it is lifted and stepped back home, and the performance resumes.
- The asterisk turns 30° every 0.4 s (`steps(12)`, 4.8 s a turn). The headline arrives once: each letter falls 0.5 em with its own slant (−9°…+10°) in 5 held steps over 0.42 s, 85 ms apart.
- Paused off screen and in a hidden tab. Reduced motion: one finished frame, no entrance; pieces can still be lifted and moved (changes show at once).
- Keyboard: every piece is a button ("Move the beach ball"); focus lifts it and shows a dashed box, arrows move it 3%, Enter or Space makes it hop.

## Phone (390 × 844)

Nav 58 px (brand + the outlined pill, links hidden). The sheet lies across the full width under it, 332 px tall, anchored to the top (tiles visible), pieces re-laid for a wide sheet: umbrella 14/22 w24, diver 84/30 w7.5, swimmer 50/49 w31 (lane ±30%), floater 20/72 w29, ball 73/77 w15, ring 91/80 w17; the label moves to the bottom right. The tag overlaps the sheet's bottom edge on the left. Headline 80 px with the asterisk beside "paper"; the line, then the button, stacked; one film row (01 Lido) under a hairline.

## Colours

Black #0e0d0c · cream #f3ecdc · tomato #e9462f · butter #f5c63c · pool #1fa5ba · watermark #161513.
