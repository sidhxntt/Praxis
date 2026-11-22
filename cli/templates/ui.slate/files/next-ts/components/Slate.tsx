"use client";

/**
 * SLATE · website hero
 *
 * The first screen of an architecture studio showing one house. A long, low
 * house of dark timber stands on black rock above a fjord, one corner of
 * glass lit from inside, under a heavy sky with a single break of light. The
 * house's name is set very large across the sky BEHIND the house, so the
 * roof cuts into the letters, and a script word lies in front of the roof.
 *
 * The page is weather and depth. The picture is three layers (sky, name,
 * house) and the camera never stands still: it drifts sideways on a slow
 * loop, so the name slides behind the roof. Cloud moves across the sky, mist
 * crosses the mountain, a band of light travels over the rock and the glass
 * corner glows as it passes, and a thin rain falls in front of everything.
 * Three points on the house pulse in turn; a glass card springs from one to
 * the next, draws its hairline and rewrites itself.
 *
 * One file, React only. The typefaces come from Google Fonts (loaded in the CSS).
 *
 *   <Slate />
 *   <Slate word="FJELL" weather={1.5} onCta={() => openBrief()} />
 *
 * Props
 *   brand      the studio's name                           "Nordhus"
 *   word       the house's name, set behind the house      "SLATE"
 *   script     the word written in front of the roof       "house"
 *   cta        the action at the top right                 "Start a house"
 *   house      the house and its ground, cut out (alpha)   "/design/websites/slate/house.webp"
 *   sky        the sky, the mountain and the water         "/design/websites/slate/sky.webp"
 *   clouds     a strip of cloud that tiles sideways        "/design/websites/slate/clouds.webp"
 *   tone       the colour of the type                      "#efe6d6"
 *   weather    how fast the weather moves (1 = calm storm) 1
 *   rain       a thin rain in front of the picture         true
 *   autoplay   the card walks the three points by itself   true
 *   sound      a tick when you choose a point              true
 *   onCta      called when the action is pressed
 *
 * Fills its container's width; height is var(--design-h, 100svh), never under
 * 640px. Responsive by container query: on a phone the house fills the lower
 * two thirds, the name runs behind its roof at a size that fits, and the card
 * is a sheet at the bottom.
 * The pointer moves the camera. Point at a hotspot (or Tab to it) and the card
 * stays there; the walk starts again six seconds after you leave.
 * Keyboard: each hotspot is a button; on one, the arrow keys step to the next.
 * Everything pauses off screen and in a hidden tab.
 * Reduced motion: one finished frame, no drift, no weather; the hotspots
 * still work, without travel.
 * Sound: silent until the visitor interacts, when `sound` is false, and when
 * <html data-cd-mute="1">. The walk itself never makes a sound.
 */

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

type Props = {
  brand?: string;
  word?: string;
  script?: string;
  cta?: string;
  house?: string;
  sky?: string;
  clouds?: string;
  tone?: string;
  weather?: number;
  rain?: boolean;
  autoplay?: boolean;
  sound?: boolean;
  onCta?: () => void;
};

/** A point on the house. fx/fy: where it is on the house picture (0 to 1); mx/my: the same on a phone. */
type Spot = {
  name: string;
  line: string;
  fx: number;
  fy: number;
  mx: number;
  my: number;
  /** the card's top left corner on the 1440×900 scene */
  cx: number;
  cy: number;
  /** where the hairline meets the card: its top edge, or its right edge this far down */
  join: "top" | number;
};

const SPOTS: Spot[] = [
  { name: "The roof", line: "One plane of slate, pitched four degrees to shed the wind.", fx: 0.456, fy: 0.43, mx: 0.66, my: 0.379, cx: 352, cy: 496, join: "top" },
  { name: "The glass corner", line: "It faces south-west, the one side the storm rarely comes from.", fx: 0.749, fy: 0.547, mx: 0.749, my: 0.547, cx: 690, cy: 566, join: 46 },
  { name: "The stilts", line: "Nine steel legs. No rock was blasted to stand it here.", fx: 0.702, fy: 0.722, mx: 0.702, my: 0.692, cx: 628, cy: 470, join: 152 },
];
const FACTS: [string, string][] = [
  ["Studio", "Nordhus architects"],
  ["Architects", "Ingrid Vaa, Tomás Reyes"],
  ["Place", "Lofoten, Norway"],
  ["Area", "164 m²"],
  ["Year", "2024"],
  ["Type", "Private house"],
];
const NAV = ["Home", "Studio", "Houses", "Journal", "Fees"];
const CARD_W = 352;
/* the house picture on the 1440×900 scene: 108% wide, 3:2, hanging 12% under the bottom edge */
const FG = { x: -57.6, y: -28.8, w: 1555.2, h: 1036.8 };
const r1 = (n: number) => Math.round(n * 10) / 10;

