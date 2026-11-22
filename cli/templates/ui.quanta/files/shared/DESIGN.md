# Quanta: fast reasoning model / inference API launch hero

Build the first screen of an AI lab launching a fast reasoning model (it works for any inference API). The speed is the scene: a ring of light made of thousands of particles orbits the live console. You sit low beside the ring, so its far side is a razor line on the horizon and its near side sweeps past the lens out of focus, in front of the console. The idea you feel: **press a prompt, the whole answer lands in a blink, and a bright bunch whips round the ring.** No pictures: everything is drawn in code.

## Stage (one colour, lit from the horizon)
`--tone: #1230d0` (cobalt) is a prop; every stage colour is mixed from it, so any brand colour works.
- Ground: `color-mix(in oklab, tone, #000 78%)`.
- Sky layer (4% larger than the hero, shifts with the pointer by 1.2% / 0.8%): a soft light where the ring meets the horizon, `radial-gradient(54% 17% at 50% 60%, mix(tone, #fff 38%), transparent)`, over `radial-gradient(92% 74% at 50% 66%, tone 0%, mix(tone, #000 22%) 40%, mix(tone, #000 56%) 74%, ground 100%)`.
- Film grain on top of everything (SVG fractal noise, overlay, 20%).
- Ink #f4f7ff, secondary `rgba(232,238,255,.72)`, live accent `#d4ff3a` (lime; a prop).

