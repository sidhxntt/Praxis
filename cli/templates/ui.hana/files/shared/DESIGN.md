# Hana · speaker and advisor hero

The first screen of Hana Okoye's site: a product leader who speaks and advises startups. A calm editorial portrait against a mint paper backdrop, and between her and the camera a tall panel of reeded (fluted) glass. The glass is the signature: it's rendered live as real refraction. Each flute is a small cylindrical lens, so wherever the panel passes, she breaks into soft, mirrored vertical strips with a highlight on every flute. The panel glides slowly across her face on its own and follows the pointer. The type is set in front of everything.

## Image (one photo, split into two plates)

Prompt (landscape, 1536×1024, gpt-image class model):
"Fashion editorial photograph of a woman in her thirties with a sleek low bun and small gold earrings, wearing a crisp white shirt, three-quarter view looking toward camera, standing in front of a seamless mint green paper backdrop, soft large window light from the right, natural skin texture, Kodak Portra 400 film look, subject on the right third, lots of empty mint backdrop on the left."

- Upscaled to 2560×1707 (Lanczos, then a gentle unsharp: 1.45 × image − 0.45 × 1.4px blur).
- `hana.webp`: the same full frame with alpha, a cut-out of her from a subject-lift mask (Apple Vision foreground instance), left soft so the edge carries a little of the mint (it then sits invisibly on the backdrop).
- `backdrop.webp`: the clean plate. Her silhouette, dilated by 20px, is filled by push-pull diffusion from the wall around it, blurred 18px (the paper is soft), then given film grain matched to the photo's own (per-channel standard deviation of its high-pass).
- Both are cover-fitted with the frame held at x 62%, y 10% (so her head keeps its room at 16:9). On a phone the photo is bottom-aligned in the lower 58% of the screen, her face at about 56% across, and the wall continues above it (edge clamp).

## Layers (back to front)

1. Backdrop (mint paper). Parallax: −4px drift, −7px under the pointer.
2. Her soft shadow on the wall: her alpha sampled 30px toward the light (right) and 10px up, at a very blurred mip (level 5), darkening the wall by up to 20%, only outside her.
3. Hana, the cut-out. Parallax: −11px drift, −18px under the pointer (she moves 2.5× the wall, so the planes part).
4. The reeded glass panel, full height, 20.5% of the width (180–340px), 14 flutes.
5. Grain (SVG fractal noise, 9%, multiply), then the type and UI. The copy moves +5px drift and +9px under the pointer, the opposite way to her.

The drift is a slow Lissajous (sin 0.42t, sin 0.31t + 1.1), the pointer offsets ease in at 2.4/s.

## The glass (one WebGL fragment shader, all in one pass)

Inside the panel, per pixel: u = fract((x − left) / fluteWidth), s = 2u − 1, slope n = s / √(1 − 0.8s²).
- Refraction: sample the scene at x − n · fluteWidth · 0.9. The middle of each flute sees straight through, its shoulders see far to the side, so every flute shows a compressed, mirrored strip.
- Blur: sample with mip bias 1.8 (mipmapped textures; WebGL2).
- Chromatic fringe: red sampled at +2.4n px, blue at −2.4n px, so the colour edge grows toward the grooves.
- Frost: mix 7.5% toward #f0fbf5. Grooves: darken 20% where |s| > 0.74; a 5% roundness on each flute's body.
- Specular line from the window on the right: exp(−((s − 0.46)/0.09)²) × 0.2, strongest at the top of the frame, fading downward, with a slow vertical modulation. A weaker line at s = −0.6.
- A reflection of the room's window fixed in space (a soft diagonal band at x + 0.42y = 0.83 × width, 110px sigma, +0.09). The panel slides through it, as glass would.
- Polished edges: a 1.2px bright line on the right edge (lit side), a darker 2.5px line and a thin highlight on the left edge.
Outside the panel: its shadow on the wall to its left (16%, 42px falloff), and faint bright caustic lines in the shadow, one per flute.
A gentle corner vignette (12%).

## Motion

- On its own the panel glides from 52% to 90% of the width and back on a sine, 11 s per round trip (`drift` scales the speed), timed so it crosses her face around 3–6 s after load. It never stops hard and never overshoots.
- The pointer takes it: the panel follows the pointer x (clamped to 46%–94%), and the hand-off weight eases in at 3.2/s, so taking it and giving it back is a glide. The panel itself follows its target with exponential smoothing (4.2/s): critically damped, no wobble.
- Touch: drag across the picture to move it. Keyboard: the panel is a slider (Tab, arrows ±8%, Home/End, Escape returns it to the glide), with a quiet tick per step.
- Entrance: the copy rises 14px and fades in, 1.1 s; the canvas fades in over 0.5 s once the photo is loaded.
- Reduced motion: no entrance, one still frame with the glass resting at 62% of its travel, across her cheek.

## Copy

- Nav: "Hana Okoye" · Talks · Advisory · Writing · [Book Hana]
- Eyebrow: "Product leader · Speaker"
- Headline: "I build teams / that *actually* ship."
- Line: "Ex-Spotify, ex-Monzo. Now advising seven startups on the hard part: getting things out the door."
- Buttons: [Book a talk] (Read the newsletter)
- On press: the label rolls up to "✓ Request sent", and the line "Hana replies within two days · next open date 12 March" fades in under it. Two soft sine notes (E6, B6, 60 ms, ≤ 0.028 gain). It resets after 2.4 s.
- Footer evidence: "● Next talk · Mind the Product, London · 14.03" (mono, the dot pulses).

## Type

- Inter Tight 500 for the headline: 84px at 1440 (5.84cqi, clamp 44–96px), line-height .98, tracking −0.05em. "actually" in Instrument Serif italic 400, tracking −0.02em.
- Inter Tight 16px / 1.5 for the line, 15px 500 for buttons, 14px 500 for nav, 18px 600 for the wordmark.
- JetBrains Mono 500: eyebrow 12px, tracking .14em, uppercase; footer 11px, .08em.

## Colour

- Mint paper #96b794 (wall average), ink #0e2b22 (text, primary button), hover #163d31.
- Ghost button: white 50% with a white 55% hairline.
- Glass frost #f0fbf5; highlights neutral white.

## Layout (1440×810; 1440×900 the same)

- Nav: 44px sides, 30px top; links sit just after the wordmark (on the wall, not over her hair); Book Hana on the right.
- Copy: left 56px, vertically centred (−46%), max 600px wide.
- Footer line: left 56px, bottom 34px.
- She fills the right 45%; the glass travels from the open wall beside the headline across her face to her far shoulder.

## Responsive (container queries)

- ≤ 1100px: nav links hidden, copy max 470px.
- ≤ 640px (phone): nav 20px sides; copy at the top (left/right 22px, top 84px), headline 42px, line 15px, buttons 14px; the footer line is hidden; the photo sits in the lower 58%; the glass is 30% of the width (min 96px) and glides from 20% to 80%.

## Engineering

- One WebGL context (WebGL2, WebGL1 fallback without the mip blur), DPR ≤ 2, one full-screen triangle strip, 7 texture reads per pixel inside the panel and 3 outside. Paused off screen (IntersectionObserver) and in hidden tabs; textures and program deleted on unmount.
- Without WebGL the two plates are shown as images, still and finished.
- Sound is silent until a user gesture, when `sound` is false, and when `<html data-cd-mute="1">`.