/* ------------------------------------------------------------------ sound
   A tiny synthesized tick, made in the browser. Silent when `sound` is false,
   when <html data-cd-mute="1">, and until the visitor has interacted.
   Delete this hook and its calls to make the page silent. */
type Blip = { f: number; to?: number; d?: number; g?: number; type?: OscillatorType; at?: number };
function useBlip(on: boolean) {
  const ctx = useRef<AudioContext | null>(null);
  useEffect(() => () => void ctx.current?.close().catch(() => {}), []);
  return useCallback(
    (b: Blip) => {
      if (!on || typeof window === "undefined") return;
      if (document.documentElement.dataset.cdMute === "1") return;
      const ua = (navigator as unknown as { userActivation?: { hasBeenActive: boolean } }).userActivation;
      if (ua && !ua.hasBeenActive) return;
      try {
        const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AC) return;
        const a = (ctx.current ??= new AC());
        if (a.state === "suspended") void a.resume();
        const t = a.currentTime + (b.at ?? 0);
        const d = Math.min(b.d ?? 0.035, 0.16);
        const amp = a.createGain();
        amp.gain.setValueAtTime(0.0001, t);
        amp.gain.exponentialRampToValueAtTime(Math.min(b.g ?? 0.03, 0.06), t + 0.004);
        amp.gain.exponentialRampToValueAtTime(0.0001, t + d);
        amp.connect(a.destination);
        const o = a.createOscillator();
        o.type = b.type ?? "sine";
        o.frequency.setValueAtTime(b.f, t);
        if (b.to) o.frequency.exponentialRampToValueAtTime(b.to, t + d);
        o.connect(amp);
        o.start(t);
        o.stop(t + d + 0.01);
      } catch {
        /* no sound is fine */
      }
    },
    [on],
  );
}

