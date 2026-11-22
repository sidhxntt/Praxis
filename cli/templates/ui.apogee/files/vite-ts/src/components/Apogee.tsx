"use client";

/**
 * APOGEE · website hero
 *
 * The first screen of Apogee, one weekly letter about the night sky for people
 * who are busy. The page is one photograph that is alive: a tidal flat at deep
 * dusk, the last warm light on a dead-level horizon, and an enormous ringed
 * planet half-set behind it, finished by its own reflection in the wet sand.
 * Someone stands on a dark ridge beside a telescope, looking up.
 *
 * The sky turns. The planet is a real sphere drawn on a small canvas: its cloud
 * bands wrap round the limb and rotate, with the night side falling into the
 * colour of the sky. Its rings catch the light and carry the planet's shadow,
 * two moons go round (behind the disc, then in front), the stars wheel slowly
 * about the horizon, a meteor crosses every few seconds, two banks of low mist
 * flow along the water, and film grain lives over all of it. The pointer parts
 * the layers in depth; with no pointer the view drifts by itself.
 *
 * Type an email and press the pill: a point of light leaves the button, rises
 * on an arc and joins the rings, and the reader count goes up by one. Left
 * alone, the page shows this by itself every few seconds (silently).
 *
 * One file, React only. The typeface comes from Google Fonts (in the CSS).
 *
 *   <Apogee />
 *   <Apogee glow="#9fd8ff" turn={40} cta="SUBSCRIBE" onSubscribe={(email) => save(email)} />
 *
 * Props
 *   brand        the wordmark in the glass panel             "APOGEE"
 *   line1        the headline, first line                    "One letter a week."
 *   line2        the headline, second line                   "Worth looking up for."
 *   cta          the pill                                    "SEND IT TO ME"
 *   readers      the number of readers shown under the field  61204
 *   glow         the colour of the light (dot, rim, launch)  "#ffb07a"
 *   turn         seconds for one turn of the planet          70
 *   sky, flat    the photograph, above and below the horizon "/design/websites/apogee/sky.webp", "…/flat.webp"
 *   planet       the planet's cloud map, 2:1, wraps left-right "…/planet.webp"
 *   ridge        the ridge and the watcher, cut out          "…/ridge.webp"
 *   stars        the star field, a transparent square        "…/stars.webp"
 *   mistA, mistB two strips of mist that tile sideways       "…/mist-a.webp", "…/mist-b.webp"
 *   grain        a small tile of film grain                  "…/grain.webp"
 *   sound        a soft two-note rise when a letter is sent  true
 *   onSubscribe  called with the email when a visitor sends it
 *
 * Fills its container's width; height is var(--design-h, 100svh), never under
 * 640px. Responsive by container query: on a phone the planet takes the upper
 * half, the headline sits over its limb and the glass panel becomes a bottom
 * sheet with one group of links. One 2D canvas (560 px) for the planet and a
 * tiny one for its reflection; everything else is transforms. Paused off
 * screen and in a hidden tab. Reduced motion: one finished frame, no drift, no
 * self-play; sending still works and shows its result without the flight.
 * Keyboard: the field, the pill and every link are real controls.
 * Sound: silent until the visitor interacts, when `sound` is false, and when
 * <html data-cd-mute="1">. The AudioContext is created on the first sound.
 * The sent state resets itself after about 2.6 s so the next visitor can try
 * (remove the reset in `send` if you keep people on the page).
 */

