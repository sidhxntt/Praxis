"use client";
/**
 * COMMONS · website hero
 *
 * The first screen of a guide to a city's parks, lawn by lawn. The page IS a
 * lawn, seen from straight above on a summer afternoon and drawn as a flat,
 * grainy editorial illustration: a reader on a striped blanket, two people
 * playing badminton, a child with a hoop and her dog, someone flying a kite,
 * a cyclist beside his bike, card players, a sunbather, a man asleep under his
 * newspaper. Over it lies a quiet white nav, and the words sit in the shade of
 * a tree that stands just outside the picture.
 *
 * The afternoon goes on by itself. The tree's dappled shadow sways and creeps,
 * a cloud's shadow crosses the whole lawn, the kite flies a slow figure of
 * eight over the grass with its shadow far below it, the shuttlecock goes back
 * and forth, the hoop turns, the reader turns a page, the sleeper breathes.
 * The child throws the ball, the dog runs after it and brings it back. The
 * count of people on the lawn ticks.
 *
 * The pointer is a passer-by: people near it look up. Press the ball and you
 * throw it; the dog goes after it wherever it is.
 *
 * One file, React only. The typeface (Figtree) comes from Google Fonts, loaded
 * in the CSS. The lawn, its shadows, the kite, the ball, the shuttlecock, the
 * hoop and the blankets are drawn in code; the twelve figures are pictures
 * with a transparent ground.
 *
 *   <Commons />
 *   <Commons lawn="#6fb35a" pace={1.3} park="Villa Borghese · the pine lawn" />
 *
 * Props
 *   brand      the letter mark                          "C."
 *   title      the headline, " / " breaks the line      "Somewhere to lie down, / ten minutes from anywhere."
 *   lede       the line under it
 *   cta        the button                               "Open the map"
 *   chip       the chip in the nav                      "Sunny until 19:40"
 *   search     the search field's placeholder           "Find a lawn near you"
 *   park       bottom label, the lawn you are over      "Parco Sempione · east lawn"
 *   people     how many are here now (it ticks)         214
 *   shade      bottom label                             "shade until 16:10"
 *   lawn       the colour of the grass                  "#a4c03a"
 *   pace       how fast the afternoon goes, 0.6 to 1.6  1
 *   reader, sleeper, eater, cyclist, bike, dog, playera, playerb, flyer,
 *   child, cards, sunbather                             the twelve cut-outs (transparent)
 *   sound      a soft pop when you throw the ball       true
 *   onCta      called when the button is pressed
 *   onSearch   called with the text when the search is sent
 *
 * Fills its container's width; height is var(--design-h, 100svh), never under
 * 640px. Responsive by container query: on a phone the lawn is a tall crop
 * with six of the figures, the nav becomes the mark, the chip and a search
 * key, and the shade with the words lies across the bottom.
 * The scene pauses off screen and in a hidden tab. The child's own throws wait
 * about six seconds after you press or type.
 * Reduced motion: one finished frame, nothing loops; pressing the ball still
 * moves the ball and the dog, at once.
 * Keyboard: the nav, the search, the button and the ball are real controls.
 * Sound: silent until the visitor interacts, when `sound` is false, and when
 * <html data-cd-mute="1">. The AudioContext is created on the first sound.
 */
import { useEffect, useRef } from "react";
const BASE = "/design/websites/commons/";
const PIECES = [
    { id: "reader", ar: 2.474, d: [14.2, 31.5, -8, 5.5], m: [25, 37.5, -8, 15] },
    { id: "eater", ar: 1.095, d: [26, 45, 14, 6], m: null },
    { id: "playera", ar: 0.586, d: [37.5, 27, 0, 10.4], m: [26, 21.5, 0, 30] },
    { id: "playerb", ar: 0.546, d: [60.5, 23.5, 0, 11.4], m: [73, 17.5, 0, 33] },
    { id: "cyclist", ar: 1.61, d: [73.5, 27.5, 62, 5.1], m: null },
    { id: "bike", ar: 0.936, d: [83.5, 19.5, -12, 7.8], m: null },
    { id: "flyer", ar: 1.526, d: [89, 43, -18, 4.7], m: [87, 55.5, -14, 13] },
    { id: "child", ar: 0.559, d: [46, 50, 0, 6.6], m: [62, 38.5, 0, 20] },
    { id: "cards", ar: 0.494, d: [80.5, 68, -14, 11.2], m: null },
    { id: "sunbather", ar: 1.94, d: [61, 80.5, 82, 4.8], m: null },
    { id: "sleeper", ar: 1.68, d: [41, 66, -62, 6.2], m: [33, 57, 80, 17] },
];
const P = Object.fromEntries(PIECES.map((p) => [p.id, p]));
/** What moves on its own path: the kite, the dog, the ball, the shuttlecock. */
const GEO = {
    d: { kite: [72, 49, 6.5, 7.5], kiteW: 6.2, kiteOff: [-4.6, 6], rest: [52.5, 57.5], targets: [[58.5, 63.5], [55.5, 39], [65.5, 46.5]], dogW: 6.4, ballW: 1.5, shW: 1.5 },
    m: { kite: [52, 54.5, 13, 2.4], kiteW: 12.5, kiteOff: [-9, 9], rest: [77, 46], targets: [[46, 47.5], [52, 29.5], [40, 45]], dogW: 19, ballW: 4.4, shW: 4.4 },
};
const NOMINAL = { d: [1440, 900], m: [390, 844] };
const DOG_AR = 0.366;
const KITE_AR = 1.3;
/* where things are on the pictures, as fractions of their box */
const HEAD_A = [0.92, 0.16];
const HEAD_B = [0.07, 0.12];
const HAND = [0.96, 0.27];
const SPOOL = [0.5, 0.52];
const r1 = (n) => Math.round(n * 10) / 10;
const r2 = (n) => Math.round(n * 100) / 100;
/** A point on a piece, in pixels of a page W by H. */
function anchor(lay, ar, fx, fy, W, H) {
    const w = (lay[3] * W) / 100;
    const h = w * ar;
    const a = (lay[2] * Math.PI) / 180;
    const dx = (fx - 0.5) * w;
    const dy = (fy - 0.5) * h;
    return [(lay[0] * W) / 100 + dx * Math.cos(a) - dy * Math.sin(a), (lay[1] * H) / 100 + dx * Math.sin(a) + dy * Math.cos(a)];
}
/** Where the movers stand before any script runs, in percent, for both lawns. */
function basesFor(k) {
    const [W, H] = NOMINAL[k];
    const g = GEO[k];
    const pc = (p) => [r2((p[0] / W) * 100), r2((p[1] / H) * 100)];
    const child = P.child[k];
    const pa = P.playera[k];
    const fl = P.flyer[k];
    const hand = pc(anchor(child, P.child.ar, HAND[0], HAND[1], W, H));
    const head = pc(anchor(pa, P.playera.ar, HEAD_A[0], HEAD_A[1], W, H));
    const spool = pc(anchor(fl, P.flyer.ar, SPOOL[0], SPOOL[1], W, H));
    const kite = [g.kite[0], r2(g.kite[1] + g.kite[3] * 0.56)];
    const kiteS = [r2(kite[0] + g.kiteOff[0]), r2(kite[1] + (g.kiteOff[1] * W) / H)];
    /* the kite starts turned 27 degrees; its string ends at its lower tip */
    const tip = [r2(kite[0] - 0.277 * g.kiteW), r2(kite[1] + (0.544 * g.kiteW * W) / H)];
    return { hand, head, spool, kite, kiteS, tip, dog: g.rest };
}
const BASES = { d: basesFor("d"), m: basesFor("m") };
/* ------------------------------------------------------------------ drawing
   The lawn's small marks and the tree's shadow are worked out once, from a
   seeded generator, so the server and the browser draw the same lawn. */
