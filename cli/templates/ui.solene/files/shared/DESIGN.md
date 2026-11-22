# Solène · thermal bath house, first screen

Build the first screen of a thermal bath house called Solène. It is one rounded photograph on a sage-grey page, with very little on it: a glass pill of four words, one quiet statement, one white button, three thin circles that touch, and the name set very large and very thin along the bottom, cut by the frame. The page is not a poster: the room in the photograph is alive.

## The photograph
One picture, landscape 3:2, about 1536 px wide, WebP under 300 KB. Generation prompt:

"Architectural interior photograph of an old thermal bath hall: a wide barrel-vaulted room of pale honey limestone with a single round oculus in the ceiling, placed left of centre. ONE soft shaft of warm sunlight falls from the oculus through thin steam onto still green-gold water, making a bright oval patch of light on the water left of centre. The pool fills the whole lower half of the frame, calm, with only a few faint ripples and soft reflections, dark jade and gold. On the far stone edge of the pool at the right side, small in the frame, a person wrapped in a thick white linen bathrobe with a towel around their hair sits with their back to the camera, feet in the water, looking toward the far wall. Arched niches in the far wall, worn stone steps on the right, drifting steam. Shot on a 24mm lens at eye level just above the water, natural light only, warm muted colours, soft contrast, fine film grain, real photograph, quiet. The lower third of the image is only calm water. No text, no logos, no candles, no other people, no border."

Note four places on it as fractions of its width and height, because the drawing sits on them: the oculus (0.215, 0.085), the shaft (from x 0.14–0.29 at the top to 0.16–0.31 at the water), where the light lands (0.228, 0.676), and the far edge of the pool (y 0.65 on the left, rising to 0.70 at the right edge).

## Layout (1440×900)
- Page: #bfc2b2. Ink for the small text on it: #2c3028.
- Two small lines above the picture, 12px, weight 400, the first line at 58% opacity: left "Thermal baths / Lyon, since 1896", right "Open daily, 7 to 23 / Rue des Sources 14".
- The picture: inset 29px left, right and bottom, 66px from the top, radius 29px. The photograph covers it; it is anchored near its top so the oculus stays in view. Over it two veils: 30% warm dark at the top fading out by 20%, 50% dark green at the bottom fading out by 40%.
- Top row, 36px inside the picture: the mark "SØ" at the left (28px, weight 300); in the middle a glass pill 52% wide and 48px high (white at 10%, a 1px white line at 40%, background blur 12px) holding BATHS · RITUALS · THE HOUSE · VISIT in 13px capitals, tracking 0.09em; at the right a 48px outlined circle with the pool's temperature, "36°".
- The statement, centred in the picture at 21% of its height, 36% wide, 27px, weight 300, line height 1.2, white with a soft warm shadow: "Warm water, slow light, / and nowhere to be. / Three hours that give you / the week back."
- The button, right, at 36% of the height: a white pill, ink text "BOOK A BATH", 14px, weight 500, tracking 0.08em.
- The name "solène" in lower-case along the bottom, centred, white, font size about 31% of the picture's width (433px), weight 150, so it spans about 84% of the width. Its baseline sits just under the picture's lower edge: the frame cuts the last tenth of the letters.
- Type: Outfit (variable, weights 100 to 500) for everything.

## The circles (an orrery)
Three 1px white circles at 56% opacity, centred on a point at 50% / 49% of the picture. The middle one has a radius of 23% of the picture's width. The two outer ones (radius 21%) touch it from the left and the right. A small four-point spark sits on each point of touch and a white dot 26px wide sits on the middle circle.
- The outer circles roll along the middle one: the right one swings between −17° and +15° in 17 s, the left one between 196° and 166° in 21 s, both ease-in-out, back and forth. The sparks ride with them and twinkle (scale 0.62 to 1.18 with a 45° turn, 3.4 s).
- The dot goes round the middle circle once in 24 s, linear.
- On load the middle circle draws itself once in 2.2 s (a conic mask from 0 to 360°).
- All of it leans a few pixels toward the pointer.

## The room (the signature motion)
1. **The shaft.** A soft body of light over the photograph's own shaft (a blurred trapezoid in the light colour #ffe7b8, blended as screen) that breathes between 16% and 62% opacity and sways about 1.7° each way, 5.6 s per breath. Inside it, on a small canvas (176×340, stretched, blended as screen): 84 short bright streaks falling at different speeds, flickering, and 9 soft blobs of steam climbing slowly and drifting sideways. The canvas fades out at its top and bottom.
2. **The rings.** Every 1.6 s a ring leaves the place where the light lands and the patch of light swells for a moment. A ring is an ellipse (the pool is seen almost from its surface: height is 10% of the width far away, up to 30% near) that grows to 43% of the picture's width in 5.6 s and fades; it is drawn as a light crest with a dark line just outside it, on a canvas that covers the water and is cut along the far edge of the pool. Every three seconds or so another drop falls somewhere else on the water. The whole surface also carries slow glints: bands of light worked out on a 176×44 grid and stretched, denser far away, brighter under the shaft.
3. **The name rides the water.** Each letter lifts and settles as a ring passes its place (up to 3% of the font size, a damped wave), and the part of each letter that stands in the water bends: the letter is cut into fourteen thin strips below 61% of its box and each strip slides sideways on a sine, more the lower it is and more while a ring is passing.
4. **Touch.** Moving the pointer over the water starts a small ring under it (at most three a second); a press starts a strong one with a soft drop sound. The photograph shifts a few pixels against the pointer and the circles a few pixels with it.

The first painted frame is the finished room; nothing fades in from black. Everything stops off screen and in a hidden tab. With reduced motion there are no loops: three rings stand on the water, and a press leaves one more.

## Phone (390×844)
The picture is the whole screen, with no margin and no round corners, cropped on the shaft of light (the oculus top left, the light landing left of centre; the seated figure is out of frame). Top row at 62px: "SØ" left, the round "36°" and a glass "MENU" key right; the pill of words is gone. The statement sits at 146px, 23px, 84% wide, centred; the button is centred under it at 284px. The middle circle grows to 44% of the width, so the sparks sit at the screen's edges. The name stays along the bottom at about 32% of the width per letter count, still cut by the edge. The two small lines above the picture are hidden.

## Colours
Page #bfc2b2 · ink #2c3028 · light #ffe7b8 (alternatives: rose #ffd3c4, jade #d9ffe6) · white type and lines · the ring's dark line rgba(14,34,26,.34).

## Sound
One short sine that falls from 620 to 250 Hz in 60 ms when the water is pressed, and one that rises when the button is pressed; quiet (peak gain 0.035). Nothing sounds by itself or before the visitor has interacted.
