"use client";

/**
 * SAYSO · website hero
 *
 * The first screen of a product that builds a small app from one spoken
 * sentence. The page is almost empty: warm paper with window light across it,
 * a logo, a three-way switch, one line of words, and in the middle ONE object:
 * a red moulded device like a toy radio. It has a pale inset screen, a speaker
 * grill of punched holes, a small keyboard key, a white "Hold to speak" key
 * and a dark send key. All of it is drawn in CSS and one small canvas.
 *
 * It listens and builds, by itself: a request types onto the screen while the
 * grill runs as a level meter, the send key goes down, and the screen answers
 * by assembling a tiny working app in six strokes (a packing list, a water
 * ring, a rent split, a watering calendar). A ring runs out through the grill
 * when it is done, the app ticks its own boxes, then the screen clears for the
 * next request. The device leans toward the pointer and its light and shadow
 * move with it.
 *
 * Press and hold the white key yourself: the grill becomes a live meter (the
 * levels are made up here, no microphone is opened) and the request writes
 * itself; let go and it is sent. The keyboard key types the next request, the
 * send key sends or clears.
 *
 * One file, React only. The typefaces come from Google Fonts (loaded in the CSS).
 *
 *   <Sayso />
 *   <Sayso tone="#1f4fff" set="work" onSpeak={() => recorder.start()} onSend={(text) => build(text)} />
 *
 * Props
 *   brand     the wordmark                                        "Sayso"
 *   line      the one line above the device                       "Say what you need."
 *   line2     its second, quieter half                            "It builds the app."
 *   cta       the label on the white key                          "Hold to speak"
 *   tone      the colour of the device, the logo and the switch   "#ee2b1c"
 *   set       which requests it plays: "everyday" | "work"        "everyday"
 *   sound     tiny synthesized sounds on interaction              true
 *   autoplay  plays requests by itself while nobody touches it    true
 *   onSpeak   called when a person starts holding the white key
 *   onSend    called with the request when it is sent by a person
 *
 * Fills its container's width; height is var(--design-h, 100svh), never under
 * 640px. The device is sized from the room it has, so the page is recomposed
 * on a phone (the switch drops under the logo, the line wraps, the footer
 * keeps four links). Everything pauses off screen.
 * Keyboard: Tab to the white key, hold Space or Enter to speak, let go to
 * send. The other two keys and the switch are real buttons.
 * Reduced motion: nothing plays by itself, the device does not lean, the
 * request and the app appear at once.
 * Sound: silent until the visitor interacts, when `sound` is false, and when
 * <html data-cd-mute="1">. The AudioContext is created on the first sound.
 * The self-play keeps the page alive (pass autoplay={false} to stop it).
 */

import { useCallback, useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";

type Props = {
  brand?: string;
  line?: string;
  line2?: string;
  cta?: string;
  tone?: string;
  set?: "everyday" | "work";
  sound?: boolean;
  autoplay?: boolean;
  onSpeak?: () => void;
  onSend?: (text: string) => void;
};

/* ---- the device: data ------------------------------------------------- */
/* A request and the small app it gets back. `a` holds the words that app shows. */
type Kind = "list" | "ring" | "split" | "month";
type Ask = { say: string; kind: Kind; a: string[] };
const SETS: Record<string, Ask[]> = {
  everyday: [
    { say: "A packing list that knows the weather", kind: "list", a: ["Lisbon, Fri to Sun", "24° and clear", "Linen shirts, three", "Sunglasses", "A jacket for the evenings", "Umbrella", "no rain"] },
    { say: "Track the water I drink today", kind: "ring", a: ["Water today", "1.5", "of 2.4 litres", "5", "Add a glass"] },
    { say: "Split the rent between the four of us", kind: "split", a: ["Rent, December", "€1,680", "Ines", "Tomás", "Wren", "You", "€420"] },
    { say: "Tell me when the plants are thirsty", kind: "month", a: ["Watering", "December", "Next: Thursday", "Fern and basil"] },
  ],
  work: [
    { say: "A handover list for Friday's release", kind: "list", a: ["Release 4.2, Friday", "3 of 4 ready", "Changelog written", "Rollback tested", "Support team briefed", "Press note", "Monday"] },
    { say: "Count the hours I bill this week", kind: "ring", a: ["Billed this week", "26", "of 40 hours", "5", "Start the timer"] },
    { say: "Split the offsite bill across the team", kind: "split", a: ["Offsite, Porto", "€2,340", "Design", "Product", "Sales", "You", "€585"] },
    { say: "Show who is on call each week", kind: "month", a: ["On call", "December", "This week: Maya", "Next: Idris"] },
  ],
};

/* ---- the device: sound ------------------------------------------------ */
/* Tiny synthesized sounds, made in the browser. Silent when `sound` is false,
   when the page sets <html data-cd-mute="1">, and until the visitor has
   touched the page. To make it silent for good, delete this hook and its calls. */
type Blip = { f: number; to?: number; d?: number; g?: number; type?: OscillatorType; at?: number };
const SOUNDS: Record<string, Blip[]> = {
  down: [{ f: 320, to: 520, d: 0.05, g: 0.04, type: "triangle" }],
  key: [{ f: 1400, to: 900, d: 0.018, g: 0.022, type: "square" }],
  send: [{ f: 520, to: 240, d: 0.05, g: 0.045, type: "triangle" }],
  done: [
    { f: 1046.5, d: 0.06, g: 0.04 },
    { f: 1568, d: 0.06, g: 0.04, at: 0.08 },
  ],
};
function useBlip(on: boolean) {
  const ctx = useRef<AudioContext | null>(null);
  useEffect(() => () => void ctx.current?.close().catch(() => {}), []);
  return useCallback(
    (name: string) => {
      if (!on || typeof window === "undefined") return;
      if (document.documentElement.dataset.cdMute === "1") return;
      const ua = (navigator as unknown as { userActivation?: { hasBeenActive: boolean } }).userActivation;
      if (ua && !ua.hasBeenActive) return;
      try {
        const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AC) return;
        const a = (ctx.current ??= new AC());
        if (a.state === "suspended") void a.resume();
        for (const b of SOUNDS[name] ?? []) {
          const t = a.currentTime + (b.at ?? 0);
          const d = Math.min(b.d ?? 0.035, 0.06);
          const amp = a.createGain();
          amp.gain.setValueAtTime(0.0001, t);
          amp.gain.exponentialRampToValueAtTime(Math.min(b.g ?? 0.035, 0.06), t + 0.004);
          amp.gain.exponentialRampToValueAtTime(0.0001, t + d);
          amp.connect(a.destination);
          const o = a.createOscillator();
          o.type = b.type ?? "sine";
          o.frequency.setValueAtTime(b.f, t);
          if (b.to) o.frequency.exponentialRampToValueAtTime(b.to, t + d);
          o.connect(amp);
          o.start(t);
          o.stop(t + d + 0.01);
        }
      } catch {
        /* sound is a nicety; never let it break the page */
      }
    },
    [on],
  );
}

