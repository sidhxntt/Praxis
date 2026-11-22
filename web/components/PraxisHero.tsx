"use client";

/**
 * PRAXIS · website hero (adapted from the Ora hero)
 *
 * The first screen of Praxis. One saturated brand colour (Flow blue, Pro
 * emerald), the headline in white in the middle, and a glossy glass ball in
 * front of it, warm inside: deep red through orange to coral, marbled with
 * lighter streaks. The ball drifts on a slow lazy figure-eight across the
 * headline and works like a real lens: the letters under it swell, bend and
 * split into a faint rainbow at its edge, then settle as it passes. Its marbled
 * interior swirls slowly, it casts a soft shadow (with a little warm caustic)
 * onto the type, and the three planes (the ground with its light, type, ball)
 * part in parallax on their own and under the pointer. The pointer also tugs
 * the ball toward it, so you can read the headline through it.
 *
 * The main button plays a short synthesized "resolve and compose": the ball
 * breathes twice (scale <= 1.04), soft ripples leave it, and the composer's
 * result line is typed under the buttons. It resets itself after ~3.5 s.
 * The second button copies the install command.
 *
 * One file, React only. The typefaces come from Google Fonts (loaded in the CSS).
 *
 *   <PraxisHero />
 *   <PraxisHero brand="Praxis Pro" ground="#047857" ... />
 *
 * Fills its container's width; height is var(--design-h, 100svh), never under
 * 640px. Responsive by container query. The scene is drawn in one WebGL canvas
 * that pauses off screen and in a hidden tab; without WebGL the ground, ball
 * and headline are shown as plain CSS, image and text. Reduced motion: the
 * ball rests above the headline, nothing drifts. Sound: silent until the
 * visitor interacts, when `sound` is false, and when <html data-cd-mute="1">.
 */

import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent } from "react";

type Link = { label: string; href: string };

type Props = {
  /** The wordmark. */
  brand?: string;
  /** Headline, first line (sans) and second line (italic serif). */
  line1?: string;
  line2?: string;
  /** The line under the headline. */
  lede?: string;
  /** Main button: idle, while composing, when done. */
  cta?: string;
  busy?: string;
  done?: string;
  /** Copied by the second button, and shown on it. */
  command?: string;
  /** Typed under the buttons after the demo, with its speaker label. */
  speaker?: string;
  result?: string;
  links?: Link[];
  navCta?: Link;
  /** Footer: [number, label] with the live dot, and the right-hand line. */
  stat?: [string, string];
  meta?: string;
  /** Colours: the ground, the italic line, button text, deep shadow tone, the ball's shadow tint and halo. */
  ground?: string;
  accent?: string;
  ink?: string;
  deep?: string;
  shade?: string;
  halo?: string;
  drift?: number;
  orb?: string;
  sound?: boolean;
  onCta?: () => void;
  /** false: the main button only calls onCta (no compose demo). */
  demo?: boolean;
  /** With onAlt, the second button calls it and reads altLabel instead of copying the command. */
  altLabel?: string;
  onAlt?: () => void;
  /** false: don't load the typefaces from Google (supply "Inter Tight" and "Instrument Serif" yourself). */
  fonts?: boolean;
  /** URL of the film-grain texture (defaults to an inline SVG). */
  grain?: string;
  /** false: skip WebGL on software renderers (no GPU) and show the CSS version instead. */
  softwareGL?: boolean;
  /** false: no glass ball (and no WebGL scene); the headline sits centred on the ground with its pool of light. */
  ball?: boolean;
};

const GRAIN = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>";

/* Where the marbling sits in its image (fractions). */
const ORB_C: [number, number] = [0.49705, 0.50312];
const ORB_R = 0.4634;

/* Sound: tiny synthesized notes made in the browser. Silent when `sound` is
   false, when <html data-cd-mute="1">, and until the visitor has interacted. */
type Blip = { f: number; to?: number; d?: number; g?: number; type?: OscillatorType; noise?: boolean; at?: number };
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
        const d = Math.min(b.d ?? 0.04, 0.06);
        const amp = a.createGain();
        amp.gain.setValueAtTime(0.0001, t);
        amp.gain.exponentialRampToValueAtTime(Math.min(b.g ?? 0.03, 0.06), t + (b.noise ? 0.006 : 0.005));
        amp.gain.exponentialRampToValueAtTime(0.0001, t + d);
        amp.connect(a.destination);
        let src: AudioScheduledSourceNode;
        if (b.noise) {
          const buf = a.createBuffer(1, Math.ceil(a.sampleRate * d), a.sampleRate);
          const ch = buf.getChannelData(0);
          for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
          const n = a.createBufferSource();
          n.buffer = buf;
          const bp = a.createBiquadFilter();
          bp.type = "bandpass";
          bp.frequency.value = b.f;
          bp.Q.value = 1.4;
          n.connect(bp).connect(amp);
          src = n;
        } else {
          const o = a.createOscillator();
          o.type = b.type ?? "sine";
          o.frequency.setValueAtTime(b.f, t);
          if (b.to) o.frequency.exponentialRampToValueAtTime(b.to, t + d);
          o.connect(amp);
          src = o;
        }
        src.start(t);
        src.stop(t + d + 0.01);
      } catch {
        /* no sound is fine */
      }
    },
    [on],
  );
}