export default function Slate({
  brand = "Nordhus",
  word = "SLATE",
  script = "house",
  cta = "Start a house",
  house = "/design/websites/slate/house.webp",
  sky = "/design/websites/slate/sky.webp",
  clouds = "/design/websites/slate/clouds.webp",
  tone = "#efe6d6",
  weather = 1,
  rain = true,
  autoplay = true,
  sound = true,
  onCta,
}: Props) {
  const root = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const wordEl = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const [live, setLive] = useState(true);
  const [calm, setCalm] = useState(false);
  const [sent, setSent] = useState(false);
  const hold = useRef(0); // the walk waits until this time (ms)
  const hovering = useRef(false);
  const blip = useBlip(sound);
  const speed = Math.min(3, Math.max(0.3, weather));

  /* on screen, in a visible tab, and whether the visitor wants less motion */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMq = () => setCalm(mq.matches);
    onMq();
    mq.addEventListener("change", onMq);
    let seen = true;
    const sync = () => setLive(seen && !document.hidden);
    const io = new IntersectionObserver(([e]) => {
      seen = e.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      mq.removeEventListener("change", onMq);
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  /* the name is fitted to the scene: how wide it is, in ems */
  useEffect(() => {
    const el = wordEl.current;
    const sc = scene.current;
    if (!el || !sc) return;
    const fit = () => {
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (!fs || !el.offsetWidth) return;
      sc.style.setProperty("--slt-wem", String(Math.round((el.offsetWidth / fs) * 1000) / 1000));
    };
    fit();
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    void fonts?.ready.then(fit);
    fonts?.addEventListener?.("loadingdone", fit);
    return () => fonts?.removeEventListener?.("loadingdone", fit);
  }, [word]);

  /* the camera: a slow sideways loop, plus the pointer */
  useEffect(() => {
    const sc = scene.current;
    const el = root.current;
    if (!sc || !el) return;
    if (calm || !live) {
      if (calm) {
        sc.style.setProperty("--slt-px", "0");
        sc.style.setProperty("--slt-py", "0");
      }
      return;
    }
    let raf = 0;
    let t0 = performance.now();
    let t = Number(sc.dataset.t ?? 0);
    const target = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = el.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      target.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - t0) / 1000);
      t0 = now;
      t += dt * (0.6 + 0.4 * speed);
      const k = 1 - Math.exp(-3.2 * dt);
      eased.x += (target.x - eased.x) * k;
      eased.y += (target.y - eased.y) * k;
      const x = 25 * Math.sin(t * 0.34) + 8 * Math.sin(t * 0.13 + 1.3) + eased.x * 15;
      const y = 4.5 * Math.sin(t * 0.23 + 0.6) + eased.y * 7;
      sc.style.setProperty("--slt-px", x.toFixed(2));
      sc.style.setProperty("--slt-py", y.toFixed(2));
      sc.dataset.t = t.toFixed(3);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [calm, live, speed]);

  /* the walk: the card goes from one point to the next by itself */
  useEffect(() => {
    if (!autoplay || calm || !live) return;
    const id = window.setInterval(() => {
      if (hovering.current || performance.now() < hold.current) return;
      setActive((a) => (a + 1) % SPOTS.length);
    }, 3400);
    return () => window.clearInterval(id);
  }, [autoplay, calm, live]);

  const choose = (i: number, by: "hover" | "press" | "key") => {
    if (by !== "hover") {
      hold.current = performance.now() + 6000;
      blip({ f: 880 + i * 120, to: 620 + i * 90, d: 0.045, g: 0.028, type: "triangle" });
    }
    setActive(i);
  };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const n = (i + step + SPOTS.length) % SPOTS.length;
    choose(n, "key");
    root.current?.querySelectorAll<HTMLButtonElement>(".slt-hot")[n]?.focus();
  };
  const press = () => {
    blip({ f: 520, d: 0.06, g: 0.03 });
    blip({ f: 780, d: 0.09, g: 0.03, at: 0.07 });
    onCta?.();
    setSent(true);
    // Demo: the button goes back by itself. Remove this to keep the sent state.
    window.setTimeout(() => setSent(false), 1900);
  };

  const s = SPOTS[active];
  const dot = { x: FG.x + s.fx * FG.w, y: FG.y + s.fy * FG.h };
  const path = s.join === "top" ? `M${r1(dot.x)} ${r1(dot.y)}V${s.cy}` : `M${r1(dot.x)} ${r1(dot.y)}V${s.cy + s.join}H${s.cx + CARD_W}`;
  const vars = { "--slt-tone": tone, "--slt-speed": String(Math.round((1 / speed) * 1000) / 1000) } as CSSProperties;

  return (
    <section ref={root} className="slt-root" style={vars} data-live={live} data-calm={calm} aria-label={`${brand} architects: ${word} ${script}`}>
      <style>{css}</style>
      <div className="slt-stage">
        <div ref={scene} className="slt-scene">
          {/* 1. the sky, the mountain, the water */}
          <div className="slt-far slt-par" aria-hidden>
            <div className="slt-sky" style={{ backgroundImage: `url(${sky})` }} />
            <div className="slt-clouds" style={{ backgroundImage: `url(${clouds})` }} />
            <div className="slt-break" />
            <div className="slt-mist">
              <i />
              <i />
              <i />
            </div>
          </div>

          {/* 2. the name, behind the house */}
          <div className="slt-word slt-par" aria-hidden>
            <span ref={wordEl}>{word}</span>
          </div>

          {/* 3. the house on its rock, and the light that crosses it */}
          <div className="slt-fg slt-par" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={house} alt="" draggable={false} />
            <div className="slt-band" style={{ WebkitMaskImage: `url(${house})`, maskImage: `url(${house})` }}>
              <i />
            </div>
            <div className="slt-glow" />
          </div>

          {/* 4. the script word, in front of the roof */}
          <div className="slt-script slt-par" aria-hidden>
            <span>{script}</span>
          </div>

          {rain ? (
            <div className="slt-rain" aria-hidden>
              <i />
              <i />
            </div>
          ) : null}
          <div className="slt-shade" aria-hidden />

          {/* 5. the three points and the card */}
          <div className="slt-pins slt-par">
            <svg className="slt-line" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden>
              <path key={active} d={path} pathLength={1} />
            </svg>
            {SPOTS.map((p, i) => (
              <button
                key={p.name}
                type="button"
                className="slt-hot"
                data-on={i === active}
                style={{ "--fx": p.fx, "--fy": p.fy, "--mx": p.mx, "--my": p.my, "--i": i } as CSSProperties}
                aria-label={`${p.name}. ${p.line}`}
                aria-pressed={i === active}
                onPointerEnter={(e) => {
                  if (e.pointerType !== "mouse") return;
                  hovering.current = true;
                  choose(i, "hover");
                }}
                onPointerLeave={() => {
                  hovering.current = false;
                  hold.current = performance.now() + 2500;
                }}
                onFocus={() => {
                  hovering.current = true;
                  setActive(i);
                }}
                onBlur={() => {
                  hovering.current = false;
                  hold.current = performance.now() + 2500;
                }}
                onClick={() => choose(i, "press")}
                onKeyDown={(e) => onKey(e, i)}
              >
                <i />
              </button>
            ))}
            <div className="slt-card" style={{ "--kx": s.cx, "--ky": s.cy } as CSSProperties} aria-live="polite">
              <div className="slt-card-top" key={active}>
                <p className="slt-kick">
                  <b>0{active + 1}</b>
                  <span>/ 0{SPOTS.length}</span>
                  <em>{s.name}</em>
                </p>
                <p className="slt-say">{s.line}</p>
              </div>
              <dl className="slt-facts">
                {FACTS.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="slt-steps" aria-hidden>
                {SPOTS.map((p, i) => (
                  <i key={p.name} data-on={i === active} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* the page */}
        <header className="slt-nav">
          <nav className="slt-pills" aria-label="Sections">
            {NAV.map((n, i) => (
              <a key={n} href="#" data-on={i === 0} onClick={(e) => e.preventDefault()}>
                {n}
              </a>
            ))}
          </nav>
          <a className="slt-logo" href="#" onClick={(e) => e.preventDefault()} aria-label={`${brand} architects`}>
            <span className="slt-mark" aria-hidden>
              {Array.from({ length: 9 }, (_, i) => (
                <i key={i} data-off={i === 2} />
              ))}
            </span>
            <span className="slt-name">
              <b>{brand}</b>
              <em>architects</em>
            </span>
          </a>
          <div className="slt-right">
            <a href="#" onClick={(e) => e.preventDefault()}>
              Contact
            </a>
            <button type="button" className="slt-cta" data-sent={sent} onClick={press}>
              <span>{sent ? "We'll write to you" : cta}</span>
              <svg viewBox="0 0 46 12" aria-hidden>
                <path d="M0 6h44M38 1l6 5-6 5" />
              </svg>
            </button>
          </div>
        </header>

        <h1 className="slt-h1">
          {word} {script}, a private house in Lofoten by {brand} architects
        </h1>
        <p className="slt-by">{brand} architects</p>
        <p className="slt-year">
          <span>2026</span>
          A house that keeps the weather outside
        </p>
        <ul className="slt-traits">
          <li>— Low</li>
          <li>— Sheltered</li>
          <li>— Quiet</li>
        </ul>

        <div className="slt-copy">
          <p>A long, low house on the outer side of Lofoten. Dark timber under one roof of slate, standing on steel legs above the rock, so the weather passes over it and under it.</p>
          <p>Inside, a single room runs the length of the house and ends in a corner of glass. Sliding walls close it down to one warm room when the storm comes in.</p>
        </div>
        <div className="slt-links">
          <button type="button" aria-label="Share this house">
            <svg viewBox="0 0 20 20" aria-hidden>
              <path d="M6 14 14 6M7.5 6H14v6.5" />
            </svg>
          </button>
          <button type="button" aria-label="Write to the studio">
            <svg viewBox="0 0 20 20" aria-hidden>
              <path d="M3.5 6h13v8.5h-13zM3.5 6.5l6.5 5 6.5-5" />
            </svg>
          </button>
          <button type="button" aria-label="All houses">
            <svg viewBox="0 0 20 20" aria-hidden>
              <path d="M4 4h5v5H4zM11 4h5v5h-5zM4 11h5v5H4zM11 11h5v5h-5z" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

/* a tile of rain: short streaks leaning one in four, so the tile can fall along its own slant */
const RAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cg stroke='%23fff' stroke-width='.7' stroke-linecap='round' fill='none'%3E%3Cpath d='M23 8l-7 28M71 52l-9 36M118 12l-6 24M163 70l-8 32M41 118l-9 36M97 140l-7 28M150 150l-8 32M188 20l-6 24M12 170l-5 20M130 92l-5 20'/%3E%3C/g%3E%3C/svg%3E\")";

const css = `
@import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,500&family=Pinyon+Script&display=swap");

.slt-root { container: slt / inline-size; position: relative; isolation: isolate; overflow: hidden; width: 100%; height: var(--design-h, 100svh); min-height: 640px;
  background: #08090b; color: var(--slt-tone, #efe6d6); font-family: "Montserrat", "Avenir Next", "Segoe UI", system-ui, sans-serif; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
.slt-root *, .slt-root *::before, .slt-root *::after { box-sizing: border-box; }
.slt-root p, .slt-root ul, .slt-root dl, .slt-root dd, .slt-root h1 { margin: 0; padding: 0; }
.slt-root ul { list-style: none; }
.slt-root a { color: inherit; text-decoration: none; }
.slt-root button { font: inherit; color: inherit; background: none; border: 0; padding: 0; cursor: pointer; }
.slt-root :focus-visible { outline: 2px solid var(--slt-tone, #efe6d6); outline-offset: 3px; }

/* the framed picture: everything is measured against it. --u is one pixel of the 1440 design */
.slt-stage { position: absolute; inset: 0.55cqi; border-radius: 1.5cqi; overflow: hidden; container-type: size; background: #1b222b; --u: calc(100cqw / 1440); }
/* the scene always keeps 16:10 and covers the frame, so the roof stays where the name expects it */
.slt-scene { position: absolute; left: 50%; top: 50%; width: max(100cqw, 160cqh); aspect-ratio: 16 / 10; transform: translate(-50%, -50%); container-type: size; --u: calc(100cqw / 1440);
  --slt-px: 0; --slt-py: 0; --slt-wem: 2.96; --slt-span: 82; }
.slt-par { position: absolute; inset: 0; will-change: transform; transform: translate3d(calc(var(--slt-px) * var(--k) * var(--u)), calc(var(--slt-py) * var(--k) * var(--u)), 0); }

/* 1. far */
.slt-far { --k: -0.2; }
.slt-sky { position: absolute; inset: -5%; background-size: cover; background-position: 50% 28%; animation: slt-sky calc(46s * var(--slt-speed)) ease-in-out infinite alternate; }
.slt-clouds { position: absolute; left: 0; top: -2%; width: 340cqw; height: 54cqh; background-repeat: repeat-x; background-size: 170cqw 100%; opacity: .5; mix-blend-mode: soft-light;
  -webkit-mask-image: linear-gradient(#000 40%, transparent); mask-image: linear-gradient(#000 40%, transparent); animation: slt-clouds calc(64s * var(--slt-speed)) linear infinite; will-change: transform; }
.slt-break { position: absolute; left: -6cqw; top: 14cqh; width: 60cqw; height: 78cqh; mix-blend-mode: screen; opacity: .5;
  background: radial-gradient(closest-side at 42% 30%, rgba(255,226,170,.5), rgba(255,214,150,.16) 46%, transparent 72%), linear-gradient(168deg, transparent 30%, rgba(255,224,170,.14) 46%, transparent 62%);
  animation: slt-break calc(7s * var(--slt-speed)) ease-in-out infinite alternate; }
.slt-mist { position: absolute; inset: 0; }
.slt-mist i { position: absolute; left: -46cqw; width: 46cqw; height: 13cqh; border-radius: 50%; background: radial-gradient(closest-side, rgba(226,232,238,.3), rgba(226,232,238,.1) 55%, transparent); will-change: transform; animation: slt-mist calc(30s * var(--slt-speed)) linear infinite; }
.slt-mist i:nth-child(1) { top: 47cqh; }
.slt-mist i:nth-child(2) { top: 56cqh; width: 62cqw; height: 10cqh; animation-duration: calc(43s * var(--slt-speed)); animation-delay: calc(-17s * var(--slt-speed)); opacity: .8; }
.slt-mist i:nth-child(3) { top: 40cqh; width: 36cqw; height: 9cqh; animation-duration: calc(37s * var(--slt-speed)); animation-delay: calc(-29s * var(--slt-speed)); opacity: .7; }

/* 2. the name */
.slt-word { --k: -0.5; }
.slt-word span { position: absolute; left: 6.2cqw; top: 14.2cqh; white-space: nowrap; font-weight: 500; font-size: calc(var(--slt-span) / var(--slt-wem) * 1cqw); line-height: 1; letter-spacing: -0.02em; color: var(--slt-tone, #efe6d6); }

/* 3. the house */
.slt-fg { --k: -1; }
.slt-fg img, .slt-band, .slt-glow { position: absolute; left: -4cqw; bottom: -12cqh; width: 108cqw; height: 72cqw; }
.slt-fg img { display: block; max-width: none; user-select: none; -webkit-user-drag: none; }
.slt-band { -webkit-mask-size: 100% 100%; mask-size: 100% 100%; -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; mix-blend-mode: soft-light; overflow: hidden; }
.slt-band i { position: absolute; left: -52%; top: 0; width: 46%; height: 100%; transform: translate3d(0,0,0) skewX(-16deg); will-change: transform;
  background: linear-gradient(90deg, transparent, rgba(255,226,172,.5) 30%, rgba(255,240,208,.95) 50%, rgba(255,226,172,.5) 70%, transparent); animation: slt-band calc(9s * var(--slt-speed)) linear infinite; }
.slt-glow { left: calc(-4cqw + 108cqw * .64); bottom: auto; top: calc(112cqh - 72cqw + 72cqw * .36); width: calc(108cqw * .3); height: calc(72cqw * .38); mix-blend-mode: screen; pointer-events: none;
  background: radial-gradient(closest-side at 46% 52%, rgba(255,186,96,.62), rgba(255,160,70,.22) 52%, transparent 78%); animation: slt-glow calc(9s * var(--slt-speed)) linear infinite; }

/* 4. the script word */
.slt-script { --k: -1.3; }
.slt-script span { position: absolute; right: 1.6cqw; top: 28.6cqh; font-family: "Pinyon Script", "Snell Roundhand", cursive; font-weight: 400; font-size: 13cqw; line-height: 1; color: var(--slt-tone, #efe6d6); white-space: nowrap; padding: 0 1.2cqw 0 2cqw;
  text-shadow: 0 .2cqw 1.6cqw rgba(8,9,11,.35); animation: slt-write 1.5s cubic-bezier(.6,.1,.2,1) .15s both; }

/* 5. the points and the card */
.slt-pins { --k: -1; }
.slt-line { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; }
.slt-line path { fill: none; stroke: rgba(255,255,255,.82); stroke-width: 1.1; vector-effect: non-scaling-stroke; stroke-dasharray: 1; stroke-dashoffset: 0; animation: slt-draw .55s cubic-bezier(.3,.7,.2,1) .34s both; }
.slt-hot { position: absolute; left: calc(-4cqw + var(--fx) * 108cqw); top: calc(112cqh - 72cqw + var(--fy) * 72cqw); width: calc(44 * var(--u)); height: calc(44 * var(--u)); margin: calc(-22 * var(--u)) 0 0 calc(-22 * var(--u)); border-radius: 50%; display: grid; place-items: center; z-index: 2; }
.slt-hot i { position: relative; width: calc(13 * var(--u)); height: calc(13 * var(--u)); border-radius: 50%; background: #fff; box-shadow: 0 0 0 calc(4 * var(--u)) rgba(255,255,255,.22), 0 calc(2 * var(--u)) calc(10 * var(--u)) rgba(0,0,0,.45); transition: scale .35s cubic-bezier(.3,1.5,.5,1); }
.slt-hot i::after { content: ""; position: absolute; inset: calc(-5 * var(--u)); border-radius: 50%; border: 1px solid rgba(255,255,255,.75); opacity: 0; animation: slt-ping 2.7s cubic-bezier(.2,.6,.3,1) infinite; animation-delay: calc(var(--i) * .9s); }
.slt-hot[data-on="true"] i { scale: 1.25; }
.slt-hot[data-on="true"] i::after { animation-duration: 1.5s; border-color: #fff; }
.slt-hot:active i { scale: .9; }

.slt-card { position: absolute; left: 0; top: 0; width: calc(352 * var(--u)); padding: calc(16 * var(--u)) calc(18 * var(--u)) calc(15 * var(--u)); border-radius: calc(18 * var(--u)); z-index: 1;
  transform: translate3d(calc(var(--kx) * var(--u)), calc(var(--ky) * var(--u)), 0); transition: transform .78s cubic-bezier(.3,1.32,.46,1);
  background: linear-gradient(160deg, rgba(34,38,44,.5), rgba(14,16,19,.42)); border: 1px solid rgba(255,255,255,.3); box-shadow: inset 0 1px 0 rgba(255,255,255,.16), 0 calc(18 * var(--u)) calc(44 * var(--u)) calc(-18 * var(--u)) rgba(0,0,0,.6);
  -webkit-backdrop-filter: blur(calc(14 * var(--u))) saturate(1.25); backdrop-filter: blur(calc(14 * var(--u))) saturate(1.25); color: #fff; }
.slt-card-top { animation: slt-in .5s cubic-bezier(.2,.7,.2,1) .16s both; }
.slt-kick { display: flex; align-items: baseline; gap: calc(6 * var(--u)); font-size: calc(11 * var(--u)); letter-spacing: .08em; text-transform: uppercase; font-weight: 600; font-variant-numeric: tabular-nums; }
.slt-kick span { opacity: .5; }
.slt-kick em { font-style: normal; margin-left: auto; letter-spacing: .06em; }
.slt-say { margin-top: calc(8 * var(--u)) !important; font-size: calc(14.5 * var(--u)); line-height: 1.34; font-weight: 500; letter-spacing: -.005em; text-wrap: balance; min-height: calc(39 * var(--u)); }
.slt-facts { margin-top: calc(12 * var(--u)) !important; padding-top: calc(11 * var(--u)) !important; border-top: 1px solid rgba(255,255,255,.2); display: grid; grid-template-columns: 1fr 1.2fr; gap: calc(8 * var(--u)) calc(14 * var(--u)); }
.slt-facts dt { font-size: calc(10 * var(--u)); letter-spacing: .06em; text-transform: uppercase; opacity: .58; font-weight: 500; }
.slt-facts dd { margin-top: calc(2 * var(--u)); font-size: calc(12.5 * var(--u)); font-weight: 600; line-height: 1.25; white-space: nowrap; }
.slt-steps { display: none; }

/* weather in front, and the shade that keeps the words readable */
.slt-rain { position: absolute; inset: 0; overflow: hidden; pointer-events: none; opacity: .15; }
.slt-rain i { position: absolute; left: 0; top: -800px; width: calc(100% + 200px); height: calc(100% + 800px); background-image: ${RAIN}; background-size: 200px 200px; will-change: transform; animation: slt-rain calc(.86s * var(--slt-speed)) linear infinite; }
.slt-rain i + i { background-size: 400px 400px; left: 0; top: -1600px; width: calc(100% + 400px); height: calc(100% + 1600px); opacity: .7; animation-name: slt-rain2; animation-duration: calc(1.22s * var(--slt-speed)); }
.slt-shade { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(to top, rgba(6,7,9,.78), rgba(6,7,9,.34) 20%, transparent 40%), linear-gradient(to bottom, rgba(6,7,9,.42), transparent 20%), radial-gradient(120% 90% at 50% 45%, transparent 62%, rgba(6,7,9,.4)); }

/* the page */
.slt-nav { position: absolute; left: calc(40 * var(--u)); right: calc(40 * var(--u)); top: calc(34 * var(--u)); display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; z-index: 3; }
.slt-pills { display: flex; gap: calc(8 * var(--u)); }
.slt-pills a { height: calc(40 * var(--u)); padding: 0 calc(25 * var(--u)); display: grid; place-items: center; border-radius: 999px; border: 1px solid rgba(255,255,255,.6); font-size: calc(10.5 * var(--u)); font-weight: 600; letter-spacing: .07em; text-transform: uppercase; color: #fff; transition: background .25s, color .25s; }
.slt-pills a[data-on="true"] { background: #fff; color: #14161a; border-color: #fff; }
.slt-pills a:not([data-on="true"]):hover { background: rgba(255,255,255,.16); }
.slt-logo { display: flex; align-items: center; gap: calc(11 * var(--u)); color: #fff; }
.slt-mark { display: grid; grid-template-columns: repeat(3, calc(7 * var(--u))); gap: calc(3 * var(--u)); }
.slt-mark i { width: calc(7 * var(--u)); height: calc(7 * var(--u)); background: #fff; border-radius: calc(1.5 * var(--u)); }
.slt-mark i[data-off="true"] { background: none; }
.slt-name { display: grid; line-height: 1.02; }
.slt-name b { font-size: calc(14 * var(--u)); font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
.slt-name em { font-size: calc(13.5 * var(--u)); font-weight: 500; }
.slt-right { justify-self: end; display: flex; align-items: center; gap: calc(30 * var(--u)); font-size: calc(10.5 * var(--u)); font-weight: 600; letter-spacing: .07em; text-transform: uppercase; color: #fff; }
.slt-cta { display: flex; align-items: center; gap: calc(12 * var(--u)); text-transform: uppercase; letter-spacing: .07em; font-weight: 600 !important; }
.slt-cta svg { width: calc(46 * var(--u)); height: calc(12 * var(--u)); fill: none; stroke: currentColor; stroke-width: 1.3; transition: translate .35s cubic-bezier(.3,1.4,.5,1); }
.slt-cta:hover svg { translate: calc(6 * var(--u)) 0; }
.slt-cta:active { scale: .97; }
.slt-cta[data-sent="true"] svg { translate: calc(10 * var(--u)) 0; }

.slt-h1 { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.slt-by, .slt-year, .slt-traits { position: absolute; z-index: 3; font-size: calc(12.5 * var(--u)); line-height: 1.42; font-weight: 500; color: color-mix(in srgb, var(--slt-tone, #efe6d6) 86%, transparent); }
.slt-by { left: calc(104 * var(--u)); top: calc(112 * var(--u)); }
.slt-year { left: calc(712 * var(--u)); top: calc(96 * var(--u)); }
.slt-year span { display: block; }
.slt-traits { right: calc(40 * var(--u)); top: calc(146 * var(--u)); text-align: right; color: var(--slt-tone, #efe6d6); }
.slt-copy { position: absolute; right: calc(40 * var(--u)); bottom: calc(38 * var(--u)); z-index: 3; display: grid; grid-template-columns: repeat(2, calc(246 * var(--u))); gap: calc(28 * var(--u)); font-size: calc(13 * var(--u)); line-height: 1.48; font-weight: 400; color: color-mix(in srgb, var(--slt-tone, #efe6d6) 94%, transparent); }
.slt-links { position: absolute; left: calc(40 * var(--u)); bottom: calc(38 * var(--u)); z-index: 3; display: flex; gap: calc(12 * var(--u)); }
.slt-links button { width: calc(36 * var(--u)); height: calc(36 * var(--u)); border-radius: calc(9 * var(--u)); border: 1.5px solid var(--slt-tone, #efe6d6); display: grid; place-items: center; transition: background .25s, color .25s, scale .2s; }
.slt-links button:hover { background: var(--slt-tone, #efe6d6); color: #14161a; }
.slt-links button:active { scale: .94; }
.slt-links svg { width: calc(20 * var(--u)); height: calc(20 * var(--u)); fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linejoin: round; stroke-linecap: round; }

@keyframes slt-sky { from { transform: translate3d(-1.6%, 0, 0) scale(1.03); } to { transform: translate3d(1.6%, -0.8%, 0) scale(1.07); } }
@keyframes slt-clouds { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(-170cqw, 0, 0); } }
@keyframes slt-break { from { opacity: .26; } to { opacity: .7; } }
@keyframes slt-mist { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(170cqw, -3cqh, 0); } }
@keyframes slt-band { from { transform: translate3d(0, 0, 0) skewX(-16deg); } to { transform: translate3d(440%, 0, 0) skewX(-16deg); } }
@keyframes slt-glow { 0%, 28% { opacity: .42; } 52% { opacity: 1; } 78%, 100% { opacity: .42; } }
@keyframes slt-ping { 0% { opacity: .9; transform: scale(.7); } 70%, 100% { opacity: 0; transform: scale(2.5); } }
@keyframes slt-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes slt-in { from { opacity: 0; transform: translate3d(0, calc(7 * var(--u)), 0); filter: blur(4px); } to { opacity: 1; transform: none; filter: none; } }
@keyframes slt-write { from { clip-path: inset(-20% 100% -20% 0); } to { clip-path: inset(-20% -5% -20% 0); } }
@keyframes slt-rain { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(-200px, 800px, 0); } }
@keyframes slt-rain2 { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(-400px, 1600px, 0); } }

/* off screen: everything waits */
.slt-root[data-live="false"] *, .slt-root[data-live="false"] *::after { animation-play-state: paused !important; }

/* a narrower frame: drop the second paragraph and the far links */
@container slt (max-width: 1000px) {
  .slt-pills a:nth-child(n + 4) { display: none; }
}

/* phone: the house fills the lower two thirds, the card is a sheet */
@container slt (max-width: 640px) {
  .slt-stage { inset: 6px; border-radius: 26px; --u: calc(100cqw / 390); }
  .slt-scene { left: 0; top: 0; width: 100%; height: 100%; aspect-ratio: auto; transform: none; --u: calc(100cqw / 390); --slt-span: 91; }
  .slt-par { transform: translate3d(calc(var(--slt-px) * var(--k) * var(--u) * .4), calc(var(--slt-py) * var(--k) * var(--u) * .4), 0); }
  .slt-sky { background-position: 24% 30%; inset: -6%; }
  .slt-clouds { width: 520cqw; background-size: 260cqw 100%; height: 44cqh; }
  .slt-break { left: -30cqw; width: 130cqw; top: 8cqh; height: 60cqh; }
  .slt-mist i { top: 38cqh !important; height: 8cqh; }
  .slt-fg img, .slt-band { left: -147cqw; width: 250cqw; height: 166.67cqw; bottom: 1cqh; }
  .slt-glow { left: calc(-147cqw + 250cqw * .64); top: calc(99cqh - 166.67cqw + 166.67cqw * .36); width: calc(250cqw * .3); height: calc(166.67cqw * .38); }
  .slt-word span { left: 4.2cqw; top: auto; bottom: calc(1cqh + 96.5cqw); }
  .slt-script span { right: 0; top: auto; bottom: calc(1cqh + 86.6cqw); font-size: 26cqw; }
  .slt-line { display: none; }
  .slt-hot { left: calc(-147cqw + var(--mx) * 250cqw); top: calc(99cqh - 166.67cqw + var(--my) * 166.67cqw); }
  .slt-card { left: 3.2cqw; right: 3.2cqw; top: auto; bottom: 3.4cqw; width: auto; transform: translate3d(calc(var(--slt-px) * var(--u) * .4), calc(var(--slt-py) * var(--u) * .4), 0); transition: none; padding: 15px 16px 14px; border-radius: 22px; }
  .slt-say { font-size: 14.5px; min-height: 0; }
  .slt-facts { grid-template-columns: 1.2fr 1fr 1fr; gap: 8px 10px; }
  .slt-facts div:nth-child(2), .slt-facts div:nth-child(6), .slt-facts div:nth-child(1) { display: none; }
  .slt-steps { position: absolute; right: 16px; bottom: 17px; display: flex; gap: 5px; }
  .slt-steps i { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,.35); transition: width .4s cubic-bezier(.3,1.4,.5,1), background .3s; }
  .slt-steps i[data-on="true"] { width: 16px; border-radius: 3px; background: #fff; }
  .slt-shade { background: linear-gradient(to top, rgba(6,7,9,.7), transparent 30%), linear-gradient(to bottom, rgba(6,7,9,.5), transparent 24%); }
  .slt-nav { left: 18px; right: 18px; top: 20px; grid-template-columns: 1fr auto; }
  .slt-pills { display: none; }
  .slt-right > a { display: none; }
  .slt-root .slt-cta { height: 38px; padding: 0 16px; border-radius: 999px; background: #fff; color: #14161a; font-size: 10.5px; }
  .slt-cta svg { width: 22px; }
  .slt-by { display: none; }
  .slt-year { left: 20px; top: 86px; font-size: 12.5px; max-width: 190px; }
  .slt-rain { opacity: .1; }
  .slt-traits { right: 20px; top: 86px; font-size: 12.5px; }
  .slt-copy, .slt-links { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .slt-root *, .slt-root *::after { animation: none !important; }
  .slt-card { transition: none; }
  .slt-band i { transform: translate3d(250%, 0, 0) skewX(-16deg); }
  .slt-glow { opacity: .85; }
  .slt-break { opacity: .55; }
  .slt-mist i:nth-child(1) { transform: translate3d(96cqw, 0, 0); }
  .slt-mist i:nth-child(2) { transform: translate3d(60cqw, 0, 0); }
  .slt-rain { display: none; }
}
`;
