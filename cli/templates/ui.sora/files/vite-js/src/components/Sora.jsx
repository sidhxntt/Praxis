"use client";
/**
 * SORA · website hero
 *
 * The first screen of a travel-money card: "Money that moves with you". Under
 * the red serif title lies a field of enamel tiles seen in perspective, drawn
 * in WebGL as real 3D columns (lit tops with a glazed bevel, shaded sides,
 * grout between them). Slow swells roll across the field and the tiles rise
 * into enamel red where the swell is high and settle back to white. The navy
 * card floats above it in the same 3D space: it hovers, catches a moving
 * sheen, and its shadow and reflection travel over the tiles beneath it.
 *
 * Every 2.8 s the card hops to pay: it crouches, springs up and turns a full
 * flip over its long axis (its edge and navy back flash past), drops and lands
 * on a damped spring with two small bounces. The landing kicks the field: a
 * ring of tiles pops up, overshoots below and settles as it runs outward, and
 * the receipt in the corner rolls to the next purchase in the next city
 * (Coffee · Lisbon, Metro · Paris, Ramen · Tokyo …). The pointer moves the camera, so the tiles, the card and
 * the title part in true parallax, and the card tilts toward it. Press the
 * card (or focus it and press Enter) to pay yourself: a soft two-note chime.
 *
 * One file, React only. The typefaces come from Google Fonts (loaded in the CSS).
 *
 *   <Sora />
 *   <Sora tone="#0e8a63" waves={1.4} cta="Open an account" />
 *
 * Props
 *   brand    the wordmark                                     "Sora"
 *   cta      the main button                                  "Get the card"
 *   tone     the enamel colour (title, high tiles, button)     "#c8102e"
 *   waves    how fast and high the field rolls (1 = as shown)  1
 *   last4    the digits on the card                           "4821"
 *   sound    tiny synthesized sounds on interaction           true
 *   onCta    called when the main button is pressed
 *
 * Fills its container's width; height is var(--design-h, 100svh), never under
 * 640px. Responsive by container query: on a phone the title stacks larger,
 * the camera pulls back and the card sits in the middle of the field.
 * The field pauses off screen and in a hidden tab. Without WebGL2 a drawn card
 * over a soft red field is shown instead. Reduced motion: no entrance, one
 * still frame, the receipt stays put. Keyboard: Tab to the card, Enter/Space
 * pays. The automatic payments keep going on their own so the page stays
 * alive (remove the `nextTap` lines in the loop to stop them).
 * Sound: silent until the visitor interacts, when `sound` is false, and when
 * <html data-cd-mute="1">. The AudioContext is created on the first sound.
 */
import { useCallback, useEffect, useRef, useState } from "react";
const BUYS = [
    { what: "Coffee", city: "Lisbon", amount: "€3.20" },
    { what: "Metro", city: "Paris", amount: "€2.15" },
    { what: "Ramen", city: "Tokyo", amount: "¥1,180" },
    { what: "Taxi", city: "New York", amount: "$18.40" },
    { what: "Gelato", city: "Rome", amount: "€4.50" },
    { what: "Books", city: "Berlin", amount: "€12.90" },
    { what: "Tapas", city: "Madrid", amount: "€16.80" },
    { what: "Ferry", city: "Istanbul", amount: "₺85.00" },
];
const TAP_EVERY = 2.8; // seconds between automatic hops (each landing is a payment)
/* The hop, in seconds from its start: crouch, spring up with a full flip, fall, land on a spring. */
const CROUCH = 0.14;
const APEX = 0.52;
const LAND = 0.8;
/* Sound: a soft two-note chime, made in the browser. Silent when `sound` is
   false, when <html data-cd-mute="1">, and until the visitor has interacted. */
