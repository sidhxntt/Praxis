"use client";
/**
 * VESPER · website hero
 *
 * The first screen of a personal system that reads your day (light, sleep,
 * focus, meetings) and shows it as live tiles. On a pale grey page sits a
 * black stage with one person in it, lit only by a red light from behind.
 * Around the stage and over its edges float the tiles, at three depths: each
 * is a small panel of living colour with a two-line label and ONE instrument
 * (a reading set in dots, a ruler of ticks with a wandering needle, a sun
 * riding a ruler, a dial, a wave, a ring, a waveform, a scatter of bubbles,
 * a slider), plus a glass plate with four round icons and the app's icon.
 *
 * The one idea is depth. Every tile bobs slowly on its own clock and shifts
 * with the pointer, the near ones more than the far ones, and each shadow
 * slides the other way. Point at a tile and it comes forward; press it and
 * its reading changes. Left alone, an invisible pointer travels a slow path
 * so the depth shows by itself, and every few seconds one tile comes forward,
 * changes its reading and goes back. The red light on the stage breathes.
 *
 * One file, React only. Inter Tight comes from Google Fonts (in the CSS).
 *
 *   <Vesper />
 *   <Vesper line={"Your day,\nread for you."} light="#2f6bff" depth={1.4} />
 *
 * Props
 *   brand    the wordmark                                   "Vesper"
 *   line     the headline on the stage (\n breaks the line) "Vesper reads\nyour day."
 *   cta      the white button                               "Get early access"
 *   figure   the person, on pure black                      "/design/websites/vesper/figure.webp"
 *   light    the colour of the light behind the person:
 *            "#ff2a1f" | "#ff2d8a" | "#ff8a1f" | "#2f6bff"   "#ff2a1f"
 *   depth    how far the tiles part, 1 = normal             1
 *   sound    a soft tap when a tile is pressed              true
 *   onCta    called when the white button is pressed
 *
 * Fills its container's width; height is var(--design-h, 100svh), never under
 * 640px. The board is drawn at 1440×900 and scaled to fit; under 700px of
 * width it is recomposed at 390×844: the stage becomes the top half and five
 * tiles stand in two staggered columns over its lower edge.
 * Everything pauses off screen.
 * Reduced motion: one finished frame; tiles still come forward on hover and
 * focus, and a press still changes the reading.
 * Keyboard: every tile is a button (Tab, then Enter or Space).
 * Sound: silent until the visitor interacts, when `sound` is false, and when
 * <html data-cd-mute="1">. The AudioContext is created on the first sound.
 */
import { useCallback, useEffect, useRef, useState } from "react";
/* the photograph is lit red; another light is the same picture with its hue turned */
const HUE = { "#ff2a1f": 0, "#ff2d8a": -38, "#ff8a1f": 26, "#2f6bff": 222 };
/* ------------------------------------------------------------------ the dot font
   six columns, nine rows; "#" is a lit dot (the same table as Dot digits) */