function rng(seed) {
    let s = seed >>> 0;
    return () => {
        s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
        return s / 4294967296;
    };
}
const TICKS = (() => {
    const r = rng(11);
    let d = "";
    for (let i = 0; i < 190; i++) {
        const x = r() * 1600;
        const y = r() * 1000;
        const l = 6 + r() * 7;
        const a = -0.45 + r() * 0.9;
        d += `M${r1(x)} ${r1(y)}l${r1(Math.sin(a) * l)} ${r1(-l)}M${r1(x + 4)} ${r1(y)}l${r1(Math.sin(a + 0.5) * l * 0.8)} ${r1(-l * 0.8)}`;
    }
    return d;
})();
const DAISIES = (() => {
    const r = rng(29);
    const out = [];
    for (let c = 0; c < 15; c++) {
        const cx = 60 + r() * 1480;
        const cy = 60 + r() * 880;
        const n = 2 + Math.floor(r() * 4);
        for (let i = 0; i < n; i++)
            out.push([r1(cx + (r() - 0.5) * 70), r1(cy + (r() - 0.5) * 56), r1(2.6 + r() * 1.6)]);
    }
    return out;
})();
const PATCHES = [
    [330, 210, 250, 120, -14],
    [1010, 540, 300, 150, 9],
    [1340, 190, 210, 105, 22],
    [640, 830, 280, 115, -6],
    [170, 640, 190, 100, 18],
];
/** The tree's shadow in a box 1000 by 800 whose bottom left corner is the tree. */
const SHADE = (() => {
    const r = rng(53);
    const RX = 965;
    const RY = 765;
    const N = 3;
    const at = (th, f) => {
        const c = Math.cos(th);
        const s = Math.sin(th);
        const k = Math.pow(Math.pow(c, N) + Math.pow(s, N), -1 / N) * f;
        return [c * k * RX, 800 - s * k * RY];
    };
    let mass = "M0 800";
    for (let i = 0; i <= 30; i++) {
        const th = (i / 30) * (Math.PI / 2);
        const [x, y] = at(th, 0.87 + 0.035 * Math.sin(th * 9) + 0.02 * r());
        mass += `L${r1(x)} ${r1(y)}`;
    }
    mass += "Z";
    const edge = [];
    for (let i = 0; i < 40; i++) {
        const th = ((i + r() * 0.8) / 40) * (Math.PI / 2);
        const [x, y] = at(th, 0.84 + r() * 0.14);
        const s = 34 + r() * 52;
        edge.push([r1(x), r1(y), r1(s), r1(s * (0.62 + r() * 0.3)), Math.round(r() * 180)]);
    }
    const dap = (n, f0, f1, s0, s1) => {
        const out = [];
        for (let i = 0; i < n; i++) {
            const th = r() * (Math.PI / 2);
            const f = f0 + r() * (f1 - f0);
            const [x, y] = at(th, f);
            const s = (s0 + r() * (s1 - s0)) * (1.25 - (f - f0) / (f1 - f0 + 0.001) * 0.55);
            out.push([r1(x), r1(y), r1(s), r1(s * (0.55 + r() * 0.35)), Math.round(r() * 180)]);
        }
        return out;
    };
    const a = dap(30, 0.99, 1.2, 12, 30);
    const b = dap(26, 1.02, 1.3, 9, 24);
    const holes = [];
    for (let i = 0; i < 16; i++) {
        const th = r() * (Math.PI / 2);
        const [x, y] = at(th, 0.87 + r() * 0.09);
        const s = 10 + r() * 15;
        holes.push([r1(x), r1(y), r1(s), r1(s * (0.55 + r() * 0.3)), Math.round(r() * 180)]);
    }
    return { mass, edge, a, b, holes };
})();
/* ------------------------------------------------------------------ sound
   One soft pop when you throw the ball. Silent when `sound` is false, when the
   page sets <html data-cd-mute="1">, and until the visitor has interacted. */