/* ---- the device: the small apps --------------------------------------- */
/* Each app is six groups (--i: 0 to 5) that come in one after another while it
   "builds", and a few marks (--j) that tick themselves once it is shown.
   Drawn in a 264×232 box, the same size as the screen's inside. */
const st = (i: number) => ({ "--i": i }) as CSSProperties;
const tk = (j: number) => ({ "--j": Math.round(j * 100) / 100 }) as CSSProperties;
const RING_C = 364.42; // the ring's circumference (r = 58)

function MiniApp({ ask }: { ask: Ask }) {
  const a = ask.a;
  if (ask.kind === "list") {
    return (
      <svg className="sso-app" viewBox="0 0 264 232" aria-hidden>
        <g className="sso-st" style={st(0)}>
          <rect x="0" y="0" width="264" height="46" rx="15" className="sso-f-card" />
          <circle cx="24" cy="23" r="9" className="sso-f-tone" />
          <text x="44" y="20" className="sso-t-b">{a[0]}</text>
          <text x="44" y="35" className="sso-t-s">{a[1]}</text>
        </g>
        {[0, 1, 2, 3].map((n) => (
          <g key={n} className="sso-st" style={st(n + 1)}>
            <rect x="3" y={62 + n * 42} width="22" height="22" rx="7.5" className="sso-f-box" />
            <text x="38" y={78 + n * 42} className={n === 3 ? "sso-t-m sso-t-off" : "sso-t-m"}>{a[2 + n]}</text>
            {n === 3 ? (
              <>
                <line x1="36" y1={73.5 + n * 42} x2={Math.round(40 + (a[5] ?? "").length * 7.1)} y2={73.5 + n * 42} className="sso-l-off" />
                <text x="264" y={77.5 + n * 42} textAnchor="end" className="sso-t-x">{a[6]}</text>
              </>
            ) : null}
          </g>
        ))}
        {[0, 1].map((n) => (
          <g key={n} className="sso-tk" style={tk(n)}>
            <rect x="3" y={62 + n * 42} width="22" height="22" rx="7.5" className="sso-f-tone" />
            <path d={`M9 ${73.5 + n * 42}l3.6 3.6 6.6 -7.4`} className="sso-l-check" />
          </g>
        ))}
        <g className="sso-st" style={st(5)}>
          <rect x="0" y="228" width="264" height="1" className="sso-f-line" />
        </g>
      </svg>
    );
  }
  if (ask.kind === "ring") {
    const filled = Math.max(0, Math.min(8, Number(a[3]) || 0));
    const off = Math.round(RING_C * (1 - filled / 8) * 100) / 100;
    return (
      <svg className="sso-app" viewBox="0 0 264 232" aria-hidden>
        <g className="sso-st" style={st(0)}>
          <text x="132" y="13" textAnchor="middle" className="sso-t-b">{a[0]}</text>
        </g>
        <g className="sso-st" style={st(1)}>
          <circle cx="132" cy="92" r="58" className="sso-l-track" />
        </g>
        <circle cx="132" cy="92" r="58" className="sso-l-ring" style={{ "--off": off, "--i": 2 } as CSSProperties} transform="rotate(-90 132 92)" />
        <g className="sso-st" style={st(3)}>
          <text x="132" y="101" textAnchor="middle" className="sso-t-big">{a[1]}</text>
          <text x="132" y="119" textAnchor="middle" className="sso-t-s">{a[2]}</text>
        </g>
        <g className="sso-st" style={st(4)}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
            <rect key={n} x={32 + n * 26} y="166" width="18" height="24" rx="6" className={n < filled ? "sso-f-tone" : "sso-f-off"} />
          ))}
        </g>
        <g className="sso-tk" style={tk(1)}>
          <rect x={32 + filled * 26} y="166" width="18" height="24" rx="6" className="sso-f-tone" />
        </g>
        <g className="sso-st" style={st(5)}>
          <rect x="66" y="202" width="132" height="30" rx="15" className="sso-f-ink" />
          <text x="132" y="221.5" textAnchor="middle" className="sso-t-w">{a[4]}</text>
        </g>
      </svg>
    );
  }
  if (ask.kind === "split") {
    return (
      <svg className="sso-app" viewBox="0 0 264 232" aria-hidden>
        <g className="sso-st" style={st(0)}>
          <text x="0" y="14" className="sso-t-b">{a[0]}</text>
          <text x="264" y="14" textAnchor="end" className="sso-t-b">{a[1]}</text>
          <rect x="0" y="26" width="264" height="1" className="sso-f-line" />
        </g>
        {[0, 1, 2, 3].map((n) => (
          <g key={n} className="sso-st" style={st(n + 1)}>
            <circle cx="16" cy={58 + n * 47} r="15" className={n === 3 ? "sso-f-tone" : n === 0 ? "sso-f-ink" : n === 1 ? "sso-f-mid" : "sso-f-soft"} />
            <text x="16" y={62 + n * 47} textAnchor="middle" className={n === 2 ? "sso-t-i sso-t-ink" : "sso-t-i"}>{(a[2 + n] ?? "").slice(0, 1)}</text>
            <text x="42" y={54 + n * 47} className="sso-t-m">{a[2 + n]}</text>
            <rect x="42" y={63 + n * 47} width="150" height="6" rx="3" className="sso-f-off" />
            <text x="264" y={62 + n * 47} textAnchor="end" className="sso-t-m">{a[6]}</text>
          </g>
        ))}
        {[0, 1, 3].map((n, j) => (
          <rect key={n} x="42" y={63 + n * 47} width="150" height="6" rx="3" className={n === 3 ? "sso-bar sso-f-tone" : "sso-bar sso-f-ink"} style={tk(j)} />
        ))}
        <g className="sso-st" style={st(5)}>
          <rect x="0" y="228" width="264" height="1" className="sso-f-line" />
        </g>
      </svg>
    );
  }
  const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <svg className="sso-app" viewBox="0 0 264 232" aria-hidden>
      <g className="sso-st" style={st(0)}>
        <text x="4" y="14" className="sso-t-b">{a[0]}</text>
        <text x="260" y="14" textAnchor="end" className="sso-t-s">{a[1]}</text>
        {DAYS.map((d, c) => (
          <text key={c} x={18 + c * 38} y="36" textAnchor="middle" className="sso-t-x">{d}</text>
        ))}
      </g>
      {[0, 1, 2, 3].map((r) => (
        <g key={r} className="sso-st" style={st(r + 1)}>
          {DAYS.map((_, c) => (
            <rect key={c} x={4 + c * 38} y={46 + r * 34} width="28" height="28" rx="9" className="sso-f-off" />
          ))}
        </g>
      ))}
      {[1, 4, 8, 11, 15, 18, 22, 25].map((d, j) => (
        <g key={d} className="sso-tk" style={tk(j * 0.45)}>
          <rect x={4 + (d % 7) * 38} y={46 + Math.floor(d / 7) * 34} width="28" height="28" rx="9" className="sso-f-tone" />
          <circle cx={18 + (d % 7) * 38} cy={60 + Math.floor(d / 7) * 34} r="3.2" className="sso-f-card" />
        </g>
      ))}
      <g className="sso-st" style={st(5)}>
        <rect x="0" y="192" width="264" height="38" rx="14" className="sso-f-card" />
        <circle cx="20" cy="211" r="5" className="sso-f-tone" />
        <text x="34" y="215.5" className="sso-t-b">{a[2]}</text>
        <text x="250" y="215.5" textAnchor="end" className="sso-t-s">{a[3]}</text>
      </g>
    </svg>
  );
}

