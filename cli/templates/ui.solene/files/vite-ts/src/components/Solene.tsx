"use client";

/**
 * SOLÈNE · website hero
 *
 * The first screen of a thermal bath house. One rounded photograph on a
 * sage-grey page: a vaulted limestone hall, a round opening in the ceiling,
 * one shaft of sunlight falling through steam onto green-gold water. Over it,
 * a glass pill of four words, one quiet statement, a white button, three thin
 * circles that touch, and the name set very large and very thin along the
 * bottom, cut by the frame.
 *
 * The room is alive. Dust and steam fall and drift inside the shaft of light
 * and the shaft breathes. Where the light meets the water a ring leaves every
 * second and a half and travels out across the pool; as each ring passes under
 * the name the letters ride it, and the part of each letter that stands in the
 * water bends. The three circles turn like a slow orrery: the two outer ones
 * roll along the middle one, a spark sits where they touch, and a small white
 * moon goes round. Touch the water and a ring starts under your finger.
 *
 * One file, React only. The typeface comes from Google Fonts (loaded in the CSS).
 *
 *   <Solene />
 *   <Solene word="thermes" light="#ffd9c7" pace={2.2} onCta={() => openBooking()} />
 *
 * Props
 *   mark       the two letters, top left                      "SØ"
 *   word       the name along the bottom (short, lower-case)   "solène"
 *   statement  the sentence ("\n" breaks it)                   (see below)
 *   cta        the button                                      "Book a bath"
 *   nav        the four words in the glass pill                ["Baths", "Rituals", "The house", "Visit"]
 *   water      the reading in the round badge                  "36°"
 *   hours      the two small lines over the picture, right     ["Open daily, 7 to 23", "Rue des Sources 14"]
 *   photo      the hall, landscape 3:2                         "/design/websites/solene/bath.webp"
 *   light      the colour of the light on the water            "#ffe7b8"
 *   pace       seconds between two rings                       1.6
 *   autoplay   now and then a drop falls somewhere else        true
 *   sound      a small drop when you touch the water           true
 *   onCta      called when the button is pressed
 *
 * Fills its container's width; height is var(--design-h, 100svh), never under
 * 640px. Responsive by container query: on a phone the photograph fills the
 * screen, cropped on the shaft of light, the statement moves to the top and
 * the pill becomes one "Menu" key.
 * Everything pauses off screen and in a hidden tab. The extra drops stop for
 * six seconds after you touch the water; the rings from the light never stop.
 * Keyboard: the nav words, the badge and the button are buttons (Tab, Enter).
 * Reduced motion: one finished frame, three rings standing on the water, no
 * loops; a touch still leaves a ring, without travel.
 * Sound: silent until the visitor interacts, when `sound` is false, and when
 * <html data-cd-mute="1">. The room itself never makes a sound.
 *
 * The photograph is 3:2 and the drawing is placed on it in percent (the
 * opening, the shaft, where the light lands, the line of the water). With
 * your own photograph, move those numbers: they are the SCENE constant below.
 */

import { useCallback, useEffect, useRef, type CSSProperties } from "react";

type Props = {
  mark?: string;
  word?: string;
  statement?: string;
  cta?: string;
  nav?: string[];
  water?: string;
  hours?: [string, string];
  photo?: string;
  light?: string;
  pace?: number;
  autoplay?: boolean;
  sound?: boolean;
  onCta?: () => void;
};

/* Where things are on the photograph, as fractions of its width and height. */
const SCENE = {
  /** where the light lands on the water */
  landX: 0.228,
  landY: 0.676,
  /** the far edge of the pool, left to right: [x, y] */
  shore: [
    [0, 0.662],
    [0.027, 0.651],
    [0.6, 0.648],
    [0.72, 0.668],
    [1, 0.704],
  ] as [number, number][],
};
/* The water canvas covers the photograph from WATER_TOP to its lower edge. */
const WATER_TOP = 0.64;
const WATER_H = 1 - WATER_TOP;
const SHORE_CLIP = `polygon(${SCENE.shore.map(([x, y]) => `${Math.round(x * 1000) / 10}% ${Math.round(((y - WATER_TOP) / WATER_H) * 1000) / 10}%`).join(", ")}, 100% 100%, 0% 100%)`;
const shoreAt = (x: number) => {
  const s = SCENE.shore;
  for (let i = 1; i < s.length; i++) if (x <= s[i][0]) return s[i - 1][1] + ((s[i][1] - s[i - 1][1]) * (x - s[i - 1][0])) / (s[i][0] - s[i - 1][0] || 1);
  return s[s.length - 1][1];
};

