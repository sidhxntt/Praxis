"use client";

/**
 * RITAGLIO · website hero
 *
 * The first screen of a paper-cut animation studio. A black field carries an
 * oval tag, two huge words in a wide heavy face, one line and a button. Beside
 * it stands the film that is on the table right now: a swimming pool made of
 * cut paper, and six loose pieces lying on it (a swimmer, a girl floating, a
 * diver, a beach ball, a lifebuoy, a sun umbrella).
 *
 * The paper moves the way the studio moves it: in stop-motion. Nothing glides.
 * Twelve times a second every piece is put in a new place and held there: the
 * swimmer does lengths and turns, the diver hops on the tiles, the ball bobs
 * and turns, and every so often a piece is lifted off the sheet (its shadow
 * grows), carried a little way in steps and put down again. A frame counter in
 * the corner counts the poses. The asterisk turns one notch at a time and the
 * headline arrives as cut letters that land one by one.
 *
 * The pointer is a hand: the piece under it lifts, and you can drag it and put
 * it down anywhere on the sheet (it moves in steps too, with a paper tap when
 * it lands). Left alone for a few seconds, the animator puts it back.
 *
 * One file, React only. The typeface (Archivo, with its width axis) comes from
 * Google Fonts, loaded in the CSS.
 *
 *   <Ritaglio />
 *   <Ritaglio line1="made by" line2="Hand" accent="#f5c63c" fps={8} />
 *
 * Props
 *   brand     the wordmark                              "Ritaglio"
 *   tag       the oval tag, " / " breaks the line       "Paper-cut / animation studio"
 *   line1     the headline's first word(s)              "paper"
 *   line2     the headline's second word(s)             "Moves"
 *   lede      the line under it                         "A stop-motion studio in Bologna. …"
 *   cta       the button                                "Watch the reel"
 *   accent    the colour of the oval tag                "#e9462f"
 *   fps       poses a second, 6 to 14                   12
 *   pool      the sheet the film lies on                "/design/websites/ritaglio/pool.webp"
 *   swimmer, floater, diver, ball, ring, umbrella       the six cut-outs (transparent)
 *   lido, market, parade                                three square stills for the film list
 *   sound     a tiny paper tap when a piece lands       true
 *   onCta     called when the button is pressed
 *
 * Fills its container's width; height is var(--design-h, 100svh), never under
 * 640px. Responsive by container query: on a phone the sheet lies across the
 * top and the black field with the words sits under it.
 * The scene pauses off screen and in a hidden tab. Self-play (the lifted
 * piece) waits about six seconds after any real touch.
 * Reduced motion: one finished frame, no entrance, no loop; pieces can still
 * be lifted and moved.
 * Keyboard: every piece is a button. Focus lifts it, the arrow keys move it a
 * step, Enter or Space makes it hop.
 * Sound: silent until the visitor interacts, when `sound` is false, and when
 * <html data-cd-mute="1">. The AudioContext is created on the first sound.
 */

import { useCallback, useEffect, useRef, type CSSProperties, type KeyboardEvent, type MouseEvent, type PointerEvent as RPointerEvent } from "react";

type Props = {
  brand?: string;
  tag?: string;
  line1?: string;
  line2?: string;
  lede?: string;
  cta?: string;
  accent?: string;
  fps?: number;
  pool?: string;
  swimmer?: string;
  floater?: string;
  diver?: string;
  ball?: string;
  ring?: string;
  umbrella?: string;
  lido?: string;
  market?: string;
  parade?: string;
  sound?: boolean;
  onCta?: () => void;
};

const BASE = "/design/websites/ritaglio/";

/* Sound: a short burst of filtered noise, like a piece of card put down on a
   table. Silent when `sound` is false, when <html data-cd-mute="1">, and until
   the visitor has interacted. Delete this hook and its calls to make it silent. */
function useTap(on: boolean) {
  const ctx = useRef<AudioContext | null>(null);
  useEffect(() => () => void ctx.current?.close().catch(() => {}), []);
  return useCallback(
    (pitch: number, gain = 0.04) => {
      if (!on || typeof window === "undefined") return;
      if (document.documentElement.dataset.cdMute === "1") return;
      const ua = (navigator as unknown as { userActivation?: { hasBeenActive: boolean } }).userActivation;
      if (ua && !ua.hasBeenActive) return;
      try {
        const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AC) return;
        const a = (ctx.current ??= new AC());
        if (a.state === "suspended") void a.resume();
        const t = a.currentTime;
        const d = 0.045;
        const buf = a.createBuffer(1, Math.ceil(a.sampleRate * d), a.sampleRate);
        const ch = buf.getChannelData(0);
        for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
        const n = a.createBufferSource();
        n.buffer = buf;
        const bp = a.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.setValueAtTime(pitch, t);
        bp.frequency.exponentialRampToValueAtTime(pitch * 0.55, t + d);
        bp.Q.value = 0.9;
        const amp = a.createGain();
        amp.gain.setValueAtTime(0.0001, t);
        amp.gain.exponentialRampToValueAtTime(Math.min(gain, 0.06), t + 0.004);
        amp.gain.exponentialRampToValueAtTime(0.0001, t + d);
        n.connect(bp).connect(amp).connect(a.destination);
        n.start(t);
        n.stop(t + d + 0.01);
      } catch {
        /* no sound is fine */
      }
    },
    [on],
  );
}