/* ---------- WebGL: ground, type and the glass ball in one pass ---------- */
const hex3 = (h: string): [number, number, number] => {
  const m = /^#?([0-9a-f]{6})$/i.exec(h.trim());
  const n = m ? parseInt(m[1], 16) : 0x0c7bf6;
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

// Outside the lens: 2 taps. Near it: 6. Inside the ball: 8.
const FRAG = `
precision highp float;
varying vec2 vUv;
uniform vec2 uRes;
uniform sampler2D uText;
uniform sampler2D uOrb;
uniform vec3 uGround;
uniform vec2 uSkyOff;
uniform vec3 uO;
uniform float uT;
uniform float uTextOn;
uniform float uOrbOn;
uniform float uRingA;
uniform float uRingP;
uniform vec3 uOrbTex;
uniform vec3 uShade;
uniform vec3 uHalo;

// The ground: one blue, a very soft lift toward the bottom and a wide pool of light (the far plane).
vec3 groundAt(vec2 p) {
  vec2 s = (p - uSkyOff) / uRes;
  vec3 g = mix(uGround, mix(uGround, vec3(1.0), 0.32), smoothstep(0.62, 1.05, s.y) * 0.7);
  vec2 lq = (s - vec2(0.5, 0.42)) * vec2(uRes.x / uRes.y, 1.0);
  g = mix(g, mix(uGround, vec3(1.0), 0.18), exp(-dot(lq, lq) * 3.2) * 0.5);
  return g;
}
float textA(vec2 p) {
  return texture2D(uText, p / uRes).a * uTextOn;
}
// The ball's warm palette: deep red, red, orange, coral, pale streak.
vec3 warm(float s) {
  vec3 c = mix(vec3(0.43, 0.04, 0.05), vec3(0.75, 0.14, 0.06), smoothstep(0.0, 0.3, s));
  c = mix(c, vec3(0.93, 0.31, 0.11), smoothstep(0.3, 0.55, s));
  c = mix(c, vec3(1.0, 0.54, 0.38), smoothstep(0.55, 0.8, s));
  return mix(c, vec3(1.0, 0.84, 0.76), smoothstep(0.8, 1.0, s));
}
float key(vec3 c) {
  return smoothstep(0.38, 0.93, dot(c, vec3(0.299, 0.587, 0.114)) - 0.5 * (c.r - c.b));
}
vec3 sceneAt(vec2 p) {
  vec4 t = texture2D(uText, p / uRes) * uTextOn;
  return mix(groundAt(p), t.rgb, t.a);
}

void main() {
  vec2 p = vUv * uRes;
  vec2 c = uO.xy;
  float R = uO.z;
  vec2 v = p - c;
  vec2 q = v / R;
  float d = length(q);

  // The type and ground near the ball swell toward its rim, with a faint rainbow split.
  vec3 col;
  float near = (1.0 - smoothstep(1.0, 1.75, d)) * uOrbOn;
  if (near > 0.0) {
    float m = 1.0 - 0.13 * near * near;
    float ca = 0.0035 * near;
    col = vec3(sceneAt(c + v * (m - ca)).r, sceneAt(c + v * m).g, sceneAt(c + v * (m + ca)).b);
  } else {
    col = sceneAt(p);
  }

  // Its soft shadow on the type, light from the upper left, and the warm caustic inside it.
  vec2 sq = (v - vec2(0.2, 0.5) * R) / (R * vec2(1.0, 0.92));
  float sh = 1.0 - smoothstep(0.3, 1.22, length(sq));
  col *= mix(vec3(1.0), uShade, sh * 0.5 * uOrbOn);
  vec2 cq = (v - vec2(0.34, 0.98) * R) / (R * vec2(0.46, 0.2));
  col += vec3(1.0, 0.55, 0.3) * exp(-dot(cq, cq) * 1.6) * 0.16 * uOrbOn;
  // The light around it: a pale halo on the blue, a touch of its warmth near the rim.
  float halo = exp(-max(d - 1.0, 0.0) * 2.4) * step(1.0, d) * uOrbOn;
  col = mix(col, uHalo, halo * 0.34);
  col += vec3(0.5, 0.18, 0.05) * 0.05 * exp(-max(d - 1.0, 0.0) * 9.0) * step(1.0, d) * uOrbOn;

  // Ripples while it rings.
  if (uRingA > 0.0) {
    for (int k = 0; k < 2; k++) {
      float ph = fract(uRingP + float(k) * 0.5);
      float rr = 1.04 + ph * 1.1;
      float band = exp(-pow((d - rr) / 0.022, 2.0)) * (1.0 - ph) * (1.0 - ph);
      col = mix(col, vec3(1.0), band * uRingA * 0.55 * step(1.0, d));
    }
  }

  if (d < 1.0) {
    // Seen through the glass: the type magnified, with a chromatic edge.
    float m = 0.5 + 0.3 * d * d;
    float ca = 0.04 * d * d;
    vec3 ta = vec3(textA(c + v * (m - ca)), textA(c + v * m), textA(c + v * (m + ca)));

    // The marbled interior: a slow turn, a slower swirl that winds and unwinds, and a gentle flow.
    float ang = uT * 0.07 + 0.55 * sin(uT * 0.16) * (1.0 - d) * (1.0 - d);
    float cs = cos(ang);
    float sn = sin(ang);
    vec2 r = vec2(cs * q.x - sn * q.y, sn * q.x + cs * q.y);
    r += 0.055 * (1.0 - d * d) * vec2(sin(r.y * 3.3 + uT * 0.41), sin(r.x * 2.9 - uT * 0.37));
    vec3 sw = texture2D(uOrb, uOrbTex.xy + r * uOrbTex.z * 0.94).rgb;
    vec3 orb = warm(0.1 + 0.8 * key(sw));
    // Volume: lit from the upper left, deeper toward the lower right rim.
    float lit = dot(normalize(vec3(q, sqrt(max(0.0, 1.0 - d * d)))), normalize(vec3(-0.45, -0.55, 0.7)));
    orb *= 0.62 + 0.5 * clamp(lit, 0.0, 1.0);
    orb = mix(orb, orb * vec3(0.55, 0.32, 0.4), smoothstep(0.7, 1.0, d) * smoothstep(-0.2, 0.6, q.x + q.y) * 0.7);
    // The type through it, warm white.
    orb = mix(orb, vec3(1.0, 0.92, 0.86), ta * 0.82);
    // Gloss that stays put: the window highlight and sparkles from the image, a soft spot, a thin rim.
    vec3 fx = texture2D(uOrb, uOrbTex.xy + q * uOrbTex.z * 0.985).rgb;
    float hi = smoothstep(0.86, 0.99, min(fx.r, min(fx.g, fx.b)));
    orb = mix(orb, vec3(1.0, 0.95, 0.92), hi * 0.42);
    vec2 gq = (q - vec2(-0.36, -0.44)) / vec2(0.34, 0.24);
    orb += vec3(1.0, 0.9, 0.85) * exp(-dot(gq, gq) * 1.4) * 0.3;
    orb = mix(orb, vec3(1.0, 0.72, 0.6), smoothstep(0.9, 1.0, d) * smoothstep(0.2, -0.6, q.x + q.y) * 0.5);
    float e = smoothstep(1.0, 1.0 - 2.4 / R, d);
    col = mix(col, orb, e * uOrbOn);
  }
  gl_FragColor = vec4(col, 1.0);
}`;

type Layout = {
  w: number;
  h: number;
  restX: number;
  restY: number;
  r: number;
  hx: number;
  ax: number;
  yLow: number;
};

type CallState = "idle" | "ring" | "live";

const FLOW_LINKS: Link[] = [
  { label: "Product", href: "#product" },
  { label: "How it works", href: "#how" },
  { label: "FAQ", href: "#faqs" },
  { label: "Praxis Pro", href: "/pro" },
];

export default function PraxisHero({
  brand = "Praxis Flow",
  line1 = "Your whole stack,",
  line2 = "composed to order.",
  lede = "Pick a framework, a backend, a database and a deploy target. Praxis validates the set and writes one coherent repository.",
  cta = "Watch it compose",
  busy = "Resolving…",
  done = "Composed",
  command = "npx praxiflow",
  speaker = "praxis",
  result = "Resolved 8 modules, composed them in staging, then wrote my-app/. Nothing partial.",
  links = FLOW_LINKS,
  navCta = { label: "Agent Wiki", href: "https://github.com/sidhxntt/Praxis/wiki/Agent-Guide" },
  stat = ["40", "landing-page styles ship with the CLI"],
  meta = "Next.js · Vite · Vue · Astro · Angular · Express",
  ground = "#2563eb",
  accent = "#bfdbfe",
  ink = "#1d4ed8",
  deep = "#172554",
  shade = "#99a8db",
  halo = "#dbeafe",
  drift = 1,
  orb = "/design/websites/ora-call/orb.webp",
  sound = true,
  onCta,
  demo = true,
  altLabel,
  onAlt,
  fonts = true,
  grain = GRAIN,
  softwareGL = true,
  ball = true,
}: Props) {
  const rootRef = useRef<HTMLElement | null>(null);
  const cvRef = useRef<HTMLCanvasElement | null>(null);
  const slotRef = useRef<HTMLDivElement | null>(null);
  const h1Ref = useRef<HTMLHeadingElement | null>(null);
  const paraRef = useRef<HTMLParagraphElement | null>(null);
  const ptr = useRef<{ x: number; y: number; on: boolean }>({ x: 0, y: 0, on: false });
  const ringAt = useRef(-1);
  const driftRef = useRef(drift);
  const groundRef = useRef<[number, number, number]>(hex3(ground));
  const shadeRef = useRef<[number, number, number]>(hex3(shade));
  const haloRef = useRef<[number, number, number]>(hex3(halo));
  // The scene reads these every frame; keep them in step with the props.
  useEffect(() => {
    driftRef.current = drift;
    groundRef.current = hex3(ground);
    shadeRef.current = hex3(shade);
    haloRef.current = hex3(halo);
  }, [drift, ground, shade, halo]);

  const [live, setLive] = useState(false);
  const [state, setState] = useState<CallState>("idle");
  const [said, setSaid] = useState("");
  const [copied, setCopied] = useState(false);
  const timers = useRef<number[]>([]);
  const blip = useBlip(sound);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const call = useCallback(() => {
    onCta?.();
    if (!demo || state !== "idle") return;
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setState("ring");
    setSaid("");
    ringAt.current = performance.now();
    // Two short runs of resolve ticks (rising), then the write click and two rising notes.
    for (let k = 0; k < 2; k++) for (let i = 0; i < 9; i++) blip({ f: 520 + i * 40 + k * 60, d: 0.03, g: 0.018, at: k * 0.75 + i * 0.05 });
    blip({ f: 2600, noise: true, d: 0.03, g: 0.03, at: 1.55 });
    blip({ f: 660, d: 0.06, g: 0.026, type: "triangle", at: 1.64 });
    blip({ f: 990, d: 0.06, g: 0.022, type: "triangle", at: 1.74 });
    const words = result.split(" ");
    timers.current.push(
      window.setTimeout(() => {
        setState("live");
        words.forEach((_, i) =>
          timers.current.push(window.setTimeout(() => setSaid(words.slice(0, i + 1).join(" ")), i * 85)),
        );
      }, 1550),
    );
    // Demo reset so the next visitor can try (remove to keep the result line).
    timers.current.push(
      window.setTimeout(() => {
        setState("idle");
        setSaid("");
      }, 5200),
    );
  }, [blip, demo, onCta, result, state]);

  const copy = useCallback(() => {
    blip({ f: 1320, d: 0.03, g: 0.02, type: "triangle" });
    void navigator.clipboard?.writeText(command).then(
      () => {
        setCopied(true);
        timers.current.push(window.setTimeout(() => setCopied(false), 1600));
      },
      () => {},
    );
  }, [blip, command]);

  /* The scene. */
  useEffect(() => {
    const root = rootRef.current;
    const cv = cvRef.current;
    if (!ball || !root || !cv) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gl = cv.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false }) as WebGLRenderingContext | null;
    if (!gl) return;
    if (!softwareGL) {
      // No GPU (SwiftShader, llvmpipe…): keep the CSS version rather than a slow, noisy software scene.
      const info = gl.getExtension("WEBGL_debug_renderer_info");
      const renderer = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
      if (/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer)) {
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        return;
      }
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(prog, n);
    const u = {
      res: U("uRes"), ground: U("uGround"), skyOff: U("uSkyOff"), o: U("uO"), t: U("uT"),
      textOn: U("uTextOn"), orbOn: U("uOrbOn"), ringA: U("uRingA"), ringP: U("uRingP"), orbTex: U("uOrbTex"),
      shade: U("uShade"), halo: U("uHalo"),
    };
    gl.uniform1i(U("uText"), 1);
    gl.uniform1i(U("uOrb"), 2);
    gl.uniform3f(u.orbTex, ORB_C[0], ORB_C[1], ORB_R);

    const mkTex = (unit: number) => {
      const t = gl.createTexture()!;
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
      return t;
    };
    const texText = mkTex(1);
    const texOrb = mkTex(2);
    let orbOn = 0;
    let textOn = 0;
    let disposed = false;
    const load = (src: string, tex: WebGLTexture, unit: number, done: () => void) => {
      const im = new Image();
      im.decoding = "async";
      im.onload = () => {
        if (disposed) return;
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
        done();
        kick();
      };
      im.src = src;
    };
    load(orb, texOrb, 2, () => (orbOn = 1));

    /* Layout: where the ball rests, how big it is and the path it drifts on,
       all from the real DOM, and the headline drawn into a texture. */
    const tc = document.createElement("canvas");
    const tctx = tc.getContext("2d");
    let L: Layout = { w: 1, h: 1, restX: 0, restY: 0, r: 1, hx: 0, ax: 0, yLow: 0 };
    let dpr = 1;
    const measure = () => {
      const slot = slotRef.current;
      const h1 = h1Ref.current;
      const para = paraRef.current;
      if (!slot || !h1 || !para) return;
      const w = root.offsetWidth;
      const h = root.offsetHeight;
      const rr = root.getBoundingClientRect();
      const k = w / Math.max(1, rr.width);
      const box = (el: Element) => {
        const b = el.getBoundingClientRect();
        return { x: (b.left - rr.left) * k, y: (b.top - rr.top) * k, w: b.width * k, h: b.height * k };
      };
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const W = Math.max(1, Math.round(w * dpr));
      const H = Math.max(1, Math.round(h * dpr));
      if (cv.width !== W || cv.height !== H) {
        cv.width = W;
        cv.height = H;
      }
      const s = box(slot);
      const hb = box(h1);
      const pb = box(para);
      const r = s.w / 2;
      L = {
        w,
        h,
        restX: s.x + s.w / 2,
        restY: s.y + s.h / 2,
        r,
        hx: hb.x + hb.w / 2,
        ax: hb.w * (w < 640 ? 0.26 : 0.4),
        yLow: Math.max(s.y + s.h / 2, pb.y - r - 10),
      };
      // The headline, word by word, exactly where the (hidden) DOM text sits.
      if (!tctx) return;
      tc.width = W;
      tc.height = H;
      tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      tctx.clearRect(0, 0, w, h);
      h1.querySelectorAll<HTMLElement>("[data-w]").forEach((el) => {
        const cs = getComputedStyle(el);
        const b = box(el);
        tctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        (tctx as unknown as { letterSpacing: string }).letterSpacing = cs.letterSpacing === "normal" ? "0px" : cs.letterSpacing;
        tctx.fillStyle = cs.color;
        tctx.textBaseline = "alphabetic";
        const mt = tctx.measureText("Hg");
        const asc = mt.fontBoundingBoxAscent || parseFloat(cs.fontSize) * 0.9;
        const desc = mt.fontBoundingBoxDescent || parseFloat(cs.fontSize) * 0.25;
        tctx.fillText(el.textContent ?? "", b.x, b.y + (b.h * asc) / (asc + desc));
      });
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, texText);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tc);
      textOn = 1;
      gl.viewport(0, 0, W, H);
      gl.uniform2f(u.res, W, H);
      kick();
    };

    /* Motion state. */
    let t = 9.5; // start where the ball is already crossing the headline
    let last = 0;
    let raf = 0;
    let visible = true;
    let running = false;
    let intro = still ? 1 : 0;
    const off = { x: 0, y: 0 };
    const cam = { x: 0, y: 0 };
    let shown = false;

    const frame = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      if (!still) {
        t += dt;
        intro = Math.min(1, intro + dt / 1.1);
      }
      const ease = 1 - Math.pow(1 - intro, 3);
      // The lazy figure-eight across the headline.
      const a = ((2 * Math.PI) / 30) * Math.max(0.2, driftRef.current);
      const ph = t * a;
      let x = still ? L.restX : L.hx + L.ax * Math.sin(ph);
      let y = still ? L.restY : L.restY + (L.yLow - L.restY) * (0.5 + 0.5 * Math.sin(2 * ph - 0.6));
      // The pointer tugs it (critically damped, no overshoot) and parts the planes.
      const P = ptr.current;
      const k = 1 - Math.exp(-dt * 2.6);
      const tx = P.on && !still ? Math.max(-130, Math.min(130, (P.x - x) * 0.28)) : 0;
      const ty = P.on && !still ? Math.max(-70, Math.min(70, (P.y - y) * 0.22)) : 0;
      off.x += (tx - off.x) * k;
      off.y += (ty - off.y) * k;
      const nx = P.on ? (P.x / L.w) * 2 - 1 : 0;
      const ny = P.on ? (P.y / L.h) * 2 - 1 : 0;
      const cx = nx * 16 + (still ? 0 : Math.sin(t * 0.23) * 6);
      const cy = ny * 10 + (still ? 0 : Math.cos(t * 0.19) * 3);
      cam.x += (cx - cam.x) * (still ? 1 : k);
      cam.y += (cy - cam.y) * (still ? 1 : k);
      x += off.x - cam.x;
      y = Math.min(L.yLow + 6, y + off.y) - cam.y;
      // Ringing: the ball breathes with each ring (≤ 4 %), ripples leave it.
      let pulse = 0;
      let ringA = 0;
      let ringP = 0;
      if (ringAt.current > 0) {
        const e = (now - ringAt.current) / 1000;
        if (e < 1.5) pulse = 0.04 * (0.5 - 0.5 * Math.cos((2 * Math.PI * e) / 0.75));
        ringA = e < 1.5 ? Math.min(1, e / 0.15) : Math.max(0, 1 - (e - 1.5) / 0.7);
        ringP = e / 0.75;
        if (e > 2.4) ringAt.current = -1;
      }
      const R = L.r * (0.94 + 0.06 * ease) * (1 + pulse);
      y += (1 - ease) * 18;
      gl.uniform3f(u.o, x * dpr, y * dpr, R * dpr);
      gl.uniform2f(u.skyOff, (cam.x * 0.4 + (still ? 0 : Math.sin(t * 0.075) * 0.022 * L.w)) * dpr, cam.y * 0.4 * dpr);
      gl.uniform3fv(u.ground, groundRef.current);
      gl.uniform3fv(u.shade, shadeRef.current);
      gl.uniform3fv(u.halo, haloRef.current);
      gl.uniform1f(u.t, t);
      gl.uniform1f(u.textOn, textOn);
      gl.uniform1f(u.orbOn, orbOn * ease);
      gl.uniform1f(u.ringA, ringA);
      gl.uniform1f(u.ringP, ringP);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!shown && textOn && orbOn) {
        shown = true;
        setLive(true);
      }
      if (running && !still) raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (running || !visible || document.hidden) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    // Redraw once (still mode, late loads, resizes).
    function kick() {
      if (still || !running) {
        if (!raf) raf = requestAnimationFrame(frame);
      }
    }

    const ro = new ResizeObserver(measure);
    ro.observe(root);
    measure();
    void document.fonts?.ready.then(() => !disposed && measure());
    const onFonts = () => !disposed && measure();
    document.fonts?.addEventListener?.("loadingdone", onFonts);
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible && !still) start();
      else stop();
    });
    io.observe(root);
    const onVis = () => (document.hidden ? stop() : !still && start());
    document.addEventListener("visibilitychange", onVis);
    if (!still) start();
    else kick();

    return () => {
      disposed = true;
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      document.fonts?.removeEventListener?.("loadingdone", onFonts);
      gl.deleteTexture(texText);
      gl.deleteTexture(texOrb);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, [ball, orb, softwareGL]);

  const onMove = (e: RPointerEvent<HTMLElement>) => {
    const el = rootRef.current;
    if (!el || e.pointerType === "touch") return;
    const b = el.getBoundingClientRect();
    const k = el.offsetWidth / Math.max(1, b.width);
    ptr.current = { x: (e.clientX - b.left) * k, y: (e.clientY - b.top) * k, on: true };
  };
  const onLeave = () => {
    ptr.current = { ...ptr.current, on: false };
  };

  const words = (s: string) =>
    s.split(" ").map((w, i, all) => (
      <span key={i}>
        <span data-w="">{w}</span>
        {i < all.length - 1 ? " " : ""}
      </span>
    ));

  return (
    <section
      ref={rootRef}
      className={`pxh${live ? " pxh-live" : ""}${ball ? "" : " pxh-noball"}`}
      style={{ "--pxh-accent": accent, "--pxh-ground": ground, "--pxh-ink": ink, "--pxh-deep": deep, "--pxh-grain": `url("${grain}")` } as CSSProperties}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      id="home"
      aria-label={brand}
    >
      <style>{fonts ? FONTS + css : css}</style>
      {ball && <canvas ref={cvRef} className="pxh-gl" aria-hidden="true" />}
      <div className="pxh-grain" aria-hidden="true" />

      <header className="pxh-nav">
        <a className="pxh-logo" href="#home">
          <span className="pxh-dot" aria-hidden="true" />
          {brand}
        </a>
        <nav className="pxh-links" aria-label="Main">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <a className="pxh-try" href={navCta.href}>
          {navCta.label}
        </a>
      </header>

      <div className="pxh-stage">
        {ball && <div ref={slotRef} className="pxh-slot" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element -- plain img keeps this file React-only */}
          <img className="pxh-orbimg" src={orb} alt="" draggable={false} />
        </div>}
        <h1 ref={h1Ref} className="pxh-h">
          <span className="pxh-l1">{words(line1)}</span>{" "}
          <span className="pxh-l2">{words(line2)}</span>
        </h1>
        <p ref={paraRef} className="pxh-p">
          {lede}
        </p>
        <div className="pxh-cta">
          <button type="button" className="pxh-btn pxh-main" onClick={call} aria-live="polite" data-state={state}>
            <span className="pxh-ico" aria-hidden="true">
              <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 4l4 4-4 4" />
                <path d="M8.5 12.5h5" />
              </svg>
            </span>
            {state === "ring" ? busy : state === "live" ? done : cta}
          </button>
          {onAlt ? (
            <button type="button" className="pxh-btn pxh-alt" onClick={onAlt}>
              {altLabel}
            </button>
          ) : (
            <button type="button" className="pxh-btn pxh-alt pxh-cmd" onClick={copy} aria-label={`Copy ${command}`}>
              <span className="pxh-sigil" aria-hidden="true">$</span>
              {command}
              <span className="pxh-copied" aria-live="polite">{copied ? "Copied" : ""}</span>
            </button>
          )}
          <p className="pxh-said" aria-live="polite">
            {said ? (
              <>
                <b>{speaker}</b> {said}
              </>
            ) : null}
          </p>
        </div>
      </div>

      <footer className="pxh-foot">
        <span className="pxh-stat">
          <i aria-hidden="true" /> <b>{stat[0]}</b> {stat[1]}
        </span>
        <span className="pxh-meta">{meta}</span>
      </footer>
    </section>
  );
}