/* The name is cut into bands so the part in the water can bend: band 0 is the
   dry top of the letter, the others are thin strips below it. Whole percents. */
const DRY = 61; // where the water starts on the letter's box, in percent (the baseline is at 86)
const WET = 2; // the height of one strip, in percent
const BANDS = 15;
const STRIPS = Array.from({ length: BANDS }, (_, k) => {
  if (k === 0) return { top: 0, bottom: 100 - DRY };
  return { top: DRY + WET * (k - 1), bottom: k === BANDS - 1 ? -20 : 100 - DRY - WET * k };
});

/* A fixed scatter (no Math.random in render or in the loop: the same room every time). */
const rnd = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};
const R1 = rnd(20261120);
const MOTES = Array.from({ length: 84 }, () => ({ v0: R1(), off: R1() * 2 - 1, sp: 0.045 + R1() * 0.11, len: 3 + R1() * 10, a: 0.14 + R1() * 0.4, tw: 0.6 + R1() * 1.8, ph: R1() * 6.28 }));
const STEAM = Array.from({ length: 9 }, () => ({ v0: R1(), off: R1() * 1.5 - 0.75, sp: 0.018 + R1() * 0.03, r: 0.2 + R1() * 0.22, a: 0.1 + R1() * 0.13, f: 0.2 + R1() * 0.4, ph: R1() * 6.28 }));
/* where the extra drops fall, in turn */
const DROPS: [number, number][] = [
  [0.52, 0.8],
  [0.36, 0.9],
  [0.66, 0.86],
  [0.12, 0.84],
  [0.45, 0.74],
  [0.82, 0.93],
];

/* ------------------------------------------------------------------ sound
   One small drop, made in the browser. Silent when `sound` is false, when
   <html data-cd-mute="1">, and until the visitor has interacted. Delete this
   hook and its calls to make the page silent. */
function useDrop(on: boolean) {
  const ctx = useRef<AudioContext | null>(null);
  useEffect(() => () => void ctx.current?.close().catch(() => {}), []);
  return useCallback(
    (from: number, to: number, gain = 0.035) => {
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
        const amp = a.createGain();
        amp.gain.setValueAtTime(0.0001, t);
        amp.gain.exponentialRampToValueAtTime(Math.min(gain, 0.06), t + 0.005);
        amp.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
        amp.connect(a.destination);
        const o = a.createOscillator();
        o.type = "sine";
        o.frequency.setValueAtTime(from, t);
        o.frequency.exponentialRampToValueAtTime(to, t + 0.06);
        o.connect(amp);
        o.start(t);
        o.stop(t + 0.08);
      } catch {
        /* no sound is fine */
      }
    },
    [on],
  );
}

type Ring = { x: number; y: number; t0: number; power: number };