/* ------------------------------------------------------------- the pieces
   Where each cut-out lies on the sheet (its centre, in % of the sheet) and how
   wide it is (in % of the sheet's width), for the tall sheet (desktop) and the
   wide one (phone). One unit of movement below, "u", is 1% of the sheet's width. */
type Id = "umbrella" | "diver" | "swimmer" | "floater" | "ball" | "ring";
type Spot = { x: number; y: number; w: number };
type Piece = { id: Id; label: string; ratio: number; tall: Spot; wide: Spot };

const PIECES: Piece[] = [
  { id: "umbrella", label: "the sun umbrella", ratio: 0.95, tall: { x: 21, y: 10.5, w: 37 }, wide: { x: 14, y: 22, w: 24 } },
  { id: "ring", label: "the lifebuoy", ratio: 1, tall: { x: 70, y: 89, w: 29 }, wide: { x: 91, y: 80, w: 17 } },
  { id: "floater", label: "the girl floating", ratio: 0.836, tall: { x: 29, y: 62, w: 45 }, wide: { x: 20, y: 72, w: 29 } },
  { id: "ball", label: "the beach ball", ratio: 1.015, tall: { x: 77, y: 60, w: 25 }, wide: { x: 73, y: 77, w: 15 } },
  { id: "swimmer", label: "the swimmer", ratio: 0.385, tall: { x: 50, y: 38.5, w: 47 }, wide: { x: 50, y: 49, w: 31 } },
  { id: "diver", label: "the diver", ratio: 3.41, tall: { x: 70, y: 18.5, w: 12.5 }, wide: { x: 84, y: 30, w: 7.5 } },
];

type Pose = { dx: number; dy: number; rot: number; lift: number; flip: boolean };

const BOB = [0, -0.5, -0.8, -0.5, 0, 0.3];
const SWAY = [0, 1.5, 3, 1.5, 0, -1.5, -3, -1.5];
const HOP_Y = [-1.2, -2.6, -3.4, -3.6, -3, -1.8, -0.6, 0];
const HOP_R = [-2, -3, -2, 0, 2, 3, 1, 0];
const CARRY = 14; // how far the ball is carried, in u

/* Every piece's pose at pose number f (ambient) and fs (the performance, which
   waits while a visitor is touching things). `lane` is how far the swimmer
   goes each side of the middle. All of it moves "on twos": a pose is held for
   two ticks, as on an animation table. */
function poseOf(id: Id, f: number, fs: number, lane: number): Pose {
  const two = Math.floor(f / 2);
  if (id === "swimmer") {
    const ph = f % 144;
    let x = lane;
    let flip = false;
    let moving = true;
    if (ph < 60) x = lane - (Math.floor(ph / 2) * 2 * (2 * lane)) / 60;
    else if (ph < 72) {
      x = -lane;
      flip = ph >= 66;
      moving = false;
    } else if (ph < 132) {
      x = -lane + (Math.floor((ph - 72) / 2) * 2 * (2 * lane)) / 60;
      flip = true;
    } else {
      x = lane;
      flip = ph < 138;
      moving = false;
    }
    const stroke = two % 2 === 0 ? 1 : -1;
    return { dx: x, dy: moving ? stroke * 0.45 : 0, rot: moving ? stroke * 3 : 0, lift: 0, flip };
  }
  if (id === "floater") {
    const k = Math.floor(f / 3);
    return { dx: Math.round(Math.sin(k / 13) * 6) / 2, dy: Math.round(Math.cos(k / 17) * 4) / 2, rot: (k * 2.5) % 360, lift: 0, flip: false };
  }
  if (id === "ring") return { dx: 0, dy: BOB[Math.floor(f / 3) % 6] * 0.6, rot: -(Math.floor(f / 3) * 4) % 360, lift: 0, flip: false };
  if (id === "umbrella") return { dx: 0, dy: 0, rot: SWAY[Math.floor(f / 4) % 8], lift: 0, flip: false };
  if (id === "diver") {
    const ph = f % 48;
    const i = Math.floor(ph / 1);
    return i < 8 ? { dx: 0, dy: HOP_Y[i], rot: HOP_R[i], lift: 0.35, flip: false } : { dx: 0, dy: 0, rot: 0, lift: 0, flip: false };
  }
  /* the ball: it bobs and turns, and twice in the loop it is lifted, carried in
     steps and put down again */
  const ph = fs % 192;
  const bob = BOB[two % 6];
  const turn = (two * 6) % 360;
  const go = (from: number, start: number) => {
    const k = Math.min(12, Math.floor((ph - start) / 2) + 1);
    return from + ((from === 0 ? -CARRY : CARRY) * k) / 12;
  };
  if (ph < 80) return { dx: 0, dy: bob, rot: turn, lift: 0, flip: false };
  if (ph < 84) return { dx: 0, dy: 0, rot: turn, lift: (ph - 79) / 4, flip: false };
  if (ph < 108) return { dx: go(0, 84), dy: 0, rot: turn, lift: 1, flip: false };
  if (ph < 112) return { dx: -CARRY, dy: 0, rot: turn, lift: 1 - (ph - 107) / 4, flip: false };
  if (ph < 152) return { dx: -CARRY, dy: bob, rot: turn, lift: 0, flip: false };
  if (ph < 156) return { dx: -CARRY, dy: 0, rot: turn, lift: (ph - 151) / 4, flip: false };
  if (ph < 180) return { dx: go(-CARRY, 156), dy: 0, rot: turn, lift: 1, flip: false };
  if (ph < 184) return { dx: 0, dy: 0, rot: turn, lift: 1 - (ph - 179) / 4, flip: false };
  return { dx: 0, dy: bob, rot: turn, lift: 0, flip: false };
}