const FONT = {
    "0": [".####.", "#....#", "#....#", "#....#", "#....#", "#....#", "#....#", "#....#", ".####."],
    "1": ["...#..", "..##..", "...#..", "...#..", "...#..", "...#..", "...#..", "...#..", ".#####"],
    "2": [".####.", "#....#", ".....#", ".....#", "....#.", "...#..", "..#...", ".#....", "######"],
    "3": [".####.", "#....#", ".....#", ".....#", "..###.", ".....#", ".....#", "#....#", ".####."],
    "4": ["....#.", "...##.", "..#.#.", ".#..#.", "#...#.", "######", "....#.", "....#.", "....#."],
    "5": ["######", "#.....", "#.....", "#####.", ".....#", ".....#", ".....#", "#....#", ".####."],
    "6": ["..###.", ".#....", "#.....", "#.....", "#####.", "#....#", "#....#", "#....#", ".####."],
    "7": ["######", ".....#", ".....#", "....#.", "....#.", "...#..", "...#..", "..#...", "..#..."],
    "8": [".####.", "#....#", "#....#", "#....#", ".####.", "#....#", "#....#", "#....#", ".####."],
    "9": [".####.", "#....#", "#....#", "#....#", ".#####", ".....#", ".....#", "....#.", ".###.."],
    "°": [".##.", "#..#", "#..#", ".##."],
    "%": ["##...#", "##..#.", "....#.", "...#..", "...#..", "..#...", ".#....", ".#..##", "#...##"],
    "+": ["......", "......", "..#...", "..#...", "#####.", "..#...", "..#...", "......", "......"],
    ":": ["..", "..", "##", "##", "..", "..", "##", "##", ".."],
    ".": ["..", "..", "..", "..", "..", "..", "..", "##", "##"],
    " ": ["...", "...", "...", "...", "...", "...", "...", "...", "..."],
};
const r1 = (n) => Math.round(n * 10) / 10;
/* a reading as ONE path: every lit dot is a zero-length stroke with round caps */
function dotPath(text, p) {
    let d = "";
    let x0 = 0;
    for (const ch of text) {
        const rows = FONT[ch] ?? FONT[" "];
        rows.forEach((row, r) => {
            for (let c = 0; c < row.length; c++)
                if (row[c] === "#")
                    d += `M${r1(x0 + c * p + p / 2)} ${r1(r * p + p / 2)}h.01`;
        });
        x0 += rows[0].length * p + p * 1.3;
    }
    return { d, w: r1(x0 - p * 1.3), h: r1(9 * p) };
}
function Dots({ text, pitch = 3.9 }) {
    const { d, w, h } = dotPath(text, pitch);
    return (<svg key={text} className="vsp-dots" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <path d={d} strokeWidth={r1(pitch * 0.8)}/>
    </svg>);
}
const SPOTS = [
    { id: "calm", x: 812, y: 304, s: 1, d: 0.16, z: 2, ph: 0.4 },
    { id: "sleep", x: 1006, y: 304, s: 1, d: 0.16, z: 2, ph: 2.2, p: [28, 606, 0.8] },
    { id: "mood", x: 812, y: 532, s: 1, d: 0.16, z: 2, ph: 4.1 },
    { id: "move", x: 1006, y: 532, s: 1, d: 0.16, z: 2, ph: 5.3, p: [216, 470, 0.8] },
    { id: "day", x: 246, y: 744, s: 1, d: 0.42, z: 3, ph: 1.3 },
    { id: "light", x: 300, y: 34, s: 1.16, d: 0.55, z: 3, ph: 3.3, p: [216, 290, 0.8] },
    { id: "meet", x: 1000, y: 78, s: 1, d: 0.5, z: 3, ph: 0.9 },
    { id: "air", x: 86, y: 172, s: 1.06, d: 1, z: 4, ph: 2.7, p: [28, 420, 0.8] },
    { id: "focus", x: 806, y: 62, s: 0.98, d: 0.86, z: 5, ph: 5.9 },
    { id: "dial", x: 40, y: 512, s: 1.04, d: 0.92, z: 4, ph: 4.6 },
    { id: "mix", x: 606, y: 646, s: 1.04, d: 1, z: 5, ph: 1.8, p: [216, 650, 0.8] },
    { id: "plate", x: 1176, y: 214, s: 1, d: 0.95, z: 5, ph: 3.9 },
    { id: "app", x: 1200, y: 668, s: 1, d: 0.78, z: 4, ph: 0.2 },
];
/* the order in which they come forward when nobody is there */
const TOUR = ["air", "sleep", "focus", "move", "light", "mix", "meet", "calm", "dial", "mood", "plate", "day", "app"];
/* what each tile reads, in turn */
const AIR = [
    ["19°", "Clear"],
    ["21°", "Warm"],
    ["17°", "Breezy"],
];
const LIGHT = [
    ["Neutral", "4,200 K", "#a8f08c"],
    ["Daylight", "5,600 K", "#cfe6ff"],
    ["Candle", "2,900 K", "#ffd27a"],
];
const FOCUS = [
    ["2.4", "Deep work"],
    ["3.1", "In flow"],
    ["1.8", "Scattered"],
];
const MEET = [
    ["14:30", "Design review"],
    ["16:00", "Call with Ines"],
    ["09:15", "Stand-up"],
];
const CALM = [
    ["62", "Even"],
    ["58", "Slow"],
    ["66", "Quick"],
];
const SLEEP = [
    [81, "7 h 12"],
    [74, "6 h 40"],
    [88, "7 h 50"],
];
const MOOD = [
    ["+4", "Bright"],
    ["+7", "Lifted"],
    ["+2", "Level"],
];
const DIAL = [
    ["40", "Steady", 18],
    ["55", "Shifting", 62],
    ["28", "Flat", -34],
];
const MIX = [
    [75, "Mostly daylight"],
    [58, "Half and half"],
    [84, "A day outside"],
];
const DAY = [
    ["93%", "An even day"],
    ["88%", "A long morning"],
    ["96%", "Right on rhythm"],
];
const ICONS = ["Clock", "Signal", "Spark", "Orbit"];
const ICON_GLOW = ["#7df0c8", "#f2c14a", "#ff5a2a", "#7a6bff"];
/* the wave, the bubbles, the bars: the drawings of Tonic's tiles */
const WW = 158;
const WMID = 28;
const env = (x) => Math.min(1, 0.22 + (x / WW) * 1.25);
const waveA = (x, ph) => Math.sin((x / WW) * Math.PI * 2.7 - ph) * 12 * env(x);
const waveB = (x, ph) => Math.sin((x / WW) * Math.PI * 2.7 - ph + Math.PI * 0.84) * 9 * env(x);
const tracePath = (fn, ph) => {
    let d = "";
    for (let x = 0; x <= WW; x += 3)
        d += `${x ? "L" : "M"}${x} ${(WMID + fn(x, ph)).toFixed(2)}`;
    return d;
};
const MARK = 0.72;
const HOMES = [
    [78, 104, 7.5, 0.3],
    [96, 118, 9, 1.9],
    [112, 100, 5, 3.1],
    [70, 126, 4.5, 4.4],
    [104, 138, 6.5, 5.2],
    [124, 124, 4, 0.9],
    [86, 146, 3.5, 2.6],
    [58, 108, 3, 3.8],
    [132, 144, 3, 1.2],
    [118, 84, 3.5, 5.7],
    [66, 150, 2.5, 2.2],
    [140, 106, 2.5, 4.9],
    [92, 86, 2.5, 0.6],
];
const r2 = (n) => Math.round(n * 100) / 100;
const BARS = Array.from({ length: 25 }, (_, i) => ({
    h: r2(5 + 34 * Math.exp(-((i - 12) * (i - 12)) / 26)),
    d: r2(0.5 + ((i * 37) % 11) * 0.06),
    delay: r2(-((i * 53) % 17) * 0.09),
    warm: Math.abs(i - 12) < 3,
}));
const RING_C = r2(2 * Math.PI * 44);
/* the dial: sixty fine ticks on a circle, and a wedge of nine longer ones */
const tick = (a, r0, r1x) => {
    const c = Math.cos((a * Math.PI) / 180);
    const s = Math.sin((a * Math.PI) / 180);
    return `M${r2(91 + c * r0)} ${r2(120 + s * r0)}L${r2(91 + c * r1x)} ${r2(120 + s * r1x)}`;
};
const DIAL_RING = Array.from({ length: 60 }, (_, i) => tick(i * 6, 47, 52)).join("");
const DIAL_WEDGE = Array.from({ length: 9 }, (_, i) => tick(-90 + (i - 4) * 4.4, 44 - (4 - Math.abs(i - 4)) * 0.6, 57 + (4 - Math.abs(i - 4)) * 1.1)).join("");
const SUN_RAYS = Array.from({ length: 18 }, (_, i) => {
    const c = Math.cos((i * 20 * Math.PI) / 180);
    const s = Math.sin((i * 20 * Math.PI) / 180);
    return `M${r2(30 + c * 25)} ${r2(30 + s * 25)}L${r2(30 + c * 27.5)} ${r2(30 + s * 27.5)}`;
}).join("");
/* the wide tile's little gyroscope: lines whose widths draw a lens */
const LENS = Array.from({ length: 13 }, (_, i) => r2(6 + 38 * Math.sqrt(Math.max(0, 1 - Math.pow((i - 6) / 6.4, 2)))));
function useBlip(on) {
    const ctx = useRef(null);
    useEffect(() => () => void ctx.current?.close().catch(() => { }), []);
    return useCallback((list) => {
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
            for (const b of list) {
                const t = a.currentTime + (b.at ?? 0);
                const d = Math.min(b.d ?? 0.035, 0.06);
                const amp = a.createGain();
                amp.gain.setValueAtTime(0.0001, t);
                amp.gain.exponentialRampToValueAtTime(Math.min(b.g ?? 0.035, 0.06), t + 0.003);
                amp.gain.exponentialRampToValueAtTime(0.0001, t + d);
                amp.connect(a.destination);
                const o = a.createOscillator();
                o.type = b.type ?? "sine";
                o.frequency.setValueAtTime(b.f, t);
                if (b.to)
                    o.frequency.exponentialRampToValueAtTime(b.to, t + d);
                o.connect(amp);
                o.start(t);
                o.stop(t + d + 0.01);
            }
        }
        catch {
            /* sound is a nicety; never let it break the page */
        }
    }, [on]);
}
export default function Vesper({ brand = "Vesper", line = "Vesper reads\nyour day.", cta = "Get early access", figure = "/design/websites/vesper/figure.webp", light = "#ff2a1f", depth = 1, sound = true, onCta, }) {
    const root = useRef(null);
    const board = useRef(null);
    const blip = useBlip(sound);
    const [live, setLive] = useState(true);
    const [calm, setCalm] = useState(false); // prefers-reduced-motion
    const [n, setN] = useState({}); // how many times each tile has been read
    const [auto, setAuto] = useState(null); // the tile self-play has brought forward
    const [over, setOver] = useState(null); // the tile under the pointer
    const [dip, setDip] = useState(null);
    const [icon, setIcon] = useState(-1); // the plate's lit icon (-1: the travelling light)
    const touched = useRef(-1e9);
    const ptr = useRef({ x: 0, y: 0, at: -1e9 });
    const sim = useRef({ mx: 0, my: 0, phase: 0.9, boost: 0, kick: 0, small: false });
    const timers = useRef({});
    const later = useCallback((name, ms, fn) => {
        clearTimeout(timers.current[name]);
        timers.current[name] = setTimeout(fn, ms);
    }, []);
    useEffect(() => {
        const t = timers.current;
        return () => Object.values(t).forEach(clearTimeout);
    }, []);
    /* fit the board to the space, pause off screen, respect reduced motion */
    useEffect(() => {
        const el = root.current;
        if (!el)
            return;
        const fit = () => {
            const w = el.clientWidth;
            const h = el.clientHeight;
            const phone = (sim.current.small = w < 700);
            board.current?.style.setProperty("--vsp-k", String(Math.round(Math.min(w / (phone ? 390 : 1440), h / (phone ? 844 : 900)) * 10000) / 10000));
        };
        fit();
        const ro = new ResizeObserver(fit);
        ro.observe(el);
        const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting));
        io.observe(el);
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const sync = () => setCalm(mq.matches);
        sync();
        mq.addEventListener("change", sync);
        return () => {
            ro.disconnect();
            io.disconnect();
            mq.removeEventListener("change", sync);
        };
    }, []);
    /* ---------------------------------------------------------- one loop: the depth, the wave, the bubbles */
    const floats = useRef({});
    const shades = useRef({});
    const stage = useRef(null);
    const person = useRef(null);
    const pathA = useRef(null);
    const pathB = useRef(null);
    const marker = useRef(null);
    const bubbles = useRef([]);
    useEffect(() => {
        const s = sim.current;
        const far = Math.max(0, Math.min(2.5, depth));
        const draw = (t, still) => {
            const amp = far * (s.small ? 0.34 : 1); // on a phone the tiles stand close together: they part less
            for (const sp of SPOTS) {
                const el = floats.current[sp.id];
                if (!el)
                    continue;
                const bx = still ? 0 : Math.sin(t * (0.34 + sp.ph * 0.03) + sp.ph) * 5 * sp.d;
                const by = still ? 0 : Math.cos(t * (0.42 + sp.ph * 0.025) + sp.ph * 1.7) * 7 * sp.d;
                const x = s.mx * sp.d * 30 * amp + bx;
                const y = s.my * sp.d * 22 * amp + by;
                el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
                const sh = shades.current[sp.id];
                if (sh)
                    sh.style.transform = `translate3d(${(-s.mx * sp.d * 16 * amp - bx * 0.6).toFixed(2)}px, ${(10 + sp.d * 20 - s.my * sp.d * 12 * amp - by * 0.8).toFixed(2)}px, 0)`;
            }
            if (stage.current)
                stage.current.style.transform = `translate3d(${(s.mx * 3 * amp).toFixed(2)}px, ${(s.my * 2 * amp).toFixed(2)}px, 0)`;
            if (person.current)
                person.current.style.transform = `translate3d(${(s.mx * 9 * amp).toFixed(2)}px, ${(s.my * 5 * amp).toFixed(2)}px, 0)`;
            pathA.current?.setAttribute("d", tracePath(waveA, s.phase));
            pathB.current?.setAttribute("d", tracePath(waveB, s.phase));
            marker.current?.setAttribute("transform", `translate(${WW * MARK} ${(WMID + waveA(WW * MARK, s.phase) - 3).toFixed(2)})`);
            HOMES.forEach(([hx, hy, r, ph], i) => {
                const el = bubbles.current[i];
                if (!el)
                    return;
                const a = Math.atan2(hy - 122, hx - 96) + Math.sin(ph * 7) * 0.5;
                const out = s.kick * (26 + 20 * Math.abs(Math.sin(ph * 3)));
                const x = hx + (still ? 0 : Math.sin(t * 0.7 + ph) * 4.5) + Math.cos(a) * out;
                const y = hy + (still ? 0 : Math.cos(t * 0.55 + ph * 1.7) * 4.5) + Math.sin(a) * out;
                el.style.transform = `translate3d(${(x - r).toFixed(2)}px, ${(y - r).toFixed(2)}px, 0) scale(${(1 + (still ? 0 : 0.14 * Math.sin(t * 1.3 + ph))).toFixed(3)})`;
            });
        };
        if (!live || calm) {
            s.mx = s.my = s.kick = 0;
            draw(0, true);
            return;
        }
        let raf = 0;
        let last = performance.now();
        const step = (now) => {
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            const t = now / 1000;
            /* the pointer steers while it is moving; otherwise a slow path of its own */
            const mine = now - ptr.current.at < 2600;
            const tx = mine ? ptr.current.x : Math.sin(t * 0.52) * 0.9 + Math.sin(t * 0.23 + 1) * 0.22;
            const ty = mine ? ptr.current.y : Math.cos(t * 0.41) * 0.75;
            const ease = 1 - Math.exp(-dt * (mine ? 6 : 2.4));
            s.mx += (tx - s.mx) * ease;
            s.my += (ty - s.my) * ease;
            s.boost *= Math.exp(-dt * 1.7);
            s.kick *= Math.exp(-dt * 2.6);
            s.phase += dt * (1.05 + s.boost * 8);
            draw(t, false);
            raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [live, calm, depth]);
    /* ---------------------------------------------------------- reading a tile */
    const read = useCallback((k, quiet = false) => {
        setN((m) => ({ ...m, [k]: (m[k] ?? 0) + 1 }));
        if (k === "calm")
            sim.current.boost = 1;
        if (k === "move")
            sim.current.kick = 1;
        if (k === "plate") {
            setIcon((i) => (i + 1 + 4) % 4);
            later("icon", 1500, () => setIcon(-1)); // DEMO: the travelling light takes over again
        }
        if (quiet)
            return;
        blip([{ f: 190, to: 130, d: 0.03, g: 0.05, type: "triangle" }, { f: 620, to: 940, d: 0.05, g: 0.022, at: 0.03 }]);
    }, [blip, later]);
    const press = (k) => {
        setDip(k);
        later("dip", 160, () => setDip(null));
        read(k);
    };
    /* ---------------------------------------------------------- alive when nobody is there */
    useEffect(() => {
        if (!live || calm)
            return;
        let i = 0;
        const play = () => {
            if (performance.now() - touched.current < 6000)
                return;
            const k = TOUR[i++ % TOUR.length];
            setAuto(k);
            later("auto-read", 620, () => read(k, true));
            later("auto-back", 1750, () => setAuto(null));
        };
        const first = setTimeout(play, 1200);
        const id = setInterval(play, 2500);
        return () => {
            clearTimeout(first);
            clearInterval(id);
            setAuto(null);
        };
    }, [live, calm, read, later]);
    const at = (k, len) => (n[k] ?? 0) % len;
    const fwd = (k) => (over ? over === k : auto === k);
    const hue = HUE[light.toLowerCase()] ?? 0;
    /* one floating thing: the place, the shadow, the button (a plain function: the tiles must never remount) */
    const float = (id, label, children, className = "") => {
        const sp = SPOTS.find((x) => x.id === id);
        return (<div key={id} ref={(el) => {
                floats.current[id] = el;
            }} className={`vsp-f vsp-f-${id} ${className}`} data-fwd={fwd(id)} data-phone={!!sp.p} style={{ "--dx": sp.x, "--dy": sp.y, "--ds": sp.s, "--px": sp.p?.[0] ?? 0, "--py": sp.p?.[1] ?? 0, "--ps": sp.p?.[2] ?? 1, "--z": sp.z, "--dd": sp.d }}>
        {sp.d > 0.3 ? (<span className="vsp-sh" ref={(el) => {
                    shades.current[id] = el;
                }} aria-hidden/>) : null}
        <button type="button" className="vsp-tile" data-dip={dip === id} aria-label={label} onClick={() => press(id)} onPointerEnter={(e) => e.pointerType === "mouse" && setOver(id)} onPointerLeave={() => setOver((o) => (o === id ? null : o))}>
          <span className={`vsp-in vsp-${id}`}>{children}</span>
        </button>
      </div>);
    };
    const air = AIR[at("air", 3)];
    const lit = LIGHT[at("light", 3)];
    const foc = FOCUS[at("focus", 3)];
    const meet = MEET[at("meet", 3)];
    const clm = CALM[at("calm", 3)];
    const slp = SLEEP[at("sleep", 3)];
    const mood = MOOD[at("mood", 3)];
    const dial = DIAL[at("dial", 3)];
    const mix = MIX[at("mix", 3)];
    const day = DAY[at("day", 3)];
    return (<div ref={root} className="vsp-root" data-live={live} style={{ "--vsp-light": light, "--vsp-hue": `${hue}deg` }} onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            ptr.current = { x: Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1)), y: Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1)), at: performance.now() };
        }} onPointerLeave={() => {
            ptr.current.at = -1e9;
            setOver(null);
        }} onPointerDownCapture={() => (touched.current = performance.now())} onKeyDownCapture={() => (touched.current = performance.now())}>
      <style>{css}</style>
      <div ref={board} className="vsp-board">
        <nav className="vsp-nav" aria-label="Vesper">
          <a className="vsp-brand" href="#top" onClick={(e) => e.preventDefault()}>
            {brand} <span>beta</span>
          </a>
          <span className="vsp-links">
            <a href="#tiles" onClick={(e) => e.preventDefault()}>
              Tiles
            </a>
            <a href="#sources" onClick={(e) => e.preventDefault()}>
              Sources
            </a>
            <a href="#privacy" onClick={(e) => e.preventDefault()}>
              Privacy
            </a>
            <a className="vsp-in-link" href="#signin" onClick={(e) => e.preventDefault()}>
              Sign in
            </a>
          </span>
        </nav>

        {/* ---- the stage: the person, the line, the button ---- */}
        <div ref={stage} className="vsp-stage">
          <span className="vsp-glow" aria-hidden/>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={person} className="vsp-person" src={figure} alt="" draggable={false}/>
          <span className="vsp-veil" aria-hidden/>
          <span className="vsp-tabs" aria-hidden>
            <b>Today</b>
            <span>Week</span>
            <span>Sources</span>
            <span>Notes</span>
          </span>
          <div className="vsp-copy">
            <p className="vsp-kick">
              <i aria-hidden/>
              Reading 13 signals
            </p>
            <h1>
              {line.split("\n").map((l, i) => (<span key={i}>{l}</span>))}
            </h1>
            <p className="vsp-sub">Light, sleep, focus and meetings, as live tiles on your desk.</p>
            <button type="button" className="vsp-cta" onClick={onCta}>
              {cta}
              <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden>
                <path d="M3 8h9.5M8.5 3.8 12.7 8l-4.2 4.2"/>
              </svg>
            </button>
          </div>
        </div>

        {/* ---- on the stage: four tiles in Tonic's drawing ---- */}
        {float("calm", `Steadiness of the heart, ${clm[0]}. Read it again`, <>
          <Ground n={3}/>
          <Label a="Steadiness" b="Heart, at rest"/>
          <span className="vsp-read">
            <Dots text={clm[0]}/>
          </span>
          <span className="vsp-wave" aria-hidden>
            <svg className="vsp-wave-fade" viewBox={`0 0 ${WW} 56`} width={WW} height="56">
              <path className="vsp-wave-line" d={`M0 ${WMID}H${WW}`}/>
              <path className="vsp-wave-b" ref={pathB} d={tracePath(waveB, 0.9)}/>
              <path className="vsp-wave-a" ref={pathA} d={tracePath(waveA, 0.9)}/>
            </svg>
            <svg viewBox={`0 0 ${WW} 56`} width={WW} height="56">
              <g ref={marker} transform={`translate(${WW * MARK} ${(WMID + waveA(WW * MARK, 0.9) - 3).toFixed(2)})`}>
                <path className="vsp-wave-mark" d="M-4.5 -7.5h9L0 0Z"/>
              </g>
            </svg>
          </span>
          <span className="vsp-word">{clm[1]}</span>
        </>)}

        {float("sleep", `Sleep last night, ${slp[0]} percent. Read it again`, <>
          <Ground n={3}/>
          <Label a="Sleep" b="Last night"/>
          <svg className="vsp-ring" viewBox="0 0 182 218" width="182" height="218" aria-hidden>
            <circle className="vsp-ring-track" cx="91" cy="116" r="44"/>
            <circle className="vsp-ring-arc" cx="91" cy="116" r="44" transform="rotate(-90 91 116)" strokeDasharray={RING_C} strokeDashoffset={r2(RING_C * (1 - slp[0] / 100))}/>
            <path className="vsp-ring-leaf" d="M44 92C74 44 136 42 164 88C132 64 80 62 44 92Z"/>
          </svg>
          <span className="vsp-read vsp-read-ring">
            <Dots text={String(slp[0])} pitch={3.3}/>
            <sup>%</sup>
          </span>
          <span className="vsp-word">{slp[1]}</span>
        </>)}

        {float("mood", `Mood, ${mood[0]}. Read it again`, <>
          <Ground n={2}/>
          <Label a="Mood" b="Lift since noon"/>
          <span className="vsp-read">
            <Dots text={mood[0]}/>
          </span>
          <span className="vsp-bars" aria-hidden>
            {BARS.map((b, i) => (<i key={i} data-warm={b.warm} style={{ height: b.h, animationDuration: `${b.d}s`, animationDelay: `${b.delay}s` }}/>))}
          </span>
          <span className="vsp-word">{mood[1]}</span>
        </>)}

        {float("move", "Movement by the hour. Shake it", <>
          <Ground n={2}/>
          <Label a="Movement" b="By the hour"/>
          <span className="vsp-cross" aria-hidden/>
          <span className="vsp-plot" aria-hidden>
            {HOMES.map(([x, y, r], i) => (<i key={i} ref={(el) => {
                    bubbles.current[i] = el;
                }} style={{ width: r * 2, height: r * 2, transform: `translate3d(${x - r}px, ${y - r}px, 0)`, opacity: r < 3 ? 0.55 : 1 }}/>))}
          </span>
          <span className="vsp-word vsp-ends">
            <span>Early</span>
            <span>Late</span>
          </span>
        </>)}

        {/* ---- around the stage ---- */}
        {float("day", `The whole day, ${day[0]}. Read it again`, <>
          <Ground n={2}/>
          <Label a="Whole day" b="All tiles"/>
          <span className="vsp-read vsp-read-day">
            <Dots text={day[0]} pitch={3.5}/>
          </span>
          <span className="vsp-lens" aria-hidden>
            {LENS.map((w, i) => (<i key={i} style={{ width: w }}/>))}
          </span>
          <svg className="vsp-lens-mark" viewBox="0 0 9 12" width="9" height="12" aria-hidden>
            <path d="M8.4 .8 .6 6l7.8 5.2Z"/>
          </svg>
          <span className="vsp-word">{day[1]}</span>
        </>, "vsp-wide")}

        {float("light", `Room light, ${lit[0]}, ${lit[1]}. Read it again`, <>
          <Ground n={2}/>
          <Label a="Room light" b="Colour"/>
          <span className="vsp-ride" aria-hidden style={{ "--vsp-sun": lit[2] }}>
            <svg className="vsp-sun" viewBox="0 0 60 60" width="60" height="60">
              <path d={SUN_RAYS}/>
              <circle cx="30" cy="30" r="19"/>
            </svg>
            <i className="vsp-stem"/>
            <svg className="vsp-tri" viewBox="0 0 12 9" width="12" height="9">
              <path d="M6 .6 11.2 8.4H.8Z"/>
            </svg>
          </span>
          <span className="vsp-rule vsp-rule-cool" aria-hidden/>
          <span className="vsp-word">
            {lit[0]} <em>{lit[1]}</em>
          </span>
        </>)}

        {float("meet", `Next meeting, ${meet[1]} at ${meet[0]}. Show the one after`, <>
          <Ground n={2}/>
          <Label a="Meetings" b={`Next: ${meet[1]}`}/>
          <span className="vsp-dotring" aria-hidden/>
          <span className="vsp-read vsp-read-meet">
            <Dots text={meet[0]} pitch={3.5}/>
          </span>
          <span className="vsp-tall" aria-hidden>
            <i />
            <i />
            <i />
            <i />
          </span>
        </>)}

        {float("air", `Outside, ${air[0]}, ${air[1]}. Read it again`, <>
          <Ground n={2}/>
          <Label a="Outside" b="Right now"/>
          <span className="vsp-read">
            <Dots text={air[0]}/>
          </span>
          <span className="vsp-rule" aria-hidden>
            <i className="vsp-needle"/>
          </span>
          <span className="vsp-word">{air[1]}</span>
        </>)}

        {float("focus", `Focus score, ${foc[0]}, ${foc[1]}. Read it again`, <>
          <Ground n={2}/>
          <Label a="Focus" b="Score today"/>
          <span className="vsp-pips" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <span className="vsp-read">
            <Dots text={foc[0]}/>
          </span>
          <span className="vsp-rule" aria-hidden>
            <i className="vsp-needle"/>
          </span>
          <span className="vsp-word">{foc[1]}</span>
        </>)}

        {float("dial", `Daylight variability, ${dial[0]}, ${dial[1]}. Read it again`, <>
          <Ground n={2}/>
          <Label a="Daylight" b="Variability"/>
          <svg className="vsp-dial" viewBox="0 0 182 218" width="182" height="218" aria-hidden>
            <path className="vsp-dial-ring" d={DIAL_RING}/>
            <g className="vsp-dial-turn" style={{ "--vsp-a": `${dial[2]}deg` }}>
              <path className="vsp-dial-wedge" d={DIAL_WEDGE}/>
            </g>
          </svg>
          <span className="vsp-read vsp-read-dial">
            <Dots text={dial[0]} pitch={3.3}/>
          </span>
          <span className="vsp-word">{dial[1]}</span>
        </>)}

        {float("mix", `Sun against screen, ${mix[0]} percent daylight. Read it again`, <>
          <Ground n={3}/>
          <Label a="Sun vs screen" b="Share of your light"/>
          <span className="vsp-num">
            {mix[0]}
            <sup>%</sup>
          </span>
          <span className="vsp-track" aria-hidden style={{ "--vsp-v": mix[0] / 100 }}>
            <span className="vsp-fill"/>
            <svg className="vsp-thumb" viewBox="0 0 12 9" width="12" height="9">
              <path d="M6 8.4 11.2 .6H.8Z"/>
            </svg>
          </span>
          <span className="vsp-sides" aria-hidden>
            <span>Screen</span>
            <span>Sun</span>
          </span>
          <span className="vsp-word">{mix[1]}</span>
        </>)}

        {float("plate", `Sources: ${ICONS.join(", ")}. Light the next one`, <>
          <span className="vsp-pools" data-lit={icon} aria-hidden>
            {ICON_GLOW.map((g, i) => (<i key={i} data-on={icon === i} style={{ "--vsp-g": g }}/>))}
          </span>
          <span className="vsp-icons" data-lit={icon} aria-hidden>
            <i className="vsp-ic vsp-ic-clock" data-on={icon === 0}>
              <svg viewBox="0 0 64 64" width="64" height="64">
                <circle cx="32" cy="32" r="15"/>
                <path d="M32 23v9.5l6 4"/>
              </svg>
            </i>
            <i className="vsp-ic vsp-ic-signal" data-on={icon === 1}>
              <svg viewBox="0 0 64 64" width="64" height="64">
                <path d="M22 40a14 14 0 0 1 0-16M27.5 36a7.5 7.5 0 0 1 0-8M42 24a14 14 0 0 1 0 16M36.5 28a7.5 7.5 0 0 1 0 8"/>
                <circle className="vsp-ic-dot" cx="32" cy="32" r="2.6"/>
              </svg>
            </i>
            <i className="vsp-ic vsp-ic-spark" data-on={icon === 2}>
              <svg viewBox="0 0 64 64" width="64" height="64">
                <path d="M32 16v32M18.2 24l27.6 16M18.2 40l27.6-16"/>
              </svg>
            </i>
            <i className="vsp-ic vsp-ic-orbit" data-on={icon === 3}>
              <svg viewBox="0 0 64 64" width="64" height="64">
                <circle className="vsp-ic-dot" cx="32" cy="32" r="6"/>
              </svg>
            </i>
          </span>
        </>, "vsp-sq")}

        {float("app", "Vesper, the app. Wake it", <>
          <span className="vsp-app-bg" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <span className="vsp-app-disc" key={n.app ?? 0} data-spin={(n.app ?? 0) > 0} aria-hidden>
            <svg viewBox="0 0 64 64" width="64" height="64">
              <path d="M39 15.5A17.5 17.5 0 1 0 48.5 40 14 14 0 0 1 39 15.5Z"/>
              <circle cx="45" cy="22" r="3.2"/>
            </svg>
          </span>
        </>, "vsp-sq vsp-sq-app")}

        <p className="vsp-foot vsp-foot-l">Main board</p>
        <p className="vsp-foot vsp-foot-r">
          {brand} <span>thirteen live tiles</span>
        </p>
      </div>
    </div>);
}
function Label({ a, b }) {
    return (<span className="vsp-label">
      <b>{a}</b>
      <span>{b}</span>
    </span>);
}
/* A tile's colour: the flat ground is on the wrapper, the lobes are the <i>s, the grain lies on top. */
function Ground({ n }) {
    return (<span className="vsp-bg" aria-hidden>
      {Array.from({ length: n }, (_, i) => (<i key={i}/>))}
      <span className="vsp-grain"/>
    </span>);
}
const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600;700&display=swap');