## The ring (two canvases: the far half behind the console, the near half in front of it)
A real perspective projection, not a drawn ellipse. World: a ring of radius 1 lying flat. Camera 2.25 radii from the centre and 0.31 radii above the plane, pitched down to look at the centre. Focal length = (the ring's half-width on screen) × 2.27; the half-width is 56% of the hero's width on desktop, so the ring is wider than the screen. The ring's centre sits at 64.5% of the hero's height. Points with z > 0 go to the back canvas, the rest to the front canvas (z-index above the console, `pointer-events: none`). Both use additive blending.

- **10,500 particles** (5,200 on a phone), seeded so the still frame never changes, in bands of (radius, width, share, brightness): (1.0, .003, 36%, 1) the razor core · (1.0, .03, 18%, .55) its halo · (.905, .011, 12%, .6) · (1.09, .016, 11%, .5) · (.79, .045, 8%, .32) · and a wide outer ring (2.5, .12, 15%, .62) that you sit inside: only its near half is drawn, so it passes right by the lens as giant soft discs.
- Each orbits at `0.34 rad/s × (tps/1240)^0.6 × radius^-1.5`. So the near side crosses the screen at about 500 px/s and the far side at 170.
- **Depth of field**: circle of confusion `0.009 × f × |1/z − 0.345|` px. In focus (under 1.9 px) a particle is a fine streak from where it was 24 ms ago to where it is (three brightness levels, widths 1 / 1.25 / 1.7 px). Out of focus it is a soft white disc stretched along its own path (a 64 px radial sprite drawn through a rotated, scaled transform), alpha `brightness × 1.5 / (1 + size²/3.2)`; 7% of the particles are 3.5–7.5× brighter, and those are the bokeh you notice.
- **Lines of light**: the ring itself is also stroked in 150 segments whose width grows as it nears the lens: a wide bloom (5% white), a narrower one (10%) and a thin core (34%). One more faint ring at radius 4.4 draws a horizon line behind the console. 420 dust points far beyond (radius 6–13) fill the sky.
- **Pointer**: the camera orbits ±4.3° and rises or sinks 0.05 radii, eased at 0.06 per frame, so the dust, the far side and the near side slide against each other.
- **A run**: the ring surges (speed ×2.7, decaying with τ 0.5 s) and a bunch of 640 accent-coloured particles is fired from the left side at 10.5 rad/s, slowing toward the ring's speed (τ 0.7 s) and fading over 4 s: a dense head, a long tail, a line of accent light along the ring behind the head and a glow on the head. It whips across the front of the console as the answer lands, goes round the back, and comes back slowly.
- On load the ring spins up 3.4× fast and settles over a second while it fades in.

## Layout (1440×900)
- **Nav** (24px / 40px): a tilted ellipse with a dot + "Quanta" (600, 19px); Models · API · Pricing · Research · Docs; "Sign in" right.
- **Centre column** (680px, from 92px down to just above the ring's near side): an eyebrow pill "● Quanta 3 is live in the API"; H1 "Frontier reasoning," / "at the speed of autocomplete." (Space Grotesk 500, `clamp(33px, 4.05cqi, 62px)`, line-height 1.02, tracking −.04em); copy "Quanta 3 thinks like the largest models and answers at 1,240 tokens a second, so agents, voice and search feel instant. It speaks the OpenAI API: change one line." (16.5px, 72%); white pill button "Get an API key →" (46px, text in the tone darkened 62%) + link "Read the benchmarks".
- **The console** (680px, radius 20, the ground colour at 70% with a 20px backdrop blur, 1px inner ring white 13%, a soft white light rising from its bottom edge as if the ring lit it): header "● Quanta 3" and, right, "Racing…" then "Answered 5.6× sooner" in the accent; the question with an accent "›"; the answer (15px/1.52); two lanes in JetBrains Mono 12px, each a name, a 4px track and a time: "Quanta 3 ━━━ 61 tokens · 0.23 s" (accent, glowing) and "Typical frontier model ━━ 34 of 61 tokens" → "61 tokens · 1.28 s"; four prompt chips (the current one white): Primes proof · Refund reply · Two-sum in O(n) · Blue sky.
- **Bottom left**: "● Live, per stream", the reading "1,245 tok/s" (46px, 500, tabular) and a trace of the last 28 readings as bars (newest in the accent).
- **Bottom right**: First token, p50 180 ms · Context 400k tokens · Per million tokens $0.60 in · $2.40 out · Uptime, 90 days 99.99%.

## The console's behaviour
- Answers are split into tokens (words; words over 7 letters in two). A run: 180 ms to first token, then tokens appear at `tps` (61 tokens in about 50 ms: three or four frames). Each token lands in the accent colour with a glow and cools to white over 750 ms, so the arrival is visible. When the last one lands the console's border flashes the accent for 900 ms.
- The second lane is a typical model: first token after 620 ms, then 92 tokens a second, counting "34 of 61 tokens" until it is done. Then the header says how many times sooner (total time ÷ total time).
- It runs once 0.9 s after it appears, then the next prompt every ~7 s (not while off screen, and not within 6.4 s of a click). Clicking a chip runs that prompt at once.
- The reading: `tps ×` a fixed list of 28 factors between 0.976 and 1.024, one every 1.1 s. Each digit is a column of 0–9 that slides to its value (700 ms, `cubic-bezier(.3,1.2,.4,1)`).
- Prompts and answers (real, correct): the proof that there are infinitely many primes; a reply to a customer who was charged twice (order 4417, $48.00 refunded, $10 credit); two-sum in O(n) with a hash map; why the sky is blue and sunsets red.

## Sound
WebAudio, created on the first click or key press, silent while `html[data-cd-mute="1"]`: a chip = one 40 ms triangle tap at 620 Hz (gain .05); the answer landing = five sine ticks inside 55 ms, rising from 1,900 Hz in 240 Hz steps (gain .03 each).

## Responsive
- Under 1160px: nav links and both bottom blocks go; the live reading moves into the console's header.
- Phone (≤ 640px): the headline wraps on three centred lines at 8.5cqi, one sentence of copy, the button and link, then the console anchored to the bottom (question on up to two lines, answer 13.5px, lanes stacked with the time on the right, chips in one scrolling row). The camera rises to 0.75 radii and the ring grows to 150% of the width, centred 318px above the bottom, so its far side arcs just above the console and its near side passes just under it.
- Short screens (≤ 800px tall): the second sentence of the copy goes; ≤ 700px: the copy goes.

## Reduced motion
One still frame of the ring with the bunch resting in front, a finished answer, both lanes full, nothing loops. Chips still swap the answer.