const r2 = (n: number) => Math.round(n * 100) / 100;

/* Black or cream ink, whichever reads on the tag's colour. */
const inkOn = (hex: string) => {
  const h = hex.replace("#", "");
  const f = h.length === 3 ? h.split("").map((c) => c + c).join("") : h.padEnd(6, "0").slice(0, 6);
  const n = parseInt(f, 16);
  if (!Number.isFinite(n)) return "#f3ecdc";
  const l = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return l > 0.62 ? "#0e0d0c" : "#f3ecdc";
};

/* The cut letters' own slant as they fall, by position in the word. */
const TILT = [-9, 7, -6, 10, -8, 6, -10, 8];

type Live = { ox: number; oy: number; tx: number; ty: number; lift: number; hover: boolean; focus: boolean; drag: boolean; hop: number; home: boolean };

const FILMS = [
  { n: "01", title: "Lido", meta: "4 min · on the table now", key: "lido" as const },
  { n: "02", title: "Night market", meta: "7 min · 2025", key: "market" as const },
  { n: "03", title: "The parade", meta: "11 min · 2024", key: "parade" as const },
];

export default function Ritaglio({
  brand = "Ritaglio",
  tag = "Paper-cut / animation studio",
  line1 = "paper",
  line2 = "Moves",
  lede = "A stop-motion studio in Bologna. Every film is cut from paper and moved by hand, twelve frames a second.",
  cta = "Watch the reel",
  accent = "#e9462f",
  fps = 12,
  pool = `${BASE}pool.webp`,
  swimmer = `${BASE}swimmer.webp`,
  floater = `${BASE}floater.webp`,
  diver = `${BASE}diver.webp`,
  ball = `${BASE}ball.webp`,
  ring = `${BASE}ring.webp`,
  umbrella = `${BASE}umbrella.webp`,
  lido = `${BASE}lido.webp`,
  market = `${BASE}market.webp`,
  parade = `${BASE}parade.webp`,
  sound = true,
  onCta,
}: Props) {
  const tap = useTap(sound);
  const root = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const nodes = useRef<Partial<Record<Id, HTMLButtonElement | null>>>({});
  const live = useRef<Record<Id, Live>>(
    Object.fromEntries(PIECES.map((p) => [p.id, { ox: 0, oy: 0, tx: 0, ty: 0, lift: 0, hover: false, focus: false, drag: false, hop: 0, home: false }])) as Record<Id, Live>,
  );
  const clock = useRef({ f: 30, fs: 30, touched: -1e9 });
  const grab = useRef<{ id: Id; px: number; py: number; ox: number; oy: number } | null>(null);
  const paintRef = useRef<() => void>(() => {});
  const rate = Math.max(6, Math.min(14, fps));
  const src: Record<Id, string> = { umbrella, diver, swimmer, floater, ball, ring };
  const still: Record<"lido" | "market" | "parade", string> = { lido, market, parade };

  /* Put every piece where pose f says, plus what the visitor did to it. */
  const paint = useCallback(() => {
    const el = sheet.current;
    if (!el) return;
    const W = el.offsetWidth || 1;
    const H = el.offsetHeight || 1;
    const u = W / 100;
    const wide = W / H > 0.95;
    const { f, fs } = clock.current;
    for (const p of PIECES) {
      const node = nodes.current[p.id];
      if (!node) continue;
      const s = live.current[p.id];
      const spot = wide ? p.wide : p.tall;
      const pose = poseOf(p.id, f, fs, wide ? 30 : 22);
      const hop = s.hop > 0 ? HOP_Y[8 - s.hop] : 0;
      const lift = Math.max(pose.lift, s.lift);
      /* keep the piece on the sheet */
      const maxY = (100 * H) / W;
      const cx = Math.max(3, Math.min(97, spot.x + pose.dx + s.ox));
      const cy = Math.max(3, Math.min(maxY - 3, (spot.y / 100) * maxY + pose.dy + s.oy));
      const x = (cx - spot.x) * u;
      const y = (cy - (spot.y / 100) * maxY + hop - lift * 1.1) * u;
      const k = 1 + lift * 0.06;
      node.style.transform = `translate(-50%, -50%) translate(${r2(x)}px, ${r2(y)}px)`;
      node.style.filter = `drop-shadow(${r2(0.9 + lift * 5)}px ${r2(1.4 + lift * 9)}px ${r2(0.7 + lift * 6)}px rgba(4, 38, 48, ${r2(0.42 - lift * 0.14)}))`;
      node.style.zIndex = String(lift > 0.05 ? 20 : 0);
      const art = node.firstElementChild as HTMLElement | null;
      if (art) art.style.transform = `rotate(${r2(pose.rot + (s.hop > 0 ? HOP_R[8 - s.hop] : 0))}deg) scale(${pose.flip ? -k : k}, ${k})`;
    }
    if (count.current) count.current.textContent = String((f % 2880) + 1).padStart(4, "0");
  }, []);
  paintRef.current = paint;

  /* One pose: move the visitor's pieces a step, then paint. */
  const tick = useCallback(
    (now: number) => {
      const c = clock.current;
      c.f += 1;
      const quiet = now - c.touched > 6000;
      if (quiet) c.fs += 1;
      for (const p of PIECES) {
        const s = live.current[p.id];
        if (s.drag) {
          s.ox = s.tx;
          s.oy = s.ty;
        } else if (quiet && (s.ox !== 0 || s.oy !== 0)) {
          /* the animator puts it back, a step at a time */
          const d = Math.hypot(s.ox, s.oy);
          const step = Math.min(d, 2.2);
          s.ox = d <= 2.2 ? 0 : s.ox - (s.ox / d) * step;
          s.oy = d <= 2.2 ? 0 : s.oy - (s.oy / d) * step;
          s.home = d > 2.2;
        } else s.home = false;
        const want = s.drag || s.hover || s.focus || s.home ? 1 : 0;
        s.lift = want > s.lift ? Math.min(1, s.lift + 0.5) : Math.max(0, s.lift - 0.34);
        if (s.hop > 0) s.hop -= 1;
      }
      paint();
    },
    [paint],
  );

  /* The clock: `rate` poses a second, only while the hero is on screen. */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    paint();
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ro = new ResizeObserver(() => paintRef.current());
    if (sheet.current) ro.observe(sheet.current);
    if (calm) {
      el.dataset.calm = "true";
      return () => ro.disconnect();
    }
    let raf = 0;
    let last = 0;
    let seen = true;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < 1000 / rate) return;
      last = t - ((t - last) % (1000 / rate));
      tick(performance.now());
    };
    const run = () => {
      cancelAnimationFrame(raf);
      const on = seen && !document.hidden;
      el.dataset.live = on ? "true" : "false";
      if (on) raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      seen = e.isIntersecting;
      run();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", run);
    run();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", run);
    };
  }, [paint, tick, rate]);

  const calmNow = () => root.current?.dataset.calm === "true";
  const touch = () => {
    clock.current.touched = performance.now();
  };
  /* With reduced motion there is no clock: a touch shows straight away. */
  const settle = (id: Id) => {
    if (!calmNow()) return;
    const s = live.current[id];
    s.ox = s.tx;
    s.oy = s.ty;
    s.lift = s.drag || s.hover || s.focus ? 1 : 0;
    paint();
  };

  const onDown = (id: Id) => (e: RPointerEvent<HTMLButtonElement>) => {
    const s = live.current[id];
    e.currentTarget.setPointerCapture(e.pointerId);
    grab.current = { id, px: e.clientX, py: e.clientY, ox: s.ox, oy: s.oy };
    s.drag = true;
    s.tx = s.ox;
    s.ty = s.oy;
    touch();
    tap(2600, 0.03);
    settle(id);
  };
  const onMove = (id: Id) => (e: RPointerEvent<HTMLButtonElement>) => {
    const g = grab.current;
    if (!g || g.id !== id) return;
    const el = sheet.current;
    if (!el) return;
    const u = el.getBoundingClientRect().width / 100 || 1;
    const s = live.current[id];
    s.tx = g.ox + (e.clientX - g.px) / u;
    s.ty = g.oy + (e.clientY - g.py) / u;
    touch();
    settle(id);
  };
  const onUp = (id: Id) => () => {
    const s = live.current[id];
    if (!s.drag) return;
    s.drag = false;
    s.ox = s.tx;
    s.oy = s.ty;
    grab.current = null;
    touch();
    tap(1700, 0.045);
    settle(id);
  };
  const onKey = (id: Id) => (e: KeyboardEvent<HTMLButtonElement>) => {
    const s = live.current[id];
    const by: Record<string, [number, number]> = { ArrowLeft: [-3, 0], ArrowRight: [3, 0], ArrowUp: [0, -3], ArrowDown: [0, 3] };
    const d = by[e.key];
    if (d) {
      e.preventDefault();
      s.ox = s.tx = Math.max(-80, Math.min(80, s.ox + d[0]));
      s.oy = s.ty = Math.max(-140, Math.min(140, s.oy + d[1]));
      touch();
      tap(2200, 0.03);
      settle(id);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      s.hop = 8;
      touch();
      tap(1700, 0.045);
      settle(id);
    }
  };
  const hover = (id: Id, on: boolean) => () => {
    live.current[id].hover = on;
    settle(id);
  };
  const focus = (id: Id, on: boolean) => () => {
    live.current[id].focus = on;
    settle(id);
  };
  const stay = (e: MouseEvent<HTMLAnchorElement>) => e.preventDefault();

  const tagLines = tag.split(" / ");
  let n = 0;
  const word = (w: string, row: number) => (
    <span className="rtg-row" key={row}>
      {Array.from(w).map((ch, i) => {
        const k = n++;
        return (
          <span key={i} className="rtg-ch" style={{ "--rtg-i": k, "--rtg-t": `${TILT[k % TILT.length]}deg` } as CSSProperties}>
            {ch === " " ? " " : ch}
          </span>
        );
      })}
    </span>
  );

  return (
    <div ref={root} className="rtg-root" data-live="false" style={{ "--rtg-accent": accent, "--rtg-on": inkOn(accent) } as CSSProperties}>
      <style>{css}</style>

      {/* the black field */}
      <div className="rtg-field">
        <svg className="rtg-mark" viewBox="0 0 100 100" aria-hidden>
          <path d="M43 2h14l-2 33 28-18 7 12-30 15 30 15-7 12-28-18 2 33H43l2-33-28 18-7-12 30-15-30-15 7-12 28 18z" />
        </svg>

        <header className="rtg-nav">
          <a className="rtg-brand" href="#" onClick={stay}>
            <i aria-hidden />
            {brand}
          </a>
          <nav aria-label="Main">
            <a href="#" onClick={stay}>
              Films
            </a>
            <a href="#" onClick={stay}>
              Workshop
            </a>
            <a href="#" onClick={stay}>
              Studio
            </a>
          </nav>
          <a className="rtg-ask" href="#" onClick={stay}>
            Commission a film
          </a>
        </header>

        <main className="rtg-main">
          <p className="rtg-tag">
            {tagLines.map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </p>
          <h1 className="rtg-h" aria-label={`${line1} ${line2}`}>
            <span aria-hidden className="rtg-rows">
              {word(line1, 0)}
              {word(line2, 1)}
            </span>
            <svg className="rtg-star" viewBox="0 0 100 100" aria-hidden>
              <path d="M43 2h14l-2 33 28-18 7 12-30 15 30 15-7 12-28-18 2 33H43l2-33-28 18-7-12 30-15-30-15 7-12 28 18z" />
            </svg>
          </h1>
          <div className="rtg-under">
            <p className="rtg-lede">{lede}</p>
            <button type="button" className="rtg-cta" onClick={onCta}>
              <svg viewBox="0 0 12 12" aria-hidden>
                <path d="M2.5 1.2v9.6L10.6 6z" />
              </svg>
              {cta}
            </button>
          </div>
        </main>

        <ul className="rtg-films" aria-label="Films">
          {FILMS.map((f) => (
            <li key={f.n}>
              <a href="#" onClick={stay}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={still[f.key]} alt="" draggable={false} />
                <span>
                  <em>{f.n}</em>
                  <b>{f.title}</b>
                  <small>{f.meta}</small>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* the film on the table */}
      <div className="rtg-pic">
        <div ref={sheet} className="rtg-sheet">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="rtg-pool" src={pool} alt="" draggable={false} />
          {PIECES.map((p) => (
            <button
              key={p.id}
              ref={(el) => {
                nodes.current[p.id] = el;
              }}
              type="button"
              className="rtg-piece"
              aria-label={`Move ${p.label}`}
              style={
                {
                  "--rtg-x": `${p.tall.x}%`,
                  "--rtg-y": `${p.tall.y}%`,
                  "--rtg-w": `${p.tall.w}%`,
                  "--rtg-mx": `${p.wide.x}%`,
                  "--rtg-my": `${p.wide.y}%`,
                  "--rtg-mw": `${p.wide.w}%`,
                  aspectRatio: `1 / ${p.ratio}`,
                } as CSSProperties
              }
              onPointerDown={onDown(p.id)}
              onPointerMove={onMove(p.id)}
              onPointerUp={onUp(p.id)}
              onPointerCancel={onUp(p.id)}
              onPointerEnter={hover(p.id, true)}
              onPointerLeave={hover(p.id, false)}
              onFocus={focus(p.id, true)}
              onBlur={focus(p.id, false)}
              onKeyDown={onKey(p.id)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="rtg-art" src={src[p.id]} alt="" draggable={false} />
            </button>
          ))}
          <p className="rtg-slate" aria-hidden>
            <b>Lido</b>
            <span>
              frame <span ref={count}>0031</span>
            </span>
            <i>{rate} fps</i>
          </p>
        </div>
      </div>
    </div>
  );
}

const css = `
@import url("https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&display=swap");

.rtg-root {
  --rtg-black: #0e0d0c;
  --rtg-cream: #f3ecdc;
  --rtg-dim: rgba(243, 236, 220, .6);
  --rtg-line: rgba(243, 236, 220, .16);
  --rtg-butter: #f5c63c;
  container-type: inline-size;
  position: relative; isolation: isolate; overflow: hidden;
  width: 100%; height: var(--design-h, 100svh); min-height: 640px;
  background: var(--rtg-black); color: var(--rtg-cream);
  font-family: "Archivo", "Helvetica Neue", Arial, sans-serif; font-stretch: 100%;
  -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility;
}
.rtg-root *, .rtg-root *::before, .rtg-root *::after { box-sizing: border-box; }
.rtg-root a { color: inherit; text-decoration: none; }
.rtg-root p, .rtg-root h1, .rtg-root ul { margin: 0; }
.rtg-root ul { padding: 0; }

/* ---- the sheet */
.rtg-pic { position: absolute; z-index: 1; top: 0; right: 0; bottom: 0; width: 40cqi; overflow: hidden; background: #1fa5ba; }
.rtg-sheet { position: absolute; inset: 0; }
.rtg-pool { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 0; user-select: none; -webkit-user-drag: none; }
.rtg-piece {
  position: absolute; left: var(--rtg-x); top: var(--rtg-y); width: var(--rtg-w);
  margin: 0; padding: 0; border: 0; background: none; color: inherit; font: inherit;
  transform: translate(-50%, -50%);
  filter: drop-shadow(.9px 1.4px .7px rgba(4, 38, 48, .42));
  cursor: grab; touch-action: none; -webkit-tap-highlight-color: transparent; outline: none;
}
.rtg-piece:active { cursor: grabbing; }
.rtg-piece:focus-visible::after { content: ""; position: absolute; inset: -6px; border: 2px dashed var(--rtg-black); border-radius: 10px; }
.rtg-art { display: block; width: 100%; height: 100%; object-fit: contain; pointer-events: none; user-select: none; -webkit-user-drag: none; }
.rtg-slate {
  position: absolute; left: 1.5cqi; bottom: 1.5cqi; z-index: 30;
  display: flex; align-items: baseline; gap: .8cqi; padding: .5cqi .9cqi .45cqi;
  background: var(--rtg-cream); color: var(--rtg-black);
  font-size: max(10px, .76cqi); font-weight: 600; letter-spacing: .08em; text-transform: uppercase; font-variant-numeric: tabular-nums;
  transform: rotate(-2deg); box-shadow: 1px 2px 1px rgba(4, 38, 48, .35); pointer-events: none;
}
.rtg-slate b { font-stretch: 125%; font-weight: 800; }
.rtg-slate i { font-style: normal; opacity: .55; }

/* ---- the black field */
.rtg-field { position: absolute; z-index: 2; overflow: hidden; top: 0; left: 0; bottom: 0; right: 40cqi; display: flex; flex-direction: column; padding: 0 3.3cqi; pointer-events: none; }
.rtg-nav, .rtg-tag, .rtg-h, .rtg-under, .rtg-films { pointer-events: auto; }
.rtg-mark { position: absolute; right: -7cqi; bottom: -9cqi; width: 34cqi; height: 34cqi; fill: #161513; pointer-events: none; z-index: -1; }

.rtg-nav { display: flex; align-items: center; gap: 2.4cqi; height: 6cqi; flex: none; }
.rtg-brand { display: inline-flex; align-items: center; gap: .7cqi; font-stretch: 125%; font-weight: 800; font-size: max(15px, 1.25cqi); letter-spacing: -.01em; margin-right: auto; }
.rtg-brand i { width: .85cqi; height: .85cqi; min-width: 10px; min-height: 10px; background: var(--rtg-accent); transform: rotate(-6deg); }
.rtg-nav nav { display: flex; gap: 2.2cqi; font-size: max(12px, .92cqi); font-weight: 500; color: var(--rtg-dim); }
.rtg-nav nav a { transition: color .15s; }
.rtg-nav nav a:hover { color: var(--rtg-cream); }
.rtg-ask { font-size: max(12px, .92cqi); font-weight: 600; padding: .62cqi 1.15cqi .58cqi; border: 1px solid rgba(243, 236, 220, .34); border-radius: 99px; transition: background .15s, color .15s; }
.rtg-ask:hover { background: var(--rtg-cream); color: var(--rtg-black); }
.rtg-root a:focus-visible, .rtg-cta:focus-visible { outline: 2px solid var(--rtg-butter); outline-offset: 3px; }

.rtg-main { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; justify-content: center; padding-bottom: 1cqi; }
.rtg-tag {
  align-self: flex-start; display: grid; place-items: center; margin-left: .4cqi !important;
  padding: 1.75cqi 3.3cqi 1.6cqi; border-radius: 50%;
  background: var(--rtg-accent); color: var(--rtg-on);
  font-stretch: 125%; font-weight: 600; font-size: max(10px, .86cqi); line-height: 1.2; letter-spacing: .05em; text-transform: uppercase; text-align: center;
  transform: rotate(-4deg);
}
.rtg-tag span { display: block; white-space: nowrap; }

.rtg-h {
  position: relative; align-self: flex-start; margin-top: 2.6cqi !important;
  font-stretch: 125%; font-weight: 900; line-height: .92; letter-spacing: -.035em;
  font-size: min(12.4cqi, calc(var(--design-h, 100svh) * .2));
}
.rtg-rows { display: block; }
.rtg-row { display: block; white-space: nowrap; }
.rtg-ch {
  /* cut from cream paper: the same grain as the pieces, clipped to the letter */
  padding: .16em 0 .24em; margin: -.16em 0 -.24em;
  color: transparent; -webkit-text-fill-color: transparent; background-color: var(--rtg-cream);
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .35  0 0 0 0 .3  0 0 0 0 .2  0 0 0 .5 -.17'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  -webkit-background-clip: text; background-clip: text;
}
.rtg-ch { display: inline-block; transform-origin: 50% 80%; animation: rtg-show .02s linear both, rtg-land .42s steps(5, jump-end) both; animation-delay: calc(.25s + var(--rtg-i) * .085s); }
@keyframes rtg-show { from { opacity: 0; } to { opacity: 1; } }
@keyframes rtg-land { from { transform: translate(.06em, -.5em) rotate(var(--rtg-t)); } to { transform: none; } }
.rtg-star { position: absolute; left: calc(100% + .9cqi); top: -.2em; width: .34em; height: .34em; fill: var(--rtg-butter); animation: rtg-spin 4.8s steps(12) infinite; }
@keyframes rtg-spin { to { transform: rotate(360deg); } }
.rtg-root[data-live="false"] .rtg-star { animation-play-state: paused; }

.rtg-under { display: flex; align-items: center; gap: 2.4cqi; margin-top: 2.9cqi; }
.rtg-lede { max-width: 30cqi; font-size: max(13px, 1.16cqi); line-height: 1.42; font-weight: 400; color: rgba(243, 236, 220, .78); text-wrap: pretty; }
.rtg-cta {
  flex: none; display: inline-flex; align-items: center; gap: .7cqi; margin: 0; cursor: pointer;
  padding: 1.05cqi 1.7cqi 1cqi 1.45cqi; border: 0; border-radius: 99px;
  background: var(--rtg-cream); color: var(--rtg-black);
  font: inherit; font-stretch: 125%; font-weight: 700; font-size: max(13px, 1.02cqi); letter-spacing: -.005em;
  transition: transform .16s steps(2), background .15s;
}
.rtg-cta svg { width: .85cqi; height: .85cqi; min-width: 10px; min-height: 10px; fill: currentColor; }
.rtg-cta:hover { transform: rotate(-2.5deg) translateY(-2px); background: #fff; }
.rtg-cta:active { transform: rotate(0deg) translateY(1px); }

.rtg-films { flex: none; list-style: none; display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid var(--rtg-line); margin: 0 0 2.6cqi !important; }
.rtg-films li { padding: 1.5cqi 1.4cqi 0 0; }
.rtg-films li + li { padding-left: 1.4cqi; border-left: 1px solid var(--rtg-line); }
.rtg-films a { display: flex; align-items: center; gap: 1cqi; }
.rtg-films img { flex: none; width: 4.4cqi; height: 4.4cqi; object-fit: cover; transform: rotate(-2deg); transition: transform .16s steps(2); }
.rtg-films li:nth-child(2) img { transform: rotate(1.5deg); }
.rtg-films a:hover img { transform: rotate(3deg) scale(1.06); }
.rtg-films span { display: grid; gap: .22cqi; min-width: 0; }
.rtg-films em { font-style: normal; font-size: max(10px, .72cqi); font-weight: 700; letter-spacing: .08em; color: var(--rtg-butter); font-variant-numeric: tabular-nums; }
.rtg-films b { font-stretch: 125%; font-weight: 700; font-size: max(12px, 1cqi); letter-spacing: -.005em; white-space: nowrap; }
.rtg-films small { font-size: max(10px, .8cqi); color: var(--rtg-dim); white-space: nowrap; }

/* ---- tablet: the film list keeps its titles and drops the small print */
@container (max-width: 1040px) {
  .rtg-films small { display: none; }
  .rtg-films li { padding-right: .8cqi; }
  .rtg-films li + li { padding-left: 1cqi; }
  .rtg-nav nav { gap: 1.8cqi; }
  .rtg-under { flex-direction: column; align-items: flex-start; gap: 2cqi; }
  .rtg-lede { max-width: 44cqi; }
}

/* ---- phone: the sheet lies across the top, the words under it */
@container (max-width: 700px) {
  .rtg-pic { left: 0; right: 0; top: 15cqi; bottom: auto; width: auto; height: 85cqi; }
  .rtg-piece { left: var(--rtg-mx); top: var(--rtg-my); width: var(--rtg-mw); }
  .rtg-slate { left: auto; right: 3.5cqi; bottom: 3.5cqi; gap: 2cqi; padding: 1.4cqi 2.4cqi 1.2cqi; font-size: 2.6cqi; transform: rotate(1.5deg); }
  .rtg-field { right: 0; padding: 0 5.2cqi; }
  .rtg-mark { right: -22cqi; bottom: -20cqi; width: 80cqi; height: 80cqi; }
  .rtg-nav { height: 15cqi; gap: 3cqi; }
  .rtg-nav nav { display: none; }
  .rtg-brand { font-size: 4.6cqi; gap: 2cqi; }
  .rtg-brand i { width: 3cqi; height: 3cqi; }
  .rtg-ask { font-size: 3.3cqi; padding: 1.9cqi 3.4cqi 1.7cqi; }
  .rtg-main { justify-content: flex-start; padding-top: 79cqi; padding-bottom: 0; }
  .rtg-tag { font-size: 2.45cqi; padding: 4.3cqi 8cqi 3.9cqi; margin-left: 0 !important; position: relative; z-index: 40; }
  .rtg-h { margin-top: 4.2cqi !important; font-size: min(20.6cqi, calc(var(--design-h, 100svh) * .105)); }
  .rtg-star { left: auto; right: -.5cqi; top: .1em; width: .36em; height: .36em; }
  .rtg-under { flex-direction: column; align-items: flex-start; gap: 4.6cqi; margin-top: 5cqi; }
  .rtg-lede { max-width: none; font-size: 3.85cqi; line-height: 1.4; }
  .rtg-cta { font-size: 3.9cqi; gap: 2.2cqi; padding: 3.5cqi 5.6cqi 3.3cqi 4.8cqi; }
  .rtg-cta svg { width: 3cqi; height: 3cqi; }
  .rtg-films { grid-template-columns: 1fr; margin-bottom: 7cqi !important; }
  .rtg-films li { padding: 3.6cqi 0 0; }
  .rtg-films li + li { display: none; }
  .rtg-films a { gap: 3.4cqi; }
  .rtg-films img { width: 12cqi; height: 12cqi; }
  .rtg-films span { grid-template-columns: auto 1fr; column-gap: 2.4cqi; row-gap: .6cqi; align-items: baseline; }
  .rtg-films em { font-size: 2.8cqi; }
  .rtg-films b { font-size: 3.9cqi; }
  .rtg-films small { display: block; grid-column: 1 / -1; font-size: 3.1cqi; }
}

@media (prefers-reduced-motion: reduce) {
  .rtg-ch, .rtg-star { animation: none !important; }
  .rtg-cta, .rtg-films img { transition: none !important; }
}
`;