function useChime(on) {
    const ctx = useRef(null);
    useEffect(() => () => void ctx.current?.close().catch(() => { }), []);
    return useCallback(() => {
        if (!on || typeof window === "undefined")
            return;
        if (document.documentElement.dataset.cdMute === "1")
            return;
        const ua = navigator.userActivation;
        if (ua && !ua.hasBeenActive)
            return;
        try {
            const AC = window.AudioContext ?? window.webkitAudioContext;
            if (!AC)
                return;
            const a = (ctx.current ??= new AC());
            if (a.state === "suspended")
                void a.resume();
            [1318.5, 1760].forEach((f, i) => {
                const t = a.currentTime + i * 0.075;
                const o = a.createOscillator();
                const g = a.createGain();
                o.type = "sine";
                o.frequency.setValueAtTime(f, t);
                g.gain.setValueAtTime(0.0001, t);
                g.gain.exponentialRampToValueAtTime(0.045, t + 0.005);
                g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
                o.connect(g).connect(a.destination);
                o.start(t);
                o.stop(t + 0.07);
            });
        }
        catch {
            /* no sound is fine */
        }
    }, [on]);
}
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => {
    const l = Math.hypot(a[0], a[1], a[2]) || 1;
    return [a[0] / l, a[1] / l, a[2] / l];
};
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
function perspective(tanHalf, aspect, n, f) {
    const m = new Float32Array(16);
    m[0] = 1 / (tanHalf * aspect);
    m[5] = 1 / tanHalf;
    m[10] = (f + n) / (n - f);
    m[11] = -1;
    m[14] = (2 * f * n) / (n - f);
    return m;
}
function lookAt(eye, at) {
    const z = norm(sub(eye, at));
    const x = norm(cross([0, 1, 0], z));
    const y = cross(z, x);
    const m = new Float32Array(16);
    m[0] = x[0];
    m[4] = x[1];
    m[8] = x[2];
    m[12] = -dot(x, eye);
    m[1] = y[0];
    m[5] = y[1];
    m[9] = y[2];
    m[13] = -dot(y, eye);
    m[2] = z[0];
    m[6] = z[1];
    m[10] = z[2];
    m[14] = -dot(z, eye);
    m[15] = 1;
    return m;
}
function mul(a, b) {
    const o = new Float32Array(16);
    for (let c = 0; c < 4; c++)
        for (let r = 0; r < 4; r++) {
            let s = 0;
            for (let k = 0; k < 4; k++)
                s += a[k * 4 + r] * b[c * 4 + k];
            o[c * 4 + r] = s;
        }
    return o;
}
/* rotate a vector around an axis (Rodrigues) */
function rot(v, k, ang) {
    const c = Math.cos(ang);
    const s = Math.sin(ang);
    const kv = cross(k, v);
    const d = dot(k, v) * (1 - c);
    return [v[0] * c + kv[0] * s + k[0] * d, v[1] * c + kv[1] * s + k[1] * d, v[2] * c + kv[2] * s + k[2] * d];
}
const hex3 = (h) => {
    const m = /^#?([0-9a-f]{6})$/i.exec(h.trim());
    const n = m ? parseInt(m[1], 16) : 0xc8102e;
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};
const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
/* ---------- shaders ---------- */
const NX = 60;
const NZ = 54;
const Z0 = -34; // far row
const CARD_W = 5.5;
const CARD_H = CARD_W / 1.586;
const TILE_VS = `#version 300 es
precision highp float;
layout(location=0) in vec3 aPos;
layout(location=1) in vec3 aNor;
layout(location=2) in vec3 aInst;
uniform mat4 uVP;
uniform float uT, uIntro, uAmp;
uniform vec2 uPool;
uniform vec4 uRip[4];
uniform vec3 uTone;
uniform float uFloor;
out vec3 vW; out vec3 vN; out vec3 vCol; out vec2 vFace; out float vSide;
float field(vec2 p){
  float a = sin(p.x*0.27 + p.y*0.19 - uT*0.80);
  float b = sin(-p.x*0.15 + p.y*0.30 - uT*0.55 + 1.7);
  float c = sin(length(p - vec2(-9.0,-14.0))*0.33 - uT*0.65);
  return a*0.42 + b*0.36 + c*0.22;
}
void main(){
  if(uFloor > 0.5){ vW = aPos; vN = aNor; vCol = vec3(1.0); vFace = vec2(0.0); vSide = 0.0; gl_Position = uVP*vec4(aPos,1.0); return; }
  vec2 p = vec2((aInst.x - ${((NX - 1) / 2).toFixed(1)}), ${Z0}.0 + aInst.y);
  float w = field(p);
  vec2 dp = (p - uPool) * vec2(1.0/8.5, 1.0/5.8);
  float pool = exp(-dot(dp,dp));
  float h = 0.14 + pool*(0.95 + 0.40*w) + (1.0-pool)*max(0.0, w)*0.62;
  for(int i=0;i<4;i++){
    vec4 r = uRip[i];
    float age = uT - r.z;
    if(age > 0.0 && age < 7.0){
      float d = length(p - r.xy);
      float tau = age - d/7.5;
      if(tau > 0.0) h += r.w * exp(-tau*2.4) * sin(tau*9.0) * exp(-d*0.045);
    }
  }
  h = max(0.06, h * uAmp) * uIntro + 0.06*(1.0-uIntro);
  float rnd = aInst.z;
  float k = smoothstep(0.22, 1.25, h + (rnd-0.5)*0.12);
  vec3 white = vec3(0.965, 0.955, 0.950);
  vec3 blush = mix(white, uTone, 0.30);
  vec3 deep = uTone * 0.80;
  vec3 col = k < 0.45 ? mix(white, blush, k/0.45) : (k < 0.85 ? mix(blush, uTone, (k-0.45)/0.40) : mix(uTone, deep, (k-0.85)/0.15));
  col *= 0.97 + rnd*0.06;
  vec3 wp = vec3(p.x + aPos.x*0.86, aPos.y*h, p.y + aPos.z*0.86);
  vW = wp; vN = aNor; vCol = col; vFace = aPos.xz; vSide = aNor.y > 0.5 ? 0.0 : aPos.y;
  gl_Position = uVP * vec4(wp, 1.0);
}`;
const TILE_FS = `#version 300 es
precision highp float;
in vec3 vW; in vec3 vN; in vec3 vCol; in vec2 vFace; in float vSide;
uniform vec3 uEye, uL, uGround;
uniform vec3 uCC, uCX, uCY, uCN;
uniform vec2 uCS;
uniform float uFloor, uHaze;
uniform vec2 uPoolF;
uniform vec3 uToneF;
out vec4 o;
float rectMask(vec3 q, float soft){
  float lx = dot(q, uCX)/uCS.x; float ly = dot(q, uCY)/uCS.y;
  return (1.0 - smoothstep(0.5-soft, 0.5+soft, abs(lx))) * (1.0 - smoothstep(0.5-soft*1.6, 0.5+soft*1.6, abs(ly)));
}
void main(){
  vec3 N = normalize(vN);
  vec3 V = normalize(uEye - vW);
  vec3 col = vCol;
  float diff = 0.62 + 0.38*dot(N, uL);
  if(uFloor > 0.5){
    vec2 dq = (vW.xz - uPoolF) * vec2(1.0/8.5, 1.0/5.8);
    col = mix(uGround*vec3(0.80,0.78,0.78), uToneF*0.32, exp(-dot(dq,dq))*0.85); diff = 1.0;
  }
  else if(N.y < 0.5){ diff = (0.70 + 0.22*dot(N, uL)) * (0.72 + 0.28*clamp(vSide*1.6, 0.0, 1.0)); }
  col *= diff;
  if(uFloor < 0.5 && N.y > 0.5){
    float e = max(abs(vFace.x), abs(vFace.y));
    col = mix(col, vec3(1.0), smoothstep(0.38, 0.5, e)*0.42);
    vec3 H = normalize(uL + V);
    col += pow(max(dot(N,H),0.0), 70.0)*0.22;
    // the card mirrored in the glaze
    vec3 R = reflect(-V, N);
    float dn = dot(R, uCN);
    if(abs(dn) > 1e-3){
      float t = dot(uCC - vW, uCN)/dn;
      if(t > 0.0){
        float m = rectMask(vW + R*t - uCC, 0.03 + t*0.012);
        float fr = 0.10 + 0.30*pow(1.0 - max(dot(N,V),0.0), 3.0);
        col = mix(col, col*vec3(0.42,0.44,0.70), m*fr);
      }
    }
  }
  // the card's shadow, softer the further it falls
  float dl = dot(uL, uCN);
  if(abs(dl) > 1e-3){
    float t = dot(uCC - vW, uCN)/dl;
    if(t > 0.0){
      float m = rectMask(vW + uL*t - uCC, 0.05 + t*0.05);
      col *= 1.0 - m*0.42;
    }
  }
  // a broad contact shadow straight below
  vec3 qd = vW - uCC; qd.y = 0.0;
  vec2 b = vec2(dot(qd, normalize(vec3(uCX.x,0.0,uCX.z)))/(uCS.x*0.75), dot(qd, normalize(vec3(uCY.x,0.0,uCY.z)+vec3(0.0,0.0,1e-4)))/(uCS.y*0.9));
  col *= 1.0 - 0.12*exp(-dot(b,b)*2.0);
  float fog = smoothstep(5.0, -31.0, vW.z);
  col = mix(col, uGround, pow(fog, 0.85));
  // the headline sits on calm ground: the upper part of the frame is hazed
  float sy = gl_FragCoord.y / uHaze;
  col = mix(col, uGround, smoothstep(0.50, 0.80, sy)*0.80);
  o = vec4(col, 1.0);
}`;
const CARD_VS = `#version 300 es
precision highp float;
layout(location=0) in vec2 aQ;
uniform mat4 uVP;
uniform vec3 uCC, uCX, uCY, uCN;
uniform vec2 uCS;
uniform float uOff, uGrow;
out vec2 vUv; out vec3 vW; out vec2 vL;
void main(){
  vec2 l = aQ * uGrow;
  vec3 w = uCC + uCX*(l.x*uCS.x) + uCY*(l.y*uCS.y) + uCN*uOff;
  vUv = vec2(l.x + 0.5, 0.5 - l.y);
  vL = l; vW = w;
  gl_Position = uVP * vec4(w, 1.0);
}`;
const CARD_FS = `#version 300 es
precision highp float;
in vec2 vUv; in vec3 vW; in vec2 vL;
uniform sampler2D uTex;
uniform vec3 uEye, uL, uCN;
uniform vec2 uCS;
uniform float uBack, uSheen, uAlpha;
out vec4 o;
void main(){
  vec2 q = vL * uCS;
  vec2 hs = uCS*0.5;
  float r = uCS.x*0.055;
  vec2 d2 = abs(q) - (hs - r);
  float d = length(max(d2, 0.0)) + min(max(d2.x, d2.y), 0.0) - r;
  float fw = fwidth(d);
  float a = 1.0 - smoothstep(-fw, fw, d);
  if(a <= 0.0) discard;
  vec3 V = normalize(uEye - vW);
  vec3 N = normalize(uCN);
  if(uBack > 0.5){
    // the back: navy enamel, a magnetic stripe, the same sheen
    vec3 Nb = dot(N, V) < 0.0 ? -N : N;
    vec3 bc = mix(vec3(0.11,0.13,0.27), vec3(0.17,0.19,0.40), vUv.x*0.6 + vUv.y*0.4);
    bc *= 0.75 + 0.35*max(dot(Nb, uL), 0.0);
    float stripe = smoothstep(0.155, 0.16, vUv.y) * (1.0 - smoothstep(0.33, 0.335, vUv.y));
    bc = mix(bc, vec3(0.03,0.03,0.05), stripe*0.92);
    float sb = dot(vL, normalize(vec2(0.85, 0.55)));
    bc += vec3(0.8,0.85,1.0) * exp(-pow((sb - uSheen)*6.0, 2.0))*0.18;
    bc += pow(max(dot(reflect(-V, Nb), uL), 0.0), 30.0)*0.25;
    o = vec4(bc, a*uAlpha);
    return;
  }
  vec3 col = texture(uTex, vUv).rgb;
  col *= 0.86 + 0.24*max(dot(N, uL), 0.0);
  float s = dot(vL, normalize(vec2(0.85, 0.55)));
  col += vec3(0.85,0.88,1.0) * (exp(-pow((s - uSheen)*7.0, 2.0))*0.22 + exp(-pow((s - uSheen)*2.2, 2.0))*0.07);
  vec3 R = reflect(-V, N);
  col += pow(max(dot(R, uL), 0.0), 36.0)*0.30;
  float rim = 1.0 - smoothstep(-0.05, -0.012, d);
  col += (1.0 - rim) * 0.10;
  o = vec4(col, a*uAlpha);
}`;
/* The card face, drawn once into a canvas and used as a texture. */
function drawFace(c, brand, last4) {
    const W = 1024;
    const H = Math.round(W / 1.586);
    c.width = W;
    c.height = H;
    const x = c.getContext("2d");
    if (!x)
        return;
    const g = x.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "#1c2142");
    g.addColorStop(0.5, "#2b3270");
    g.addColorStop(1, "#141731");
    x.fillStyle = g;
    x.fillRect(0, 0, W, H);
    // fine brushed lines in the enamel
    x.globalAlpha = 0.05;
    x.strokeStyle = "#ffffff";
    for (let i = -H; i < W; i += 7) {
        x.beginPath();
        x.moveTo(i, H);
        x.lineTo(i + H * 0.62, 0);
        x.stroke();
    }
    // a large embossed arc, the "orbit" of the brand
    x.globalAlpha = 0.09;
    x.lineWidth = 46;
    x.beginPath();
    x.arc(W * 0.86, H * 1.02, H * 0.78, Math.PI * 1.02, Math.PI * 1.62);
    x.stroke();
    x.globalAlpha = 1;
    x.fillStyle = "#ffffff";
    x.font = '400 92px "DM Serif Display", Georgia, serif';
    x.textBaseline = "alphabetic";
    x.fillText(brand, 64, 132);
    // the chip
    const cx = 66, cy = 236, cw = 118, ch = 90;
    const cg = x.createLinearGradient(cx, cy, cx + cw, cy + ch);
    cg.addColorStop(0, "#f1dda4");
    cg.addColorStop(0.5, "#c9a85e");
    cg.addColorStop(1, "#e6cd8a");
    x.fillStyle = cg;
    x.beginPath();
    x.roundRect(cx, cy, cw, ch, 16);
    x.fill();
    x.strokeStyle = "rgba(90,66,20,.45)";
    x.lineWidth = 2.5;
    x.beginPath();
    x.moveTo(cx, cy + ch / 2);
    x.lineTo(cx + cw * 0.35, cy + ch / 2);
    x.moveTo(cx + cw * 0.65, cy + ch / 2);
    x.lineTo(cx + cw, cy + ch / 2);
    x.moveTo(cx + cw * 0.35, cy);
    x.lineTo(cx + cw * 0.35, cy + ch);
    x.moveTo(cx + cw * 0.65, cy);
    x.lineTo(cx + cw * 0.65, cy + ch);
    x.stroke();
    // contactless
    x.strokeStyle = "rgba(255,255,255,.75)";
    x.lineWidth = 6;
    x.lineCap = "round";
    for (let i = 0; i < 3; i++) {
        x.beginPath();
        x.arc(212, cy + ch / 2, 16 + i * 15, -0.75, 0.75);
        x.stroke();
    }
    x.fillStyle = "rgba(255,255,255,.88)";
    x.font = '500 40px "JetBrains Mono", ui-monospace, Menlo, monospace';
    x.fillText(`••••  ${last4}`, 66, H - 66);
    // the network mark
    x.globalAlpha = 0.95;
    x.fillStyle = "#eb001b";
    x.beginPath();
    x.arc(W - 150, H - 84, 46, 0, Math.PI * 2);
    x.fill();
    x.fillStyle = "#f79e1b";
    x.globalAlpha = 0.9;
    x.beginPath();
    x.arc(W - 92, H - 84, 46, 0, Math.PI * 2);
    x.fill();
    x.globalAlpha = 1;
}
export default function Sora({ brand = "Sora", cta = "Get the card", tone = "#c8102e", waves = 1, last4 = "4821", sound = true, onCta, }) {
    const root = useRef(null);
    const cvRef = useRef(null);
    const hitRef = useRef(null);
    const titleRef = useRef(null);
    const fgRef = useRef(null);
    const [gl2, setGl2] = useState(true);
    const [buy, setBuy] = useState(0);
    const toneRef = useRef(tone);
    toneRef.current = tone;
    const wavesRef = useRef(waves);
    wavesRef.current = waves;
    const tapRef = useRef(() => { });
    const chime = useChime(sound);
    const chimeRef = useRef(chime);
    chimeRef.current = chime;
    useEffect(() => {
        const el = root.current;
        const cv = cvRef.current;
        if (!el || !cv)
            return;
        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const gl = cv.getContext("webgl2", { antialias: true, alpha: false, powerPreference: "high-performance" });
        if (!gl) {
            setGl2(false);
            return;
        }
        let dead = false;
        let raf = 0;
        let visible = true;
        let W = 1, H = 1, dpr = 1;
        const compile = (vs, fs) => {
            const p = gl.createProgram();
            for (const [t, s] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]]) {
                const sh = gl.createShader(t);
                gl.shaderSource(sh, s);
                gl.compileShader(sh);
                if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS))
                    console.warn(gl.getShaderInfoLog(sh));
                gl.attachShader(p, sh);
            }
            gl.linkProgram(p);
            return p;
        };
        const tileP = compile(TILE_VS, TILE_FS);
        const cardP = compile(CARD_VS, CARD_FS);
        if (!gl.getProgramParameter(tileP, gl.LINK_STATUS) || !gl.getProgramParameter(cardP, gl.LINK_STATUS)) {
            setGl2(false);
            return;
        }
        const uni = (p, names) => {
            const u = {};
            for (const n of names)
                u[n] = gl.getUniformLocation(p, n);
            return u;
        };
        const UT = uni(tileP, ["uVP", "uT", "uIntro", "uAmp", "uPool", "uRip", "uTone", "uEye", "uL", "uGround", "uCC", "uCX", "uCY", "uCN", "uCS", "uFloor", "uHaze", "uPoolF", "uToneF"]);
        const UC = uni(cardP, ["uVP", "uCC", "uCX", "uCY", "uCN", "uCS", "uOff", "uGrow", "uTex", "uEye", "uL", "uBack", "uSheen", "uAlpha"]);
        // A tile: five faces of a unit column (x,z in -.5….5, y in 0…1).
        const faces = [];
        const quad = (a, b, c, d, n) => {
            for (const v of [a, b, c, a, c, d])
                faces.push(...v, ...n);
        };
        quad([-0.5, 1, 0.5], [0.5, 1, 0.5], [0.5, 1, -0.5], [-0.5, 1, -0.5], [0, 1, 0]);
        quad([-0.5, 0, 0.5], [0.5, 0, 0.5], [0.5, 1, 0.5], [-0.5, 1, 0.5], [0, 0, 1]);
        quad([0.5, 0, -0.5], [-0.5, 0, -0.5], [-0.5, 1, -0.5], [0.5, 1, -0.5], [0, 0, -1]);
        quad([0.5, 0, 0.5], [0.5, 0, -0.5], [0.5, 1, -0.5], [0.5, 1, 0.5], [1, 0, 0]);
        quad([-0.5, 0, -0.5], [-0.5, 0, 0.5], [-0.5, 1, 0.5], [-0.5, 1, -0.5], [-1, 0, 0]);
        const tileVao = gl.createVertexArray();
        gl.bindVertexArray(tileVao);
        const vb = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vb);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(faces), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);
        const inst = new Float32Array(NX * NZ * 3);
        let s = 1234567;
        for (let j = 0; j < NZ; j++)
            for (let i = 0; i < NX; i++) {
                s = (s * 16807) % 2147483647;
                const k = (j * NX + i) * 3;
                inst[k] = i;
                inst[k + 1] = j;
                inst[k + 2] = s / 2147483647;
            }
        const ib = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, ib);
        gl.bufferData(gl.ARRAY_BUFFER, inst, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(2, 1);
        // The floor (grout) under the tiles: a big quad at y = 0.
        const floorVao = gl.createVertexArray();
        gl.bindVertexArray(floorVao);
        const fb = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, fb);
        const F = 80;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-F, 0, 12, 0, 1, 0, F, 0, 12, 0, 1, 0, F, 0, -60, 0, 1, 0, -F, 0, 12, 0, 1, 0, F, 0, -60, 0, 1, 0, -F, 0, -60, 0, 1, 0]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);
        gl.vertexAttrib3f(2, 0, 0, 0);
        // The card: one unit quad.
        const cardVao = gl.createVertexArray();
        gl.bindVertexArray(cardVao);
        const cb = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cb);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.bindVertexArray(null);
        // The card face texture (redrawn once the fonts arrive).
        const face = document.createElement("canvas");
        const tex = gl.createTexture();
        const upload = () => {
            drawFace(face, brand, last4);
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, face);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            const ext = gl.getExtension("EXT_texture_filter_anisotropic");
            if (ext)
                gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, 8);
        };
        upload();
        if (document.fonts) {
            Promise.all([document.fonts.load('400 92px "DM Serif Display"'), document.fonts.load('500 40px "JetBrains Mono"')])
                .then(() => {
                if (!dead) {
                    upload();
                    if (still)
                        frame(0);
                }
            })
                .catch(() => { });
        }
        const layout = () => {
            const r = el.getBoundingClientRect();
            W = Math.max(1, Math.round(r.width));
            H = Math.max(1, Math.round(r.height));
            dpr = Math.min(2, window.devicePixelRatio || 1);
            cv.width = Math.round(W * dpr);
            cv.height = Math.round(H * dpr);
        };
        layout();
        // Pointer: -1…1 across the hero, eased.
        const ptr = { tx: 0, ty: 0, x: 0, y: 0, on: false };
        const onMove = (e) => {
            const r = el.getBoundingClientRect();
            ptr.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
            ptr.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
            ptr.on = true;
        };
        const onLeave = () => {
            ptr.tx = 0;
            ptr.ty = 0;
            ptr.on = false;
        };
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        // Hops: the card crouches, springs up and flips, lands on a spring; the landing
        // kicks a ring of tiles outward and the receipt rolls.
        const rip = new Float32Array(16);
        let ripI = 0;
        let T = still ? 4.2 : 0;
        let tapAt = -9;
        let nextTap = 1.5;
        let buyI = 0;
        let rolled = true;
        let poolX = 0, poolZ = 0;
        const tap = (user) => {
            if (T - tapAt < LAND + 0.2)
                return;
            tapAt = T;
            rolled = false;
            nextTap = T + TAP_EVERY;
            const k = (ripI++ % 4) * 4;
            rip[k] = poolX;
            rip[k + 1] = poolZ;
            rip[k + 2] = T + LAND;
            rip[k + 3] = user ? 1.6 : 1.3;
            if (user)
                chimeRef.current();
        };
        tapRef.current = tap;
        // Camera and card state.
        const tilt = { x: 0, y: 0, vx: 0, vy: 0 };
        const L = norm([-0.38, 1.0, -0.22]);
        let corners = [];
        let lastHit = "";
        function frame(dt) {
            if (!gl || dead || !cv)
                return;
            const ar = W / H;
            const phone = ar < 0.9;
            T += dt;
            const sp = wavesRef.current;
            const k = 1 - Math.exp(-dt * 3.2);
            ptr.x += (ptr.tx - ptr.x) * k;
            ptr.y += (ptr.ty - ptr.y) * k;
            const intro = still ? 1 : ease(T / 1.3);
            // a slow drift so the planes part even with no pointer
            const dx = still ? 0 : Math.sin(T * 0.31) * 0.55;
            const dy = still ? 0 : Math.sin(T * 0.23 + 1.1) * 0.3;
            const eye = phone
                ? [ptr.x * 1.2 + dx * 0.6, 17.5 - ptr.y * 0.6 + dy, 22.5]
                : [ptr.x * 2.6 + dx * 1.2, 15.3 - ptr.y * 1.3 + dy, 22.1];
            const at = phone ? [0, 0.4, -4.5] : [0, 0.5, -4.2];
            const tanV = phone ? Math.max(Math.tan((19 * Math.PI) / 180), 0.3 / ar) : Math.tan((19 * Math.PI) / 180);
            const VP = mul(perspective(tanV, ar, 0.5, 120), lookAt(eye, at));
            // The card: base pose, hover, a springy tilt to the pointer, the hop.
            const tt = T - tapAt;
            // lift (world units), flip (radians) and the landing slap, all from one clock
            let lift = 0;
            let flip = 0;
            let slap = 0;
            if (tt > 0 && tt < CROUCH)
                lift = -0.32 * Math.sin((Math.PI * tt) / CROUCH);
            else if (tt >= CROUCH && tt < APEX) {
                const u = (tt - CROUCH) / (APEX - CROUCH);
                lift = 1.7 * (1 - Math.pow(1 - u, 3));
            }
            else if (tt >= APEX && tt < LAND) {
                const u = (tt - APEX) / (LAND - APEX);
                lift = 1.7 * (1 - u * u);
            }
            else if (tt >= LAND && tt < LAND + 2.5) {
                // a damped spring: lands with ~0.4 of overshoot, two visible bounces
                const tau = tt - LAND;
                const w = 13;
                const env = Math.exp(-3.3 * tau);
                lift = -0.42 * env * Math.sin(w * tau);
                slap = env * Math.sin(w * tau + 0.6);
            }
            if (tt >= CROUCH && tt < LAND)
                flip = Math.PI * 2 * ease((tt - CROUCH) / (LAND - CROUCH));
            if (!rolled && tt > LAND) {
                rolled = true;
                buyI = (buyI + 1) % BUYS.length;
                setBuy(buyI);
            }
            // the pointer tilt is a real spring (slight overshoot), stepped in small slices
            for (let n = 0, h = dt / 4; n < 4; n++) {
                tilt.vx += (((ptr.on ? ptr.y : 0) - tilt.x) * 70 - tilt.vx * 9) * h;
                tilt.vy += (((ptr.on ? ptr.x : 0) - tilt.y) * 70 - tilt.vy * 9) * h;
                tilt.x += tilt.vx * h;
                tilt.y += tilt.vy * h;
            }
            const hov = still ? 0 : Math.sin(T * 1.5);
            const C = phone ? [0.3, 6.6 + hov * 0.3 + lift * 0.9, 10.0 + lift * 0.4] : [0.2, 3.5 + hov * 0.32 + lift, 5.2 + lift * 0.7];
            C[1] += (1 - intro) * 1.2;
            poolX = phone ? 0.3 : 0.2;
            poolZ = phone ? 10.0 : 5.2;
            let cx = [1, 0, 0];
            let cy = [0, 1, 0];
            // lie back so it floats over the field, turned like the still
            const back = (-58 + tilt.x * 9 + slap * 9) * (Math.PI / 180);
            const roll = (16 + (still ? 0 : Math.sin(T * 0.8) * 4)) * (Math.PI / 180);
            const yaw = (-6 + tilt.y * 14 + (still ? 0 : Math.cos(T * 0.7) * 5)) * (Math.PI / 180);
            cx = rot(cx, [0, 0, 1], roll);
            cy = rot(cy, [0, 0, 1], roll);
            cx = rot(cx, [1, 0, 0], back);
            cy = rot(cy, [1, 0, 0], back);
            cx = rot(cx, [0, 1, 0], yaw);
            cy = rot(cy, [0, 1, 0], yaw);
            // the flip turns the card over its long axis, showing its edge and back
            if (flip)
                cy = rot(cy, cx, flip);
            const cn = norm(cross(cx, cy));
            const sheen = -0.55 + tilt.y * 0.35 - tilt.x * 0.25 + (still ? 0.3 : ((T * 0.22) % 1.6)) + flip * 0.12;
            // Auto payments on a rhythm.
            if (!still && T > nextTap)
                tap(false);
            gl.viewport(0, 0, cv.width, cv.height);
            const g = [0.969, 0.969, 0.961];
            gl.clearColor(g[0], g[1], g[2], 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.enable(gl.DEPTH_TEST);
            gl.disable(gl.BLEND);
            gl.useProgram(tileP);
            gl.uniformMatrix4fv(UT.uVP, false, VP);
            gl.uniform1f(UT.uT, T * 1.6 * (0.55 + 0.45 * sp));
            gl.uniform1f(UT.uIntro, intro);
            gl.uniform1f(UT.uAmp, 0.7 + 0.3 * sp);
            gl.uniform2f(UT.uPool, C[0], C[2] - 1.2);
            // ripples are timed on the same clock as the field
            const ripT = new Float32Array(rip);
            for (let i = 0; i < 4; i++)
                ripT[i * 4 + 2] = rip[i * 4 + 2] * 1.6 * (0.55 + 0.45 * sp);
            gl.uniform4fv(UT.uRip, ripT);
            gl.uniform3fv(UT.uTone, hex3(toneRef.current));
            gl.uniform3fv(UT.uEye, eye);
            gl.uniform3fv(UT.uL, L);
            gl.uniform3fv(UT.uGround, g);
            gl.uniform3fv(UT.uCC, C);
            gl.uniform3fv(UT.uCX, cx);
            gl.uniform3fv(UT.uCY, cy);
            gl.uniform3fv(UT.uCN, cn);
            gl.uniform2f(UT.uCS, CARD_W, CARD_H);
            gl.uniform1f(UT.uHaze, cv.height);
            gl.uniform2f(UT.uPoolF, C[0], C[2] - 1.2);
            gl.uniform3fv(UT.uToneF, hex3(toneRef.current));
            gl.uniform1f(UT.uFloor, 1);
            gl.bindVertexArray(floorVao);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            gl.uniform1f(UT.uFloor, 0);
            gl.bindVertexArray(tileVao);
            gl.drawArraysInstanced(gl.TRIANGLES, 0, 30, NX * NZ);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.useProgram(cardP);
            gl.uniformMatrix4fv(UC.uVP, false, VP);
            gl.uniform3fv(UC.uCC, C);
            gl.uniform3fv(UC.uCX, cx);
            gl.uniform3fv(UC.uCY, cy);
            gl.uniform3fv(UC.uCN, cn);
            gl.uniform2f(UC.uCS, CARD_W, CARD_H);
            gl.uniform3fv(UC.uEye, eye);
            gl.uniform3fv(UC.uL, L);
            gl.uniform1f(UC.uSheen, sheen);
            gl.uniform1f(UC.uAlpha, intro);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.uniform1i(UC.uTex, 0);
            gl.bindVertexArray(cardVao);
            // the edge: a dark slab just behind the face
            gl.uniform1f(UC.uBack, 1);
            gl.uniform1f(UC.uOff, -0.07);
            gl.uniform1f(UC.uGrow, 1.0);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            gl.uniform1f(UC.uBack, 0);
            gl.uniform1f(UC.uOff, 0);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            gl.bindVertexArray(null);
            // Project the card's corners: the hit area and the focus ring follow it.
            corners = [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]].map(([a, b]) => {
                const p = [C[0] + cx[0] * a * CARD_W + cy[0] * b * CARD_H, C[1] + cx[1] * a * CARD_W + cy[1] * b * CARD_H, C[2] + cx[2] * a * CARD_W + cy[2] * b * CARD_H];
                const X = VP[0] * p[0] + VP[4] * p[1] + VP[8] * p[2] + VP[12];
                const Y = VP[1] * p[0] + VP[5] * p[1] + VP[9] * p[2] + VP[13];
                const Wc = VP[3] * p[0] + VP[7] * p[1] + VP[11] * p[2] + VP[15];
                return [((X / Wc) * 0.5 + 0.5) * W, (0.5 - (Y / Wc) * 0.5) * H];
            });
            const xs = corners.map((c) => c[0]);
            const ys = corners.map((c) => c[1]);
            const box = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)].map((v) => Math.round(v));
            const key = box.join(",");
            if (key !== lastHit && hitRef.current) {
                lastHit = key;
                const st = hitRef.current.style;
                st.left = `${box[0]}px`;
                st.top = `${box[1]}px`;
                st.width = `${box[2] - box[0]}px`;
                st.height = `${box[3] - box[1]}px`;
            }
            // The title and the receipt are the near planes: they move against the camera.
            const px = -(eye[0]) * 7;
            const py = (eye[1] - (phone ? 17.5 : 15.3)) * 6;
            if (titleRef.current)
                titleRef.current.style.transform = `translate3d(${px.toFixed(2)}px, ${py.toFixed(2)}px, 0)`;
            if (fgRef.current)
                fgRef.current.style.setProperty("--sra-px", `${(px * 1.5).toFixed(2)}px`);
            if (fgRef.current)
                fgRef.current.style.setProperty("--sra-py", `${(py * 1.5).toFixed(2)}px`);
        }
        let last = performance.now();
        const loop = (now) => {
            raf = requestAnimationFrame(loop);
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            if (!visible || document.hidden)
                return;
            frame(dt);
        };
        const ro = new ResizeObserver(() => {
            layout();
            if (still)
                frame(0);
        });
        ro.observe(el);
        const io = new IntersectionObserver(([x]) => {
            visible = x.isIntersecting;
        });
        io.observe(el);
        if (still)
            frame(0);
        else
            raf = requestAnimationFrame(loop);
        // Press on the card itself (inside its projected outline).
        const inside = (x, y) => {
            if (corners.length !== 4)
                return false;
            let sign = 0;
            for (let i = 0; i < 4; i++) {
                const [ax, ay] = corners[i];
                const [bx, by] = corners[(i + 1) % 4];
                const c = (bx - ax) * (y - ay) - (by - ay) * (x - ax);
                if (c !== 0) {
                    if (sign === 0)
                        sign = Math.sign(c);
                    else if (Math.sign(c) !== sign)
                        return false;
                }
            }
            return true;
        };
        const onDown = (e) => {
            const r = el.getBoundingClientRect();
            if (inside(e.clientX - r.left, e.clientY - r.top)) {
                tap(true);
                if (still)
                    frame(0);
            }
        };
        cv.addEventListener("pointerdown", onDown);
        return () => {
            dead = true;
            cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
            el.removeEventListener("pointermove", onMove);
            el.removeEventListener("pointerleave", onLeave);
            cv.removeEventListener("pointerdown", onDown);
            gl.deleteProgram(tileP);
            gl.deleteProgram(cardP);
            gl.deleteTexture(tex);
            [vb, ib, fb, cb].forEach((b) => gl.deleteBuffer(b));
        };
    }, [brand, last4]);
    const b = BUYS[buy];
    const style = { "--sra-tone": tone };
    return (<div ref={root} className={`sra-root${gl2 ? "" : " sra-nogl"}`} style={style}>
      <style>{css}</style>
      <canvas ref={cvRef} className="sra-cv" aria-hidden="true"/>
      <div className="sra-fallback" aria-hidden="true">
        <div className="sra-fcard">
          <span className="sra-fbrand">{brand}</span>
          <span className="sra-fnum">•••• {last4}</span>
        </div>
      </div>

      <nav className="sra-nav">
        <a className="sra-logo" href="#" onClick={(e) => e.preventDefault()}>
          <span className="sra-dot"/>
          {brand}
        </a>
        <div className="sra-links">
          <a href="#" onClick={(e) => e.preventDefault()}>Card</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Savings</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Business</a>
        </div>
        <button type="button" className="sra-cta" onClick={() => onCta?.()}>
          {cta}
        </button>
      </nav>

      <h1 ref={titleRef} className="sra-title">
        <span className="sra-l1"><span>Money that</span></span>
        <span className="sra-l2"><span><em>moves with you</em></span></span>
      </h1>

      <button ref={hitRef} type="button" className="sra-hit" aria-label={`Pay with the ${brand} card`} onClick={(e) => {
            if (e.detail === 0)
                tapRef.current(true);
        }}/>

      <div ref={fgRef} className="sra-fg">
        <div className="sra-receipt" aria-live="polite">
          <div className="sra-rtop">
            <span key={`w${buy}`} className="sra-roll">{b.what} · {b.city}</span>
            <span className="sra-now">Just now</span>
          </div>
          <div className="sra-rrow">
            <b key={`a${buy}`} className="sra-roll">{b.amount}</b>
            <span className="sra-fx">0% FX</span>
          </div>
        </div>
        <p className="sra-copy">One card for 40 currencies. No fees abroad, ever.</p>
      </div>
    </div>);
}
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
.sra-root {
  --sra-tone: #c8102e;
  --sra-ink: #121214;
  container-type: inline-size;
  position: relative;
  width: 100%;
  height: var(--design-h, 100svh);
  min-height: 640px;
  overflow: hidden;
  isolation: isolate;
  background: #f7f7f5;
  color: var(--sra-ink);
  font-family: "Inter Tight", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
.sra-cv { position: absolute; inset: 0; width: 100%; height: 100%; display: block; z-index: 0; touch-action: manipulation; }
.sra-fallback { display: none; }
.sra-nogl .sra-cv { display: none; }
.sra-nogl .sra-fallback {
  display: block; position: absolute; inset: 0; z-index: 0;
  background:
    radial-gradient(60% 45% at 50% 72%, color-mix(in srgb, var(--sra-tone) 55%, #f7f7f5) 0%, color-mix(in srgb, var(--sra-tone) 18%, #f7f7f5) 55%, #f7f7f5 80%);
}
.sra-fcard {
  position: absolute; left: 50%; top: 62%; width: min(330px, 70cqi); aspect-ratio: 1.586; border-radius: 18px;
  transform: translate(-50%, -50%) perspective(900px) rotateX(18deg) rotateY(-12deg) rotateZ(-10deg);
  background: linear-gradient(135deg, #1c2142, #2b3270 50%, #141731); color: #fff;
  box-shadow: 0 40px 60px rgba(20, 20, 50, .3);
}
.sra-fbrand { position: absolute; left: 22px; top: 18px; font: 400 28px "DM Serif Display", Georgia, serif; }
.sra-fnum { position: absolute; left: 22px; bottom: 18px; font: 500 13px "JetBrains Mono", ui-monospace, monospace; letter-spacing: .14em; }

.sra-nav {
  position: absolute; z-index: 5; left: 44px; right: 44px; top: 30px;
  display: flex; align-items: center; gap: 30px; font-size: 14px; font-weight: 500;
}
.sra-logo { margin-right: auto; display: flex; align-items: center; gap: 9px; font-size: 18px; font-weight: 600; color: var(--sra-tone); text-decoration: none; }
.sra-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--sra-tone); }
.sra-links { display: flex; gap: 28px; }
.sra-links a { color: var(--sra-ink); opacity: .8; text-decoration: none; transition: opacity .2s; }
.sra-links a:hover { opacity: 1; }
.sra-cta {
  font: inherit; font-size: 13.5px; font-weight: 500; color: #fff; background: var(--sra-tone);
  border: 0; border-radius: 999px; padding: 10px 18px; cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.22), 0 6px 16px -6px color-mix(in srgb, var(--sra-tone) 70%, transparent);
  transition: transform .18s cubic-bezier(.3,1.4,.5,1), filter .2s;
}
.sra-cta:hover { filter: brightness(1.07); }
.sra-cta:active { transform: scale(.97); }
.sra-root a:focus-visible, .sra-cta:focus-visible { outline: 2px solid var(--sra-tone); outline-offset: 3px; border-radius: 999px; }

.sra-title {
  position: absolute; z-index: 3; left: 0; right: 0; top: 96px; margin: 0;
  text-align: center; color: var(--sra-tone); pointer-events: none;
  font-family: "DM Serif Display", Georgia, serif; font-weight: 400;
  font-size: clamp(56px, 9.17cqi, 140px); line-height: .9; letter-spacing: -.03em;
  will-change: transform;
}
.sra-title > span { display: block; overflow: hidden; padding: 0 .08em .06em; }
.sra-title > span > span { display: inline-block; animation: sra-rise 1s cubic-bezier(.2,.8,.2,1) both; }
.sra-l2 > span { animation-delay: .12s !important; }
.sra-title em { font-style: italic; }
@keyframes sra-rise { from { transform: translateY(105%); } to { transform: none; } }

.sra-hit {
  position: absolute; z-index: 2; border: 0; padding: 0; background: transparent; cursor: pointer;
  border-radius: 22px; pointer-events: none;
}
.sra-hit:focus-visible { outline: 2px solid var(--sra-tone); outline-offset: 6px; }
.sra-nogl .sra-hit { display: none; }

.sra-fg { position: absolute; inset: 0; z-index: 4; pointer-events: none; transform: translate3d(var(--sra-px, 0px), var(--sra-py, 0px), 0); }
.sra-receipt {
  position: absolute; left: 56px; bottom: 52px; width: 236px; padding: 14px 18px;
  background: #fff; border-radius: 14px; font-size: 13px; color: var(--sra-ink); pointer-events: auto;
  box-shadow: 0 1px 0 rgba(0,0,0,.04), 0 18px 40px -12px rgba(60, 10, 20, .22);
  animation: sra-fade .8s .5s cubic-bezier(.2,.8,.2,1) both;
}
.sra-rtop, .sra-rrow { display: flex; justify-content: space-between; align-items: baseline; overflow: hidden; }
.sra-rtop { color: rgba(18,18,20,.55); }
.sra-now { font-size: 11.5px; }
.sra-rrow { margin-top: 4px; }
.sra-rrow b { font-size: 20px; font-weight: 600; font-variant-numeric: tabular-nums; letter-spacing: -.01em; }
.sra-fx { color: #1a8f4c; font-weight: 500; }
.sra-roll { display: inline-block; animation: sra-roll .5s cubic-bezier(.2,.8,.2,1) both; }
@keyframes sra-roll { from { transform: translateY(110%); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes sra-fade { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
.sra-copy {
  position: absolute; right: 56px; bottom: 56px; width: 300px; margin: 0;
  font-size: 15px; line-height: 1.45; text-align: right; color: var(--sra-ink);
  text-shadow: 0 0 10px #fff, 0 0 18px #fff, 0 0 28px rgba(255,255,255,.9);
  animation: sra-fade .8s .6s cubic-bezier(.2,.8,.2,1) both;
}

@container (max-width: 900px) {
  .sra-links { display: none; }
  .sra-copy { width: 240px; font-size: 14px; }
}
@container (max-width: 640px) {
  .sra-nav { left: 20px; right: 20px; top: 22px; }
  .sra-title { top: 92px; font-size: 14cqi; line-height: .94; }
  .sra-receipt { left: 20px; right: 20px; bottom: 24px; width: auto; }
  .sra-copy { left: 20px; right: 20px; bottom: 108px; width: auto; text-align: left; font-size: 14px; }
}
@media (prefers-reduced-motion: reduce) {
  .sra-title > span > span, .sra-receipt, .sra-copy, .sra-roll { animation: none !important; }
  .sra-cta { transition: none; }
}
`;