import { useCallback, useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";

type Props = {
  brand?: string;
  line1?: string;
  line2?: string;
  cta?: string;
  readers?: number;
  glow?: string;
  turn?: number;
  sky?: string;
  flat?: string;
  planet?: string;
  ridge?: string;
  stars?: string;
  mistA?: string;
  mistB?: string;
  grain?: string;
  sound?: boolean;
  onSubscribe?: (email: string) => void;
};

/* ---- the planet ---- */
const N = 560; // the canvas the sphere is drawn on
const TW = 1024; // the cloud map, as it is read: 1024 × 512
const TH = 512;
const TILT = -14; // degrees: the axis, and with it the rings
const TILT_R = (TILT * Math.PI) / 180;
const RING = 2.2; // the rings' outer edge, in planet radii
const SQUASH = 0.26; // how open the rings are (1 = seen from above)
/* Two moons: orbit (planet radii), seconds for one round, where they start. */
const MOONS = [
  { a: 2.62, period: 52, at: 0.82 },
  { a: 3.25, period: 97, at: 0.37 },
];

/* What the page types into its own field when nobody is there. */
const DEMO = "ada@example.com";

const COLS: { title: string; links: string[] }[] = [
  { title: "Read", links: ["This week", "The archive", "Start here", "Sky calendar"] },
  { title: "Letter", links: ["Who writes it", "Sources", "Corrections"] },
  { title: "Help", links: ["Contact", "Privacy", "Unsubscribe"] },
];

const r2 = (n: number) => Math.round(n * 100) / 100;

/* ------------------------------------------------------------------ sound
   Two tiny sine notes, made in the browser. Silent when `sound` is false,
   when the page sets <html data-cd-mute="1">, and until the visitor has
   touched the page. The AudioContext is created on the first sound. */
function useRise(on: boolean) {
  const ctx = useRef<AudioContext | null>(null);
  useEffect(() => () => void ctx.current?.close().catch(() => {}), []);
  return useCallback(() => {
    if (!on || typeof window === "undefined") return;
    if (document.documentElement.dataset.cdMute === "1") return;
    const ua = (navigator as unknown as { userActivation?: { hasBeenActive: boolean } }).userActivation;
    if (ua && !ua.hasBeenActive) return;
    try {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      const a = (ctx.current ??= new AC());
      if (a.state === "suspended") void a.resume();
      [
        { f: 620, to: 780, at: 0 },
        { f: 930, to: 1180, at: 0.07 },
      ].forEach((b) => {
        const t = a.currentTime + b.at;
        const amp = a.createGain();
        amp.gain.setValueAtTime(0.0001, t);
        amp.gain.exponentialRampToValueAtTime(0.04, t + 0.004);
        amp.gain.exponentialRampToValueAtTime(0.0001, t + 0.058);
        amp.connect(a.destination);
        const o = a.createOscillator();
        o.type = "sine";
        o.frequency.setValueAtTime(b.f, t);
        o.frequency.exponentialRampToValueAtTime(b.to, t + 0.055);
        o.connect(amp);
        o.start(t);
        o.stop(t + 0.07);
      });
    } catch {
      /* sound is a nicety; never let it break the page */
    }
  }, [on]);
}

type Phase = "idle" | "fly" | "done" | "bad";
type Shot = { d: string; w: number; h: number; x: number; y: number; n: number };

export default function Apogee({
  brand = "APOGEE",
  line1 = "One letter a week.",
  line2 = "Worth looking up for.",
  cta = "SEND IT TO ME",
  readers = 61204,
  glow = "#ffb07a",
  turn = 70,
  sky = "/design/websites/apogee/sky.webp",
  flat = "/design/websites/apogee/flat.webp",
  planet = "/design/websites/apogee/planet.webp",
  ridge = "/design/websites/apogee/ridge.webp",
  stars = "/design/websites/apogee/stars.webp",
  mistA = "/design/websites/apogee/mist-a.webp",
  mistB = "/design/websites/apogee/mist-b.webp",
  grain = "/design/websites/apogee/grain.webp",
  sound = true,
  onSubscribe,
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const cvMirror = useRef<HTMLCanvasElement>(null);
  const lStars = useRef<HTMLDivElement>(null);
  const lPlanet = useRef<HTMLDivElement>(null);
  const lMirror = useRef<HTMLDivElement>(null);
  const lFlat = useRef<HTMLImageElement>(null);
  const lMistA = useRef<HTMLDivElement>(null);
  const lMistB = useRef<HTMLDivElement>(null);
  const lRidge = useRef<HTMLDivElement>(null);
  const moonA = useRef<HTMLSpanElement>(null);
  const moonB = useRef<HTMLSpanElement>(null);
  const pill = useRef<HTMLButtonElement>(null);

  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [extra, setExtra] = useState(0); // readers who joined on this page
  const [shot, setShot] = useState<Shot | null>(null);
  const [live, setLive] = useState(true);

  const rise = useRise(sound);
  const turnRef = useRef(turn);
  turnRef.current = Math.max(8, turn);
  const phaseRef = useRef<Phase>("idle");
  phaseRef.current = phase;
  const touched = useRef(-1e9); // when a person last used the form (performance.now)
  const selfTyped = useRef(false);
  const reduce = useRef(false);
  const timers = useRef<number[]>([]);
  const shots = useRef(0);
  const onSub = useRef(onSubscribe);
  onSub.current = onSubscribe;

  /* ---- send: the light leaves the pill and joins the rings ---- */
  const send = useCallback(
    (value: string, by: "person" | "page") => {
      if (phaseRef.current === "fly" || phaseRef.current === "done") return;
      const st = stage.current;
      const from = pill.current;
      const to = lPlanet.current;
      let next: Shot | null = null;
      if (st && from && to && !reduce.current) {
        const s = st.getBoundingClientRect();
        const k = s.width / (st.offsetWidth || 1); // the gallery may scale the whole page
        const w = st.offsetWidth;
        const h = st.offsetHeight;
        const b = from.getBoundingClientRect();
        const p = to.getBoundingClientRect();
        const u = w <= 700 ? (w / 100) * 2.6 : Math.min(w / 100, (h * 1.6) / 100);
        const R = 23 * u;
        // a place on the far side of the rings, up and to the right
        const th = -0.42;
        const ex = Math.cos(th) * R * 1.86;
        const ey = Math.sin(th) * R * 1.86 * SQUASH;
        const x1 = (p.left - s.left) / k + ex * Math.cos(TILT_R) - ey * Math.sin(TILT_R);
        const y1 = (p.top - s.top) / k + ex * Math.sin(TILT_R) + ey * Math.cos(TILT_R);
        const x0 = (b.left + b.width / 2 - s.left) / k;
        const y0 = (b.top + b.height / 2 - s.top) / k;
        const cx = x0 + (x1 - x0) * 0.42;
        const cy = Math.min(y0, y1) - Math.max(60, Math.abs(x1 - x0) * 0.34);
        shots.current += 1;
        next = { d: `M${r2(x0)} ${r2(y0)} Q${r2(cx)} ${r2(cy)} ${r2(x1)} ${r2(y1)}`, w, h, x: r2(x1), y: r2(y1), n: shots.current };
      }
      setShot(next);
      setPhase("fly");
      if (by === "person") rise();
      const flight = next ? 1250 : 60;
      timers.current.push(
        window.setTimeout(() => {
          setPhase("done");
          setExtra((n) => n + 1);
          if (by === "person") onSub.current?.(value);
        }, flight),
        // the page resets itself so the next visitor can try: remove this timer to keep the sent state
        window.setTimeout(() => {
          setPhase("idle");
          setEmail("");
          selfTyped.current = false;
        }, flight + 2600),
        window.setTimeout(() => setShot((s) => (s && next && s.n === next.n ? null : s)), flight + 3400),
      );
    },
    [rise],
  );

  const submit = (e: FormEvent) => {
    e.preventDefault();
    touched.current = performance.now();
    if (phase === "fly" || phase === "done") return;
    const value = selfTyped.current ? "" : email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      if (selfTyped.current) {
        selfTyped.current = false;
        setEmail("");
      }
      setPhase("bad");
      timers.current.push(window.setTimeout(() => setPhase((p) => (p === "bad" ? "idle" : p)), 520));
      return;
    }
    send(value, "person");
  };

  /* a person takes the field: whatever the page typed is cleared */
  const take = () => {
    touched.current = performance.now();
    if (selfTyped.current && phaseRef.current === "idle") {
      selfTyped.current = false;
      setEmail("");
    }
  };

  /* ---- on screen? in a visible tab? ---- */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let seen = true;
    const sync = () => setLive(seen && !document.hidden);
    const io = new IntersectionObserver(([e]) => {
      seen = e.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t));
    },
    [],
  );

  /* ---- the engine: the sphere, the moons, the depth ---- */
  useEffect(() => {
    const el = root.current;
    const st = stage.current;
    const canvas = cv.current;
    if (!el || !st || !canvas) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduce.current = mq.matches;
    const onMq = () => {
      reduce.current = mq.matches;
    };
    mq.addEventListener("change", onMq);

    const ctx = canvas.getContext("2d");
    const mctx = cvMirror.current?.getContext("2d") ?? null;

    /* For every pixel of the disc: which column and row of the cloud map it shows
       (an orthographic sphere: columns crowd together toward the limb). */
    const half = N / 2;
    const lutP = new Int32Array(N * N);
    const lutU = new Uint16Array(N * N);
    const lutV = new Int32Array(N * N);
    let n = 0;
    for (let y = 0; y < N; y++) {
      const sy = (y + 0.5 - half) / half;
      for (let x = 0; x < N; x++) {
        const sx = (x + 0.5 - half) / half;
        const d = sx * sx + sy * sy;
        if (d >= 1) continue;
        const z = Math.sqrt(1 - d);
        const lon = Math.atan2(sx, z); // −π/2 … π/2
        const lat = Math.asin(sy);
        lutP[n] = y * N + x;
        lutU[n] = Math.floor((lon / (Math.PI * 2) + 0.5) * TW) % TW;
        lutV[n] = Math.min(TH - 1, Math.floor((lat / Math.PI + 0.5) * TH)) * TW;
        n++;
      }
    }
    const total = n;

    let tex: Uint32Array | null = null;
    const out = ctx ? ctx.createImageData(N, N) : null;
    const out32 = out ? new Uint32Array(out.data.buffer) : null;
    let dead = false;
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (dead) return;
      try {
        const c = document.createElement("canvas");
        c.width = TW;
        c.height = TH;
        const g = c.getContext("2d");
        if (!g) return;
        g.drawImage(img, 0, 0, TW, TH);
        tex = new Uint32Array(g.getImageData(0, 0, TW, TH).data.buffer);
        draw(rot);
        mctx?.drawImage(canvas, 0, 0, 128, 128);
        canvas.dataset.on = "1";
      } catch {
        tex = null; // a picture from another origin without CORS: the flat map under the canvas stays
      }
    };
    img.src = planet;

    /* One frame of the sphere, turned by `turns` (0…1). Two neighbouring columns
       are mixed, so a slow turn glides instead of stepping a texel at a time. */
    function draw(turns: number) {
      if (!tex || !out || !out32 || !ctx) return;
      const pos = (((turns % 1) + 1) % 1) * TW;
      const shift = Math.floor(pos);
      const f = Math.round((pos - shift) * 256);
      const g = 256 - f;
      const mask = TW - 1;
      for (let i = 0; i < total; i++) {
        const u = (lutU[i] + shift) & mask;
        const row = lutV[i];
        const a = tex[row + u];
        const b = tex[row + ((u + 1) & mask)];
        const rb = (((a & 0xff00ff) * g + (b & 0xff00ff) * f) >>> 8) & 0xff00ff;
        const gg = (((a & 0x00ff00) * g + (b & 0x00ff00) * f) >>> 8) & 0x00ff00;
        out32[lutP[i]] = 0xff000000 | rb | gg;
      }
      ctx.putImageData(out, 0, 0);
    }

    /* ---- depth: a real pointer, or a slow drift when there is none ---- */
    let px = 0;
    let py = 0;
    let tx = 0;
    let ty = 0;
    let pointerAt = -1e9;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = el.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
      pointerAt = performance.now();
    };
    const onLeave = () => {
      pointerAt = -1e9;
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    let rot = 0.18;
    let last = 0;
    let frame = 0;
    let raf = 0;
    let t0 = 0;
    const moons = [moonA.current, moonB.current];
    const set = (node: HTMLElement | null, x: number, y: number) => {
      if (node) node.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!t0) t0 = now;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      const t = (now - t0) / 1000;
      const w = st.offsetWidth;
      const h = st.offsetHeight;
      const phone = w <= 700;
      const u = phone ? (w / 100) * 2.6 : Math.min(w / 100, (h * 1.6) / 100);

      // the planet turns
      rot += dt / turnRef.current;
      draw(rot);
      if (mctx && frame % 3 === 0 && tex) mctx.drawImage(canvas, 0, 0, 128, 128);
      frame++;

      // the view: follow the pointer, or wander
      if (now - pointerAt > 1400) {
        tx = Math.sin(t * 0.21) * 0.85;
        ty = Math.sin(t * 0.29 + 1.1) * 0.7;
      }
      px += (tx - px) * 0.05;
      py += (ty - py) * 0.05;
      set(lStars.current, -px * u * 0.4, -py * u * 0.22);
      set(lPlanet.current, -px * u * 0.95, -py * u * 0.5);
      set(lMirror.current, -px * u * 0.95, py * u * 0.5);
      set(lFlat.current, -px * u * 0.55, 0);
      set(lMistB.current, -px * u * 1.35, -py * u * 0.3);
      set(lRidge.current, -px * u * 2.5, -py * u * 0.75);
      set(lMistA.current, -px * u * 3.1, -py * u * 0.9);

      // the moons: round the planet in the plane of the rings, hidden while they pass behind it
      const R = 23 * u;
      for (let i = 0; i < MOONS.length; i++) {
        const m = MOONS[i];
        const node = moons[i];
        if (!node) continue;
        const a = (m.at + t / m.period) * Math.PI * 2;
        const ex = Math.cos(a) * m.a * R;
        const ey = Math.sin(a) * m.a * R * SQUASH;
        const x = ex * Math.cos(TILT_R) - ey * Math.sin(TILT_R);
        const y = ex * Math.sin(TILT_R) + ey * Math.cos(TILT_R);
        const behind = Math.sin(a) < 0 && x * x + y * y < R * R * 1.02;
        set(node, x, y);
        node.style.opacity = behind ? "0" : "1";
      }
    };

    /* one still frame for reduced motion, and before the loop starts */
    const still = () => {
      const w = st.offsetWidth;
      const h = st.offsetHeight;
      const u = w <= 700 ? (w / 100) * 2.6 : Math.min(w / 100, (h * 1.6) / 100);
      const R = 23 * u;
      MOONS.forEach((m, i) => {
        const a = m.at * Math.PI * 2;
        const ex = Math.cos(a) * m.a * R;
        const ey = Math.sin(a) * m.a * R * SQUASH;
        set(moons[i], ex * Math.cos(TILT_R) - ey * Math.sin(TILT_R), ex * Math.sin(TILT_R) + ey * Math.cos(TILT_R));
      });
    };
    still();

    let running = false;
    const start = () => {
      if (running || reduce.current || el.dataset.live !== "true") return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    start();
    // the root's data-live attribute is the switch (set from React state below)
    const mo = new MutationObserver(() => (el.dataset.live === "true" ? start() : stop()));
    mo.observe(el, { attributes: true, attributeFilter: ["data-live"] });
    const ro = new ResizeObserver(() => {
      if (!running) still();
    });
    ro.observe(st);

    return () => {
      dead = true;
      stop();
      mo.disconnect();
      ro.disconnect();
      mq.removeEventListener("change", onMq);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [planet]);

  /* ---- self-play: the page types an address and sends it, every few seconds ---- */
  useEffect(() => {
    if (!live) return;
    let mode: "wait" | "type" | "hold" = "wait";
    let next = performance.now() + 1100;
    let i = 0;
    const id = window.setInterval(() => {
      if (reduce.current) return;
      const now = performance.now();
      if (now - touched.current < 6000) {
        mode = "wait";
        next = now + 1500;
        return;
      }
      if (mode === "wait") {
        if (now < next || phaseRef.current !== "idle") return;
        mode = "type";
        i = 0;
        selfTyped.current = true;
        return;
      }
      if (mode === "type") {
        i++;
        setEmail(DEMO.slice(0, i));
        if (i >= DEMO.length) {
          mode = "hold";
          next = now + 420;
        }
        return;
      }
      if (now >= next) {
        send(DEMO, "page");
        mode = "wait";
        next = now + 1250 + 2600 + 3300;
      }
    }, 62);
    return () => window.clearInterval(id);
  }, [live, send]);

  const count = (readers + extra).toLocaleString("en-US");
  const busy = phase === "fly" || phase === "done";
  const vars = { "--apg-glow": glow } as CSSProperties;
  const bg = (src: string) => ({ backgroundImage: `url(${src})` }) as CSSProperties;

  /* the planet, as it stands in the sky and (soft, flipped) in the water */
  const body = (mirror: boolean) => (
    <>
      <span className="apg-ring apg-ring-back">
        <i />
      </span>
      <span className="apg-disc">
        <span className="apg-globe" style={bg(planet)}>
          <canvas ref={mirror ? cvMirror : cv} width={mirror ? 128 : N} height={mirror ? 128 : N} />
        </span>
        <span className="apg-shade" />
      </span>
      <span className="apg-ring apg-ring-front">
        <i />
      </span>
    </>
  );

  return (
    <div ref={root} className="apg-root" style={vars} data-live={live} data-phase={phase}>
      <style>{css}</style>
      <div ref={stage} className="apg-stage">
        {/* ------------------------------------------------ the photograph */}
        <div className="apg-scene" aria-hidden="true">
          <div className="apg-sky">
            <img className="apg-skyimg" src={sky} alt="" draggable={false} />
            <div className="apg-starbox">
              <div ref={lStars} className="apg-par">
                <img className="apg-wheel" src={stars} alt="" draggable={false} />
              </div>
            </div>
            <span className="apg-meteor apg-meteor-a" />
            <span className="apg-meteor apg-meteor-b" />
            <span className="apg-meteor apg-meteor-c" />
            <div className="apg-planet">
              <div ref={lPlanet} className="apg-par">
                {body(false)}
                <span ref={moonA} className="apg-moon" />
                <span ref={moonB} className="apg-moon apg-moon-b" />
              </div>
            </div>
            <span className="apg-haze" />
          </div>
          <div className="apg-flat">
            <img ref={lFlat} className="apg-flatimg" src={flat} alt="" draggable={false} />
            <div className="apg-water">
              <div className="apg-planet apg-planet-mirror">
                <div ref={lMirror} className="apg-par">
                  <div className="apg-flip">{body(true)}</div>
                </div>
              </div>
            </div>
            <span className="apg-sheen" />
          </div>
          <div className="apg-mist apg-mist-b">
            <div ref={lMistB} className="apg-par">
              <i style={bg(mistB)} />
            </div>
          </div>
          <div className="apg-ridge">
            <div ref={lRidge} className="apg-par">
              <img src={ridge} alt="" draggable={false} />
            </div>
          </div>
          <div className="apg-mist apg-mist-a">
            <div ref={lMistA} className="apg-par">
              <i style={bg(mistA)} />
            </div>
          </div>
          <span className="apg-vig" />
          <span className="apg-grain" style={bg(grain)} />
        </div>

        {/* ------------------------------------------------ the page */}
        <header className="apg-top">
          <span className="apg-tag">
            <i />
            No. 214 is out
          </span>
          <nav className="apg-links" aria-label="Apogee">
            <button type="button" className="apg-link apg-link-wide">
              The archive
            </button>
            <button type="button" className="apg-link">
              Read this week&rsquo;s letter
              <svg viewBox="0 0 12 12" aria-hidden="true">
                <path d="M3 9l6-6M4.2 3H9v4.8" />
              </svg>
            </button>
          </nav>
        </header>

        <main className="apg-copy">
          <h1 className="apg-h1">
            <span>{line1}</span>
            <span>{line2}</span>
          </h1>
          <form className="apg-form" onSubmit={submit} noValidate data-bad={phase === "bad"}>
            {phase === "done" ? (
              <span className="apg-sent" role="status">
                You&rsquo;re in. See you Sunday.
              </span>
            ) : (
              <input
                className="apg-input"
                type="email"
                inputMode="email"
                autoComplete="email"
                aria-label="Your email"
                placeholder="Your email"
                value={email}
                readOnly={phase === "fly"}
                onFocus={take}
                onPointerDown={take}
                onKeyDown={take}
                onChange={(e) => {
                  touched.current = performance.now();
                  selfTyped.current = false;
                  setEmail(e.target.value);
                }}
              />
            )}
            <button ref={pill} type="submit" className="apg-send" aria-disabled={busy} onPointerDown={() => (touched.current = performance.now())}>
              {phase === "done" ? (
                <>
                  <svg viewBox="0 0 14 14" aria-hidden="true">
                    <path d="M2.5 7.4l3 3 6-6.6" />
                  </svg>
                  SENT
                </>
              ) : phase === "fly" ? (
                "ON ITS WAY"
              ) : (
                cta
              )}
            </button>
          </form>
          <p className="apg-note">
            Sundays, 7 minutes, no adverts.{" "}
            <b key={count} className="apg-count">
              {count}
            </b>{" "}
            readers.
          </p>
        </main>

        {/* the light that leaves the pill for the rings */}
        {shot ? (
          <svg key={shot.n} className="apg-fx" viewBox={`0 0 ${shot.w} ${shot.h}`} preserveAspectRatio="none" aria-hidden="true">
            <path className="apg-trail apg-trail-soft" d={shot.d} pathLength={1} />
            <path className="apg-trail" d={shot.d} pathLength={1} />
            <circle className="apg-ping" cx={shot.x} cy={shot.y} r={5} />
            <circle className="apg-spark" cx={shot.x} cy={shot.y} r={2.6} />
          </svg>
        ) : null}

        <footer className="apg-panel">
          <div className="apg-prow">
            <div className="apg-about">
              <div className="apg-brand">
                <svg viewBox="0 0 32 32" aria-hidden="true">
                  <ellipse cx="16" cy="16" rx="13.2" ry="6.2" transform="rotate(-28 16 16)" />
                  <circle className="apg-brand-core" cx="16" cy="16" r="3.3" />
                  <circle className="apg-brand-far" cx="27.6" cy="9.8" r="2.3" />
                </svg>
                {brand}
              </div>
              <p>What is in the sky this week, and why it matters, in plain words.</p>
            </div>
            <div className="apg-cols">
              {COLS.map((c) => (
                <div key={c.title} className="apg-col">
                  <h2>{c.title}</h2>
                  <ul>
                    {c.links.map((l) => (
                      <li key={l}>
                        <button type="button" className="apg-plink">
                          {l}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="apg-pfoot">
            <span>Next issue: Sunday 23 November</span>
            <span className="apg-keys">
              <button type="button" aria-label="The feed">
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M4 15.9a.1.1 0 100-.2M4 10.2a5.8 5.8 0 015.8 5.8M4 4.4A11.6 11.6 0 0115.6 16" />
                </svg>
              </button>
              <button type="button" aria-label="Write to us">
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M3 5.5h14v9H3zM3.4 6l6.6 5 6.6-5" />
                </svg>
              </button>
              <button type="button" aria-label="Open the latest letter">
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M6 14l8-8M7.5 6H14v6.5" />
                </svg>
              </button>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

const css = `
@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500&display=swap");

.apg-root {
  container-type: inline-size;
  position: relative;
  width: 100%;
  height: var(--design-h, 100svh);
  min-height: 640px;
  overflow: hidden;
  isolation: isolate;
  background: #11475a;
  color: #fff;
  font-family: "Outfit", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  -webkit-font-smoothing: antialiased;
  --apg-glow: #ffb07a;
  --apg-shade: 11, 46, 60;
  /* one unit: a hundredth of the width, or less when the page is short */
  --u: min(1cqi, 1.6cqh);
  --apg-hz: 56%;
  --apg-px: 57%;
  --apg-rise: 4.5;
}
.apg-root * { box-sizing: border-box; }
.apg-stage { position: absolute; inset: 0; container-type: size; container-name: apgs; overflow: hidden; }
.apg-scene { position: absolute; inset: 0; pointer-events: none; user-select: none; }
.apg-par { position: absolute; inset: 0; will-change: transform; }

/* ---- sky ---- */
.apg-sky { position: absolute; left: 0; right: 0; top: 0; height: var(--apg-hz); overflow: hidden; }
.apg-skyimg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 100%; }
.apg-starbox { position: absolute; inset: 0; -webkit-mask-image: linear-gradient(to bottom, #000 0, #000 30%, transparent 80%); mask-image: linear-gradient(to bottom, #000 0, #000 30%, transparent 80%); }
.apg-wheel {
  position: absolute; left: 50%; top: 100%;
  width: calc(100cqi + 113cqh); height: calc(100cqi + 113cqh);
  width: calc(2 * hypot(50cqi, 56cqh) + 8px); height: calc(2 * hypot(50cqi, 56cqh) + 8px);
  translate: -50% -50%;
  opacity: .92;
  animation: apg-wheel 420s linear infinite;
}
@keyframes apg-wheel { to { rotate: -360deg; } }

.apg-meteor {
  position: absolute; width: calc(var(--u) * 10); height: max(1.5px, calc(var(--u) * .12)); border-radius: 2px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.2) 40%, #fff);
  box-shadow: 0 0 calc(var(--u) * .5) rgba(255,255,255,.35);
  transform-origin: 100% 50%; opacity: 0;
}
.apg-meteor-a { left: 9%; top: 9%; animation: apg-meteor-a 7s linear infinite; }
.apg-meteor-b { left: 66%; top: 5%; width: calc(var(--u) * 6.5); animation: apg-meteor-b 11s linear -3.2s infinite; }
.apg-meteor-c { left: 30%; top: 24%; width: calc(var(--u) * 8); animation: apg-meteor-a 17s linear -9s infinite; }
@keyframes apg-meteor-a {
  0% { transform: translate3d(0, 0, 0) rotate(23deg); opacity: 0; }
  1.2% { opacity: 1; }
  9% { transform: translate3d(calc(var(--u) * 27), calc(var(--u) * 11.5), 0) rotate(23deg); opacity: 0; }
  100% { transform: translate3d(calc(var(--u) * 27), calc(var(--u) * 11.5), 0) rotate(23deg); opacity: 0; }
}
@keyframes apg-meteor-b {
  0% { transform: translate3d(0, 0, 0) rotate(27deg); opacity: 0; }
  1% { opacity: .9; }
  5% { transform: translate3d(calc(var(--u) * 15), calc(var(--u) * 7.6), 0) rotate(27deg); opacity: 0; }
  100% { transform: translate3d(calc(var(--u) * 15), calc(var(--u) * 7.6), 0) rotate(27deg); opacity: 0; }
}

/* ---- the planet: a point (its centre) that everything hangs from ---- */
.apg-planet { position: absolute; left: var(--apg-px); top: calc(100% - var(--u) * var(--apg-rise)); width: 0; height: 0; }
.apg-planet > .apg-par { inset: auto; left: 0; top: 0; width: 0; height: 0; }
.apg-disc {
  position: absolute; left: calc(var(--u) * -23); top: calc(var(--u) * -23); width: calc(var(--u) * 46); height: calc(var(--u) * 46);
  border-radius: 50%; overflow: hidden; background: rgb(var(--apg-shade));
  box-shadow: 0 0 calc(var(--u) * 5) color-mix(in srgb, var(--apg-glow) 22%, transparent);
}
.apg-globe { position: absolute; inset: 0; rotate: ${TILT}deg; background-size: 200% 100%; background-position: 36% 50%; }
.apg-globe canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; opacity: 0; }
.apg-globe canvas[data-on="1"], .apg-planet-mirror .apg-globe canvas { opacity: 1; }
/* the light comes from under the horizon on the left: a lit limb there, the rest falls into the sky's own colour */
.apg-shade {
  position: absolute; inset: 0; border-radius: 50%;
  background:
    radial-gradient(circle at 50% 50%, transparent 0 63%, rgba(var(--apg-shade), .34) 86%, rgba(var(--apg-shade), .62) 100%),
    radial-gradient(circle at 20% 96%, transparent 0 38%, rgba(var(--apg-shade), .36) 54%, rgba(var(--apg-shade), .8) 69%, rgba(var(--apg-shade), .95) 86%),
    linear-gradient(200deg, rgba(8, 44, 58, .3), transparent 42%);
  box-shadow:
    inset calc(var(--u) * .5) calc(var(--u) * -.4) calc(var(--u) * 1.5) color-mix(in srgb, var(--apg-glow) 46%, transparent),
    inset calc(var(--u) * .12) calc(var(--u) * -.1) calc(var(--u) * .35) rgba(255, 244, 228, .5);
}

.apg-ring {
  position: absolute; left: calc(var(--u) * -23 * ${RING}); top: calc(var(--u) * -23 * ${RING}); width: calc(var(--u) * 46 * ${RING}); height: calc(var(--u) * 46 * ${RING});
  border-radius: 50%; transform: rotate(${TILT}deg) scaleY(${SQUASH}); overflow: hidden;
  background:
    conic-gradient(from 31deg, rgba(var(--apg-shade), .96) 0 23deg, rgba(var(--apg-shade), 0) 37deg 323deg, rgba(var(--apg-shade), .96) 337deg 360deg),
    radial-gradient(closest-side, #f3d8c2 0 60%, #ffe9d2 67%, #f6cdae 74%, #fff0de 79%, #e9c3a8 86%, #f8dcc4 93%, #e2c0aa 100%);
  -webkit-mask-image: radial-gradient(closest-side, transparent 57.4%, rgba(0,0,0,.26) 58.4%, rgba(0,0,0,.34) 64.6%, rgba(0,0,0,.86) 66.2%, rgba(0,0,0,.7) 72.5%, rgba(0,0,0,.92) 77.5%, rgba(0,0,0,.78) 81.4%, rgba(0,0,0,.07) 82.4%, rgba(0,0,0,.07) 84.6%, rgba(0,0,0,.58) 85.6%, rgba(0,0,0,.46) 91.5%, rgba(0,0,0,.6) 96%, transparent 98.4%);
  mask-image: radial-gradient(closest-side, transparent 57.4%, rgba(0,0,0,.26) 58.4%, rgba(0,0,0,.34) 64.6%, rgba(0,0,0,.86) 66.2%, rgba(0,0,0,.7) 72.5%, rgba(0,0,0,.92) 77.5%, rgba(0,0,0,.78) 81.4%, rgba(0,0,0,.07) 82.4%, rgba(0,0,0,.07) 84.6%, rgba(0,0,0,.58) 85.6%, rgba(0,0,0,.46) 91.5%, rgba(0,0,0,.6) 96%, transparent 98.4%);
  opacity: .9;
}
.apg-ring-back { clip-path: inset(0 0 50% 0); }
.apg-ring-front { clip-path: inset(50% 0 0 0); }
/* light that travels round the rings: a few brighter and dimmer spokes, turning with them */
.apg-ring i {
  position: absolute; inset: 0; border-radius: 50%;
  background: conic-gradient(from 0deg, rgba(255,255,255,0) 0 8%, rgba(255,255,255,.34) 14%, rgba(255,255,255,0) 22% 36%, rgba(20,48,58,.26) 44%, rgba(255,255,255,0) 52% 63%, rgba(255,255,255,.28) 70%, rgba(255,255,255,0) 78% 88%, rgba(20,48,58,.2) 94%, rgba(255,255,255,0) 100%);
  animation: apg-spokes 38s linear infinite;
}
@keyframes apg-spokes { to { rotate: 360deg; } }

.apg-moon {
  position: absolute; left: calc(var(--u) * -.62); top: calc(var(--u) * -.62); width: calc(var(--u) * 1.24); height: calc(var(--u) * 1.24); border-radius: 50%;
  background: radial-gradient(circle at 24% 72%, #fff4e6 0 18%, #e7c9b2 40%, rgb(var(--apg-shade)) 74%);
  box-shadow: 0 0 calc(var(--u) * .9) color-mix(in srgb, var(--apg-glow) 40%, transparent);
  transition: opacity .5s; will-change: transform;
}
.apg-moon-b { left: calc(var(--u) * -.36); top: calc(var(--u) * -.36); width: calc(var(--u) * .72); height: calc(var(--u) * .72); }

.apg-haze {
  position: absolute; left: 0; right: 0; bottom: 0; height: 34%;
  background:
    radial-gradient(60% 100% at 8% 100%, rgba(255, 150, 84, .42), rgba(255, 150, 84, 0) 70%),
    linear-gradient(to top, rgba(232, 128, 96, .44), rgba(214, 140, 112, .12) 50%, rgba(214, 140, 112, 0));
}

/* ---- the flat, and the planet again in it ---- */
.apg-flat { position: absolute; left: 0; right: 0; top: var(--apg-hz); bottom: 0; overflow: hidden; }
.apg-flatimg { position: absolute; left: -3%; top: 0; width: 106%; height: 100%; object-fit: cover; object-position: 50% 0; will-change: transform; }
.apg-water {
  position: absolute; inset: 0; mix-blend-mode: screen; opacity: .6;
  -webkit-mask-image: linear-gradient(to bottom, #000 0, rgba(0,0,0,.75) calc(var(--u) * 6), transparent calc(var(--u) * 19));
  mask-image: linear-gradient(to bottom, #000 0, rgba(0,0,0,.75) calc(var(--u) * 6), transparent calc(var(--u) * 19));
}
.apg-planet-mirror { top: calc(var(--u) * var(--apg-rise)); --apg-shade: 0, 0, 0; }
.apg-flip { position: absolute; left: 0; top: 0; width: 0; height: 0; transform: scaleY(-1.12); }
.apg-planet-mirror .apg-disc { box-shadow: none; }
.apg-planet-mirror .apg-ring i { animation: none; }
.apg-sheen { position: absolute; left: 0; right: 0; top: 0; height: calc(var(--u) * 1.4); background: linear-gradient(to bottom, rgba(255, 196, 150, .5), rgba(255, 196, 150, 0)); }

/* ---- mist: two banks, one behind the ridge, one in front ---- */
.apg-mist { position: absolute; left: 0; right: 0; height: calc(var(--u) * 13); }
.apg-mist-b { top: calc(var(--apg-hz) - var(--u) * 8.6); opacity: .62; }
.apg-mist-a { top: calc(var(--apg-hz) + var(--u) * 1.6); height: calc(var(--u) * 11.5); opacity: .4; }
.apg-mist i {
  position: absolute; left: 0; top: 0; height: 100%; width: calc(var(--u) * 13 * 5.294 * 6);
  background-repeat: repeat-x; background-size: 16.6667% 100%;
  animation: apg-flow 64s linear infinite; will-change: transform;
}
.apg-mist-a i { width: calc(var(--u) * 11.5 * 5.294 * 6); animation-duration: 41s; animation-direction: reverse; }
@keyframes apg-flow { to { transform: translate3d(-33.3333%, 0, 0); } }

/* ---- the ridge and the watcher ---- */
.apg-ridge {
  position: absolute; left: 37%; bottom: calc(var(--u) * var(--apg-ridge, 14.5));
  width: calc(var(--u) * 142.9); height: calc(var(--u) * 14.4); margin-left: calc(var(--u) * -65.3);
}
.apg-ridge img { display: block; width: 100%; height: 100%; }
.apg-ridge .apg-par::after { content: ""; position: absolute; left: 0; right: 0; top: 99.4%; height: calc(var(--u) * 60); background: linear-gradient(#0a1415, #060c0d 40%); }

.apg-vig {
  position: absolute; inset: 0;
  background:
    radial-gradient(120% 70% at 50% 0%, rgba(6, 40, 54, .42), rgba(6, 40, 54, 0) 68%),
    linear-gradient(to top, rgba(2, 8, 10, .5), rgba(2, 8, 10, 0) 26%);
}
.apg-grain { position: absolute; inset: -80px; background-size: 150px 150px; opacity: .15; animation: apg-grain .72s steps(1, end) infinite; will-change: transform; }
@keyframes apg-grain {
  0% { transform: translate3d(0, 0, 0); }
  12.5% { transform: translate3d(-37px, 23px, 0); }
  25% { transform: translate3d(41px, -52px, 0); }
  37.5% { transform: translate3d(-64px, -18px, 0); }
  50% { transform: translate3d(22px, 61px, 0); }
  62.5% { transform: translate3d(58px, 14px, 0); }
  75% { transform: translate3d(-19px, -66px, 0); }
  87.5% { transform: translate3d(-71px, 44px, 0); }
}

/* ---- the page ---- */
.apg-top {
  position: absolute; z-index: 3; left: calc(var(--u) * 2.5); right: calc(var(--u) * 2.5); top: calc(var(--u) * 2);
  display: flex; align-items: center; justify-content: space-between; font-size: max(11px, calc(var(--u) * 1.02));
}
.apg-tag {
  display: inline-flex; align-items: center; gap: .65em; padding: .52em 1em .52em .85em; border-radius: 99px;
  border: 1px solid rgba(255,255,255,.24); background: rgba(255,255,255,.09); letter-spacing: .09em; text-transform: uppercase; font-size: .84em;
}
.apg-tag i { width: .52em; height: .52em; border-radius: 50%; background: var(--apg-glow); box-shadow: 0 0 .9em var(--apg-glow); animation: apg-pulse 2.4s ease-in-out infinite; }
@keyframes apg-pulse { 50% { opacity: .35; transform: scale(.8); } }
.apg-links { display: flex; align-items: center; gap: 2.3em; }
.apg-link {
  appearance: none; background: none; border: 0; padding: .3em 0; margin: 0; font: inherit; color: rgba(255,255,255,.9); cursor: pointer;
  display: inline-flex; align-items: center; gap: .45em; border-bottom: 1px solid transparent; transition: border-color .25s, color .25s;
}
.apg-link:hover { border-color: rgba(255,255,255,.6); color: #fff; }
.apg-link svg { width: .78em; height: .78em; fill: none; stroke: currentColor; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
.apg-link-wide { color: rgba(255,255,255,.68); }

.apg-copy { position: absolute; z-index: 3; left: 0; right: 0; top: calc(var(--u) * 6.9); display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 4%; }
.apg-h1 { margin: 0; font-weight: 300; font-size: calc(var(--u) * 6.3); line-height: 1.04; letter-spacing: -.024em; text-shadow: 0 .03em .5em rgba(6, 34, 46, .4); }
.apg-h1 span { display: block; animation: apg-rise .9s cubic-bezier(.2,.8,.2,1) both; }
.apg-h1 span + span { animation-delay: .12s; }
@keyframes apg-rise { from { opacity: 0; transform: translate3d(0, .22em, 0); } }

.apg-form {
  position: relative; margin-top: calc(var(--u) * 2.5); width: calc(var(--u) * 37); max-width: 100%; height: calc(var(--u) * 4.7); padding: calc(var(--u) * .42);
  display: flex; align-items: center; border-radius: 99px;
  background: rgba(198, 224, 230, .17); border: 1px solid rgba(255,255,255,.32);
  -webkit-backdrop-filter: blur(16px) saturate(1.15); backdrop-filter: blur(16px) saturate(1.15);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.2), 0 calc(var(--u) * 1.2) calc(var(--u) * 3) rgba(4, 22, 30, .26);
  transition: border-color .3s, box-shadow .3s;
}
.apg-form:focus-within { border-color: rgba(255,255,255,.7); }
.apg-form[data-bad="true"] { animation: apg-no .42s cubic-bezier(.3,.6,.3,1); border-color: color-mix(in srgb, var(--apg-glow) 80%, #fff); }
@keyframes apg-no { 20% { transform: translate3d(-7px,0,0); } 45% { transform: translate3d(6px,0,0); } 70% { transform: translate3d(-3px,0,0); } }
.apg-input {
  flex: 1; min-width: 0; height: 100%; padding: 0 calc(var(--u) * 1.7); background: none; border: 0; outline: 0; color: #fff;
  font: inherit; font-size: max(14px, calc(var(--u) * 1.34)); font-weight: 300; letter-spacing: .005em; text-align: left;
}
.apg-input::placeholder { color: rgba(255,255,255,.66); }
.apg-sent { flex: 1; min-width: 0; padding: 0 calc(var(--u) * 1.7); text-align: left; font-size: max(14px, calc(var(--u) * 1.34)); font-weight: 300; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; animation: apg-rise .5s cubic-bezier(.2,.8,.2,1) both; }
.apg-send {
  appearance: none; flex: none; height: 100%; min-width: calc(var(--u) * 13.4); padding: 0 calc(var(--u) * 2.3); border-radius: 99px; cursor: pointer;
  border: 1px solid rgba(255,255,255,.16); background: rgba(10, 34, 44, .66); color: #fff;
  font: inherit; font-size: max(11px, calc(var(--u) * 1.08)); font-weight: 400; letter-spacing: .1em; white-space: nowrap;
  display: inline-flex; align-items: center; justify-content: center; gap: .55em;
  transition: background .35s, transform .22s cubic-bezier(.3,1.7,.5,1), box-shadow .35s;
}
.apg-send:hover { background: rgba(10, 34, 44, .82); }
.apg-send:active { transform: scale(.96); }
.apg-send:focus-visible, .apg-link:focus-visible, .apg-plink:focus-visible, .apg-keys button:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
.apg-send svg { width: 1.05em; height: 1.05em; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.apg-root[data-phase="fly"] .apg-send { transform: scale(.96); box-shadow: 0 0 calc(var(--u) * 1.6) color-mix(in srgb, var(--apg-glow) 60%, transparent); }
.apg-root[data-phase="done"] .apg-send { background: color-mix(in srgb, var(--apg-glow) 82%, #fff); color: #10262e; border-color: transparent; }
.apg-note { margin: calc(var(--u) * 1.25) 0 0; font-size: max(11.5px, calc(var(--u) * 1.04)); font-weight: 300; color: rgba(255,255,255,.78); text-shadow: 0 0 1em rgba(6, 34, 46, .5); }
.apg-count { display: inline-block; font-weight: 400; color: #fff; font-variant-numeric: tabular-nums; animation: apg-tick .5s cubic-bezier(.3,1.6,.5,1); }
@keyframes apg-tick { from { transform: translate3d(0, -.45em, 0); opacity: 0; } }

/* ---- the light on its way ---- */
.apg-fx { position: absolute; z-index: 4; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; }
.apg-trail { fill: none; stroke: #fff; stroke-width: 2.4; stroke-linecap: round; stroke-dasharray: .13 2; stroke-dashoffset: .13; animation: apg-fly 1.25s cubic-bezier(.5,.05,.3,1) forwards; }
.apg-trail-soft { stroke: var(--apg-glow); stroke-width: 9; opacity: .32; stroke-dasharray: .2 2; stroke-dashoffset: .2; }
@keyframes apg-fly { to { stroke-dashoffset: -1.02; } }
.apg-ping { fill: none; stroke: #fff; stroke-width: 1.5; transform-box: fill-box; transform-origin: center; opacity: 0; animation: apg-ping 1s cubic-bezier(.2,.7,.2,1) 1.16s both; }
@keyframes apg-ping { 0% { transform: scale(.4); opacity: .95; } 100% { transform: scale(7); opacity: 0; } }
.apg-spark { fill: #fff; opacity: 0; filter: drop-shadow(0 0 5px var(--apg-glow)); animation: apg-spark 3.3s ease-out 1.16s both; }
@keyframes apg-spark { 0% { opacity: 1; } 60% { opacity: .9; } 100% { opacity: 0; } }

/* ---- the glass panel ---- */
.apg-panel {
  position: absolute; z-index: 3; left: calc(var(--u) * 1.25); right: calc(var(--u) * 1.25); bottom: calc(var(--u) * 1.25);
  padding: calc(var(--u) * 2) calc(var(--u) * 2.5) calc(var(--u) * 1.3); border-radius: calc(var(--u) * 1.5);
  background: linear-gradient(180deg, rgba(52, 72, 74, .4), rgba(16, 28, 30, .5));
  border: 1px solid rgba(255,255,255,.18);
  -webkit-backdrop-filter: blur(26px) saturate(1.25); backdrop-filter: blur(26px) saturate(1.25);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.13), 0 calc(var(--u) * 1.5) calc(var(--u) * 4) rgba(0, 0, 0, .28);
  font-size: max(11px, calc(var(--u) * 1.04)); font-weight: 300;
}
.apg-prow { display: flex; justify-content: space-between; gap: calc(var(--u) * 4); }
.apg-brand { display: flex; align-items: center; gap: .5em; font-size: 1.62em; font-weight: 400; letter-spacing: .06em; }
.apg-brand svg { width: 1.3em; height: 1.3em; fill: none; stroke: #fff; stroke-width: 1.5; }
.apg-brand-core { fill: #fff; stroke: none; }
.apg-brand-far { fill: var(--apg-glow); stroke: none; }
.apg-about p { margin: .95em 0 0; max-width: 22.5em; line-height: 1.46; color: rgba(255,255,255,.7); }
.apg-cols { display: flex; gap: calc(var(--u) * 6.4); padding-right: calc(var(--u) * .6); }
.apg-col h2 { margin: 0 0 .7em; font-size: 1em; font-weight: 400; color: #fff; }
.apg-col ul { list-style: none; margin: 0; padding: 0; }
.apg-plink { appearance: none; background: none; border: 0; padding: 0; margin: 0; font: inherit; color: rgba(255,255,255,.64); line-height: 1.82; cursor: pointer; text-align: left; transition: color .2s; }
.apg-plink:hover { color: #fff; }
.apg-pfoot { margin-top: calc(var(--u) * 1.2); padding-top: calc(var(--u) * 1.05); border-top: 1px solid rgba(255,255,255,.15); display: flex; align-items: center; justify-content: space-between; color: rgba(255,255,255,.64); }
.apg-keys { display: flex; gap: 1.15em; }
.apg-keys button { appearance: none; background: none; border: 0; padding: 0; margin: 0; width: 1.5em; height: 1.5em; color: rgba(255,255,255,.72); cursor: pointer; transition: color .2s, transform .25s cubic-bezier(.3,1.7,.5,1); }
.apg-keys button:hover { color: #fff; transform: translate3d(0, -2px, 0); }
.apg-keys svg { width: 100%; height: 100%; fill: none; stroke: currentColor; stroke-width: 1.35; stroke-linecap: round; stroke-linejoin: round; }

/* off screen or in a hidden tab: everything holds still */
.apg-root[data-live="false"] .apg-wheel, .apg-root[data-live="false"] .apg-meteor, .apg-root[data-live="false"] .apg-ring i,
.apg-root[data-live="false"] .apg-mist i, .apg-root[data-live="false"] .apg-grain, .apg-root[data-live="false"] .apg-tag i { animation-play-state: paused; }

/* ---- a phone: the planet takes the upper half, the panel becomes a sheet ---- */
@container apgs (max-width: 700px) {
  .apg-scene { --u: 2.6cqi; --apg-hz: 55%; --apg-px: 61%; --apg-rise: 9; --apg-ridge: 21.2; }
  .apg-skyimg { object-position: 22% 100%; }
  .apg-flatimg { object-position: 22% 0; }
  .apg-ridge { left: 30%; }
  .apg-top { --u: 1cqi; left: 5cqi; right: 5cqi; top: 5.4cqi; font-size: 3.2cqi; }
  .apg-link-wide { display: none; }
  .apg-copy { top: 21cqi; padding: 0 5cqi; }
  .apg-h1 { font-size: 9.6cqi; line-height: 1.05; }
  .apg-form { margin-top: 6.4cqi; width: 100%; height: 14cqi; padding: 1.3cqi; }
  .apg-input, .apg-sent { padding: 0 4.4cqi; font-size: 3.9cqi; }
  .apg-send { min-width: 0; padding: 0 4.6cqi; font-size: 2.95cqi; letter-spacing: .08em; }
  .apg-note { margin-top: 3.6cqi; font-size: 3.2cqi; }
  .apg-panel { left: 2.6cqi; right: 2.6cqi; bottom: 2.6cqi; padding: 5cqi 5.4cqi 3.6cqi; border-radius: 6.4cqi; font-size: 3.45cqi; }
  .apg-prow { flex-direction: column; gap: 4.2cqi; }
  .apg-brand { font-size: 1.45em; }
  .apg-about p { margin-top: .7em; max-width: none; }
  .apg-cols { padding: 0; }
  .apg-col + .apg-col { display: none; }
  .apg-col { width: 100%; }
  .apg-col h2 { margin-bottom: .45em; }
  .apg-col ul { display: grid; grid-template-columns: 1fr 1fr; column-gap: 4cqi; }
  .apg-pfoot { margin-top: 3.4cqi; padding-top: 3cqi; font-size: .94em; }
  .apg-trail { stroke-width: 2; }
}

@media (prefers-reduced-motion: reduce) {
  .apg-wheel, .apg-meteor, .apg-ring i, .apg-mist i, .apg-grain, .apg-tag i, .apg-h1 span, .apg-sent, .apg-count, .apg-form[data-bad="true"] { animation: none !important; }
  .apg-send, .apg-moon { transition: none; }
  .apg-fx { display: none; }
}
`;