/* ---- the device: the object ------------------------------------------- */
/* 348×516 design pixels, scaled by --sso-k. It leans toward the pointer over
   `area` (or over itself), and the grill is a canvas of 30×7 punched holes. */
type Phase = "type" | "send" | "build" | "show" | "clear";
const COLS = 30;
const ROWS = 7;
const PITCH = 9.6;
/* light through a hole, from a hot red glimmer to warm white (16 steps, made once) */
const HOT = Array.from({ length: 16 }, (_, i) => `rgb(255,${Math.round(118 + (128 * i) / 15)},${Math.round(84 + (152 * i) / 15)})`);

function Device({
  asks,
  cta,
  sound,
  autoplay,
  area,
  jump = 0,
  onSpeak,
  onSend,
}: {
  asks: Ask[];
  cta: string;
  sound: boolean;
  autoplay: boolean;
  area?: RefObject<HTMLElement | null>;
  jump?: number;
  onSpeak?: () => void;
  onSend?: (text: string) => void;
}) {
  const fit = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("type");
  const [typed, setTyped] = useState(asks[0].say.length);
  const [held, setHeld] = useState(false);
  const [spoken, setSpoken] = useState(true);
  const [active, setActive] = useState(false);
  const [calm, setCalm] = useState(false);
  const blip = useBlip(sound);

  const ask = asks[idx % asks.length];
  const full = ask.say.length;
  const hearing = held || (phase === "type" && typed < full && spoken);

  const touched = useRef(-1e9); // when a person last touched it
  const keyed = useRef(-1e9); // when the white key was last worked from the keyboard
  const byHand = useRef(false); // this request was started by a person
  const hearRef = useRef(false);
  const pingAt = useRef(-1e9);
  hearRef.current = hearing;

  /* in view? reduced motion? */
  useEffect(() => {
    const el = fit.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMq = () => setCalm(mq.matches);
    onMq();
    mq.addEventListener("change", onMq);
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => {
      mq.removeEventListener("change", onMq);
      io.disconnect();
    };
  }, []);

  /* the loop: type → send → build → show → clear → the next request */
  useEffect(() => {
    if (!active) return;
    const auto = autoplay && !calm;
    let id = 0;
    const later = (fn: () => void, ms: number) => {
      id = window.setTimeout(fn, ms);
    };
    if (phase === "type") {
      if (typed < full) {
        if (calm) setTyped(full);
        else
          later(
            () => {
              if (!spoken) blip("key");
              setTyped((v) => Math.min(full, v + 1));
            },
            spoken ? 46 : 34,
          );
      } else if (!held && (auto || byHand.current)) {
        const quiet = Math.max(0, 6000 - (performance.now() - touched.current));
        later(() => setPhase("send"), byHand.current ? 420 : Math.max(620, quiet));
      }
    } else if (phase === "send") {
      later(() => setPhase("build"), calm ? 0 : 380);
    } else if (phase === "build") {
      later(
        () => {
          pingAt.current = performance.now();
          if (byHand.current) blip("done");
          setPhase("show");
        },
        calm ? 0 : 1650,
      );
    } else if (phase === "show") {
      if (auto) {
        const quiet = Math.max(0, 6000 - (performance.now() - touched.current));
        later(() => setPhase("clear"), Math.max(2100, quiet));
      }
    } else {
      later(
        () => {
          byHand.current = false;
          setIdx((v) => v + 1);
          setTyped(0);
          setSpoken(true);
          setPhase("type");
        },
        calm ? 0 : 440,
      );
    }
    return () => window.clearTimeout(id);
  }, [active, autoplay, calm, phase, typed, full, held, spoken, blip]);

  /* a person starts a new request (spoken or typed) */
  const begin = useCallback(
    (voice: boolean) => {
      touched.current = performance.now();
      byHand.current = true;
      setSpoken(voice);
      setIdx((v) => (phase === "type" && typed === 0 ? v : v + 1));
      setTyped(0);
      setPhase("type");
    },
    [phase, typed],
  );
  const send = useCallback(() => {
    touched.current = performance.now();
    byHand.current = true;
    blip("send");
    onSend?.(ask.say);
    setTyped(full);
    setPhase("send");
  }, [ask.say, blip, full, onSend]);

  const press = useCallback(() => {
    if (held) return;
    blip("down");
    onSpeak?.();
    setHeld(true);
    begin(true);
  }, [begin, blip, held, onSpeak]);
  const release = useCallback(() => {
    if (!held) return;
    setHeld(false);
    send();
  }, [held, send]);

  /* the switch on the page can ask for a finished app straight away */
  const jumped = useRef(jump);
  useEffect(() => {
    if (jump === jumped.current) return;
    jumped.current = jump;
    touched.current = performance.now();
    byHand.current = true;
    setHeld(false);
    setIdx((v) => v + 1);
    setTyped(1e6);
    setPhase("send");
  }, [jump]);
  /* a request longer than the one before (after `set` changes) never overruns */
  useEffect(() => {
    setTyped((v) => Math.min(v, full));
  }, [full]);

  /* the lean and the grill, one loop */
  useEffect(() => {
    const el = fit.current;
    const c = cv.current;
    if (!el || !c) return;
    const g = c.getContext("2d");
    if (!g) return;
    const S = 2; // buffer pixels per design pixel
    c.width = Math.round(COLS * PITCH * S);
    c.height = Math.round(ROWS * PITCH * S);
    const lv = new Float32Array(COLS);
    const pk = new Float32Array(COLS);
    let mix = 0;
    let tx = 0, ty = 0, gx = 0, gy = 0, over = false;
    let raf = 0;
    let last = 0;

    const draw = (t: number) => {
      const hear = hearRef.current;
      mix += ((hear ? 1 : 0) - mix) * 0.16;
      const env = 0.3 + 0.6 * Math.abs(Math.sin(t * 2.9) * Math.sin(t * 1.3 + 0.6));
      const age = (performance.now() - pingAt.current) / 1000;
      g.clearRect(0, 0, c.width, c.height);
      for (let col = 0; col < COLS; col++) {
        const want = hear ? env * Math.pow(Math.abs(Math.sin(t * 6.1 + col * 0.83) * Math.sin(t * 2.3 + col * 0.31)), 0.7) : 0;
        lv[col] += (want - lv[col]) * (want > lv[col] ? 0.5 : 0.14);
        pk[col] = Math.max(lv[col], pk[col] - 0.012);
        const top = lv[col] * ROWS;
        const peak = Math.min(ROWS - 1, Math.floor(pk[col] * ROWS));
        for (let row = 0; row < ROWS; row++) {
          const x = (col + 0.5) * PITCH * S;
          const y = (row + 0.5) * PITCH * S;
          const up = ROWS - 1 - row; // 0 at the bottom row
          const dx = col - (COLS - 1) / 2;
          const dy = (row - (ROWS - 1) / 2) * 1.6;
          const dist = Math.hypot(dx, dy);
          // idle: a slow ring leaving the middle; listening: a bar from the bottom with a held peak
          const idle = 0.3 * Math.pow(Math.max(0, Math.sin(dist * 0.62 - t * 1.7)), 3);
          const bar = up < top ? 0.92 : up === peak && pk[col] > 0.08 ? 0.6 : 0;
          let lit = idle + (bar - idle) * mix;
          if (age < 1.1) {
            const ring = Math.exp(-Math.pow(dist - age * 20, 2) / 5) * (1 - age / 1.1);
            lit = Math.max(lit, ring);
          }
          // the hole: dark (shallower where the idle ring passes), with a thin lit lip on its lower edge
          g.globalAlpha = 1 - Math.min(0.75, lit * 1.5);
          g.fillStyle = "rgba(48,0,0,.52)";
          g.beginPath();
          g.arc(x, y, 2.5 * S, 0, 6.2832);
          g.fill();
          g.globalAlpha = 1;
          g.strokeStyle = "rgba(255,255,255,.2)";
          g.lineWidth = 0.7 * S;
          g.beginPath();
          g.arc(x, y - 0.25 * S, 2.6 * S, 0.5, 2.64);
          g.stroke();
          // above a third it starts to glow: light through the hole and a little around it
          const glow = Math.min(1, Math.max(0, (lit - 0.3) / 0.6));
          if (glow > 0.01) {
            g.fillStyle = HOT[Math.round(glow * 15)];
            g.globalAlpha = glow * 0.24;
            g.beginPath();
            g.arc(x, y, 4.4 * S, 0, 6.2832);
            g.fill();
            g.globalAlpha = Math.min(1, glow * 1.6);
            g.beginPath();
            g.arc(x, y, 2.5 * S, 0, 6.2832);
            g.fill();
          }
        }
      }
      g.globalAlpha = 1;
    };

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frame = (ms: number) => {
      raf = requestAnimationFrame(frame);
      if (ms - last < 15) return; // 60 a second at most
      last = ms;
      const t = ms / 1000;
      if (!over) {
        gx = 0.42 * Math.sin(t * 0.52);
        gy = 0.3 * Math.sin(t * 0.37 + 1.1);
      }
      tx += (gx - tx) * 0.07;
      ty += (gy - ty) * 0.07;
      el.style.setProperty("--sso-tx", tx.toFixed(3));
      el.style.setProperty("--sso-ty", ty.toFixed(3));
      draw(t);
    };
    const target = area?.current ?? el;
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = el.getBoundingClientRect();
      over = true;
      gx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / Math.max(r.width, 260)));
      gy = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / Math.max(r.height, 260)));
    };
    const leave = () => {
      over = false;
    };
    if (still) {
      draw(0.9);
    } else if (active) {
      target.addEventListener("pointermove", move);
      target.addEventListener("pointerleave", leave);
      raf = requestAnimationFrame(frame);
    } else {
      draw(0.9);
    }
    return () => {
      cancelAnimationFrame(raf);
      target.removeEventListener("pointermove", move);
      target.removeEventListener("pointerleave", leave);
    };
  }, [active, area]);

  const label = phase === "type" ? (hearing ? "Listening" : typed < full ? "Typing" : "Tap to type") : phase === "show" ? "Built in 4 seconds" : phase === "clear" ? "Tap to type" : "Building";
  const keyLabel = hearing ? "Listening" : phase === "send" || phase === "build" ? "Building" : cta;
  const shown = Math.min(typed, full);

  return (
    <div ref={fit} className="sso-fit" data-ph={phase} data-hear={hearing} data-held={held}>
      <div className="sso-cast" aria-hidden />
      <div className="sso-tilt">
        <div className="sso-dev">
          <div className="sso-body" aria-hidden />
          <button
            type="button"
            className="sso-scr"
            aria-label={`Screen. ${phase === "show" || phase === "build" ? `An app for: ${ask.say}` : ask.say}. Press to type the next request.`}
            onClick={() => {
              blip("key");
              begin(false);
            }}
          >
            <span className="sso-say" aria-hidden>
              <span>
                {ask.say.slice(0, shown)}
                <i className="sso-caret" />
                <span className="sso-rest">{ask.say.slice(shown)}</span>
              </span>
            </span>
            <MiniApp key={idx} ask={ask} />
            <span className="sso-tag" aria-hidden>
              <i />
              {label}
            </span>
            <span className="sso-glare" aria-hidden />
          </button>
          <canvas ref={cv} className="sso-grill" aria-hidden />
          <div className="sso-keys">
            <button
              type="button"
              className="sso-key sso-key-a"
              aria-label="Type the next request"
              onClick={() => {
                blip("key");
                begin(false);
              }}
            >
              <svg viewBox="0 0 20 20" aria-hidden>
                <rect x="2.5" y="5" width="15" height="10" rx="2.6" />
                <path d="M6 8.4h.01M8.7 8.4h.01M11.3 8.4h.01M14 8.4h.01M7 11.6h6" />
              </svg>
            </button>
            <button
              type="button"
              className="sso-key sso-key-b"
              aria-pressed={held}
              onPointerDown={(e) => {
                if (e.button !== 0) return;
                e.currentTarget.setPointerCapture(e.pointerId);
                press();
              }}
              onPointerUp={release}
              onPointerCancel={release}
              onKeyDown={(e) => {
                if (e.key !== " " && e.key !== "Enter") return;
                e.preventDefault();
                keyed.current = performance.now();
                if (!e.repeat) press();
              }}
              onKeyUp={(e) => {
                if (e.key !== " " && e.key !== "Enter") return;
                keyed.current = performance.now();
                release();
              }}
              onBlur={release}
              onClick={(e) => {
                // a click that came from assistive tech (no press before it): play one request
                if (e.detail === 0 && !held && performance.now() - keyed.current > 700) {
                  blip("down");
                  begin(true);
                }
              }}
            >
              <svg viewBox="0 0 20 20" aria-hidden>
                <rect x="7.2" y="2.6" width="5.6" height="9.4" rx="2.8" />
                <path d="M4.6 9.6a5.4 5.4 0 0 0 10.8 0M10 15v2.4" />
              </svg>
              <span>{keyLabel}</span>
            </button>
            <button
              type="button"
              className="sso-key sso-key-c"
              aria-label={phase === "show" ? "Clear the screen" : "Send the request"}
              onClick={() => {
                if (phase === "show") {
                  touched.current = performance.now();
                  blip("send");
                  setPhase("clear");
                } else if (phase === "type") send();
              }}
            >
              <svg viewBox="0 0 20 20" aria-hidden>
                <path d="M10 15.5v-11M5.4 9.1 10 4.5l4.6 4.6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
/* ---- end of the device ------------------------------------------------ */

const TABS = ["Speak", "Gallery", "Your apps"];
const LINKS = ["Examples", "Pricing", "What's new", "Questions", "Help", "Privacy", "Terms"];

export default function Sayso({
  brand = "Sayso",
  line = "Say what you need.",
  line2 = "It builds the app.",
  cta = "Hold to speak",
  tone = "#ee2b1c",
  set = "everyday",
  sound = true,
  autoplay = true,
  onSpeak,
  onSend,
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState(0);
  const [jump, setJump] = useState(0);

  /* the device takes the room the page has left */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const size = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      const k = Math.max(0.55, Math.min(1.3, (h - 300) / 516, (w - 80) / 348));
      el.style.setProperty("--sso-k", k.toFixed(3));
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={root} className="sso-root" style={{ "--sso-tone": tone } as CSSProperties}>
      <style>{css}</style>
      <div className="sso-sun" aria-hidden />
      <header className="sso-top">
        <a className="sso-logo" href="#" onClick={(e) => e.preventDefault()} aria-label={brand}>
          <svg viewBox="0 0 34 34" aria-hidden>
            <path d="M9 2h16a7 7 0 0 1 7 7v12a7 7 0 0 1-7 7H15.5L8 33v-5.3A7 7 0 0 1 2 20.8V9a7 7 0 0 1 7-7z" />
            <rect className="sso-logo-b" x="9" y="12" width="3.6" height="7" rx="1.8" />
            <rect className="sso-logo-b" x="15.2" y="8" width="3.6" height="15" rx="1.8" />
            <rect className="sso-logo-b" x="21.4" y="11" width="3.6" height="9" rx="1.8" />
          </svg>
          <span>{brand.toLowerCase()}</span>
        </a>
        <div className="sso-tabs" role="group" aria-label="Sections" style={{ "--sso-at": tab } as CSSProperties}>
          <i className="sso-thumb" aria-hidden />
          {TABS.map((name, i) => (
            <button
              key={name}
              type="button"
              aria-pressed={tab === i}
              onClick={() => {
                setTab(i);
                if (i > 0) setJump((v) => v + 1);
              }}
            >
              {name}
            </button>
          ))}
        </div>
        <a className="sso-in" href="#" onClick={(e) => e.preventDefault()}>
          Sign in
        </a>
      </header>
      <main className="sso-mid">
        <h1 className="sso-line">
          {line} <span>{line2}</span>
        </h1>
        <Device asks={SETS[set] ?? SETS.everyday} cta={cta} sound={sound} autoplay={autoplay} area={root} jump={jump} onSpeak={onSpeak} onSend={onSend} />
      </main>
      <nav className="sso-foot" aria-label="More">
        {LINKS.map((name) => (
          <a key={name} href="#" onClick={(e) => e.preventDefault()}>
            {name}
          </a>
        ))}
      </nav>
    </div>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700&family=JetBrains+Mono:wght@500&display=swap');
.sso-root {
  --sso-tone: #ee2b1c;
  --sso-paper: #f0ebe4;
  --sso-ink: #1d1a19;
  --sso-k: 1.16;
  container-type: inline-size;
  position: relative;
  width: 100%;
  height: var(--design-h, 100svh);
  min-height: 640px;
  overflow: hidden;
  isolation: isolate;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  background: var(--sso-paper);
  color: var(--sso-ink);
  font-family: "Inter Tight", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
/* window light across the paper: a soft band that drifts very slowly */
.sso-sun {
  position: absolute; z-index: 0; left: -22%; top: -40%; width: 78%; height: 170%;
  background: linear-gradient(96deg, rgba(255,255,255,0) 6%, rgba(255,253,248,.9) 34%, rgba(255,253,248,.78) 58%, rgba(255,255,255,0) 86%);
  transform: rotate(24deg); filter: blur(34px); pointer-events: none;
  animation: sso-sun 16s ease-in-out infinite alternate;
}
@keyframes sso-sun { from { translate: -2.5% 0; } to { translate: 4% 0; } }

.sso-top { position: relative; z-index: 2; display: flex; align-items: center; justify-content: space-between; padding: 34px 44px 0; }
.sso-logo { display: flex; align-items: center; gap: 9px; color: var(--sso-tone); text-decoration: none; font-size: 25px; font-weight: 700; letter-spacing: -.045em; line-height: 1; }
.sso-logo svg { width: 34px; height: 34px; fill: currentColor; }
.sso-logo .sso-logo-b { fill: var(--sso-paper); }
.sso-tabs {
  position: absolute; left: 50%; top: 34px; translate: -50% 0; display: grid; grid-template-columns: repeat(3, 1fr);
  padding: 4px; border-radius: 13px; background: rgba(29,26,25,.06); box-shadow: inset 0 1px 1.5px rgba(29,26,25,.08);
}
.sso-tabs button {
  position: relative; z-index: 1; font: inherit; font-size: 13px; font-weight: 600; letter-spacing: -.005em; white-space: nowrap;
  min-width: 78px; padding: 8px 14px; border: 0; border-radius: 10px; background: none; color: rgba(29,26,25,.62); cursor: pointer;
  transition: color .25s;
}
.sso-tabs button[aria-pressed="true"] { color: #fff; }
.sso-thumb {
  position: absolute; left: 4px; top: 4px; bottom: 4px; width: calc((100% - 8px) / 3); border-radius: 10px; background: var(--sso-tone);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.3), 0 2px 5px -1px color-mix(in srgb, var(--sso-tone) 60%, transparent);
  transform: translateX(calc(var(--sso-at, 0) * 100%)); transition: transform .42s cubic-bezier(.3,1.35,.5,1);
}
.sso-in { font-size: 14px; font-weight: 600; color: var(--sso-ink); text-decoration: none; opacity: .72; padding: 8px 4px; transition: opacity .2s; }
.sso-in:hover { opacity: 1; }
.sso-root a:focus-visible, .sso-tabs button:focus-visible { outline: 2px solid var(--sso-tone); outline-offset: 3px; border-radius: 10px; }

.sso-mid { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 30px; min-height: 0; padding: 8px 20px 0; }
.sso-line { margin: 0; font-size: 21px; font-weight: 600; letter-spacing: -.02em; line-height: 1.2; text-align: center; color: var(--sso-ink); }
.sso-line span { color: rgba(29,26,25,.42); }

.sso-foot { position: relative; z-index: 2; display: flex; justify-content: center; flex-wrap: wrap; gap: 6px 34px; padding: 22px 24px 30px; }
.sso-foot a { font-size: 13px; font-weight: 500; color: rgba(29,26,25,.5); text-decoration: none; transition: color .2s; }
.sso-foot a:hover { color: var(--sso-ink); }

/* ---- the device ---- */
.sso-fit {
  position: relative; flex: none; width: calc(348px * var(--sso-k, 1)); height: calc(516px * var(--sso-k, 1));
  -webkit-tap-highlight-color: transparent;
}
/* its shadow on the paper slides away from the lean */
.sso-cast {
  position: absolute; left: 7%; right: 3%; top: 11%; bottom: -5%; border-radius: 24%;
  background: rgba(86,32,16,.42); filter: blur(calc(30px * var(--sso-k, 1)));
  transform: translate(calc(var(--sso-tx, 0) * -16px + 10px), calc(var(--sso-ty, 0) * -10px + 22px));
}
/* the perspective is in the transform itself (no preserve-3d): the type stays sharp while it leans */
.sso-tilt {
  position: absolute; inset: 0;
  transform: perspective(1500px) rotateX(calc(var(--sso-ty, 0) * -6deg)) rotateY(calc(var(--sso-tx, 0) * 8deg));
}
/* zoom, not a scale transform: the type and the hairlines stay sharp at any size */
.sso-dev { position: absolute; left: 0; top: 0; width: 348px; height: 516px; zoom: var(--sso-k, 1); }
/* the moulded body: a lit top-left edge, a shaded bottom-right one, and a side wall that shows as it leans */
.sso-body {
  position: absolute; inset: 0; border-radius: 46px; background: var(--sso-tone);
  --sso-wall: color-mix(in srgb, var(--sso-tone) 66%, #2a0500);
  box-shadow:
    inset 0 2px 1.5px rgba(255,255,255,.38),
    inset 2px 0 2px rgba(255,255,255,.16),
    inset 0 -4px 3px rgba(60,0,0,.26),
    inset -3px 0 3px rgba(60,0,0,.14),
    calc(var(--sso-tx, 0) * -2px) calc(2.5px + var(--sso-ty, 0) * 1px) 0 var(--sso-wall),
    calc(var(--sso-tx, 0) * -4px) calc(5px + var(--sso-ty, 0) * 2px) 0 var(--sso-wall),
    calc(var(--sso-tx, 0) * -6px) calc(7.5px + var(--sso-ty, 0) * 3px) 0 var(--sso-wall),
    0 18px 22px -10px rgba(86,32,16,.34);
}
.sso-body::before {
  content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  background:
    radial-gradient(70% 46% at calc(16% - var(--sso-tx, 0) * 26%) calc(2% - var(--sso-ty, 0) * 16%), rgba(255,255,255,.26), rgba(255,255,255,0) 70%),
    linear-gradient(158deg, rgba(255,255,255,.07), rgba(255,255,255,0) 40%, rgba(60,0,0,.17));
}
/* the screen: pale, set into the body */
.sso-scr {
  position: absolute; left: 22px; top: 22px; width: 304px; height: 316px; padding: 0; border: 0; border-radius: 30px;
  font: inherit; color: var(--sso-ink); text-align: center; cursor: text; overflow: hidden;
  background: linear-gradient(180deg, #f6f4f1, #f1eeea);
  box-shadow: inset 0 3px 8px rgba(50,10,0,.24), inset 0 0 0 1px rgba(50,10,0,.1), 0 1.5px 0 rgba(255,255,255,.3), 0 -1px 0 rgba(60,0,0,.2);
}
.sso-scr:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
.sso-say {
  position: absolute; left: 22px; right: 22px; top: 26px; bottom: 54px; display: flex; align-items: center; justify-content: center;
  font-size: 25px; font-weight: 600; line-height: 1.14; letter-spacing: -.025em; color: #8a8580; text-wrap: balance;
  transition: opacity .3s ease, transform .5s cubic-bezier(.3,1.3,.5,1);
}
.sso-rest { opacity: 0; }
.sso-caret { display: inline-block; width: 2.5px; height: .92em; margin: 0 1px -0.1em 2px; border-radius: 2px; background: var(--sso-tone); animation: sso-blink 1s steps(2, jump-none) infinite; }
.sso-fit[data-hear="true"] .sso-caret { animation: none; }
@keyframes sso-blink { from { opacity: 1; } to { opacity: 0; } }
.sso-fit:not([data-ph="type"]) .sso-say { opacity: 0; transform: translateY(-16px) scale(.94); }
.sso-fit[data-ph="send"] .sso-say { transition-duration: .26s, .34s; transition-timing-function: ease-in, cubic-bezier(.5,0,.8,.4); }

.sso-app { position: absolute; left: 20px; top: 22px; width: 264px; height: 232px; overflow: visible; font-family: inherit; }
.sso-st { opacity: 0; transform: translateY(9px); transition: opacity .16s ease, transform .16s ease; }
.sso-fit[data-ph="build"] .sso-st, .sso-fit[data-ph="show"] .sso-st {
  opacity: 1; transform: none;
  transition: opacity .3s ease calc(var(--i) * 210ms + 120ms), transform .55s cubic-bezier(.3,1.45,.5,1) calc(var(--i) * 210ms + 120ms);
}
.sso-fit[data-ph="clear"] .sso-app { opacity: 0; transform: translateY(-10px); transition: opacity .3s ease, transform .4s ease; }
.sso-l-ring { fill: none; stroke: var(--sso-tone); stroke-width: 13; stroke-linecap: round; stroke-dasharray: 364.42; stroke-dashoffset: 364.42; opacity: 0; transition: opacity .1s; }
.sso-fit[data-ph="build"] .sso-l-ring, .sso-fit[data-ph="show"] .sso-l-ring {
  stroke-dashoffset: var(--off); opacity: 1;
  transition: stroke-dashoffset .9s cubic-bezier(.3,.9,.3,1) calc(var(--i) * 210ms + 120ms), opacity .1s calc(var(--i) * 210ms + 120ms);
}
.sso-tk { opacity: 0; transform: scale(.4); transform-box: fill-box; transform-origin: center; transition: opacity .12s, transform .12s; }
.sso-fit[data-ph="show"] .sso-tk { opacity: 1; transform: none; transition: opacity .16s calc(var(--j) * 380ms + 320ms), transform .42s cubic-bezier(.3,1.6,.5,1) calc(var(--j) * 380ms + 320ms); }
.sso-bar { transform: scaleX(0); transform-box: fill-box; transform-origin: left center; transition: transform .12s; }
.sso-fit[data-ph="show"] .sso-bar { transform: none; transition: transform .6s cubic-bezier(.3,1,.4,1) calc(var(--j) * 380ms + 320ms); }
.sso-f-card { fill: #fff; }
.sso-f-tone { fill: var(--sso-tone); }
.sso-f-ink { fill: #1d1a19; }
.sso-f-mid { fill: #8a8580; }
.sso-f-soft { fill: #d6d0c8; }
.sso-f-off { fill: #e4dfd8; }
.sso-f-line { fill: rgba(29,26,25,.1); }
.sso-f-box { fill: #fff; stroke: #cfc8bf; stroke-width: 1.5; }
.sso-l-track { fill: none; stroke: #e4dfd8; stroke-width: 13; }
.sso-l-check { fill: none; stroke: #fff; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
.sso-l-off { stroke: #a9a39c; stroke-width: 1.3; }
.sso-t-b { font-size: 13.5px; font-weight: 600; letter-spacing: -.01em; fill: #1d1a19; font-variant-numeric: tabular-nums; }
.sso-t-m { font-size: 14px; font-weight: 500; letter-spacing: -.01em; fill: #1d1a19; font-variant-numeric: tabular-nums; }
.sso-t-s { font-size: 11.5px; font-weight: 500; fill: #8a8580; }
.sso-t-off { fill: #a9a39c; }
.sso-t-x { font: 500 9px "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace; letter-spacing: .08em; text-transform: uppercase; fill: #a09a93; }
.sso-t-big { font-size: 38px; font-weight: 700; letter-spacing: -.04em; fill: #1d1a19; font-variant-numeric: tabular-nums; }
.sso-t-w { font-size: 12px; font-weight: 600; fill: #fff; }
.sso-t-i { font-size: 12px; font-weight: 700; fill: #fff; }
.sso-t-ink { fill: #1d1a19; }

.sso-tag {
  position: absolute; left: 0; right: 0; bottom: 19px; display: flex; align-items: center; justify-content: center; gap: 7px;
  font: 500 9.5px "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace; letter-spacing: .16em; text-transform: uppercase; color: #a09a93;
}
.sso-tag i { width: 5px; height: 5px; border-radius: 50%; background: #c9c3bb; transition: background .2s, box-shadow .2s; }
.sso-fit[data-hear="true"] .sso-tag i { background: var(--sso-tone); box-shadow: 0 0 0 3px color-mix(in srgb, var(--sso-tone) 22%, transparent); }
.sso-fit[data-ph="build"] .sso-tag i { background: #1d1a19; animation: sso-blink .5s steps(2, jump-none) infinite; }
.sso-fit[data-ph="show"] .sso-tag i { background: #28a45a; }
.sso-glare {
  position: absolute; inset: 0; pointer-events: none; border-radius: inherit;
  background: linear-gradient(118deg, rgba(255,255,255,0) 30%, rgba(255,255,255,.5) 44%, rgba(255,255,255,0) 58%);
  opacity: .5; transform: translateX(calc(var(--sso-tx, 0) * -34%));
}
/* the grill: 30×7 punched holes, drawn on a canvas */
.sso-grill { position: absolute; left: 30px; top: 352px; width: 288px; height: 67.2px; display: block; }
/* the keys: each sits on its own shadow and goes down when pressed */
.sso-keys { position: absolute; left: 22px; right: 22px; top: 440px; height: 52px; display: flex; gap: 8px; }
.sso-key {
  position: relative; flex: none; display: grid; place-items: center; height: 50px; padding: 0; border: 0; border-radius: 15px; font: inherit; cursor: pointer;
  box-shadow: 0 4px 0 rgba(60,0,0,.36), 0 6px 8px rgba(60,0,0,.24), inset 0 1px 0 rgba(255,255,255,.9), inset 0 -1.5px 0 rgba(29,26,25,.1);
  transition: transform .1s ease-out, box-shadow .1s ease-out; touch-action: none; user-select: none; -webkit-user-select: none;
}
.sso-key svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.sso-key:active, .sso-fit[data-hear="true"] .sso-key-b, .sso-fit[data-ph="send"] .sso-key-c {
  transform: translateY(3.5px);
  box-shadow: 0 .5px 0 rgba(60,0,0,.36), 0 1px 2px rgba(60,0,0,.24), inset 0 1px 0 rgba(255,255,255,.9), inset 0 -1.5px 0 rgba(29,26,25,.1);
}
.sso-key:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
.sso-key-a { width: 46px; background: #f3f0ec; color: #5d5853; }
.sso-key-b { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; background: #fbfaf8; color: var(--sso-ink); font-size: 15px; font-weight: 600; letter-spacing: -.01em; }
.sso-key-b svg { width: 18px; height: 18px; transition: color .15s; }
.sso-fit[data-hear="true"] .sso-key-b svg { color: var(--sso-tone); }
.sso-key-c { width: 50px; background: #2b2221; color: #fff; box-shadow: 0 4px 0 rgba(30,0,0,.5), 0 6px 8px rgba(60,0,0,.26), inset 0 1px 0 rgba(255,255,255,.22); }
.sso-key-c:active, .sso-fit[data-ph="send"] .sso-key-c { box-shadow: 0 .5px 0 rgba(30,0,0,.5), 0 1px 2px rgba(60,0,0,.26), inset 0 1px 0 rgba(255,255,255,.22); }
@media (prefers-reduced-motion: reduce) {
  .sso-caret, .sso-tag i { animation: none !important; }
  .sso-say, .sso-st, .sso-tk, .sso-bar, .sso-l-ring, .sso-app, .sso-key { transition-duration: 1ms !important; transition-delay: 0s !important; }
  .sso-tilt, .sso-glare { transform: none; }
  .sso-cast { transform: translate(10px, 22px); }
}
/* ---- end of the device ---- */

@container (max-width: 900px) {
  .sso-foot { gap: 6px 24px; }
}
@container (max-width: 640px) {
  .sso-root { --sso-k: .86; }
  .sso-top { padding: 22px 20px 0; }
  .sso-logo { font-size: 22px; gap: 8px; }
  .sso-logo svg { width: 30px; height: 30px; }
  .sso-tabs { top: 76px; }
  .sso-mid { gap: 24px; padding-top: 62px; }
  .sso-line { font-size: 19px; }
  .sso-line span { display: block; }
  .sso-foot { gap: 6px 22px; padding: 14px 20px 26px; }
  .sso-foot a:nth-child(n + 5) { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .sso-sun { animation: none !important; }
  .sso-thumb { transition-duration: 1ms !important; }
}
`;