const FONTS = `@import url("https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&family=Instrument+Serif:ital@1&display=swap");
`;

const css = `

.pxh {
  container-type: inline-size;
  width: 100%;
  height: var(--design-h, 100svh);
  min-height: 640px;
  position: relative;
  overflow: hidden;
  isolation: isolate;
  color: #fff;
  font-family: "Inter Tight", ui-sans-serif, system-ui, sans-serif;
  background: linear-gradient(180deg, var(--pxh-ground) 0%, var(--pxh-ground) 62%, color-mix(in srgb, var(--pxh-ground) 78%, #fff) 108%);
  -webkit-font-smoothing: antialiased;
}
.pxh-gl {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0;
  transition: opacity .5s ease;
}
.pxh-live .pxh-gl { opacity: 1; }
.pxh-noball {
  background:
    radial-gradient(62% 58% at 50% 44%, color-mix(in srgb, #fff 20%, transparent), transparent 72%),
    linear-gradient(180deg, var(--pxh-ground) 0%, var(--pxh-ground) 62%, color-mix(in srgb, var(--pxh-ground) 78%, #fff) 108%);
}
.pxh-grain {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: .12;
  mix-blend-mode: overlay;
  background-image: var(--pxh-grain);
}

.pxh-nav {
  position: absolute;
  left: 44px;
  right: 44px;
  top: 30px;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 30px;
  font-size: 14px;
  font-weight: 500;
}
.pxh-logo {
  margin-right: auto;
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 18px;
  font-weight: 600;
  color: inherit;
  text-decoration: none;
  letter-spacing: -.01em;
}
.pxh-dot { width: 16px; height: 16px; border-radius: 50%; background: #fff; }
.pxh-links { display: flex; gap: 28px; }
.pxh-links a { color: inherit; opacity: .78; text-decoration: none; transition: opacity .2s; }
.pxh-links a:hover { opacity: 1; }
.pxh-try {
  text-decoration: none;
  font: inherit;
  font-size: 13.5px;
  border: 0;
  cursor: pointer;
  padding: 10px 18px;
  border-radius: 999px;
  background: #fff;
  color: var(--pxh-ink);
  transition: transform .18s ease, background .2s;
}
.pxh-try:hover { background: color-mix(in srgb, var(--pxh-ground) 9%, #fff); }
.pxh-try:active { transform: scale(.97); }

.pxh-stage {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 64px 24px 44px;
  pointer-events: none;
}
.pxh-stage > * { pointer-events: auto; }
.pxh-slot {
  --orb: clamp(170px, 22.9cqi, 340px);
  width: var(--orb);
  height: var(--orb);
  margin-bottom: 20px;
  flex: none;
  pointer-events: none;
}
.pxh-orbimg {
  width: 100%;
  height: 100%;
  display: block;
  filter: hue-rotate(-28deg) saturate(1.9) brightness(.92) drop-shadow(0 40px 50px color-mix(in srgb, var(--pxh-deep) 30%, transparent));
  transition: opacity .5s ease;
}
.pxh-live .pxh-orbimg { opacity: 0; }
.pxh-h {
  margin: 0;
  font-weight: 500;
  transition: opacity .5s ease;
}
.pxh-live .pxh-h { opacity: 0; }
.pxh-l1 {
  display: block;
  font-size: min(74px, 9.6cqi);
  letter-spacing: -.045em;
  line-height: 1;
}
.pxh-l2 {
  display: block;
  font-family: "Instrument Serif", ui-serif, Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-size: min(96px, 11.8cqi);
  line-height: 1;
  letter-spacing: -.02em;
  color: var(--pxh-accent);
}
.pxh-p {
  margin: 22px auto 0;
  max-width: 470px;
  font-size: 16px;
  line-height: 1.5;
  color: rgba(255, 255, 255, .84);
}
.pxh-cta {
  position: relative;
  margin-top: 26px;
  display: flex;
  gap: 12px;
  justify-content: center;
}
.pxh-btn {
  font: inherit;
  font-size: 15px;
  font-weight: 500;
  border: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 14px 24px;
  border-radius: 999px;
  transition: transform .18s ease, box-shadow .2s, background .2s;
}
.pxh-btn:active { transform: scale(.97); }
.pxh-main {
  background: #fff;
  color: var(--pxh-ink);
  min-width: 176px;
  justify-content: center;
  box-shadow: 0 10px 26px -12px color-mix(in srgb, var(--pxh-deep) 60%, transparent);
}
.pxh-main:hover { background: color-mix(in srgb, var(--pxh-ground) 6%, #fff); }
.pxh-main[data-state="ring"] .pxh-ico { animation: pxh-ring .375s ease-in-out infinite alternate; }
.pxh-ico { display: inline-flex; }
.pxh-alt {
  background: rgba(255, 255, 255, .14);
  color: #fff;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .42);
}
.pxh-alt:hover { background: rgba(255, 255, 255, .22); }
.pxh-cmd { position: relative; }
.pxh-sigil { opacity: .6; margin-right: -3px; }
.pxh-copied {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 8px);
  transform: translateX(-50%);
  font-size: 12px;
  color: var(--pxh-accent);
  pointer-events: none;
}
.pxh-btn:focus-visible, .pxh-try:focus-visible, .pxh-links a:focus-visible, .pxh-logo:focus-visible {
  outline: 2px solid var(--pxh-accent);
  outline-offset: 3px;
}
.pxh-said {
  position: absolute;
  top: calc(100% + 16px);
  left: 50%;
  transform: translateX(-50%);
  width: max-content;
  max-width: min(560px, 90cqi);
  margin: 0;
  font-size: 14.5px;
  line-height: 1.45;
  color: #fff;
  min-height: 1.45em;
}
.pxh-said b { color: var(--pxh-accent); font-weight: 600; margin-right: 4px; }
@keyframes pxh-ring { from { transform: rotate(-10deg); } to { transform: rotate(10deg); } }

.pxh-foot {
  position: absolute;
  left: 44px;
  right: 44px;
  bottom: 26px;
  z-index: 3;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12.5px;
  color: rgba(255, 255, 255, .78);
}
.pxh-stat { display: inline-flex; align-items: center; gap: 6px; }
.pxh-stat b { font-weight: 600; color: #fff; font-variant-numeric: tabular-nums; }
.pxh-stat i { width: 7px; height: 7px; border-radius: 50%; background: #7dffc4; box-shadow: 0 0 0 3px rgba(125, 255, 196, .25); }

@container (max-width: 860px) {
  .pxh-links { display: none; }
  .pxh-meta { display: none; }
  .pxh-foot { justify-content: center; }
}
@container (max-width: 640px) {
  .pxh-nav { left: 20px; right: 20px; top: 22px; }
  .pxh-stage { padding: 80px 20px 96px; }
  .pxh-slot { --orb: clamp(150px, 50cqi, 220px); margin-bottom: 26px; }
  .pxh-p { font-size: 15px; max-width: 310px; margin-top: 18px; }
  .pxh-cta { margin-top: 22px; gap: 8px; }
  .pxh-btn { padding: 13px 18px; font-size: 14.5px; }
  .pxh-main { min-width: 0; }
  .pxh-said { font-size: 13.5px; width: 86cqi; }
  .pxh-foot { bottom: 22px; left: 20px; right: 20px; }
}

@media (prefers-reduced-motion: reduce) {
  .pxh-gl, .pxh-h, .pxh-orbimg { transition: none; }
  .pxh-main[data-state="ring"] .pxh-ico { animation: none; }
}
`;