function usePop(enabled) {
    const ctx = useRef(null);
    useEffect(() => () => {
        ctx.current?.close().catch(() => { });
        ctx.current = null;
    }, []);
    return () => {
        if (!enabled || typeof window === "undefined")
            return;
        if (document.documentElement.getAttribute("data-cd-mute") === "1")
            return;
        const ua = navigator.userActivation;
        if (ua && !ua.hasBeenActive)
            return;
        try {
            if (!ctx.current) {
                const AC = window.AudioContext ?? window.webkitAudioContext;
                if (!AC)
                    return;
                ctx.current = new AC();
            }
            const ac = ctx.current;
            if (ac.state === "suspended")
                void ac.resume();
            const t = ac.currentTime;
            const o = ac.createOscillator();
            const g = ac.createGain();
            o.type = "sine";
            o.frequency.setValueAtTime(540, t);
            o.frequency.exponentialRampToValueAtTime(230, t + 0.09);
            g.gain.setValueAtTime(0.0001, t);
            g.gain.exponentialRampToValueAtTime(0.11, t + 0.008);
            g.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
            o.connect(g).connect(ac.destination);
            o.start(t);
            o.stop(t + 0.15);
        }
        catch {
            /* no sound is fine */
        }
    };
}
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const ease = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
const lerp = (a, b, u) => a + (b - a) * u;
const turn = (a, b, u) => {
    let d = b - a;
    while (d > Math.PI)
        d -= Math.PI * 2;
    while (d < -Math.PI)
        d += Math.PI * 2;
    return a + d * u;
};
function Kite({ flat = false }) {
    if (flat)
        return (<svg viewBox="0 0 100 130" aria-hidden>
        <path d="M50 2 96 46 50 128 4 46Z" fill="#8db06a"/>
      </svg>);
    return (<svg viewBox="0 0 100 130" aria-hidden>
      <path d="M50 2 96 46 50 46Z" fill="#e4553a"/>
      <path d="M50 2 4 46 50 46Z" fill="#f6ecd6"/>
      <path d="M4 46 50 128 50 46Z" fill="#e9b53a"/>
      <path d="M96 46 50 128 50 46Z" fill="#2c4a8a"/>
      <path d="M50 2V128M4 46H96" stroke="#1f2f55" strokeWidth="1.6" fill="none"/>
    </svg>);
}
export default function Commons({ brand = "C.", title = "Somewhere to lie down, / ten minutes from anywhere.", lede = "Every lawn in the city, with its shade, its crowd and its closing time. Pick a patch of grass and go.", cta = "Open the map", chip = "Sunny until 19:40", search = "Find a lawn near you", park = "Parco Sempione · east lawn", people = 214, shade = "shade until 16:10", lawn = "#a4c03a", pace = 1, reader = `${BASE}reader.webp`, sleeper = `${BASE}sleeper.webp`, eater = `${BASE}eater.webp`, cyclist = `${BASE}cyclist.webp`, bike = `${BASE}bike.webp`, dog = `${BASE}dog.webp`, playera = `${BASE}playera.webp`, playerb = `${BASE}playerb.webp`, flyer = `${BASE}flyer.webp`, child = `${BASE}child.webp`, cards = `${BASE}cards.webp`, sunbather = `${BASE}sunbather.webp`, sound = true, onCta, onSearch, }) {
    const root = useRef(null);
    const pop = usePop(sound);
    const popRef = useRef(pop);
    popRef.current = pop;
    const paceRef = useRef(pace);
    paceRef.current = clamp(Number(pace) || 1, 0.4, 2);
    const peopleRef = useRef(people);
    peopleRef.current = people;
    const throwRef = useRef(null);
    const src = { reader, sleeper, eater, cyclist, bike, playera, playerb, flyer, child, cards, sunbather };
    const lines = title.split(" / ");
    const speed = clamp(Number(pace) || 1, 0.4, 2);
    useEffect(() => {
        const el = root.current;
        if (!el)
            return;
        const q = (s) => el.querySelector(s);
        const mv = (n) => q(`[data-mv="${n}"]`);
        const inner = (n) => q(`[data-mv="${n}"] > .cmn-mvi`);
        const E = {
            dog: mv("dog"), dogI: inner("dog"),
            ball: mv("ball"), ballI: inner("ball"), ballS: mv("ball-s"),
            shut: mv("shut"), shutI: inner("shut"), shutS: mv("shut-s"),
            kite: mv("kite"), kiteI: inner("kite"), kiteS: mv("kite-s"), kiteSI: inner("kite-s"),
            strD: q(".cmn-str-d"), strM: q(".cmn-str-m"),
            pa: q('[data-id="playera"] > .cmn-pi'), pb: q('[data-id="playerb"] > .cmn-pi'),
            fl: q('[data-id="flyer"] > .cmn-pi'), ch: q('[data-id="child"] > .cmn-pi'),
            count: q(".cmn-count"),
        };
        const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let W = 0;
        let H = 0;
        let k = "d";
        let cqi = 14.4;
        let G = { hand: [0, 0], rest: [0, 0], targets: [], headA: [0, 0], headB: [0, 0], spool: [0, 0], child: [0, 0] };
        const px = (p) => [(p[0] * W) / 100, (p[1] * H) / 100];
        /* a mover is drawn at its base (CSS, in percent); the script adds the rest */
        const put = (node, base, x, y) => {
            if (node)
                node.style.transform = `translate3d(${(x - (base[0] * W) / 100).toFixed(1)}px, ${(y - (base[1] * H) / 100).toFixed(1)}px, 0)`;
        };
        const jog = new Map();
        const pose = (node, deg) => {
            if (!node || jog.get(node) === deg)
                return;
            jog.set(node, deg);
            node.style.setProperty("--j", String(deg));
        };
        /* ---- the dog and the ball: one throw at a time */
        let run = { t0: 0, from: [0, 0], to: [0, 0], dog0: [0, 0], stop: [0, 0], a0: 0, a1: 0, a2: 0, ta: 0, tb: 0, auto: true };
        let ti = 0;
        let curBall = [0, 0];
        let curDog = [0, 0];
        let curA = Math.PI * 1.2;
        let lastTouch = -1e9;
        const Tf = 1.45;
        const start = (T, from, to, auto) => {
            const dog0 = [curDog[0], curDog[1]];
            const dx = to[0] - dog0[0];
            const dy = to[1] - dog0[1];
            const d1 = Math.hypot(dx, dy) || 1;
            const reach = GEO[k].dogW * cqi * 0.46;
            const stop = [to[0] - (dx / d1) * reach, to[1] - (dy / d1) * reach];
            const run1 = Math.max(0, d1 - reach);
            const ta = Math.max(0.3 + clamp(run1 / (30 * cqi), 0.7, 2), Tf + 0.1);
            const d2 = Math.hypot(G.rest[0] - stop[0], G.rest[1] - stop[1]);
            const tb = ta + 0.55 + clamp(d2 / (25 * cqi), 0.9, 2.2);
            run = { t0: T, from, to, dog0, stop, a0: curA, a1: Math.atan2(dy, dx), a2: Math.atan2(G.rest[1] - stop[1], G.rest[0] - stop[0]), ta, tb, auto };
        };
        const nose = (p, a) => {
            const w = GEO[k].dogW * cqi;
            const ox = 0.45 * w;
            const oy = -0.17 * w * DOG_AR;
            return [p[0] + ox * Math.cos(a) - oy * Math.sin(a), p[1] + ox * Math.sin(a) + oy * Math.cos(a)];
        };
        const drawDog = (T) => {
            const tau = T - run.t0;
            const { ta, tb } = run;
            const te = tb + 0.4;
            let p;
            let a;
            let gait = 1;
            const step = Math.floor(T * 7) % 2;
            if (tau < 0.3) {
                p = run.dog0;
                a = turn(run.a0, run.a1, ease(clamp(tau / 0.3, 0, 1)));
            }
            else if (tau < ta) {
                const u = ease((tau - 0.3) / (ta - 0.3));
                p = [lerp(run.dog0[0], run.stop[0], u), lerp(run.dog0[1], run.stop[1], u)];
                a = run.a1;
                gait = step ? 0.86 : 1.04;
            }
            else if (tau < ta + 0.55) {
                p = run.stop;
                const v = tau - ta;
                a = v < 0.32 ? run.a1 + (step ? 0.09 : -0.09) : turn(run.a1, run.a2, ease((v - 0.32) / 0.23));
            }
            else if (tau < tb) {
                const u = ease((tau - ta - 0.55) / (tb - ta - 0.55));
                p = [lerp(run.stop[0], G.rest[0], u), lerp(run.stop[1], G.rest[1], u)];
                a = run.a2;
                gait = step ? 0.86 : 1.04;
            }
            else {
                p = G.rest;
                a = run.a2 + (Math.floor(T * 5) % 2 ? 0.07 : -0.07);
            }
            curDog = p;
            curA = a;
            put(E.dog, BASES[k].dog, p[0], p[1]);
            if (E.dogI)
                E.dogI.style.transform = `rotate(${((a * 180) / Math.PI).toFixed(1)}deg) scaleX(${gait})`;
            /* the ball: in the air, on the grass, in the dog's mouth, back in her hand */
            let g;
            let z = 0;
            if (tau < Tf) {
                const u = tau / Tf;
                const e = 1 - Math.pow(1 - u, 2.2);
                g = [lerp(run.from[0], run.to[0], e), lerp(run.from[1], run.to[1], e)];
                const hop = u < 0.56 ? [u / 0.56, 1] : u < 0.84 ? [(u - 0.56) / 0.28, 0.36] : [(u - 0.84) / 0.16, 0.12];
                z = Math.sin(Math.PI * hop[0]) * hop[1] * 5.2 * cqi * (k === "m" ? 2.2 : 1);
            }
            else if (tau < ta + 0.25) {
                g = run.to;
            }
            else if (tau < tb) {
                g = nose(p, a);
            }
            else if (tau < te) {
                const u = ease((tau - tb) / 0.4);
                const n = nose(p, a);
                g = [lerp(n[0], G.hand[0], u), lerp(n[1], G.hand[1], u)];
                z = Math.sin(Math.PI * u) * 1.2 * cqi;
            }
            else {
                g = G.hand;
            }
            curBall = g;
            put(E.ball, BASES[k].hand, g[0], g[1] - z);
            put(E.ballS, BASES[k].hand, g[0] - z * 0.42, g[1] + z * 0.5);
            if (E.ballI)
                E.ballI.style.transform = `scale(${(1 + z / (14 * cqi)).toFixed(3)}) rotate(${Math.round(tau < Tf ? tau * 540 : 0)}deg)`;
            if (E.ballS)
                E.ballS.style.opacity = z > 1 || tau < ta + 0.25 || tau >= te ? "1" : "0";
            /* her throw: three held poses */
            pose(E.ch, run.auto && tau < 0.14 ? -15 : run.auto && tau < 0.3 ? 9 : tau > tb && tau < te ? -6 : 0);
            if (tau > te + 1.25 && performance.now() - lastTouch > 6000) {
                ti = (ti + 1) % G.targets.length;
                start(T, G.hand, G.targets[ti], true);
            }
        };
        /* ---- the shuttlecock, back and forth, and the two swings */
        const Th = 1.2;
        const drawShuttle = (T) => {
            const n = Math.floor(T / Th);
            const u = T / Th - n;
            const fromA = n % 2 === 0;
            const a = fromA ? G.headA : G.headB;
            const b = fromA ? G.headB : G.headA;
            const gx = lerp(a[0], b[0], u);
            const gy = lerp(a[1], b[1], u);
            const zmax = Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.2;
            const z = Math.sin(Math.PI * u) * zmax;
            const dz = Math.cos(Math.PI * u) * Math.PI * zmax;
            const ang = Math.atan2(b[1] - a[1] - dz, b[0] - a[0]);
            put(E.shut, BASES[k].head, gx, gy - z);
            put(E.shutS, BASES[k].head, gx - z * 0.4, gy + z * 0.48);
            if (E.shutI)
                E.shutI.style.transform = `rotate(${((ang * 180) / Math.PI).toFixed(1)}deg) scale(${(1 + (z / (zmax || 1)) * 0.32).toFixed(3)})`;
            /* the one who hits swings through; the one who waits winds up */
            const hit = u < 0.07 ? 13 : u < 0.2 ? 5 : 0;
            const wait = u > 0.82 ? -11 : u > 0.5 ? -4 : 0;
            pose(E.pa, fromA ? hit : wait);
            pose(E.pb, fromA ? -wait : -hit);
        };
        /* ---- the kite, its shadow and its string */
        const drawKite = (T) => {
            const g = GEO[k];
            const w = (Math.PI * 2) / 12.5;
            const c = px(g.kite);
            const kx = c[0] + ((g.kite[2] * W) / 100) * Math.sin(w * T);
            const ky = c[1] + ((g.kite[3] * H) / 100) * Math.sin(2 * w * T + 0.6);
            const rot = 16 + 11 * Math.cos(w * T) + 5 * Math.sin(2 * w * T);
            put(E.kite, BASES[k].kite, kx, ky);
            put(E.kiteS, BASES[k].kiteS, kx + g.kiteOff[0] * cqi, ky + g.kiteOff[1] * cqi);
            if (E.kiteI)
                E.kiteI.style.transform = `rotate(${rot.toFixed(1)}deg)`;
            if (E.kiteSI)
                E.kiteSI.style.transform = `rotate(${rot.toFixed(1)}deg)`;
            const kh = g.kiteW * cqi * KITE_AR * 0.47;
            const ra = (rot * Math.PI) / 180;
            const tx = kx - Math.sin(ra) * kh;
            const ty = ky + Math.cos(ra) * kh;
            for (const l of [E.strD, E.strM]) {
                if (!l)
                    continue;
                l.setAttribute("x1", G.spool[0].toFixed(1));
                l.setAttribute("y1", G.spool[1].toFixed(1));
                l.setAttribute("x2", tx.toFixed(1));
                l.setAttribute("y2", ty.toFixed(1));
            }
            pose(E.fl, Math.round(Math.sin(w * T) * 2) * 4);
        };
        /* ---- how many are here */
        let shown = -1;
        const TICK = [0, 1, 0, 2, 3, 2, 3, 4, 3, 5, 4, 5, 6, 5, 4, 3, 4, 2, 1, 2];
        const drawCount = (T) => {
            const i = Math.floor(T / 2.3) % TICK.length;
            if (i === shown)
                return;
            shown = i;
            if (E.count)
                E.count.textContent = String(peopleRef.current + TICK[i]);
        };
        const measure = () => {
            W = el.clientWidth;
            H = el.clientHeight;
            k = W <= 640 ? "m" : "d";
            cqi = W / 100;
            const g = GEO[k];
            G = {
                hand: anchor(P.child[k], P.child.ar, HAND[0], HAND[1], W, H),
                child: px(P.child[k]),
                rest: px(g.rest),
                targets: g.targets.map(px),
                headA: anchor(P.playera[k], P.playera.ar, HEAD_A[0], HEAD_A[1], W, H),
                headB: anchor(P.playerb[k], P.playerb.ar, HEAD_B[0], HEAD_B[1], W, H),
                spool: anchor(P.flyer[k], P.flyer.ar, SPOOL[0], SPOOL[1], W, H),
            };
            curDog = G.rest;
            curBall = G.hand;
        };
        let T = 0;
        let last = 0;
        let raf = 0;
        let seen = true;
        const draw = () => {
            drawDog(T);
            drawShuttle(T);
            drawKite(T);
            drawCount(T);
        };
        const loop = (now) => {
            raf = requestAnimationFrame(loop);
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            T += dt * paceRef.current;
            draw();
        };
        const go = () => {
            cancelAnimationFrame(raf);
            el.dataset.live = seen && !document.hidden ? "1" : "0";
            if (calm || !seen || document.hidden)
                return;
            last = performance.now();
            raf = requestAnimationFrame(loop);
        };
        const reset = () => {
            measure();
            /* begin as the dog comes back with the ball, so there is running from the first second */
            curA = Math.atan2(G.rest[1] - G.targets[0][1], G.rest[0] - G.targets[0][0]);
            start(T, G.hand, G.targets[ti], true);
            if (calm) {
                run.t0 = T - 1e4;
                draw();
            }
            else {
                run.t0 = T - (run.ta + 0.6);
                draw();
            }
        };
        reset();
        throwRef.current = () => {
            lastTouch = performance.now();
            /* away from where the ball is now */
            let best = 0;
            let far = -1;
            G.targets.forEach((t, i) => {
                const d = Math.hypot(t[0] - curBall[0], t[1] - curBall[1]);
                if (d > far) {
                    far = d;
                    best = i;
                }
            });
            ti = best;
            popRef.current();
            if (calm) {
                curBall = G.targets[best];
                const a = Math.atan2(curBall[1] - G.rest[1], curBall[0] - G.rest[0]);
                const reach = GEO[k].dogW * cqi * 0.46;
                const p = [curBall[0] - Math.cos(a) * reach, curBall[1] - Math.sin(a) * reach];
                put(E.dog, BASES[k].dog, p[0], p[1]);
                if (E.dogI)
                    E.dogI.style.transform = `rotate(${((a * 180) / Math.PI).toFixed(1)}deg)`;
                put(E.ball, BASES[k].hand, curBall[0], curBall[1]);
                put(E.ballS, BASES[k].hand, curBall[0], curBall[1]);
                return;
            }
            start(T, [curBall[0], curBall[1]], G.targets[best], false);
        };
        /* people near the pointer look up */
        const people = Array.from(el.querySelectorAll(".cmn-p[data-id]"));
        const near = (e) => {
            if (e.pointerType === "touch")
                return;
            const b = el.getBoundingClientRect();
            const x = ((e.clientX - b.left) / b.width) * W;
            const y = ((e.clientY - b.top) / b.height) * H;
            for (const n of people) {
                const lay = P[n.dataset.id]?.[k];
                if (!lay)
                    continue;
                const on = Math.hypot((lay[0] * W) / 100 - x, (lay[1] * H) / 100 - y) < 8.5 * cqi * (k === "m" ? 2.2 : 1);
                if ((n.dataset.near === "1") !== on)
                    n.dataset.near = on ? "1" : "0";
            }
        };
        const away = () => people.forEach((n) => n.dataset.near === "1" && (n.dataset.near = "0"));
        const touch = () => {
            lastTouch = performance.now();
        };
        const ro = new ResizeObserver(() => {
            if (el.clientWidth === W && el.clientHeight === H)
                return;
            reset();
        });
        ro.observe(el);
        const io = new IntersectionObserver(([e]) => {
            seen = e.isIntersecting;
            go();
        });
        io.observe(el);
        document.addEventListener("visibilitychange", go);
        el.addEventListener("pointermove", near);
        el.addEventListener("pointerleave", away);
        el.addEventListener("pointerdown", touch);
        el.addEventListener("keydown", touch);
        go();
        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
            document.removeEventListener("visibilitychange", go);
            el.removeEventListener("pointermove", near);
            el.removeEventListener("pointerleave", away);
            el.removeEventListener("pointerdown", touch);
            el.removeEventListener("keydown", touch);
            throwRef.current = null;
        };
    }, []);
    const send = (e) => {
        e.preventDefault();
        const text = String(new FormData(e.currentTarget).get("q") ?? "").trim();
        onSearch?.(text);
    };
    const place = (p) => ({
        "--x": p.d[0], "--y": p.d[1], "--r": p.d[2], "--w": p.d[3],
        "--mx": p.m?.[0] ?? 0, "--my": p.m?.[1] ?? 0, "--mr": p.m?.[2] ?? 0, "--mw": p.m?.[3] ?? 0,
        aspectRatio: `1 / ${p.ar}`,
    });
    const mover = (d, m, w, mw) => ({ "--bx": d[0], "--by": d[1], "--mbx": m[0], "--mby": m[1], "--w": w, "--mw": mw });
    const blob = (b, i) => <ellipse key={i} cx={b[0]} cy={b[1]} rx={b[2]} ry={b[3]} transform={`rotate(${b[4]} ${b[0]} ${b[1]})`}/>;
    return (<div ref={root} className="cmn-root" data-live="1" style={{ "--cmn-lawn": lawn, "--cmn-pace": speed }}>
      <style>{CSS}</style>

      {/* the grass: lighter patches, small strokes, daisies */}
      <svg className="cmn-ground" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <g className="cmn-patch">
          {PATCHES.map((p, i) => (<ellipse key={i} cx={p[0]} cy={p[1]} rx={p[2]} ry={p[3]} transform={`rotate(${p[4]} ${p[0]} ${p[1]})`}/>))}
        </g>
        <path className="cmn-ticks" d={TICKS}/>
        {DAISIES.map((d, i) => (<g key={i}>
            <circle cx={d[0]} cy={d[1]} r={d[2]} fill="#fbf6e6"/>
            <circle cx={d[0]} cy={d[1]} r={r1(d[2] * 0.4)} fill="#f0c23c"/>
          </g>))}
      </svg>

      {/* the gravel path across the far corner */}
      <svg className="cmn-path" viewBox="0 0 300 330" aria-hidden>
        <path d="M34 345C66 232 168 132 316 96" stroke="#d9c48d" strokeWidth="56" fill="none"/>
        <path d="M34 345C66 232 168 132 316 96" stroke="#eadab0" strokeWidth="48" fill="none"/>
        <path d="M34 345C66 232 168 132 316 96" stroke="#d9c48d" strokeWidth="2.2" strokeDasharray="1 13" strokeLinecap="round" fill="none" transform="translate(-7 -5)"/>
        <path d="M34 345C66 232 168 132 316 96" stroke="#d9c48d" strokeWidth="2.6" strokeDasharray="1 17" strokeLinecap="round" fill="none" transform="translate(9 7)"/>
      </svg>

      {/* what lies on the grass */}
      <div className="cmn-p cmn-blanket" style={{ "--x": 14.6, "--y": 32.2, "--r": -8, "--w": 10.4, "--mx": 26, "--my": 37.8, "--mr": -8, "--mw": 27, aspectRatio: "1 / 1.66" }} aria-hidden>
        <div className="cmn-pi">
          <span className="cmn-stripes"/>
          <svg className="cmn-hat" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="19" fill="#e9b53a"/>
            <circle cx="20" cy="20" r="10.5" fill="#d9a22c"/>
            <circle cx="20" cy="20" r="10.5" fill="none" stroke="#e4553a" strokeWidth="2.6"/>
          </svg>
        </div>
      </div>
      <div className="cmn-p cmn-towel" data-m="0" style={{ "--x": 61, "--y": 80.5, "--r": 82, "--w": 6.4, "--mx": 0, "--my": 0, "--mr": 0, "--mw": 0, aspectRatio: "1 / 1.86" }} aria-hidden>
        <div className="cmn-pi"/>
      </div>

      {/* shadows that travel on the grass */}
      <div className="cmn-mv cmn-gs" data-mv="ball-s" style={mover(BASES.d.hand, BASES.m.hand, GEO.d.ballW, GEO.m.ballW)} aria-hidden>
        <div className="cmn-mvi"/>
      </div>
      <div className="cmn-mv cmn-gs" data-mv="shut-s" style={mover(BASES.d.head, BASES.m.head, GEO.d.shW * 0.8, GEO.m.shW * 0.8)} aria-hidden>
        <div className="cmn-mvi"/>
      </div>

      {/* the hoop turns round the child's waist, under her arms */}
      <div className="cmn-p cmn-hoop" style={{ "--x": P.child.d[0], "--y": r2(P.child.d[1] - 0.3), "--r": 0, "--w": 5, "--mx": P.child.m[0], "--my": r2(P.child.m[1] - 0.3), "--mr": 0, "--mw": 15, aspectRatio: "1 / 1" }} aria-hidden>
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#e4553a" strokeWidth="6"/>
          <circle cx="50" cy="50" r="45" fill="none" stroke="#f6ecd6" strokeWidth="6" strokeDasharray="14 33.1"/>
        </svg>
      </div>

      {/* the people */}
      {PIECES.map((p) => (<div key={p.id} className="cmn-p cmn-fig" data-id={p.id} data-m={p.m ? "1" : "0"} data-near="0" style={place(p)}>
          <div className="cmn-pi">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src[p.id]} alt="" draggable={false} decoding="async"/>
            {p.id === "reader" ? <span className="cmn-page" aria-hidden/> : null}
            {p.id === "sunbather" ? (<span className="cmn-notes" aria-hidden>
                <i>♪</i>
                <i>♫</i>
              </span>) : null}
          </div>
        </div>))}

      {/* the dog, and the ball you can throw */}
      <div className="cmn-mv cmn-dog" data-mv="dog" style={mover(BASES.d.dog, BASES.m.dog, GEO.d.dogW, GEO.m.dogW)} aria-hidden>
        <div className="cmn-mvi">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={dog} alt="" draggable={false} decoding="async"/>
        </div>
      </div>
      <button type="button" className="cmn-mv cmn-ball" data-mv="ball" style={mover(BASES.d.hand, BASES.m.hand, GEO.d.ballW, GEO.m.ballW)} aria-label="Throw the ball for the dog" onClick={() => throwRef.current?.()}>
        <span className="cmn-mvi">
          <svg viewBox="0 0 40 40" aria-hidden>
            <circle cx="20" cy="20" r="19" fill="#e4553a"/>
            <path d="M3 14C14 20 26 20 37 14" stroke="#f6ecd6" strokeWidth="5" fill="none"/>
            <path d="M5 30C14 25 26 25 35 30" stroke="#f6ecd6" strokeWidth="3" fill="none"/>
          </svg>
        </span>
      </button>

      {/* the shuttlecock */}
      <div className="cmn-mv cmn-shut" data-mv="shut" style={mover(BASES.d.head, BASES.m.head, GEO.d.shW, GEO.m.shW)} aria-hidden>
        <div className="cmn-mvi">
          <svg viewBox="0 0 44 30">
            <path d="M30 15 4 2V28Z" fill="#fbf6e6"/>
            <path d="M30 15 4 2M30 15 4 10.5M30 15 4 19.5M30 15 4 28" stroke="#c9d3e6" strokeWidth="1.3" fill="none"/>
            <circle cx="35" cy="15" r="7.5" fill="#f6ecd6"/>
            <path d="M31 8.6V21.4" stroke="#e4553a" strokeWidth="2.4"/>
          </svg>
        </div>
      </div>

      {/* the tree's shadow, lying over everything that is under the tree */}
      <svg className="cmn-shade" viewBox="0 0 1000 800" preserveAspectRatio="none" aria-hidden>
        <g fill="#8db06a">
          <g className="cmn-sh0">
            <path d={SHADE.mass}/>
          </g>
          <g className="cmn-sh1">{SHADE.edge.map(blob)}</g>
          <g className="cmn-sh2">{SHADE.a.map(blob)}</g>
          <g className="cmn-sh3">{SHADE.b.map(blob)}</g>
        </g>
        <g className="cmn-sh4" fill="#ffffff">
          {SHADE.holes.map(blob)}
        </g>
      </svg>

      {/* two clouds pass, one after the other */}
      <div className="cmn-cloud" aria-hidden/>
      <div className="cmn-cloud cmn-cloud-b" aria-hidden/>

      {/* the kite: its shadow on the grass, its string, and the kite high above */}
      <div className="cmn-mv cmn-kite-s" data-mv="kite-s" style={mover(BASES.d.kiteS, BASES.m.kiteS, GEO.d.kiteW * 0.8, GEO.m.kiteW * 0.8)} aria-hidden>
        <div className="cmn-mvi" style={{ transform: "rotate(27deg)" }}>
          <Kite flat/>
        </div>
      </div>
      <svg className="cmn-strings" aria-hidden>
        <line className="cmn-str-d" x1={`${BASES.d.spool[0]}%`} y1={`${BASES.d.spool[1]}%`} x2={`${BASES.d.tip[0]}%`} y2={`${BASES.d.tip[1]}%`}/>
        <line className="cmn-str-m" x1={`${BASES.m.spool[0]}%`} y1={`${BASES.m.spool[1]}%`} x2={`${BASES.m.tip[0]}%`} y2={`${BASES.m.tip[1]}%`}/>
      </svg>
      <div className="cmn-mv cmn-kite" data-mv="kite" style={mover(BASES.d.kite, BASES.m.kite, GEO.d.kiteW, GEO.m.kiteW)} aria-hidden>
        <div className="cmn-mvi" style={{ transform: "rotate(27deg)" }}>
          <Kite />
          <svg className="cmn-tail" viewBox="0 0 40 80">
            <path d="M20 0C8 14 32 26 20 40S8 62 20 78" stroke="#f6ecd6" strokeWidth="2" fill="none"/>
            <path d="M12 16l14 8-14 4 14-8Z" fill="#e4553a"/>
            <path d="M12 42l14 8-14 4 14-8Z" fill="#e9b53a"/>
            <path d="M12 64l14 8-14 4 14-8Z" fill="#f6ecd6"/>
          </svg>
        </div>
      </div>

      <div className="cmn-grain" aria-hidden/>

      {/* the page */}
      <header className="cmn-nav">
        <a className="cmn-mark" href="#" onClick={(e) => e.preventDefault()} aria-label="Commons, home">
          {brand}
        </a>
        <nav className="cmn-links" aria-label="Main">
          <a href="#" onClick={(e) => e.preventDefault()}>Parks</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Today</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Map</a>
        </nav>
        <span className="cmn-chip">
          <i aria-hidden/>
          {chip}
        </span>
        <form className="cmn-search" role="search" onSubmit={send}>
          <input name="q" type="search" placeholder={search} aria-label={search} autoComplete="off"/>
          <button type="submit" aria-label="Search">
            <svg viewBox="0 0 20 20" aria-hidden>
              <circle cx="8.6" cy="8.6" r="5.6" fill="none" stroke="currentColor" strokeWidth="1.7"/>
              <path d="M12.9 12.9 17.4 17.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
            </svg>
          </button>
        </form>
      </header>

      <div className="cmn-copy">
        <h1>
          {lines.map((l, i) => (<span key={i}>{l} </span>))}
        </h1>
        <p>{lede}</p>
        <button type="button" className="cmn-cta" onClick={() => onCta?.()}>
          {cta}
          <i aria-hidden>
            <svg viewBox="0 0 16 16">
              <path d="M3 8h9.5M8.6 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </i>
        </button>
      </div>

      <footer className="cmn-foot">
        <span>{park}</span>
        <i aria-hidden/>
        <span>
          <b className="cmn-count">{people}</b> people here now
        </span>
        <i aria-hidden/>
        <span className="cmn-foot-3">{shade}</span>
      </footer>
    </div>);
}
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap');