export default function Solene({
  mark = "SØ",
  word = "solène",
  statement = "Warm water, slow light,\nand nowhere to be.\nThree hours that give you\nthe week back.",
  cta = "Book a bath",
  nav = ["Baths", "Rituals", "The house", "Visit"],
  water = "36°",
  hours = ["Open daily, 7 to 23", "Rue des Sources 14"],
  photo = "/design/websites/solene/bath.webp",
  light = "#ffe7b8",
  pace = 1.6,
  autoplay = true,
  sound = true,
  onCta,
}: Props) {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const shaft = useRef<HTMLCanvasElement>(null);
  const pool = useRef<HTMLCanvasElement>(null);
  const land = useRef<HTMLSpanElement>(null);
  const wordEl = useRef<HTMLDivElement>(null);
  const touch = useRef<(cx: number, cy: number, hard: boolean) => void>(() => {});
  const drop = useDrop(sound);
  const letters = Array.from(word);

  useEffect(() => {
    const el = root.current;
    const fr = frame.current;
    const sc = scene.current;
    const sh = shaft.current;
    const po = pool.current;
    const wd = wordEl.current;
    if (!el || !fr || !sc || !sh || !po || !wd) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sctx = sh.getContext("2d");
    const pctx = po.getContext("2d");
    if (!sctx || !pctx) return;

    /* the glints on the water are worked out small and stretched */
    const GW = 176;
    const GH = 44;
    const glint = document.createElement("canvas");
    glint.width = GW;
    glint.height = GH;
    const gctx = glint.getContext("2d");
    const gimg = gctx?.createImageData(GW, GH) ?? null;
    const col = light.replace("#", "");
    const lr = parseInt(col.slice(0, 2), 16) || 255;
    const lg = parseInt(col.slice(2, 4), 16) || 231;
    const lb = parseInt(col.slice(4, 6), 16) || 184;
    /* per pixel, the parts that never change */
    const gPhase = new Float32Array(GW * GH);
    const gGain = new Float32Array(GW * GH);
    for (let y = 0; y < GH; y++)
      for (let x = 0; x < GW; x++) {
        const i = y * GW + x;
        const xf = x / GW;
        const z = (y + 2) / (GH + 2); // 0 far, 1 near
        gPhase[i] = 24 * Math.log(1 + y * 0.24);
        const column = Math.exp(-Math.pow((xf - SCENE.landX) / 0.1, 2)); // under the light it glitters more
        gGain[i] = (0.1 + 0.2 * z) * (1 + 2.4 * column * (1 - z * 0.5));
      }

    const blocks = Array.from(wd.querySelectorAll<HTMLElement>("[data-sln-l]"));
    const strips = blocks.map((b) => Array.from(b.querySelectorAll<HTMLElement>("[data-sln-s]")));
    let letterX: number[] = blocks.map((_, i) => 0.15 + (0.7 * i) / Math.max(1, blocks.length - 1));
    const measure = () => {
      const r = sc.getBoundingClientRect();
      if (!r.width) return;
      letterX = blocks.map((b) => {
        const q = b.getBoundingClientRect();
        return (q.left + q.width / 2 - r.left) / r.width;
      });
    };

    let rings: Ring[] = [];
    let visible = true;
    let raf = 0;
    let last = 0;
    let t = 0; // seconds the room has been alive
    let nextRing = 0.15;
    let nextDrop = 3.4;
    let dropAt = 0;
    let lastTouch = -100;
    let lastMove = -100;
    let tx = 0;
    let ty = 0;
    let px = 0;
    let py = 0;
    const LIFE = 5.6;
    const radius = (p: number) => 0.012 + 0.43 * Math.pow(p, 0.86);

    const add = (x: number, y: number, power: number) => {
      rings.push({ x, y, t0: t, power });
      if (rings.length > 9) rings.shift();
    };

    const drawShaft = () => {
      const W = sh.width;
      const H = sh.height;
      sctx.clearRect(0, 0, W, H);
      const sway = Math.sin(t * 0.23) * 0.035 + Math.sin(t * 0.11 + 1) * 0.02;
      const mid = (v: number) => 0.44 + (0.07 + sway) * v;
      const half = (v: number) => 0.25 + 0.05 * v;
      sctx.globalCompositeOperation = "lighter";
      for (const s of STEAM) {
        const v = (((s.v0 - t * s.sp) % 1) + 1) % 1; // steam climbs
        const u = mid(v) + s.off * half(v) + Math.sin(t * s.f + s.ph) * 0.07;
        const x = u * W;
        const y = v * H;
        const r = s.r * W;
        const a = s.a * Math.sin(Math.PI * v);
        const g = sctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgba(${lr},${lg},${lb},${a.toFixed(3)})`);
        g.addColorStop(1, `rgba(${lr},${lg},${lb},0)`);
        sctx.fillStyle = g;
        sctx.fillRect(x - r, y - r, r * 2, r * 2);
      }
      sctx.lineCap = "round";
      for (const m of MOTES) {
        const v = (m.v0 + t * m.sp) % 1; // dust and drops fall
        const u = mid(v) + m.off * half(v) * 0.92;
        const edge = 1 - Math.pow(Math.abs(m.off), 3);
        const a = m.a * edge * Math.min(1, v * 7) * Math.min(1, (1 - v) * 9) * (0.55 + 0.45 * Math.sin(t * m.tw + m.ph));
        if (a <= 0.01) continue;
        const x = u * W;
        const y = v * H;
        sctx.strokeStyle = `rgba(255,${Math.min(255, lg + 14)},${Math.min(255, lb + 30)},${a.toFixed(3)})`;
        sctx.lineWidth = 0.9;
        sctx.beginPath();
        sctx.moveTo(x, y);
        sctx.lineTo(x + (0.07 + sway) * (m.len / H) * W, y + m.len);
        sctx.stroke();
      }
      sctx.globalCompositeOperation = "source-over";
    };

    const drawPool = () => {
      const W = po.width;
      const H = po.height;
      pctx.clearRect(0, 0, W, H);
      if (gctx && gimg) {
        const d = gimg.data;
        for (let y = 0; y < GH; y++) {
          const row = y * GW;
          const wob = y * 0.3;
          for (let x = 0; x < GW; x++) {
            const i = row + x;
            const f = Math.sin(gPhase[i] + 1.5 * Math.sin(x * 0.047 + t * 0.52) + t * 0.85) * (0.62 + 0.38 * Math.sin(x * 0.093 - t * 0.37 + wob));
            const a = f > 0 ? f * f * f * gGain[i] : 0;
            const o = i * 4;
            d[o] = lr;
            d[o + 1] = lg;
            d[o + 2] = lb;
            d[o + 3] = a * 255;
          }
        }
        gctx.putImageData(gimg, 0, 0);
        pctx.imageSmoothingEnabled = true;
        pctx.drawImage(glint, 0, 0, W, H);
      }
      /* the rings: a light crest and a dark trough just outside it */
      for (const r of rings) {
        const p = (t - r.t0) / LIFE;
        if (p <= 0 || p >= 1) continue;
        const rx = radius(p) * W;
        const cy = ((r.y - WATER_TOP) / WATER_H) * H;
        const ratio = 0.1 + ((r.y - WATER_TOP) / WATER_H) * 0.2;
        const fade = Math.pow(1 - p, 1.5) * Math.min(1, p * 14) * r.power;
        pctx.lineWidth = 1.5 - p * 0.7;
        pctx.strokeStyle = `rgba(255,${Math.min(255, lg + 12)},${Math.min(255, lb + 24)},${(0.62 * fade).toFixed(3)})`;
        pctx.beginPath();
        pctx.ellipse(r.x * W, cy, rx, rx * ratio, 0, 0, Math.PI * 2);
        pctx.stroke();
        pctx.lineWidth = 2.2 - p;
        pctx.strokeStyle = `rgba(14,34,26,${(0.34 * fade).toFixed(3)})`;
        pctx.beginPath();
        pctx.ellipse(r.x * W, cy + 1.2, rx + 2.4, (rx + 2.4) * ratio, 0, 0, Math.PI * 2);
        pctx.stroke();
        if (p < 0.5) {
          const rx2 = radius(p * 0.55) * W;
          pctx.lineWidth = 1;
          pctx.strokeStyle = `rgba(255,${Math.min(255, lg + 12)},${Math.min(255, lb + 24)},${(0.4 * fade * (1 - p * 2)).toFixed(3)})`;
          pctx.beginPath();
          pctx.ellipse(r.x * W, cy, rx2, rx2 * ratio, 0, 0, Math.PI * 2);
          pctx.stroke();
        }
      }
    };

    /* the name rides the rings: each letter lifts as a ring passes its place,
       and the strips of it that stand in the water slide sideways */
    const moveWord = () => {
      for (let i = 0; i < blocks.length; i++) {
        let bob = 0;
        let energy = 0.3;
        for (const r of rings) {
          const p = (t - r.t0) / LIFE;
          if (p <= 0 || p >= 1) continue;
          const q = radius(p) - Math.abs(letterX[i] - r.x);
          if (q <= 0) continue;
          const env = Math.exp(-q * 8) * Math.pow(1 - p, 1.1) * r.power;
          bob += env * Math.sin(q * 44);
          energy += env;
        }
        if (energy > 1.5) energy = 1.5;
        const by = -0.03 * bob;
        const ss = strips[i];
        for (let k = 0; k < ss.length; k++) {
          const w = k === 0 ? 0 : Math.pow(k / (ss.length - 1), 1.25);
          const dx = 0.013 * w * energy * Math.sin(t * 2.3 - k * 0.52 + i * 0.7);
          ss[k].style.transform = `translate3d(${dx.toFixed(4)}em, ${by.toFixed(4)}em, 0)`;
        }
      }
    };

    const frameStep = (now: number) => {
      raf = requestAnimationFrame(frameStep);
      if (!visible || document.hidden) {
        last = now;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      t += dt;
      if (t >= nextRing) {
        add(SCENE.landX, SCENE.landY, 1);
        nextRing = t + Math.max(0.6, pace);
        land.current?.animate([{ opacity: 0.95, transform: "translate(-50%, -50%) scale(1.14)" }, { opacity: 0.5, transform: "translate(-50%, -50%) scale(1)" }], { duration: 900, easing: "cubic-bezier(.2,.7,.2,1)" });
      }
      if (autoplay && t >= nextDrop && t - lastTouch > 6) {
        const [x, y] = DROPS[dropAt++ % DROPS.length];
        add(x, Math.max(y, shoreAt(x) + 0.03), 1.25);
        nextDrop = t + 3.1;
      }
      rings = rings.filter((r) => t - r.t0 < LIFE);
      if (Math.abs(tx - px) > 0.002 || Math.abs(ty - py) > 0.002) {
        px += (tx - px) * Math.min(1, dt * 3);
        py += (ty - py) * Math.min(1, dt * 3);
        el.style.setProperty("--sln-px", px.toFixed(3));
        el.style.setProperty("--sln-py", py.toFixed(3));
      }
      drawShaft();
      drawPool();
      moveWord();
    };

    /* one finished frame for reduced motion */
    const still = () => {
      t = 4;
      rings = [
        { x: SCENE.landX, y: SCENE.landY, t0: t - 0.5, power: 1 },
        { x: SCENE.landX, y: SCENE.landY, t0: t - 1.9, power: 1 },
        { x: SCENE.landX, y: SCENE.landY, t0: t - 3.4, power: 1 },
      ];
      drawShaft();
      drawPool();
    };

    touch.current = (cx, cy, hard) => {
      const r = sc.getBoundingClientRect();
      if (!r.width) return;
      const x = (cx - r.left) / r.width;
      const y = (cy - r.top) / r.height;
      const f = fr.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, ((cx - f.left) / f.width) * 2 - 1));
      ty = Math.max(-1, Math.min(1, ((cy - f.top) / f.height) * 2 - 1));
      if (y < shoreAt(x) + 0.012 || y > 1 || x < 0 || x > 1) return;
      if (reduce) {
        if (!hard) return;
        rings = rings.slice(0, 3).concat([{ x, y, t0: t - 0.7, power: 1.2 }]);
        drawPool();
        return;
      }
      if (!hard && t - lastMove < 0.34) return;
      lastMove = t;
      lastTouch = t;
      add(x, y, hard ? 1.5 : 0.8);
    };
    const away = () => {
      tx = 0;
      ty = 0;
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(fr);
    const io = new IntersectionObserver(([x]) => {
      visible = x.isIntersecting;
    });
    io.observe(el);
    fr.addEventListener("pointerleave", away);
    document.fonts?.ready.then(measure).catch(() => {});
    if (reduce) still();
    else raf = requestAnimationFrame(frameStep);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      fr.removeEventListener("pointerleave", away);
      touch.current = () => {};
    };
  }, [light, pace, autoplay, word]);

  return (
    <section ref={root} className="sln-root" style={{ "--sln-light": light, "--sln-n": Math.max(4, letters.length) } as CSSProperties} aria-label={`${word}, thermal baths`}>
      <style>{CSS}</style>
      <p className="sln-meta sln-meta-l">
        <span>Thermal baths</span>
        Lyon, since 1896
      </p>
      <p className="sln-meta sln-meta-r">
        <span>{hours[0]}</span>
        {hours[1]}
      </p>

      <div
        ref={frame}
        className="sln-frame"
        onPointerMove={(e) => touch.current(e.clientX, e.clientY, false)}
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest("button")) return;
          touch.current(e.clientX, e.clientY, true);
          drop(620, 250);
        }}
      >
        <div ref={scene} className="sln-scene">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="sln-photo" src={photo} alt="A vaulted stone bath hall: one shaft of sunlight falls from a round opening onto green water" draggable={false} />
          <span className="sln-beam" aria-hidden />
          <canvas ref={shaft} className="sln-shaft" width={176} height={340} aria-hidden />
          <span ref={land} className="sln-land" aria-hidden />
          <canvas ref={pool} className="sln-pool" width={704} height={170} style={{ clipPath: SHORE_CLIP }} aria-hidden />
        </div>
        <span className="sln-veil" aria-hidden />

        {/* the orrery: three circles that touch, a spark at each touch, one moon */}
        <div className="sln-orb" aria-hidden>
          <span className="sln-ring sln-ring-0" />
          <span className="sln-arm sln-arm-l">
            <span className="sln-ring sln-ring-s" />
            <i className="sln-spark" />
          </span>
          <span className="sln-arm sln-arm-r">
            <span className="sln-ring sln-ring-s" />
            <i className="sln-spark" />
          </span>
          <span className="sln-arm sln-arm-m">
            <i className="sln-moon" />
          </span>
        </div>

        <header className="sln-nav">
          <span className="sln-mark">{mark}</span>
          <nav className="sln-pill" aria-label="Sections">
            {nav.map((n) => (
              <button key={n} type="button">
                {n}
              </button>
            ))}
          </nav>
          <button type="button" className="sln-menu">
            Menu
          </button>
          <button type="button" className="sln-temp" aria-label={`The great pool is at ${water} today`}>
            {water}
          </button>
        </header>

        <h1 className="sln-say">
          {statement.split("\n").map((l, i) => (
            <span key={i}>{l} </span>
          ))}
        </h1>
        <button
          type="button"
          className="sln-cta"
          onClick={() => {
            drop(520, 780, 0.03);
            onCta?.();
          }}
        >
          {cta}
        </button>

        <div ref={wordEl} className="sln-word" aria-hidden>
          {letters.map((ch, i) => (
            <span key={i} className="sln-l" data-sln-l>
              <span className="sln-ghost">{ch}</span>
              {STRIPS.map((s, k) => (
                <span key={k} className="sln-s" data-sln-s style={{ clipPath: k === 0 ? `inset(-40% -20% ${s.bottom}% -20%)` : `inset(${s.top}% -20% calc(${s.bottom}% - 0.5px) -20%)` }}>
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

const CSS = `
@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@100..500&display=swap");
@property --sln-a { syntax: "<angle>"; inherits: false; initial-value: 360deg; }

.sln-root {
  --sln-ground: #bfc2b2; --sln-ink: #2c3028; --sln-px: 0; --sln-py: 0;
  container: sln / inline-size; position: relative; isolation: isolate; overflow: hidden;
  width: 100%; height: var(--design-h, 100svh); min-height: 640px;
  background: var(--sln-ground); color: #fff;
  font-family: "Outfit", "Avenir Next", "Segoe UI", system-ui, sans-serif; -webkit-font-smoothing: antialiased;
}
.sln-root *, .sln-root *::before, .sln-root *::after { box-sizing: border-box; }
.sln-root button { font: inherit; color: inherit; background: none; border: 0; padding: 0; margin: 0; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.sln-root button:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }

/* the two small lines over the picture */
.sln-meta { position: absolute; top: 1.25cqi; margin: 0; font-size: max(11px, 0.86cqi); line-height: 1.38; font-weight: 400; color: var(--sln-ink); letter-spacing: .005em; }
.sln-meta span { display: block; opacity: .58; }
.sln-meta-l { left: 2.7cqi; }
.sln-meta-r { right: 2.7cqi; text-align: right; }

/* the picture */
.sln-frame {
  container: slnf / size; position: absolute; left: 2cqi; right: 2cqi; top: 4.6cqi; bottom: 2cqi;
  border-radius: 2cqi; overflow: hidden; background: #8c7850; touch-action: manipulation;
  clip-path: inset(0 round 2cqi); transform: translateZ(0);
}
.sln-scene {
  --sw: max(100cqw, 150cqh); --sh: max(66.667cqw, 100cqh); --fx: .5;
  position: absolute; width: var(--sw); height: var(--sh);
  left: clamp(100cqw - var(--sw), 50cqw - var(--fx) * var(--sw), 0px);
  top: calc((100cqh - var(--sh)) * .1);
  transform: translate3d(calc(var(--sln-px) * -.5cqw), calc(var(--sln-py) * -.35cqw), 0) scale(1.03);
  transform-origin: 30% 60%; will-change: transform;
}
.sln-photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; user-select: none; -webkit-user-drag: none; }

/* the shaft of light: a soft body that breathes, and the dust inside it */
.sln-beam {
  position: absolute; left: 9%; top: 6%; width: 27%; height: 64%;
  filter: blur(1.5cqw); mix-blend-mode: screen; opacity: .42; transform-origin: 46% 0; pointer-events: none;
  animation: sln-breathe 5.6s ease-in-out infinite alternate;
}
.sln-beam::before {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(180deg, color-mix(in srgb, var(--sln-light) 70%, transparent), color-mix(in srgb, var(--sln-light) 34%, transparent) 62%, transparent 96%);
  clip-path: polygon(24% 0, 68% 0, 82% 100%, 22% 100%);
}
@keyframes sln-breathe { from { opacity: .16; transform: skewX(-1.6deg) scaleX(.94); } to { opacity: .62; transform: skewX(1.8deg) scaleX(1.05); } }
.sln-shaft {
  position: absolute; left: 10%; top: 2%; width: 26%; height: 68%;
  mix-blend-mode: screen; pointer-events: none;
  -webkit-mask-image: linear-gradient(180deg, transparent 6%, #000 20%, #000 90%, transparent);
          mask-image: linear-gradient(180deg, transparent 6%, #000 20%, #000 90%, transparent);
}
.sln-land {
  position: absolute; left: 22.8%; top: 67.6%; width: 23%; height: 4.4%; border-radius: 50%;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--sln-light) 80%, #fff) 0, color-mix(in srgb, var(--sln-light) 46%, transparent) 46%, transparent);
  mix-blend-mode: screen; opacity: .5; transform: translate(-50%, -50%); pointer-events: none;
}
.sln-pool { position: absolute; left: 0; top: 64%; width: 100%; height: 36%; pointer-events: none; }
.sln-veil {
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(180deg, rgba(34,26,12,.3), transparent 20%), linear-gradient(0deg, rgba(12,26,20,.5), transparent 40%);
}

/* the orrery */
.sln-orb {
  --R: 23cqw; --r: 21cqw;
  position: absolute; left: 50%; top: 49%; width: 0; height: 0; pointer-events: none;
  transform: translate3d(calc(var(--sln-px) * 1.1cqw), calc(var(--sln-py) * .9cqw), 0);
}
.sln-ring { position: absolute; border-radius: 50%; border: 1px solid rgba(255,255,255,.56); }
.sln-ring-0 {
  left: calc(var(--R) * -1); top: calc(var(--R) * -1); width: calc(var(--R) * 2); height: calc(var(--R) * 2);
  -webkit-mask-image: conic-gradient(from -90deg, #000 var(--sln-a), transparent 0); mask-image: conic-gradient(from -90deg, #000 var(--sln-a), transparent 0);
  animation: sln-draw 2.2s cubic-bezier(.3,.6,.2,1) both;
}
@keyframes sln-draw { from { --sln-a: 0deg; } to { --sln-a: 360deg; } }
.sln-arm { position: absolute; left: 0; top: 0; width: 0; height: 0; will-change: transform; }
.sln-ring-s { left: calc(var(--R)); top: calc(var(--r) * -1); width: calc(var(--r) * 2); height: calc(var(--r) * 2); opacity: .8; }
.sln-arm-r { animation: sln-roll-r 17s ease-in-out infinite alternate; }
.sln-arm-l { animation: sln-roll-l 21s ease-in-out infinite alternate; }
@keyframes sln-roll-r { from { transform: rotate(-17deg); } to { transform: rotate(15deg); } }
@keyframes sln-roll-l { from { transform: rotate(196deg); } to { transform: rotate(166deg); } }
.sln-spark {
  position: absolute; left: calc(var(--R) - 1.05cqw); top: -1.05cqw; width: 2.1cqw; height: 2.1cqw; min-width: 18px; min-height: 18px; background: #fff;
  clip-path: polygon(50% 0, 57% 43%, 100% 50%, 57% 57%, 50% 100%, 43% 57%, 0 50%, 43% 43%);
  animation: sln-twinkle 3.4s ease-in-out infinite;
}
.sln-arm-l .sln-spark { animation-delay: -1.7s; }
@keyframes sln-twinkle { 0%, 100% { transform: scale(.62) rotate(0deg); opacity: .7; } 50% { transform: scale(1.18) rotate(45deg); opacity: 1; } }
.sln-arm-m { animation: sln-orbit 24s linear infinite; }
@keyframes sln-orbit { from { transform: rotate(118deg); } to { transform: rotate(478deg); } }
.sln-moon { position: absolute; left: calc(var(--R) - .95cqw); top: -.95cqw; width: 1.9cqw; height: 1.9cqw; min-width: 14px; min-height: 14px; border-radius: 50%; background: #fff; box-shadow: 0 0 1.6cqw rgba(255,255,255,.45); }

/* nav */
.sln-nav { position: absolute; left: 0; right: 0; top: 2.6cqw; height: 3.5cqw; min-height: 40px; display: flex; align-items: center; justify-content: center; }
.sln-mark { position: absolute; left: 3.2cqw; font-size: max(20px, 2cqw); font-weight: 300; letter-spacing: .04em; line-height: 1; }
.sln-pill {
  width: 52cqw; height: 100%; display: flex; align-items: center; justify-content: space-around; padding: 0 2cqw; border-radius: 99px;
  background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.4);
  -webkit-backdrop-filter: blur(12px) saturate(1.2); backdrop-filter: blur(12px) saturate(1.2);
}
.sln-pill button { font-size: max(11px, .92cqw); font-weight: 400; letter-spacing: .09em; text-transform: uppercase; padding: .7em 1em; border-radius: 99px; transition: background .3s; }
.sln-pill button:hover { background: rgba(255,255,255,.14); }
.sln-menu { display: none; }
.sln-temp {
  position: absolute; right: 3cqw; width: 3.5cqw; height: 3.5cqw; min-width: 40px; min-height: 40px; border-radius: 50%;
  border: 1px solid rgba(255,255,255,.75) !important; font-size: max(12px, 1cqw) !important; font-weight: 400; font-variant-numeric: tabular-nums; letter-spacing: .01em;
  display: grid; place-items: center; transition: background .3s, color .3s;
}
.sln-temp:hover { background: #fff; color: var(--sln-ink) !important; }

/* the statement and the button */
.sln-say {
  position: absolute; left: 50%; top: 21cqh; margin: 0; width: 36cqw; transform: translateX(-50%); text-align: center;
  font-size: max(17px, 1.98cqw); line-height: 1.2; font-weight: 300; letter-spacing: -.005em; text-shadow: 0 1px 1.6cqw rgba(48,34,10,.5);
}
.sln-say span { display: block; }
.sln-cta {
  position: absolute; right: 3.4cqw; top: 36cqh; padding: 1.15em 1.9em !important; border-radius: 99px;
  background: #fff !important; color: var(--sln-ink) !important; font-size: max(12px, 1.02cqw) !important; font-weight: 500; letter-spacing: .08em; text-transform: uppercase;
  box-shadow: 0 .6cqw 2.4cqw -1cqw rgba(30,20,6,.6); transition: transform .35s cubic-bezier(.2,.9,.3,1.3), box-shadow .3s;
}
.sln-cta:hover { transform: translateY(-2px) scale(1.03); }
.sln-cta:active { transform: scale(.96); }

/* the name, very large and very thin, cut by the frame */
.sln-word {
  position: absolute; left: 50%; bottom: -.185em; transform: translateX(-50%); display: flex; white-space: nowrap; pointer-events: none;
  font-size: calc(188cqw / var(--sln-n)); line-height: 1; font-weight: 150; letter-spacing: -.012em; color: #fff;
}
.sln-l { position: relative; display: block; }
.sln-ghost { visibility: hidden; }
.sln-s { position: absolute; left: 0; top: 0; will-change: transform; }

/* phone: the picture is the screen */
@container sln (max-width: 700px) {
  .sln-meta { display: none; }
  .sln-frame { left: 0; right: 0; top: 0; bottom: 0; border-radius: 0; clip-path: none; }
  .sln-scene { --fx: .3; top: 0; }
  .sln-veil { background: linear-gradient(180deg, rgba(34,26,12,.46), rgba(34,26,12,.12) 34%, transparent 50%), linear-gradient(0deg, rgba(12,26,20,.55), transparent 36%); }
  .sln-orb { --R: 44cqw; --r: 40cqw; top: 56%; }
  .sln-nav { top: 62px; height: 44px; justify-content: flex-end; padding: 0 20px; gap: 10px; }
  .sln-mark { left: 22px; font-size: 24px; }
  .sln-pill { display: none; }
  .sln-menu {
    display: block; order: 2; height: 44px; padding: 0 20px !important; border-radius: 99px; background: rgba(255,255,255,.12) !important; border: 1px solid rgba(255,255,255,.45) !important;
    font-size: 12px !important; letter-spacing: .1em; text-transform: uppercase; -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  }
  .sln-temp { position: static; order: 1; width: 44px; height: 44px; font-size: 13px !important; }
  .sln-say { top: 146px; width: 84cqw; font-size: 23px; line-height: 1.22; }
  .sln-cta { right: auto; left: 50%; top: 284px; transform: translateX(-50%); font-size: 12.5px !important; }
  .sln-cta:hover { transform: translateX(-50%) scale(1.03); }
  .sln-cta:active { transform: translateX(-50%) scale(.96); }
  .sln-word { font-size: calc(190cqw / var(--sln-n)); }
}

@media (prefers-reduced-motion: reduce) {
  .sln-beam, .sln-ring-0, .sln-arm, .sln-spark { animation: none !important; }
  .sln-beam { opacity: .42; }
  .sln-arm-r { transform: rotate(0deg); }
  .sln-arm-l { transform: rotate(180deg); }
  .sln-arm-m { transform: rotate(118deg); }
  .sln-scene, .sln-orb { transform: none; }
  .sln-cta { transition: none; }
}
`;