.vsp-root {
  --vsp-light: #ff2a1f; --vsp-hue: 0deg;
  --vsp-spring: cubic-bezier(.3,1.4,.5,1); --vsp-out: cubic-bezier(.2,.8,.2,1);
  container-type: inline-size; width: 100%; height: var(--design-h, 100svh); min-height: 640px; position: relative; overflow: hidden; isolation: isolate;
  background: #e2e2e0; color: #0b0b0c;
  font-family: "Inter Tight", -apple-system, "SF Pro Text", system-ui, sans-serif; font-weight: 500;
  -webkit-font-smoothing: antialiased; user-select: none; -webkit-user-select: none;
}
.vsp-root::before { content: ""; position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(120% 90% at 50% 46%, #ececea 0%, #e2e2e0 46%, #d3d3d1 100%); }
:where(.vsp-root) button { font: inherit; color: inherit; background: none; border: 0; padding: 0; margin: 0; cursor: pointer; -webkit-tap-highlight-color: transparent; text-align: left; }
:where(.vsp-root) a { color: inherit; text-decoration: none; }
:where(.vsp-root) h1, :where(.vsp-root) p { margin: 0; }
.vsp-root[data-live="false"] * { animation-play-state: paused !important; }

/* the board: drawn at 1440×900 and scaled to the space (the script sets --vsp-k; before it runs, the width alone decides) */
.vsp-board { --vsp-k: 1; position: absolute; left: 50%; top: 50%; width: 1440px; height: 900px; margin: -450px 0 0 -720px; transform: scale(var(--vsp-k)); transform-origin: 50% 50%; }
@supports (scale: tan(atan2(1px, 1px))) { .vsp-board { --vsp-k: tan(atan2(100cqi, 1440px)); } }

.vsp-nav { position: absolute; left: 44px; right: 44px; top: 34px; display: flex; align-items: center; justify-content: space-between; font-size: 15px; z-index: 1; }
.vsp-brand { font-size: 21px; font-weight: 600; letter-spacing: -.02em; }
.vsp-brand span { color: #9a9a98; font-weight: 500; }
.vsp-links { display: flex; align-items: center; gap: 26px; color: #8a8a88; letter-spacing: -.005em; }
.vsp-links a { transition: color 200ms; }
.vsp-links a:hover { color: #0b0b0c; }
.vsp-links .vsp-in-link { color: #0b0b0c; font-weight: 600; }
.vsp-root a:focus-visible, .vsp-cta:focus-visible { outline: 2px solid #0b0b0c; outline-offset: 4px; border-radius: 6px; }
.vsp-foot { position: absolute; bottom: 30px; font-size: 15px; color: #9a9a98; letter-spacing: -.005em; z-index: 1; }
.vsp-foot-l { left: 44px; }
.vsp-foot-r { right: 44px; color: #0b0b0c; font-weight: 600; }
.vsp-foot-r span { color: #9a9a98; font-weight: 500; }

/* ---- the stage ---- */
.vsp-stage { position: absolute; left: 232px; top: 138px; width: 976px; height: 624px; border-radius: 30px; background: #030303; overflow: hidden; isolation: isolate; z-index: 1; color: #fff;
  box-shadow: 0 50px 90px -50px rgba(0,0,0,.55), 0 14px 30px -18px rgba(0,0,0,.35); will-change: transform; }
.vsp-glow { position: absolute; left: 8%; top: 2%; width: 74%; height: 120%; border-radius: 50%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--vsp-light) 46%, transparent) 0%, color-mix(in srgb, var(--vsp-light) 16%, transparent) 46%, transparent 78%);
  animation: vsp-breathe 5.2s ease-in-out infinite alternate; }
@keyframes vsp-breathe { from { opacity: .42; transform: scale(.94); } to { opacity: .9; transform: scale(1.05); } }
.vsp-person { position: absolute; left: 156px; top: 4px; height: 104%; width: auto; max-width: none; filter: hue-rotate(var(--vsp-hue)); pointer-events: none; -webkit-user-drag: none;
  -webkit-mask: linear-gradient(90deg, #000 62%, transparent 92%); mask: linear-gradient(90deg, #000 62%, transparent 92%); will-change: transform;
  animation: vsp-lit 5.2s ease-in-out infinite alternate; }
@keyframes vsp-lit { from { opacity: .82; } to { opacity: 1; } }
.vsp-veil { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(180deg, transparent 56%, rgba(3,3,3,.82) 98%), linear-gradient(90deg, rgba(3,3,3,.5) 0%, transparent 34%, transparent 52%, rgba(3,3,3,.62) 70%); }
.vsp-tabs { position: absolute; left: 304px; top: 28px; display: flex; gap: 22px; font-size: 13.5px; font-weight: 600; letter-spacing: -.005em; color: rgba(255,255,255,.5); }
.vsp-tabs b { color: #fff; font-weight: 600; }
.vsp-copy { position: absolute; left: 44px; bottom: 44px; width: 420px; }
.vsp-kick { display: flex; align-items: center; gap: 9px; font-size: 13.5px; font-weight: 500; color: rgba(255,255,255,.62); letter-spacing: -.003em; margin-bottom: 16px; }
.vsp-kick i { width: 7px; height: 7px; border-radius: 50%; background: var(--vsp-light); box-shadow: 0 0 0 4px color-mix(in srgb, var(--vsp-light) 24%, transparent); animation: vsp-sync 2.6s ease-in-out infinite; }
@keyframes vsp-sync { 50% { box-shadow: 0 0 0 8px transparent; } }
.vsp-copy h1 { font-size: 60px; font-weight: 700; line-height: .96; letter-spacing: -.038em; }
.vsp-copy h1 span { display: block; white-space: nowrap; }
.vsp-sub { margin-top: 16px; width: 300px; font-size: 16px; line-height: 1.32; font-weight: 500; color: rgba(255,255,255,.62); letter-spacing: -.008em; }
.vsp-cta { margin-top: 24px; display: inline-flex; align-items: center; gap: 9px; height: 48px; padding: 0 22px 0 24px; border-radius: 24px; background: #fff; color: #0b0b0c; font-size: 15.5px; font-weight: 600; letter-spacing: -.01em;
  transition: scale 380ms var(--vsp-spring), background-color 200ms; }
.vsp-cta svg { fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; transition: translate 300ms var(--vsp-out); }
.vsp-cta:hover svg { translate: 3px 0; }
.vsp-cta:active { scale: .96; transition-duration: 90ms; }
.vsp-cta:focus-visible { outline-color: #fff; border-radius: 24px; }

/* ---- a floating thing: placed on the board, moved by the script, with its shadow under it ---- */
.vsp-f { --x: var(--dx); --y: var(--dy); --s: var(--ds); --w: 182px; --h: 218px;
  position: absolute; left: calc(var(--x) * 1px); top: calc(var(--y) * 1px); width: calc(var(--w) * var(--s)); height: calc(var(--h) * var(--s)); z-index: var(--z); will-change: transform; }
.vsp-f[data-fwd="true"], .vsp-f:focus-within { z-index: 9; }
.vsp-wide { --w: 300px; --h: 118px; }
.vsp-sq { --w: 176px; --h: 176px; }
.vsp-sq-app { --w: 150px; --h: 150px; }
.vsp-sh { position: absolute; inset: 6% 5% 2%; border-radius: calc(26px * var(--s)); background: rgba(20,20,24,.5); filter: blur(calc(14px + var(--dd) * 12px)); opacity: calc(.34 + var(--dd) * .2); pointer-events: none;
  transition: scale 520ms var(--vsp-spring), opacity 320ms ease; }
.vsp-f[data-fwd="true"] .vsp-sh { scale: 1.16; opacity: calc(.24 + var(--dd) * .14); }
.vsp-tile { position: absolute; inset: 0; display: block; border-radius: calc(22px * var(--s)); color: #fff; touch-action: manipulation; transition: scale 520ms var(--vsp-spring); }
.vsp-f[data-fwd="true"] .vsp-tile, .vsp-tile:focus-visible { scale: 1.1; }
.vsp-tile:active, .vsp-tile[data-dip="true"] { scale: .965 !important; transition-duration: 100ms; }
.vsp-tile:focus-visible { outline: 2px solid #0b0b0c; outline-offset: 4px; }
.vsp-in { position: absolute; left: 0; top: 0; width: var(--w); height: var(--h); display: block; border-radius: 22px; overflow: hidden; isolation: isolate; transform: scale(var(--s)); transform-origin: 0 0; }
.vsp-in::after { content: ""; position: absolute; inset: 0; border-radius: inherit; box-shadow: inset 0 0 0 1px rgba(255,255,255,.1), inset 0 1px 0 rgba(255,255,255,.18); pointer-events: none; z-index: 3; }

/* the living colour: a flat ground and soft lobes that drift, each on its own clock (Tonic's recipe) */
.vsp-bg { position: absolute; inset: 0; z-index: -1; }
.vsp-bg i { position: absolute; border-radius: 50%; will-change: transform; animation: vsp-drift-a 9s ease-in-out infinite alternate; }
.vsp-bg i:nth-child(2) { animation-name: vsp-drift-b; animation-duration: 11s; }
.vsp-bg i:nth-child(3) { animation-name: vsp-drift-c; animation-duration: 13s; }
@keyframes vsp-drift-a { from { transform: translate3d(-10px, 6px, 0) scale(1); } to { transform: translate3d(14px, -10px, 0) scale(1.12); } }
@keyframes vsp-drift-b { from { transform: translate3d(8px, -8px, 0) scale(1.08); } to { transform: translate3d(-12px, 12px, 0) scale(.94); } }
@keyframes vsp-drift-c { from { transform: translate3d(0, 10px, 0) scale(.96); } to { transform: translate3d(6px, -14px, 0) scale(1.1); } }
@keyframes vsp-beat { from { transform: scale(.9); } to { transform: scale(1.14) translate3d(0, 4px, 0); } }
.vsp-grain { position: absolute; inset: 0; opacity: .34; mix-blend-mode: overlay; pointer-events: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 1.1 -.1'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>"); }

/* lilac: a pale column in violet */
.vsp-calm .vsp-bg { background: linear-gradient(180deg, #7767cf 0%, #9a7fd2 52%, #c49ccc 100%); }
.vsp-calm .vsp-bg i:nth-child(1) { left: 30px; top: -90px; width: 220px; height: 200px; background: radial-gradient(closest-side, #d5b6f2 0 16%, rgba(206,170,238,.6) 52%, transparent 100%); }
.vsp-calm .vsp-bg i:nth-child(2) { left: 40px; top: 110px; width: 200px; height: 170px; background: radial-gradient(closest-side, rgba(244,206,214,.8) 0 14%, transparent 100%); }
.vsp-calm .vsp-bg i:nth-child(3) { left: -80px; top: 60px; width: 200px; height: 200px; background: radial-gradient(closest-side, rgba(98,84,190,.7) 0 26%, transparent 100%); }
/* teal to cyan */
.vsp-sleep .vsp-bg { background: linear-gradient(200deg, #18a7a0 0%, #0c6f78 100%); }
.vsp-sleep .vsp-bg i:nth-child(1) { left: 40px; top: -70px; width: 230px; height: 230px; background: radial-gradient(closest-side, #7df3e6 0 18%, rgba(70,214,214,.6) 55%, transparent 100%); }
.vsp-sleep .vsp-bg i:nth-child(2) { left: -90px; top: 90px; width: 240px; height: 240px; background: radial-gradient(closest-side, #06454f 0 30%, rgba(6,69,79,.6) 62%, transparent 100%); }
.vsp-sleep .vsp-bg i:nth-child(3) { left: 60px; top: 110px; width: 190px; height: 170px; background: radial-gradient(closest-side, rgba(40,190,230,.7) 0 20%, transparent 100%); }
/* magenta to plum: hot edges, a dark heart */
.vsp-mood .vsp-bg { background: linear-gradient(180deg, #e0186c 0%, #f02a82 55%, #c81466 100%); }
.vsp-mood .vsp-bg i:nth-child(1) { left: -9px; top: 24px; width: 200px; height: 210px; background: radial-gradient(closest-side, #2a0620 0 34%, rgba(64,10,48,.72) 62%, transparent 100%); animation-name: vsp-beat; animation-duration: 4.6s; }
.vsp-mood .vsp-bg i:nth-child(2) { left: -60px; top: -120px; width: 300px; height: 200px; background: radial-gradient(closest-side, rgba(255,92,150,.8) 0 30%, transparent 100%); }
/* deep navy with a glow at its heart */
.vsp-move .vsp-bg { background: linear-gradient(180deg, #0a1a3c 0%, #050d20 100%); }
.vsp-move .vsp-bg i:nth-child(1) { left: -4px; top: 20px; width: 200px; height: 200px; background: radial-gradient(closest-side, rgba(28,96,214,.72) 0 18%, rgba(18,58,150,.4) 56%, transparent 100%); animation-name: vsp-beat; animation-duration: 6s; }
.vsp-move .vsp-bg i:nth-child(2) { left: 70px; top: 120px; width: 170px; height: 150px; background: radial-gradient(closest-side, rgba(20,150,170,.3) 0 20%, transparent 100%); }
/* crimson with a dark heart and a hot floor */
.vsp-air .vsp-bg { background: linear-gradient(180deg, #d81f3f 0%, #b01232 50%, #e63a2c 100%); }
.vsp-air .vsp-bg i:nth-child(1) { left: -14px; top: 14px; width: 210px; height: 190px; background: radial-gradient(closest-side, #1d0410 0 36%, rgba(54,6,26,.74) 62%, transparent 100%); animation-name: vsp-beat; animation-duration: 5.4s; }
.vsp-air .vsp-bg i:nth-child(2) { left: -40px; top: 150px; width: 260px; height: 130px; background: radial-gradient(closest-side, rgba(255,120,70,.85) 0 24%, transparent 100%); }
/* bottle green, lighter at the top */
.vsp-light .vsp-bg { background: linear-gradient(180deg, #33705a 0%, #15402f 60%, #0b241b 100%); }
.vsp-light .vsp-bg i:nth-child(1) { left: -20px; top: -10px; width: 220px; height: 200px; background: radial-gradient(closest-side, rgba(10,30,22,.9) 0 30%, rgba(10,30,22,.5) 62%, transparent 100%); animation-name: vsp-beat; animation-duration: 6.4s; }
.vsp-light .vsp-bg i:nth-child(2) { left: 30px; top: -80px; width: 200px; height: 150px; background: radial-gradient(closest-side, rgba(110,190,150,.5) 0 20%, transparent 100%); }
/* dusk: grey above, a warm band, dark below */
.vsp-focus .vsp-bg { background: linear-gradient(180deg, #343a44 0%, #6a4a3e 40%, #b5633c 62%, #33201a 100%); }
.vsp-focus .vsp-bg i:nth-child(1) { left: -30px; top: 60px; width: 240px; height: 130px; background: radial-gradient(closest-side, rgba(236,140,88,.8) 0 20%, transparent 100%); }
.vsp-focus .vsp-bg i:nth-child(2) { left: -50px; top: 150px; width: 280px; height: 140px; background: radial-gradient(closest-side, rgba(22,14,12,.9) 0 40%, transparent 100%); }
/* wine above, a fire on the floor */
.vsp-meet .vsp-bg { background: linear-gradient(180deg, #2a0716 0%, #6a0c1e 46%, #d4301a 84%, #ff7a1f 100%); }
.vsp-meet .vsp-bg i:nth-child(1) { left: -40px; top: -70px; width: 260px; height: 200px; background: radial-gradient(closest-side, rgba(18,4,12,.9) 0 40%, transparent 100%); }
.vsp-meet .vsp-bg i:nth-child(2) { left: -20px; top: 150px; width: 220px; height: 120px; background: radial-gradient(closest-side, rgba(255,150,50,.7) 0 20%, transparent 100%); }
/* slate into ember, a dark heart behind the dial */
.vsp-dial .vsp-bg { background: linear-gradient(165deg, #5b7a96 0%, #7a6a6c 44%, #b95e36 100%); }
.vsp-dial .vsp-bg i:nth-child(1) { left: -4px; top: 24px; width: 190px; height: 190px; background: radial-gradient(closest-side, rgba(30,24,26,.86) 0 36%, rgba(40,30,30,.5) 62%, transparent 100%); animation-name: vsp-beat; animation-duration: 5.8s; }
.vsp-dial .vsp-bg i:nth-child(2) { left: 60px; top: 120px; width: 190px; height: 160px; background: radial-gradient(closest-side, rgba(240,130,70,.6) 0 20%, transparent 100%); }
/* olive with a lime sun */
.vsp-mix .vsp-bg { background: linear-gradient(180deg, #4d5a0a 0%, #6e7f10 54%, #8a9412 100%); }
.vsp-mix .vsp-bg i:nth-child(1) { left: 0; top: -40px; width: 190px; height: 200px; background: radial-gradient(closest-side, #d2f23c 0 16%, rgba(190,226,50,.62) 50%, transparent 100%); }
.vsp-mix .vsp-bg i:nth-child(2) { left: -60px; top: 130px; width: 300px; height: 160px; background: radial-gradient(closest-side, rgba(46,52,6,.86) 0 36%, transparent 100%); }
.vsp-mix .vsp-bg i:nth-child(3) { left: -80px; top: -90px; width: 220px; height: 180px; background: radial-gradient(closest-side, rgba(40,46,6,.8) 0 34%, transparent 100%); }
/* sand to bronze, a wide tile */
.vsp-day .vsp-bg { background: linear-gradient(90deg, #8a6a4e 0%, #b98c60 48%, #7b5b47 100%); }
.vsp-day .vsp-bg i:nth-child(1) { left: 60px; top: -60px; width: 220px; height: 190px; background: radial-gradient(closest-side, rgba(226,180,120,.8) 0 18%, transparent 100%); }
.vsp-day .vsp-bg i:nth-child(2) { left: -70px; top: 10px; width: 200px; height: 170px; background: radial-gradient(closest-side, rgba(70,50,42,.8) 0 30%, transparent 100%); }

/* ---- what is written on a tile ---- */
.vsp-label { position: absolute; left: 13px; top: 12px; right: 12px; display: grid; font-size: 13.5px; line-height: 1.16; letter-spacing: -.008em; }
.vsp-label b { font-weight: 600; }
.vsp-label span { font-weight: 500; color: rgba(255,255,255,.56); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.vsp-word { position: absolute; left: 13px; bottom: 12px; font-size: 12.5px; font-weight: 500; color: rgba(255,255,255,.62); letter-spacing: -.003em; white-space: nowrap; }
.vsp-word em { font-style: normal; color: rgba(255,255,255,.4); margin-left: 4px; font-variant-numeric: tabular-nums; }
.vsp-ends { right: 13px; display: flex; justify-content: space-between; }
.vsp-read { position: absolute; left: 0; right: 0; top: 66px; display: flex; justify-content: center; align-items: flex-start; color: #fff; }
.vsp-read sup { font-size: 12px; font-weight: 500; color: rgba(255,255,255,.72); margin: -3px 0 0 3px; line-height: 1; }
.vsp-dots { display: block; overflow: visible; filter: drop-shadow(0 0 5px rgba(255,255,255,.3)) drop-shadow(0 1px 1.5px rgba(0,0,0,.3)); animation: vsp-relight 520ms steps(5, end) both; }
.vsp-dots path { fill: none; stroke: currentColor; stroke-linecap: round; }
@keyframes vsp-relight { 0% { opacity: 0; } 30% { opacity: .9; } 45% { opacity: .25; } 100% { opacity: 1; } }
.vsp-num { position: absolute; left: 0; right: 0; top: 58px; text-align: center; font-size: 46px; font-weight: 300; line-height: 1; letter-spacing: -.03em; font-variant-numeric: tabular-nums; }
.vsp-num sup { position: absolute; top: 4px; font-size: 13px; font-weight: 500; letter-spacing: 0; color: rgba(255,255,255,.7); margin-left: 3px; }

/* the ruler of ticks and its needle */
.vsp-rule { position: absolute; left: 14px; right: 14px; top: 124px; height: 26px;
  background: repeating-linear-gradient(90deg, rgba(255,255,255,.5) 0 1px, transparent 1px 4px) 0 50% / 100% 9px no-repeat, repeating-linear-gradient(90deg, rgba(255,255,255,.72) 0 1px, transparent 1px 20px) 0 50% / 100% 17px no-repeat;
  -webkit-mask: linear-gradient(90deg, transparent, #000 16%, #000 84%, transparent); mask: linear-gradient(90deg, transparent, #000 16%, #000 84%, transparent); }
.vsp-needle { position: absolute; left: 50%; top: -2px; width: 1.5px; height: 30px; margin-left: -1px; border-radius: 1px; background: #ffd94a; box-shadow: 0 0 8px rgba(255,217,74,.7); animation: vsp-wander 7s ease-in-out infinite alternate; }
.vsp-focus .vsp-needle { animation-duration: 9s; animation-delay: -3s; }
@keyframes vsp-wander { 0% { transform: translateX(-44px); } 38% { transform: translateX(12px); } 62% { transform: translateX(-10px); } 100% { transform: translateX(40px); } }
.vsp-pips { position: absolute; right: 13px; top: 17px; display: flex; gap: 4px; }
.vsp-pips i { width: 3.5px; height: 3.5px; border-radius: 50%; background: rgba(255,255,255,.5); }
.vsp-pips i:first-child { background: #fff; }

/* the sun that rides its ruler */
.vsp-rule-cool { top: 152px; height: 18px; background: repeating-linear-gradient(90deg, rgba(190,226,255,.9) 0 1.2px, transparent 1.2px 4px) 0 50% / 100% 100% no-repeat; }
.vsp-ride { position: absolute; left: 61px; top: 52px; width: 60px; height: 132px; animation: vsp-ride 9s ease-in-out infinite alternate; }
@keyframes vsp-ride { from { transform: translateX(-36px); } to { transform: translateX(34px); } }
.vsp-sun { display: block; overflow: visible; }
.vsp-sun circle { fill: var(--vsp-sun); transition: fill 700ms ease; filter: drop-shadow(0 0 12px color-mix(in srgb, var(--vsp-sun) 60%, transparent)); }
.vsp-sun path { fill: none; stroke: rgba(255,255,255,.7); stroke-width: 1.1; stroke-linecap: round; transform-origin: 30px 30px; animation: vsp-turn 24s linear infinite; }
@keyframes vsp-turn { to { transform: rotate(360deg); } }
.vsp-stem { position: absolute; left: 29.5px; top: 62px; width: 1px; height: 52px; background: color-mix(in srgb, var(--vsp-sun) 80%, #fff); transition: background-color 700ms ease; }
.vsp-tri { position: absolute; left: 24px; top: 118px; fill: var(--vsp-sun); transition: fill 700ms ease; }

/* the tall lines of the next meetings */
.vsp-dotring { position: absolute; right: 13px; top: 14px; width: 9px; height: 9px; border-radius: 50%; box-shadow: inset 0 0 0 2.5px rgba(255,255,255,.5); }
.vsp-read-meet { top: 70px; }
.vsp-tall { position: absolute; left: 0; right: 0; top: 126px; bottom: 0; overflow: hidden; -webkit-mask: linear-gradient(180deg, transparent, #000 34%); mask: linear-gradient(180deg, transparent, #000 34%); }
.vsp-tall::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 240px; background: repeating-linear-gradient(90deg, rgba(255,130,90,.62) 0 1px, transparent 1px 6px); animation: vsp-slide 6s linear infinite; }
@keyframes vsp-slide { to { transform: translateX(-48px); } }
.vsp-tall i { position: absolute; bottom: 0; width: 2px; border-radius: 1px; background: #ffd94a; box-shadow: 0 0 8px rgba(255,217,74,.6); transform-origin: 50% 100%; animation: vsp-grow 3.4s ease-in-out infinite alternate; }
.vsp-tall i:nth-child(1) { left: 36px; height: 62px; }
.vsp-tall i:nth-child(2) { left: 84px; height: 78px; animation-delay: -1.1s; background: #fff; box-shadow: none; opacity: .85; }
.vsp-tall i:nth-child(3) { left: 138px; height: 70px; animation-delay: -2.2s; background: #fff; box-shadow: none; opacity: .85; }
.vsp-tall i:nth-child(4) { left: 150px; height: 84px; animation-delay: -.6s; }
@keyframes vsp-grow { from { transform: scaleY(.72); } to { transform: scaleY(1); } }

/* the wave */
.vsp-wave { position: absolute; left: 12px; top: 122px; width: 158px; height: 56px; }
.vsp-wave svg { position: absolute; inset: 0; display: block; overflow: visible; }
.vsp-wave-fade { -webkit-mask: linear-gradient(90deg, transparent, #000 22%); mask: linear-gradient(90deg, transparent, #000 22%); }
.vsp-wave path { fill: none; stroke-linecap: round; stroke-linejoin: round; }
.vsp-wave-line { stroke: rgba(255,255,255,.7); stroke-width: 1; }
.vsp-wave-a { stroke: #fff6a8; stroke-width: 1.4; }
.vsp-wave-b { stroke: rgba(255,246,168,.6); stroke-width: 1; }
.vsp-wave .vsp-wave-mark { fill: #ffe04a; stroke: none; }

/* the ring */
.vsp-ring { position: absolute; inset: 0; }
.vsp-ring circle, .vsp-ring path { fill: none; }
.vsp-ring-track { stroke: rgba(255,255,255,.3); stroke-width: 1; }
.vsp-ring-arc { stroke: #fff; stroke-width: 2.25; stroke-linecap: round; transition: stroke-dashoffset 900ms var(--vsp-out); }
.vsp-ring-leaf { stroke: #e9f78a; stroke-width: 1; stroke-linejoin: round; transform-origin: 91px 116px; animation: vsp-sway 7s ease-in-out infinite alternate; }
@keyframes vsp-sway { from { transform: rotate(-7deg); } to { transform: rotate(9deg) scale(1.04); } }
.vsp-read-ring { top: 102px; }

/* the waveform */
.vsp-bars { position: absolute; left: 0; right: 0; top: 122px; height: 56px; display: flex; align-items: center; justify-content: center; gap: 3.5px; }
.vsp-bars i { width: 1.5px; border-radius: 1px; background: rgba(255,255,255,.5); animation: vsp-bar .7s ease-in-out infinite alternate; }
.vsp-bars i[data-warm="true"] { background: #ffc46b; }
@keyframes vsp-bar { from { transform: scaleY(.38); } to { transform: scaleY(1); } }

/* the scatter */
.vsp-cross { position: absolute; left: 16px; right: 16px; top: 62px; bottom: 44px;
  background: linear-gradient(rgba(255,255,255,.2), rgba(255,255,255,.2)) 50% 50% / 100% 1px no-repeat, linear-gradient(rgba(255,255,255,.2), rgba(255,255,255,.2)) 50% 50% / 1px 100% no-repeat; }
.vsp-plot { position: absolute; inset: 0; --vsp-dot: #3fa8ff; }
.vsp-plot i { position: absolute; left: 0; top: 0; border-radius: 50%; background: radial-gradient(circle at 36% 30%, color-mix(in srgb, var(--vsp-dot) 45%, #fff) 0 12%, var(--vsp-dot) 55%, color-mix(in srgb, var(--vsp-dot) 76%, #001a70) 100%); box-shadow: 0 0 10px color-mix(in srgb, var(--vsp-dot) 50%, transparent); will-change: transform; }

/* the dial */
.vsp-dial { position: absolute; inset: 0; }
.vsp-dial path { fill: none; stroke-linecap: round; }
.vsp-dial-ring { stroke: rgba(255,255,255,.4); stroke-width: 1; }
.vsp-dial-turn { transform-origin: 91px 120px; transform: rotate(var(--vsp-a)); transition: transform 900ms var(--vsp-spring); }
.vsp-dial-wedge { stroke: #ffd94a; stroke-width: 1.6; filter: drop-shadow(0 0 5px rgba(255,217,74,.7)); transform-origin: 91px 120px; animation: vsp-sweep 6s ease-in-out infinite alternate; }
@keyframes vsp-sweep { from { transform: rotate(-12deg); } to { transform: rotate(14deg); } }
.vsp-read-dial { top: 106px; }

/* the slider */
.vsp-track { position: absolute; left: 14px; right: 14px; top: 132px; height: 2px; border-radius: 1px; background: rgba(255,255,255,.26); }
.vsp-fill { position: absolute; left: 0; top: 0; bottom: 0; width: calc(var(--vsp-v) * 100%); border-radius: 1px; background: #f3ff7a; transition: width 700ms var(--vsp-out); }
.vsp-thumb { position: absolute; left: calc(var(--vsp-v) * 100%); top: -10px; margin-left: -6px; fill: #f3ff7a; filter: drop-shadow(0 2px 6px rgba(0,0,0,.35)); transition: left 700ms var(--vsp-out); }
.vsp-sides { position: absolute; left: 14px; right: 14px; top: 142px; display: flex; justify-content: space-between; font-size: 11.5px; font-weight: 500; color: rgba(255,255,255,.42); }
.vsp-sides span:last-child { color: rgba(255,255,255,.86); }

/* the wide tile */
.vsp-read-day { left: 104px; right: auto; top: 46px; }
.vsp-lens { position: absolute; right: 30px; top: 22px; width: 46px; height: 76px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; animation: vsp-tilt 5s ease-in-out infinite alternate; }
.vsp-lens i { height: 1px; background: rgba(255,224,74,.9); }
@keyframes vsp-tilt { from { transform: scaleX(.5); } to { transform: scaleX(1.08); } }
.vsp-lens-mark { position: absolute; right: 12px; top: 54px; fill: #ffd94a; }

/* ---- the glass plate and its four icons ---- */
.vsp-plate { border-radius: 44px; overflow: hidden; background: linear-gradient(150deg, rgba(255,255,255,.72), rgba(236,236,240,.34)); -webkit-backdrop-filter: blur(18px) saturate(1.3); backdrop-filter: blur(18px) saturate(1.3); }
.vsp-plate::after { border-radius: 44px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.7), inset 0 2px 1px rgba(255,255,255,.9), inset 0 -10px 20px -12px rgba(60,60,80,.3); }
/* under the glass, each icon has a pool of its own light: they take turns, and a press floods the plate */
.vsp-pools { position: absolute; inset: 0; }
.vsp-pools i { position: absolute; left: -14px; top: -14px; width: 130px; height: 130px; border-radius: 50%; opacity: 0;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--vsp-g) 82%, transparent) 0%, color-mix(in srgb, var(--vsp-g) 36%, transparent) 46%, transparent 100%);
  animation: vsp-pool 6.4s ease-in-out infinite; transition: opacity 500ms ease, scale 700ms var(--vsp-spring); }
.vsp-pools i:nth-child(2) { left: 60px; animation-delay: 1.6s; }
.vsp-pools i:nth-child(3) { top: 60px; animation-delay: 4.8s; }
.vsp-pools i:nth-child(4) { left: 60px; top: 60px; animation-delay: 3.2s; }
@keyframes vsp-pool { 0%, 26%, 100% { opacity: 0; } 9% { opacity: .78; } }
.vsp-pools:not([data-lit="-1"]) i { animation: none; }
.vsp-pools i[data-on="true"] { opacity: 1; scale: 1.7; }
.vsp-icons { position: absolute; inset: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.vsp-ic { position: relative; display: grid; place-items: center; border-radius: 50%; overflow: hidden; box-shadow: 0 6px 14px -6px rgba(20,20,40,.5), inset 0 1px 0 rgba(255,255,255,.5), inset 0 -6px 10px -6px rgba(0,0,0,.4); transition: scale 420ms var(--vsp-spring), filter 300ms ease; animation: vsp-pass 6.4s ease-in-out infinite; }
.vsp-ic:nth-child(2) { animation-delay: 1.6s; }
.vsp-ic:nth-child(4) { animation-delay: 3.2s; }
.vsp-ic:nth-child(3) { animation-delay: 4.8s; }
@keyframes vsp-pass { 0%, 26%, 100% { filter: brightness(1) saturate(1); } 9% { filter: brightness(1.28) saturate(1.25); } }
.vsp-icons:not([data-lit="-1"]) .vsp-ic { animation: none; filter: brightness(.86) saturate(.8); }
.vsp-icons .vsp-ic[data-on="true"] { scale: .9; filter: brightness(1.3) saturate(1.3); }
.vsp-ic svg { width: 100%; height: 100%; display: block; fill: none; stroke: #fff; stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; }
.vsp-ic .vsp-ic-dot { fill: #fff; stroke: none; }
.vsp-ic-clock { background: radial-gradient(circle at 32% 28%, #d8fff0 0%, #86f0c9 30%, #55c8e8 78%, #3f8fd8 100%); }
.vsp-ic-clock svg { stroke: #07231c; }
.vsp-ic-signal { background: radial-gradient(circle at 34% 28%, #fff0b8 0%, #e9bd4c 36%, #a87a1c 100%); }
.vsp-ic-spark { background: radial-gradient(circle at 50% 50%, #ffd27a 0%, #ff5a2a 34%, #8a0f14 82%, #2a0508 100%); }
.vsp-ic-orbit { background: radial-gradient(circle at 50% 50%, #050508 0 42%, #2b2fd8 62%, #c63ad0 80%, #0a0a12 100%); }

/* ---- the app's icon ---- */
.vsp-app { border-radius: 40px; overflow: hidden; background: #8df5c0; }
.vsp-app::after { border-radius: 40px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.4), inset 0 2px 1px rgba(255,255,255,.7); }
.vsp-app-bg { position: absolute; inset: 0; }
.vsp-app-bg i { position: absolute; border-radius: 50%; animation: vsp-drift-a 7s ease-in-out infinite alternate; }
.vsp-app-bg i:nth-child(1) { left: -30px; top: -30px; width: 150px; height: 150px; background: radial-gradient(closest-side, #5fd0ff 0 20%, rgba(95,208,255,.6) 55%, transparent 100%); }
.vsp-app-bg i:nth-child(2) { left: 50px; top: 60px; width: 150px; height: 150px; background: radial-gradient(closest-side, #f4ff5e 0 20%, rgba(244,255,94,.6) 55%, transparent 100%); animation-name: vsp-drift-b; animation-duration: 9s; }
.vsp-app-bg i:nth-child(3) { left: 15px; top: 15px; width: 120px; height: 120px; background: radial-gradient(closest-side, #a8ffb4 0 50%, transparent 100%); animation-name: vsp-drift-c; }
.vsp-app-disc { position: absolute; left: 50%; top: 50%; width: 88px; height: 88px; margin: -44px 0 0 -44px; border-radius: 50%; background: #070709; display: grid; place-items: center; box-shadow: 0 10px 20px -8px rgba(0,40,30,.6); }
.vsp-app-disc svg { fill: #f6ff7a; display: block; }
.vsp-app-disc[data-spin="true"] { animation: vsp-wake 900ms var(--vsp-spring) both; }
@keyframes vsp-wake { 0% { transform: rotate(-90deg) scale(.8); } 100% { transform: none; } }

/* ---- the phone: the stage is the top half, five tiles stand in two staggered columns over its lower edge ---- */
@container (max-width: 700px) {
  .vsp-board { width: 390px; height: 844px; margin: -422px 0 0 -195px; }
  @supports (scale: tan(atan2(1px, 1px))) { .vsp-board { --vsp-k: tan(atan2(100cqi, 390px)); } }
  .vsp-nav { left: 20px; right: 20px; top: 20px; font-size: 14px; }
  .vsp-brand { font-size: 19px; }
  .vsp-links { gap: 0; }
  .vsp-links a:not(.vsp-in-link) { display: none; }
  .vsp-stage { left: 12px; top: 58px; width: 366px; height: 348px; border-radius: 26px; }
  .vsp-person { left: -30px; top: -10px; height: 100%; }
  .vsp-glow { left: -10%; }
  .vsp-veil { background: linear-gradient(180deg, transparent 34%, rgba(3,3,3,.86) 88%); }
  .vsp-tabs { display: none; }
  .vsp-copy { left: 20px; bottom: 22px; width: 200px; }
  .vsp-kick { font-size: 12px; margin-bottom: 9px; }
  .vsp-copy h1 { font-size: 31px; letter-spacing: -.034em; }
  .vsp-sub { display: none; }
  .vsp-cta { margin-top: 14px; height: 40px; padding: 0 16px 0 18px; font-size: 14px; }
  .vsp-f { --x: var(--px); --y: var(--py); --s: var(--ps); }
  .vsp-f[data-phone="false"] { display: none; }
  .vsp-f[data-fwd="true"] .vsp-tile, .vsp-tile:focus-visible { scale: 1.045; }
  .vsp-foot { bottom: 20px; font-size: 13px; }
  .vsp-foot-l { left: 22px; }
  .vsp-foot-r { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .vsp-root *, .vsp-root *::before, .vsp-root *::after { animation: none !important; }
  .vsp-tile, .vsp-sh, .vsp-ring-arc, .vsp-fill, .vsp-thumb, .vsp-dial-turn, .vsp-cta { transition-duration: 1ms !important; }
}
`;