.cmn-root {
  --cmn-lawn: #a4c03a;
  --cmn-pace: 1;
  --cmn-ink: #1f4a1b;
  --cmn-cast: color-mix(in srgb, var(--cmn-lawn) 56%, #1b4a12);
  container-type: inline-size;
  position: relative;
  width: 100%;
  height: var(--design-h, 100svh);
  min-height: 640px;
  overflow: hidden;
  isolation: isolate;
  background: var(--cmn-lawn);
  color: #fff;
  font-family: 'Figtree', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  text-align: left;
  line-height: 1.3;
  user-select: none;
  -webkit-user-select: none;
}
.cmn-root *, .cmn-root *::before, .cmn-root *::after { box-sizing: border-box; }
.cmn-root[data-live="0"] *, .cmn-root[data-live="0"] *::before, .cmn-root[data-live="0"] *::after { animation-play-state: paused !important; }

/* ---------- the grass */
.cmn-ground { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.cmn-patch { fill: color-mix(in srgb, var(--cmn-lawn) 82%, #f3f08a); opacity: .4; }
.cmn-ticks { fill: none; stroke: color-mix(in srgb, var(--cmn-lawn) 70%, #2a6a1a); stroke-width: 1.5; stroke-linecap: round; opacity: .75; }
.cmn-path { position: absolute; right: 0; bottom: 0; width: 30cqi; height: 33cqi; display: block; overflow: visible; }

/* ---------- a thing on the lawn: placed by its centre */
.cmn-p {
  --xx: var(--x); --yy: var(--y); --rr: var(--r); --ww: var(--w);
  position: absolute;
  left: calc(var(--xx) * 1%);
  top: calc(var(--yy) * 1%);
  width: calc(var(--ww) * 1cqi);
  translate: -50% -50%;
}
.cmn-pi { width: 100%; height: 100%; rotate: calc((var(--rr) + var(--j, 0) + var(--n, 0)) * 1deg); transition: rotate 140ms steps(2, jump-end), scale 140ms steps(2, jump-end); }
.cmn-fig { filter: drop-shadow(-.4cqi .48cqi 0 var(--cmn-cast)); }
.cmn-fig img, .cmn-dog img { display: block; width: 100%; height: auto; pointer-events: none; }
.cmn-fig[data-near="1"] > .cmn-pi { --n: 6; scale: 1.05; }
.cmn-fig[data-id="playera"] > .cmn-pi, .cmn-fig[data-id="playerb"] > .cmn-pi { transform-origin: 42% 44%; transition-duration: 1ms; }
.cmn-fig[data-id="playerb"] > .cmn-pi { transform-origin: 58% 44%; }
.cmn-fig[data-id="child"] > .cmn-pi { transition-duration: 1ms; }
.cmn-fig[data-id="flyer"] > .cmn-pi { transition: rotate 260ms steps(2, jump-end); }

/* the blanket, the hat on it, the towel */
.cmn-blanket .cmn-pi, .cmn-towel .cmn-pi { position: relative; border-radius: .25cqi; }
.cmn-stripes { position: absolute; inset: 0; border-radius: inherit; background:
  repeating-linear-gradient(90deg, #f6ecd6 0 15%, #6fa5d8 15% 21%, #f6ecd6 21% 25%, #6fa5d8 25% 27%); }
.cmn-stripes::before, .cmn-stripes::after { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 2.4%; background: #2c4a8a; }
.cmn-stripes::after { top: auto; bottom: 0; }
.cmn-hat { position: absolute; right: 7%; bottom: 7%; width: 30%; height: auto; filter: drop-shadow(-.22cqi .26cqi 0 rgba(120,130,90,.55)); }
.cmn-towel .cmn-pi { background: linear-gradient(180deg, #f6ecd6 0 7%, #e4553a 7% 11%, #f6ecd6 11% 14%, #e4553a 14% 86%, #f6ecd6 86% 89%, #e4553a 89% 93%, #f6ecd6 93%); }

/* small lives of their own: breathing, eating, a page, a tune, a hoop */
.cmn-fig[data-id="sleeper"] img { animation: cmn-breathe calc(4.2s / var(--cmn-pace)) ease-in-out infinite; transform-origin: 50% 20%; }
.cmn-fig[data-id="eater"] img { animation: cmn-nod calc(3.4s / var(--cmn-pace)) steps(1) infinite; transform-origin: 50% 70%; }
.cmn-fig[data-id="cyclist"] img { animation: cmn-nod calc(5.2s / var(--cmn-pace)) steps(1) -2s infinite; transform-origin: 50% 20%; }
.cmn-fig[data-id="cards"] img { animation: cmn-deal calc(2.8s / var(--cmn-pace)) steps(1) infinite; }
.cmn-page { position: absolute; left: 49.5%; top: 14.6%; width: 27%; height: 15.4%; background: #fbf6e6; transform-origin: 0 50%; clip-path: polygon(0 12%, 100% 0, 100% 86%, 0 100%); animation: cmn-page calc(4.6s / var(--cmn-pace)) cubic-bezier(.5,0,.3,1) infinite; }
.cmn-notes { position: absolute; left: 50%; top: 0; width: 0; height: 0; rotate: -82deg; }
.cmn-notes i { position: absolute; left: 0; top: 0; font-style: normal; font-weight: 700; font-size: 1.25cqi; line-height: 1; color: #fff; opacity: 0; animation: cmn-note calc(3.2s / var(--cmn-pace)) ease-out infinite; }
.cmn-notes i + i { animation-delay: calc(-1.6s / var(--cmn-pace)); margin-left: 1.2cqi; }
.cmn-hoop { filter: drop-shadow(-.3cqi .36cqi 0 var(--cmn-cast)); }
.cmn-hoop svg { display: block; width: 100%; height: 100%; animation: cmn-hoop calc(.9s / var(--cmn-pace)) linear infinite; }
.cmn-fig[data-id="child"] img { animation: cmn-sway calc(.9s / var(--cmn-pace)) linear infinite; }

/* ---------- what the script carries */
.cmn-mv {
  --bxx: var(--bx); --byy: var(--by); --ww: var(--w);
  position: absolute;
  left: calc(var(--bxx) * 1%);
  top: calc(var(--byy) * 1%);
  width: calc(var(--ww) * 1cqi);
  translate: -50% -50%;
  will-change: transform;
}
.cmn-mvi { display: block; width: 100%; will-change: transform; }
.cmn-mvi svg { display: block; width: 100%; height: auto; overflow: visible; }
.cmn-dog { filter: drop-shadow(-.36cqi .44cqi 0 var(--cmn-cast)); }
.cmn-ball { appearance: none; border: 0; padding: 0; margin: 0; background: none; cursor: pointer; border-radius: 50%; color: inherit; font: inherit; }
.cmn-ball::before { content: ""; position: absolute; inset: -90%; border-radius: 50%; }
.cmn-ball:focus-visible { outline: 2px solid #fff; outline-offset: 4px; }
.cmn-ball:hover .cmn-mvi svg { scale: 1.14; }
.cmn-gs .cmn-mvi { aspect-ratio: 1; border-radius: 50%; background: var(--cmn-cast); }

.cmn-shade { position: absolute; left: 0; bottom: 0; width: 53%; height: 55%; display: block; overflow: visible; mix-blend-mode: multiply; transform-origin: 0 100%; animation: cmn-creep calc(38s / var(--cmn-pace)) ease-in-out infinite alternate; pointer-events: none; }
.cmn-shade g g, .cmn-sh4 { transform-box: view-box; transform-origin: 0% 100%; }
.cmn-sh0 { animation: cmn-s0 calc(9s / var(--cmn-pace)) ease-in-out infinite alternate; }
.cmn-sh1 { animation: cmn-s1 calc(6.4s / var(--cmn-pace)) ease-in-out infinite alternate; }
.cmn-sh2 { animation: cmn-s2 calc(4.9s / var(--cmn-pace)) ease-in-out infinite alternate; }
.cmn-sh3 { animation: cmn-s3 calc(5.7s / var(--cmn-pace)) ease-in-out -2s infinite alternate; }
.cmn-sh4 { animation: cmn-s2 calc(5.3s / var(--cmn-pace)) ease-in-out -1s infinite alternate-reverse; }

.cmn-cloud { position: absolute; left: 0; top: -8%; width: 56cqi; height: 116%; pointer-events: none; opacity: .9;
  background:
    radial-gradient(closest-side, rgba(38,84,22,.2), rgba(38,84,22,.17) 55%, transparent) 0 18% / 78% 44% no-repeat,
    radial-gradient(closest-side, rgba(38,84,22,.2), rgba(38,84,22,.15) 55%, transparent) 60% 62% / 70% 50% no-repeat,
    radial-gradient(closest-side, rgba(38,84,22,.17), rgba(38,84,22,.13) 55%, transparent) 10% 96% / 60% 34% no-repeat;
  translate: -110% 0; animation: cmn-cloud calc(18s / var(--cmn-pace)) linear -5s infinite; will-change: translate; }
.cmn-cloud-b { animation-delay: calc(-14s / var(--cmn-pace)); top: 2%; scale: .82 1; }

.cmn-kite-s { mix-blend-mode: multiply; }
.cmn-kite .cmn-mvi, .cmn-kite-s .cmn-mvi { position: relative; transform-origin: 50% 50%; }
.cmn-tail { position: absolute; left: 30%; top: 96%; width: 40% !important; transform-origin: 50% 0; animation: cmn-tail calc(1.7s / var(--cmn-pace)) ease-in-out infinite alternate; }
.cmn-strings { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; }
.cmn-strings line { stroke: #fff; stroke-width: 1.1; opacity: .85; }
.cmn-str-m { display: none; }

.cmn-grain { position: absolute; inset: 0; pointer-events: none; mix-blend-mode: multiply; opacity: .55;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .16  0 0 0 0 .3  0 0 0 0 .08  0 0 0 .62 -.2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>"); }

/* ---------- the page over the lawn */
.cmn-nav { position: absolute; left: 0; right: 0; top: 0; display: flex; align-items: center; gap: 2.6cqi; padding: 2.6cqi 4.4cqi 0; z-index: 3; }
.cmn-mark { font-size: clamp(22px, 1.95cqi, 32px); font-weight: 700; letter-spacing: -.03em; color: #fff; text-decoration: none; margin-right: 2.2cqi; }
.cmn-links { display: flex; gap: 4.2cqi; }
.cmn-links a { color: #fff; text-decoration: none; font-size: clamp(13px, 1.06cqi, 17px); font-weight: 600; letter-spacing: .005em; padding: .5em 0; border-bottom: 1.5px solid transparent; transition: border-color .2s; }
.cmn-links a:hover { border-color: #fff; }
.cmn-chip { margin-left: auto; display: inline-flex; align-items: center; gap: .6em; height: 2.9em; padding: 0 1.25em 0 1.05em; border-radius: 99px; background: #fff; color: var(--cmn-ink); font-size: clamp(12px, .98cqi, 16px); font-weight: 600; white-space: nowrap; }
.cmn-chip i { width: .72em; height: .72em; border-radius: 50%; background: #f0b62e; box-shadow: 0 0 0 .22em rgba(240,182,46,.3); animation: cmn-sun calc(2.6s / var(--cmn-pace)) ease-in-out infinite alternate; }
.cmn-search { position: relative; width: 23cqi; max-width: 360px; font-size: clamp(12px, .98cqi, 16px); }
.cmn-search input { appearance: none; -webkit-appearance: none; width: 100%; height: 2.9em; border-radius: 99px; border: 1.5px solid #fff; background: rgba(255,255,255,.94); padding: 0 3em 0 1.3em; font: inherit; font-weight: 500; color: var(--cmn-ink); outline: none; box-shadow: 0 0 0 .32em rgba(255,255,255,.28); user-select: text; -webkit-user-select: text; transition: box-shadow .2s; }
.cmn-search input::placeholder { color: color-mix(in srgb, var(--cmn-ink) 58%, #fff); opacity: 1; }
.cmn-search input::-webkit-search-cancel-button { display: none; }
.cmn-search input:focus-visible { box-shadow: 0 0 0 .32em rgba(255,255,255,.6); }
.cmn-search button { appearance: none; position: absolute; right: .35em; top: 50%; translate: 0 -50%; width: 2.3em; height: 2.3em; border: 0; border-radius: 50%; background: none; color: var(--cmn-ink); display: grid; place-items: center; cursor: pointer; padding: 0; }
.cmn-search button svg { width: 1.25em; height: 1.25em; }
.cmn-nav a:focus-visible, .cmn-search button:focus-visible, .cmn-cta:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }

.cmn-copy { position: absolute; left: 4.4cqi; bottom: 11%; width: 31cqi; z-index: 3; }
.cmn-copy h1 { margin: 0; font-size: clamp(27px, 2.72cqi, 46px); font-weight: 600; letter-spacing: -.03em; line-height: 1.06; color: #fff; }
.cmn-copy h1 span { display: block; white-space: nowrap; }
.cmn-copy p { margin: 1.1em 0 0; max-width: 25em; font-size: clamp(13px, 1.06cqi, 17px); font-weight: 500; line-height: 1.42; color: rgba(255,255,255,.92); }
.cmn-cta { appearance: none; margin-top: 1.6em; display: inline-flex; align-items: center; gap: .9em; height: 3.1em; padding: 0 .5em 0 1.4em; border: 0; border-radius: 99px; background: #fff; color: var(--cmn-ink); font: inherit; font-size: clamp(13px, 1.04cqi, 17px); font-weight: 600; cursor: pointer; transition: scale .2s cubic-bezier(.2,.8,.2,1); }
.cmn-cta i { width: 2.15em; height: 2.15em; border-radius: 50%; background: var(--cmn-ink); color: #fff; display: grid; place-items: center; transition: translate .2s cubic-bezier(.2,.8,.2,1); }
.cmn-cta i svg { width: 1.05em; height: 1.05em; }
.cmn-cta:hover i { translate: .15em 0; }
.cmn-cta:active { scale: .97; }

.cmn-foot { position: absolute; left: 4.4cqi; bottom: 4.1%; display: flex; align-items: center; gap: 1.3cqi; z-index: 3; font-size: clamp(11px, .88cqi, 14px); font-weight: 600; color: #fff; white-space: nowrap; }
.cmn-foot i { width: 3.4cqi; height: 1px; background: rgba(255,255,255,.75); }
.cmn-foot b { font-weight: 700; font-variant-numeric: tabular-nums; }

@keyframes cmn-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.022, 1.03); } }
@keyframes cmn-nod { 0%, 100% { transform: rotate(0deg); } 30% { transform: rotate(2.4deg); } 42% { transform: rotate(-1.6deg); } 54% { transform: rotate(0deg); } }
@keyframes cmn-deal { 0%, 100% { transform: rotate(0deg); } 40% { transform: rotate(1.3deg); } 52% { transform: rotate(-1deg); } 64% { transform: rotate(0deg); } }
@keyframes cmn-page { 0%, 62% { transform: scaleX(1); } 76% { transform: scaleX(0); } 90%, 100% { transform: scaleX(-1); } }
@keyframes cmn-note { 0% { opacity: 0; translate: 0 0; } 15% { opacity: .95; } 100% { opacity: 0; translate: 1.2cqi -3.4cqi; } }
@keyframes cmn-hoop { 0% { translate: .5cqi 0; } 12.5% { translate: .35cqi .35cqi; } 25% { translate: 0 .5cqi; } 37.5% { translate: -.35cqi .35cqi; } 50% { translate: -.5cqi 0; } 62.5% { translate: -.35cqi -.35cqi; } 75% { translate: 0 -.5cqi; } 87.5% { translate: .35cqi -.35cqi; } 100% { translate: .5cqi 0; } }
@keyframes cmn-sway { 0%, 100% { translate: -.1cqi 0; } 25% { translate: 0 -.1cqi; } 50% { translate: .1cqi 0; } 75% { translate: 0 .1cqi; } }
@keyframes cmn-creep { from { transform: scale(.985, .98); } to { transform: scale(1.045, 1.035); } }
@keyframes cmn-s0 { from { transform: rotate(-.35deg); } to { transform: rotate(.4deg); } }
@keyframes cmn-s1 { from { transform: rotate(-.9deg) translate(-4px, 3px); } to { transform: rotate(1.1deg) translate(5px, -4px); } }
@keyframes cmn-s2 { from { transform: rotate(-1.7deg) translate(-8px, 5px); } to { transform: rotate(1.9deg) translate(9px, -7px); } }
@keyframes cmn-s3 { from { transform: rotate(1.5deg) translate(7px, 6px); } to { transform: rotate(-1.6deg) translate(-8px, -6px); } }
@keyframes cmn-cloud { from { translate: -110% 0; } to { translate: 190cqi 0; } }
@keyframes cmn-hoop-m { 0% { translate: 1.4cqi 0; } 12.5% { translate: 1cqi 1cqi; } 25% { translate: 0 1.4cqi; } 37.5% { translate: -1cqi 1cqi; } 50% { translate: -1.4cqi 0; } 62.5% { translate: -1cqi -1cqi; } 75% { translate: 0 -1.4cqi; } 87.5% { translate: 1cqi -1cqi; } 100% { translate: 1.4cqi 0; } }
@keyframes cmn-cloud-m { from { translate: -110% 0; } to { translate: 240cqi 0; } }
@keyframes cmn-tail { from { transform: rotate(-16deg); } to { transform: rotate(18deg); } }
@keyframes cmn-sun { from { box-shadow: 0 0 0 .16em rgba(240,182,46,.34); } to { box-shadow: 0 0 0 .4em rgba(240,182,46,.14); } }

/* ---------- the phone: a tall crop of the same lawn */
@container (max-width: 640px) {
  .cmn-p { --xx: var(--mx); --yy: var(--my); --rr: var(--mr); --ww: var(--mw); }
  .cmn-p[data-m="0"], .cmn-path { display: none; }
  .cmn-mv { --bxx: var(--mbx); --byy: var(--mby); --ww: var(--mw); }
  .cmn-str-d { display: none; }
  .cmn-str-m { display: inline; }
  .cmn-fig { filter: drop-shadow(-1cqi 1.2cqi 0 var(--cmn-cast)); }
  .cmn-dog, .cmn-hoop { filter: drop-shadow(-.9cqi 1.1cqi 0 var(--cmn-cast)); }
  .cmn-hat { filter: drop-shadow(-.5cqi .6cqi 0 rgba(120,130,90,.55)); }
  .cmn-shade { width: 126%; height: 45%; }
  .cmn-cloud { width: 120cqi; }
  .cmn-hoop svg { animation-name: cmn-hoop-m; }
  .cmn-cloud { animation-name: cmn-cloud-m; }
  .cmn-nav { padding: 18px 5cqi 0; gap: 10px; }
  .cmn-mark { font-size: 26px; margin-right: 0; }
  .cmn-links { display: none; }
  .cmn-chip { font-size: 13px; }
  .cmn-search { width: 2.9em; font-size: 13px; }
  .cmn-search input { padding: 0; color: transparent; cursor: pointer; box-shadow: none; }
  .cmn-search input::placeholder { color: transparent; }
  .cmn-search input:focus { position: absolute; right: 0; top: 0; width: 62cqi; padding: 0 3em 0 1.2em; color: var(--cmn-ink); cursor: text; }
  .cmn-search button { right: .3em; pointer-events: none; }
  .cmn-copy { left: 5.6cqi; right: 5.6cqi; width: auto; bottom: 9.5%; }
  .cmn-copy h1 { font-size: 7.3cqi; }
  .cmn-copy p { font-size: 3.75cqi; max-width: none; margin-top: .9em; }
  .cmn-cta { font-size: 3.75cqi; margin-top: 1.3em; }
  .cmn-foot { left: 5.6cqi; bottom: 3.3%; gap: 2.6cqi; font-size: 3.05cqi; }
  .cmn-foot i { width: 5cqi; }
  .cmn-foot i + span + i, .cmn-foot-3 { display: none; }
  .cmn-notes i { font-size: 3.4cqi; }
}

@media (prefers-reduced-motion: reduce) {
  .cmn-root *, .cmn-root *::before, .cmn-root *::after { animation: none !important; transition-duration: 1ms !important; }
  .cmn-cloud { translate: 62cqi 0; }
  .cmn-cloud-b { display: none; }
}
`;
