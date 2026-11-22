"use client";
/**
 * FURROW · website hero
 *
 * The first screen of a field intelligence product for growers. On cream, a
 * slim nav and one sentence; under them a large rounded aerial photograph of
 * a farm seen from straight above, with a faint white survey grid over it and
 * six coloured sensors standing in its fields.
 *
 * The page surveys the farm by itself. A soft line of light sweeps across the
 * fields; as it passes a sensor the sensor pings, the white alert card
 * travels to it on a spring and rewrites itself for that zone, the soil chart
 * in the panel morphs to that zone's five readings, its score counts, and the
 * zone's row lights in the table. Point at a sensor (or a row) and you read
 * it yourself: the sweep waits for you. The photograph drifts a few pixels
 * under the grid, so the survey sits above the land. The alert's button plans
 * the fix and shows it done.
 *
 * One file, React only. The typefaces come from Google Fonts (loaded in the CSS).
 *
 *   <Furrow />
 *   <Furrow accent="#9be7ff" pace={8} onCta={() => openDemo()} />
 *
 * Props
 *   brand      the wordmark                                 "Furrow"
 *   headline   the sentence ("\n" breaks it)                "Know every field\nbefore you walk it."
 *   line       the line beside it                           (see below)
 *   cta        the primary button                           "See your farm"
 *   photo      the farm from above, landscape               "/design/websites/furrow/fields.webp"
 *   accent     the highlight (tag, lit row, the sweep)      "#e4f36a"
 *   pace       seconds for one sweep across the farm        10
 *   zones      the six zones (name, readings, sensor place) built in
 *   autoplay   the sweep runs by itself                     true
 *   sound      a tick when you read a sensor, two notes
 *              when a fix is planned                        true
 *   onCta      called when the primary button is pressed
 *   onPlan     called with the zone's name when a fix is planned
 *
 * Fills its container's width; height is var(--design-h, 100svh), never under
 * 640px. Responsive by container query: on a phone the photograph fills the
 * screen under the sentence and the panel becomes a sheet with the chart and
 * two rows.
 * The sweep pauses off screen, in a hidden tab, while you point at a sensor,
 * and for six seconds after a click or a key.
 * Keyboard: every sensor and every row is a button (Tab, Enter); on a sensor
 * the arrow keys step to the next one. The three map keys switch the grid,
 * the sensors and the sweep; plus and minus zoom the photograph.
 * Reduced motion: no sweep and no drift; one finished frame with a zone read.
 * Pointing and pressing still work, without travel.
 * Sound: silent until the visitor interacts, when `sound` is false, and when
 * <html data-cd-mute="1">. The sweep itself never makes a sound.
 */
import { useCallback, useEffect, useRef, useState } from "react";
const ZONES = [
    { name: "Long Acre", ha: 41, color: "#3ecbf0", x: 35, y: 42, mx: 11, my: 43, finding: "Nitrogen is running low in the north half.", chips: ["N 38 kg/ha", "Feed by Sat"], now: [34, 72, 66, 81, 70], then: [58, 64, 61, 78, 66] },
    { name: "Mill Bank", ha: 28, color: "#7a74f7", x: 43, y: 85, mx: 30, my: 57, finding: "A dry band along the east hedge.", chips: ["Moisture 19%", "Water tonight"], now: [71, 29, 58, 74, 62], then: [69, 55, 57, 73, 64] },
    { name: "Heron Strip", ha: 17, color: "#ea6cf2", x: 54, y: 11, mx: 39, my: 15, finding: "Rust on about 3% of leaves, still early.", chips: ["Leaf scan 3%", "Scout Friday"], now: [77, 68, 49, 62, 80], then: [74, 70, 60, 70, 79] },
    { name: "Top Sixteen", ha: 52, color: "#f5c13d", x: 69, y: 79, mx: 63, my: 41, finding: "Even growth. Ready to cut in four days.", chips: ["Height 61 cm", "Cut Monday"], now: [86, 78, 82, 88, 84], then: [72, 70, 77, 85, 80] },
    { name: "Quarry Piece", ha: 33, color: "#f2885c", x: 81, y: 12, mx: 80, my: 12, finding: "Ground is tight by the gate after the trailers.", chips: ["Structure 31", "Subsoil here"], now: [64, 59, 55, 70, 31], then: [66, 60, 57, 71, 52] },
    { name: "Brook Side", ha: 41, color: "#e0482f", x: 90, y: 48, mx: 88, my: 53, finding: "Still waterlogged from Tuesday's rain.", chips: ["Moisture 94%", "Keep off"], now: [52, 96, 63, 57, 44], then: [60, 71, 64, 66, 58] },
];
const AXES = ["Nitrogen", "Moisture", "Organic", "pH", "Structure"];
const ZOOMS = [1, 1.08, 1.16];
function useBlip(on) {
    const ctx = useRef(null);
    useEffect(() => () => void ctx.current?.close().catch(() => { }), []);
    return useCallback((b) => {
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
            if (b.to)
                o.frequency.exponentialRampToValueAtTime(b.to, t + d);
            o.connect(amp);
            o.start(t);
            o.stop(t + d + 0.01);
        }
        catch {
            /* no sound is fine */
        }
    }, [on]);
}
/* ------------------------------------------------------------------ the chart
   A pentagon: axis i points at -90° + 72°·i. Every number is rounded, so the
   server's markup and the browser's agree to the last digit. */
const R = 56;
const r2 = (n) => Math.round(n * 100) / 100;
const corner = (i, v) => {
    const a = ((-90 + 72 * i) * Math.PI) / 180;
    return [r2(Math.cos(a) * R * (v / 100)), r2(Math.sin(a) * R * (v / 100))];
};
const shape = (vals) => vals.map((v, i) => corner(i, v).join(",")).join(" ");
const RINGS = [25, 50, 75, 100].map((v) => shape([v, v, v, v, v]));
const SPOKES = [0, 1, 2, 3, 4].map((i) => corner(i, 100));
const LABELS = [0, 1, 2, 3, 4].map((i) => corner(i, 124));
const score = (vals) => Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
const back = (k) => 1 + 2.2 * Math.pow(k - 1, 3) + 1.2 * Math.pow(k - 1, 2);
/* Where the alert stands for a sensor: beside it on a wide screen (on the far
   side near the right edge), under or over it on a phone. */
const place = (z) => ({
    "--frw-cl": z.x > 70 ? `calc(${z.x}% - 270px)` : `calc(${z.x}% + 22px)`,
    "--frw-ct": `clamp(28px, calc(${z.y}% - 58px), calc(100% - 224px))`,
    "--frw-ml": `clamp(22px, calc(${z.mx}% - 99px), calc(100% - 220px))`,
    "--frw-mt": z.my < 27 ? `calc(${z.my}% + 18px)` : `calc(${z.my}% - 150px)`,
});
export default function Furrow({ brand = "Furrow", headline = "Know every field\nbefore you walk it.", line = "Furrow reads your drones, probes and satellites before breakfast and names the zone that needs you today.", cta = "See your farm", photo = "/design/websites/furrow/fields.webp", accent = "#e4f36a", pace = 10, zones = ZONES, autoplay = true, sound = true, onCta, onPlan, }) {
    const root = useRef(null);
    const frame = useRef(null);
    const polyNow = useRef(null);
    const polyThen = useRef(null);
    const scoreEl = useRef(null);
    const cur = useRef({ now: zones[0].now.slice(), then: zones[0].then.slice(), score: score(zones[0].now) });
    const tw = useRef(0);
    const blip = useBlip(sound);
    const [active, setActive] = useState(0);
    const [pings, setPings] = useState(() => zones.map(() => 0));
    const [done, setDone] = useState(false);
    const [grid, setGrid] = useState(true);
    const [pins, setPins] = useState(true);
    const [playing, setPlaying] = useState(autoplay);
    const [zoom, setZoom] = useState(0);
    const live = useRef({ playing: autoplay, hover: false, hold: 0, zoom: 1, pace });
    live.current.playing = playing;
    live.current.zoom = ZOOMS[zoom];
    live.current.pace = pace;
    const doneT = useRef(null);
    useEffect(() => () => void (doneT.current && clearTimeout(doneT.current)), []);
    /* The chart and the score travel to a zone's readings (written straight to
       the SVG, so React does not redraw the panel on every frame). */
    const morph = useCallback((i) => {
        const z = zones[i];
        if (!z)
            return;
        const from = { now: cur.current.now.slice(), then: cur.current.then.slice(), score: cur.current.score };
        const to = score(z.now);
        const still = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        cancelAnimationFrame(tw.current);
        const t0 = performance.now();
        const step = (t) => {
            const k = still ? 1 : Math.min(1, (t - t0) / 720);
            const e = back(k);
            const a = from.now.map((v, j) => Math.max(4, v + (z.now[j] - v) * e));
            const b = from.then.map((v, j) => Math.max(4, v + (z.then[j] - v) * e));
            const s = from.score + (to - from.score) * Math.min(1, k * 1.15);
            cur.current = { now: a, then: b, score: s };
            polyNow.current?.setAttribute("points", shape(a));
            polyThen.current?.setAttribute("points", shape(b));
            if (scoreEl.current)
                scoreEl.current.textContent = String(Math.round(s));
            if (k < 1)
                tw.current = requestAnimationFrame(step);
        };
        step(t0);
    }, [zones]);
    useEffect(() => () => cancelAnimationFrame(tw.current), []);
    /* Read a zone: the sensor pings, the card goes to it, the chart follows. */
    const read = useCallback((i) => {
        setActive((was) => {
            if (was !== i)
                setDone(false);
            return i;
        });
        setPings((p) => p.map((n, j) => (j === i ? n + 1 : n)));
        morph(i);
    }, [morph]);
    const readRef = useRef(read);
    readRef.current = read;
    /* A visitor reads one: the sweep waits six seconds after a press or a key. */
    const pick = (i, hold = 6000) => {
        live.current.hold = performance.now() + hold;
        if (i !== active)
            blip({ f: 1700, to: 1150, d: 0.03, g: 0.028, type: "triangle" });
        read(i);
    };
    const plan = (byHand) => {
        if (done)
            return;
        setDone(true);
        if (byHand) {
            live.current.hold = performance.now() + 6000;
            blip({ f: 660, d: 0.07, g: 0.035 });
            blip({ f: 990, d: 0.09, g: 0.035, at: 0.07 });
            onPlan?.(zones[active]?.name ?? "");
        }
        if (doneT.current)
            clearTimeout(doneT.current);
        // Demo: the button comes back after a moment, so the next visitor can press it. Remove in a real page.
        doneT.current = setTimeout(() => setDone(false), 1900);
    };
    const planRef = useRef(plan);
    planRef.current = plan;
    /* The sweep and the drift, one loop. */
    useEffect(() => {
        const el = root.current;
        const fr = frame.current;
        if (!el || !fr)
            return;
        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (still) {
            el.dataset.still = "true";
            readRef.current(Math.min(2, zones.length - 1));
            return;
        }
        let visible = true;
        let raf = 0;
        let last = performance.now();
        let p = -0.03;
        let w = fr.clientWidth || 1;
        let s0 = 0;
        let narrow = false;
        let px = 0;
        let py = 0;
        let tx = 0;
        let ty = 0;
        let over = false;
        let autoT = null;
        const measure = () => {
            w = fr.clientWidth || 1;
            s0 = parseFloat(getComputedStyle(fr).getPropertyValue("--frw-s0")) || 0;
            narrow = el.clientWidth <= 760;
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        const io = new IntersectionObserver(([x]) => {
            visible = x.isIntersecting;
        });
        io.observe(el);
        const move = (e) => {
            if (e.pointerType !== "mouse")
                return;
            const r = fr.getBoundingClientRect();
            over = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
            tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
            ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
        };
        const leave = () => {
            over = false;
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        const loop = (t) => {
            raf = requestAnimationFrame(loop);
            const dt = Math.min(0.05, (t - last) / 1000);
            last = t;
            if (!visible || document.hidden)
                return;
            // the photograph drifts under the grid: slowly by itself, a little more under the pointer
            const gx = over ? -tx * 7 : Math.sin(t * 0.00031) * 4.5;
            const gy = over ? -ty * 5 : Math.cos(t * 0.00023) * 3.5;
            px += (gx - px) * Math.min(1, dt * 3);
            py += (gy - py) * Math.min(1, dt * 3);
            el.style.setProperty("--frw-px", `${px.toFixed(2)}px`);
            el.style.setProperty("--frw-py", `${py.toFixed(2)}px`);
            const L = live.current;
            const waiting = !L.playing || L.hover || t < L.hold;
            el.dataset.wait = waiting ? "true" : "false";
            if (waiting)
                return;
            const before = p;
            p += dt / Math.max(3, L.pace);
            if (p > 1.1) {
                p = -0.06;
                el.style.setProperty("--frw-p", "0");
                el.style.setProperty("--frw-po", "0");
                return;
            }
            el.style.setProperty("--frw-p", Math.max(0, Math.min(1, p)).toFixed(4));
            el.style.setProperty("--frw-po", (p < 0 || p > 1 ? 0 : Math.min(1, p / 0.05, (1 - p) / 0.05)).toFixed(3));
            for (let i = 0; i < zones.length; i++) {
                const z = zones[i];
                const fx = 0.5 + ((narrow ? z.mx : z.x) / 100 - 0.5) * L.zoom;
                const at = (fx * w - s0) / Math.max(1, w - s0);
                if (before < at && p >= at) {
                    readRef.current(i);
                    // once a sweep, the page plans a fix by itself (silently), to show the button's done state
                    if (i === 3) {
                        if (autoT)
                            clearTimeout(autoT);
                        autoT = setTimeout(() => {
                            if (!live.current.hover && performance.now() >= live.current.hold)
                                planRef.current(false);
                        }, 700);
                    }
                }
            }
        };
        raf = requestAnimationFrame(loop);
        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
            el.removeEventListener("pointermove", move);
            el.removeEventListener("pointerleave", leave);
            if (autoT)
                clearTimeout(autoT);
        };
    }, [zones]);
    const onDotKey = (e, i) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "ArrowDown" && e.key !== "ArrowUp")
            return;
        e.preventDefault();
        const n = (i + (e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : zones.length - 1)) % zones.length;
        const next = e.currentTarget.parentElement?.querySelectorAll(".frw-dot")[n];
        next?.focus();
    };
    const z = zones[active] ?? zones[0];
    const lines = headline.split("\n");
    const vars = { "--frw-accent": accent, "--frw-zoom": ZOOMS[zoom] };
    return (<div ref={root} className="frw-root" style={vars} data-grid={grid} data-pins={pins} data-wait="false">
      <style>{css}</style>

      <header className="frw-nav">
        <a className="frw-brand" href="#" onClick={(e) => e.preventDefault()} aria-label={brand}>
          <span className="frw-mark" aria-hidden>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 18c3-7 5-10 8-13"/>
              <path d="M10 19c2-6 4-9 7-12"/>
              <path d="M16 19c1-3 2-5 4-7"/>
            </svg>
          </span>
          {brand}
        </a>
        <nav className="frw-links" aria-label="Main">
          <a href="#" onClick={(e) => e.preventDefault()}>Surveys</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Sensors</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Pricing</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Field notes</a>
        </nav>
        <div className="frw-navr">
          <a className="frw-signin" href="#" onClick={(e) => e.preventDefault()}>Sign in</a>
          <button type="button" className="frw-btn frw-btn-sm" onClick={onCta}>{cta}</button>
        </div>
      </header>

      <section className="frw-band">
        <div className="frw-say">
          <span className="frw-tag">Field intelligence</span>
          <h1 className="frw-h1">
            {lines.map((l, i) => (<span key={i}>{l}</span>))}
          </h1>
        </div>
        <div className="frw-side">
          <p className="frw-line">{line}</p>
          <div className="frw-acts">
            <button type="button" className="frw-btn" onClick={onCta}>{cta}</button>
            <a className="frw-more" href="#" onClick={(e) => e.preventDefault()}>
              Watch a survey
              <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 8h10M9 4l4 4-4 4"/></svg>
            </a>
          </div>
        </div>
      </section>

      <div ref={frame} className="frw-frame">
        {/* the land */}
        <div className="frw-land" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt="" draggable={false}/>
        </div>
        {/* the survey, above the land: the grid and the line of light */}
        <div className="frw-grid" aria-hidden/>
        <div className="frw-scan" aria-hidden><i /></div>

        {/* what stands on the land: the sensors and the alert */}
        <div className="frw-pins">
          {zones.map((d, i) => (<button key={d.name} type="button" className="frw-dot" data-on={i === active} aria-label={`${d.name}: ${d.finding}`} aria-pressed={i === active} style={{ "--x": d.x, "--y": d.y, "--mx": d.mx, "--my": d.my, "--c": d.color }} onPointerEnter={(e) => {
                if (e.pointerType !== "mouse")
                    return;
                live.current.hover = true;
                pick(i, 1500);
            }} onPointerLeave={() => {
                live.current.hover = false;
                live.current.hold = Math.max(live.current.hold, performance.now() + 1500);
            }} onFocus={() => pick(i)} onClick={() => pick(i)} onKeyDown={(e) => onDotKey(e, i)}>
              <i key={pings[i]} className={pings[i] ? "frw-ping" : undefined}/>
              <b />
            </button>))}

          <div className="frw-alert" style={place(z)} data-done={done} aria-live="polite">
            <div className="frw-alert-in" key={active}>
              <p className="frw-alert-k">
                <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden><rect x="0" y="0" width="5" height="5" rx="1" fill="currentColor"/><rect x="7" y="0" width="5" height="5" rx="1" fill="currentColor"/><rect x="0" y="7" width="5" height="5" rx="1" fill="currentColor"/><rect x="7" y="7" width="5" height="5" rx="1" fill="currentColor"/></svg>
                Field alert
                <em>Read 06:4{active}</em>
              </p>
              <p className="frw-alert-t"><i style={{ background: z.color }}/>{z.name}</p>
              <p className="frw-alert-f">{z.finding}</p>
              <p className="frw-alert-c"><span>{z.chips[0]}</span><span>{z.chips[1]}</span></p>
            </div>
            <button type="button" className="frw-btn frw-plan" onClick={() => plan(true)} aria-label={done ? "Added to today" : `Plan the fix for ${z.name}`}>
              <span className="frw-plan-a">Plan the fix</span>
              <span className="frw-plan-b">
                <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 8.5l3.2 3.2L13 5"/></svg>
                Added to today
              </span>
            </button>
          </div>
        </div>

        {/* the map keys */}
        <div className="frw-keys" role="group" aria-label="Map">
          <button type="button" className="frw-key" aria-pressed={grid} aria-label="Survey grid" onClick={() => setGrid((v) => !v)}>
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 5.5h12M2 10.5h12M5.5 2v12M10.5 2v12"/></svg>
          </button>
          <button type="button" className="frw-key" aria-pressed={pins} aria-label="Sensors" onClick={() => setPins((v) => !v)}>
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 14s4.5-4 4.5-7.3A4.5 4.5 0 0 0 8 2.2a4.5 4.5 0 0 0-4.5 4.5C3.500 10 8 14 8 14z"/><circle cx="8" cy="6.700" r="1.500"/></svg>
          </button>
          <button type="button" className="frw-key" aria-pressed={playing} aria-label={playing ? "Pause the survey" : "Run the survey"} onClick={() => {
            live.current.hold = 0;
            setPlaying((v) => !v);
        }}>
            {playing ? (<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><rect x="4" y="3.500" width="2.700" height="9" rx="0.800"/><rect x="9.300" y="3.500" width="2.700" height="9" rx="0.800"/></svg>) : (<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M5 3.300v9.400a.6.6 0 0 0 .9.500l7.300-4.700a.6.6 0 0 0 0-1L5.900 2.800a.6.6 0 0 0-.9.500z"/></svg>)}
          </button>
        </div>
        <div className="frw-zoom" role="group" aria-label="Zoom">
          <button type="button" className="frw-key" aria-label="Zoom out" disabled={zoom === 0} onClick={() => setZoom((v) => Math.max(0, v - 1))}>
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3.500 8h9"/></svg>
          </button>
          <button type="button" className="frw-key" aria-label="Zoom in" disabled={zoom === ZOOMS.length - 1} onClick={() => setZoom((v) => Math.min(ZOOMS.length - 1, v + 1))}>
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3.500 8h9M8 3.500v9"/></svg>
          </button>
        </div>

        {/* the panel */}
        <aside className="frw-panel" aria-label="Morning survey">
          <div className="frw-rail" aria-hidden>
            <span className="frw-mark">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 18c3-7 5-10 8-13"/><path d="M10 19c2-6 4-9 7-12"/><path d="M16 19c1-3 2-5 4-7"/></svg>
            </span>
            <span className="frw-rail-i" data-on="true"><svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor"><path d="M8 2 2.500 6.300V13a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V6.300L8 2z"/></svg></span>
            <span className="frw-rail-i"><svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 13c0-6 4-10 10-10 0 6-4 10-10 10z"/><path d="M3 13l5-5"/></svg></span>
            <span className="frw-rail-i"><svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor"><rect x="2.500" y="2.500" width="4.600" height="4.600" rx="1.200"/><rect x="8.900" y="2.500" width="4.600" height="4.600" rx="1.200"/><rect x="2.500" y="8.900" width="4.600" height="4.600" rx="1.200"/><rect x="8.900" y="8.900" width="4.600" height="4.600" rx="1.200"/></svg></span>
            <span className="frw-rail-i"><svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2.500 4.500h11M2.500 8h11M2.500 11.500h11"/><circle cx="5.500" cy="4.500" r="1.400" fill="#fff"/><circle cx="10.500" cy="8" r="1.400" fill="#fff"/><circle cx="6.500" cy="11.500" r="1.400" fill="#fff"/></svg></span>
            <span className="frw-me">MO</span>
          </div>
          <div className="frw-body">
            <div className="frw-head">
              <p className="frw-title">Morning survey</p>
              <p className="frw-sub">North block · 212 ha</p>
              <p className="frw-chips"><span data-on="true">Zone</span><span>Soil</span><span>Water</span></p>
              <p className="frw-date">
                <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden><rect x="2.500" y="3.500" width="11" height="10" rx="2"/><path d="M2.500 6.800h11M5.500 2v3M10.500 2v3"/></svg>
                Flown <b>Thu 20 Nov, 06:40</b>
              </p>
            </div>

            <div className="frw-soil">
              <p className="frw-soil-h">
                <span>Soil health<small>{z.name}</small></span>
                <strong><span ref={scoreEl}>{score(zones[0].now)}</span><small>/100</small></strong>
              </p>
              <svg className="frw-radar" viewBox="-96 -76 192 150" role="img" aria-label={`Soil health for ${z.name}`}>
                {RINGS.map((pts, i) => (<polygon key={i} points={pts} className="frw-ring"/>))}
                {SPOKES.map(([x, y], i) => (<line key={i} x1="0" y1="0" x2={x} y2={y} className="frw-ring"/>))}
                <polygon ref={polyThen} points={shape(zones[0].then)} className="frw-then"/>
                <polygon ref={polyNow} points={shape(zones[0].now)} className="frw-now"/>
                {LABELS.map(([x, y], i) => (<text key={i} x={x} y={r2(y + 2.5)} textAnchor={i === 0 ? "middle" : x > 0 ? "start" : "end"} className="frw-ax">{AXES[i]}</text>))}
              </svg>
              <p className="frw-legend"><span><i className="frw-lg-then"/>Last month</span><span><i className="frw-lg-now"/>This month</span></p>
            </div>

            <div className="frw-table" role="group" aria-label="Zones">
              <p className="frw-th"><span>Zone</span><span>ha</span><span>Score</span></p>
              {zones.map((d, i) => (<button key={d.name} type="button" className="frw-row" data-on={i === active} data-next={i === (active + 1) % zones.length} aria-pressed={i === active} onClick={() => pick(i)}>
                  <span><i style={{ background: d.color }}/>{d.name}</span>
                  <span>{d.ha}</span>
                  <span>{score(d.now)}</span>
                </button>))}
            </div>
            <p className="frw-foot"><span>Next flight</span><b>Fri 21 Nov, 06:30</b></p>
          </div>
        </aside>
      </div>
    </div>);
}
const css = `
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap');
.frw-root {
  --frw-accent: #e4f36a;
  --frw-olive: #2f3a1c;
  --frw-ink: #171b10;
  --frw-soft: #6b6f5e;
  --frw-cream: #f1efe2;
  --frw-spring: cubic-bezier(.3,1.36,.46,1);
  --frw-px: 0px; --frw-py: 0px; --frw-p: 0; --frw-po: 0; --frw-zoom: 1;
  container: frw / inline-size;
  position: relative;
  width: 100%;
  height: var(--design-h, 100svh);
  min-height: 640px;
  overflow: hidden;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  background: var(--frw-cream);
  color: var(--frw-ink);
  font-family: "Geist", system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-align: left;
}
.frw-root *, .frw-root *::before, .frw-root *::after { box-sizing: border-box; }
.frw-root p, .frw-root h1 { margin: 0; }
.frw-root a { color: inherit; text-decoration: none; }
.frw-root button { font: inherit; color: inherit; border: 0; background: none; padding: 0; cursor: pointer; }
.frw-root button:focus-visible, .frw-root a:focus-visible { outline: 2px solid var(--frw-ink); outline-offset: 2px; border-radius: 8px; }

/* nav */
.frw-nav { flex: none; height: 64px; padding: 0 28px; display: flex; align-items: center; justify-content: space-between; }
.frw-brand { display: inline-flex; align-items: center; gap: 9px; font-size: 17px; font-weight: 600; letter-spacing: -.02em; }
.frw-mark { width: 28px; height: 28px; border-radius: 9px; background: var(--frw-olive); color: var(--frw-accent); display: grid; place-items: center; flex: none; }
.frw-links { display: flex; gap: 30px; font-size: 14px; color: #3c4130; }
.frw-links a { transition: color .2s; }
.frw-links a:hover { color: var(--frw-ink); }
.frw-navr { display: flex; align-items: center; gap: 20px; font-size: 14px; }
.frw-signin { color: #3c4130; }
.frw-root .frw-btn {
  height: 44px; padding: 0 20px; border-radius: 10px; background: var(--frw-olive); color: #f4f6e6;
  font-family: "Geist Mono", ui-monospace, Menlo, monospace; font-size: 12px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase;
  display: inline-flex; align-items: center; justify-content: center; gap: 8px; white-space: nowrap;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.12), 0 1px 2px rgba(23,27,16,.25);
  transition: scale .18s cubic-bezier(.2,.8,.2,1), background .2s;
}
.frw-root .frw-btn:hover { background: #3a4723; }
.frw-root .frw-btn:active { scale: .97; }
.frw-root .frw-btn-sm { height: 36px; padding: 0 14px; font-size: 11px; border-radius: 9px; }

/* the sentence */
.frw-band { flex: none; padding: 10px 28px 22px; display: flex; align-items: flex-end; justify-content: space-between; gap: 40px; }
.frw-tag {
  display: inline-block; padding: 4px 8px; border-radius: 5px; background: var(--frw-accent); color: #2c3312;
  font-family: "Geist Mono", ui-monospace, Menlo, monospace; font-size: 10.5px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase;
  animation: frw-up .6s cubic-bezier(.2,.8,.2,1) both;
}
.frw-h1 { margin-top: 14px !important; font-size: 50px; line-height: 1.02; font-weight: 400; letter-spacing: -.035em; }
.frw-h1 span { display: block; animation: frw-up .7s cubic-bezier(.2,.8,.2,1) both; }
.frw-h1 span:nth-child(2) { animation-delay: .07s; color: #5c6348; }
.frw-side { width: 400px; flex: none; animation: frw-up .7s .12s cubic-bezier(.2,.8,.2,1) both; }
.frw-line { font-size: 15.5px; line-height: 1.42; color: #3c4130; letter-spacing: -.005em; }
.frw-acts { margin-top: 16px; display: flex; align-items: center; gap: 20px; }
.frw-more { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 500; }
.frw-more svg { transition: translate .25s cubic-bezier(.2,.8,.2,1); }
.frw-more:hover svg { translate: 3px 0; }

/* the photograph */
.frw-frame {
  --frw-s0: 332px;
  container: frwf / size;
  position: relative; flex: 1; min-height: 0; margin: 0 24px 16px; border-radius: 26px; overflow: hidden; background: #3f5a25;
  clip-path: inset(0 round 26px);
  animation: frw-rise .9s .05s cubic-bezier(.2,.8,.2,1) both;
}
.frw-land, .frw-pins {
  position: absolute; inset: -12px;
  transform: translate3d(var(--frw-px), var(--frw-py), 0) scale(var(--frw-zoom));
  transition: transform .7s cubic-bezier(.2,.8,.2,1);
}
.frw-land img { width: 100%; height: 100%; object-fit: cover; display: block; user-select: none; }
.frw-land::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,20,5,.10), rgba(10,20,5,0) 30%, rgba(10,20,5,.12)); }
.frw-pins { pointer-events: none; }
.frw-grid {
  position: absolute; inset: 0; pointer-events: none; opacity: 1; transition: opacity .4s;
  background-image:
    linear-gradient(to right, rgba(255,255,255,.26) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,.26) 1px, transparent 1px);
  background-size: 116px 116px; background-position: 40px 28px;
}
.frw-root[data-grid="false"] .frw-grid { opacity: 0; }
/* the line of light, and the strip it has just read behind it */
.frw-scan {
  position: absolute; top: 0; bottom: 0; width: 0; pointer-events: none;
  left: calc(var(--frw-s0) + (100% - var(--frw-s0)) * var(--frw-p));
  opacity: var(--frw-po); transition: opacity .5s;
}
.frw-root[data-wait="true"] .frw-scan { opacity: calc(var(--frw-po) * .45); }
.frw-scan::before {
  content: ""; position: absolute; top: 0; bottom: 0; right: 0; width: 240px;
  background: linear-gradient(to left, color-mix(in srgb, var(--frw-accent) 46%, transparent), color-mix(in srgb, var(--frw-accent) 14%, transparent) 40%, transparent);
}
.frw-scan::after {
  content: ""; position: absolute; top: 0; bottom: 0; left: -28px; width: 56px;
  background: radial-gradient(closest-side, rgba(255,255,235,.55), transparent); mix-blend-mode: screen;
}
.frw-scan i { position: absolute; top: 0; bottom: 0; left: -1.5px; width: 3px; background: #fdffe8; box-shadow: 0 0 12px 2px #fff, 0 0 26px 6px color-mix(in srgb, var(--frw-accent) 90%, transparent), 0 0 70px 14px color-mix(in srgb, var(--frw-accent) 50%, transparent); }

/* a sensor */
.frw-root .frw-dot {
  position: absolute; left: calc(var(--x) * 1%); top: calc(var(--y) * 1%); width: 36px; height: 36px; margin: -18px 0 0 -18px;
  border-radius: 50%; pointer-events: auto; display: grid; place-items: center;
  scale: calc(1 / var(--frw-zoom)); transition: opacity .35s, scale .35s cubic-bezier(.2,.8,.2,1);
}
.frw-root[data-pins="false"] .frw-dot { opacity: 0; pointer-events: none; }
.frw-root .frw-dot:focus-visible { outline: 2px solid #fff; outline-offset: -4px; border-radius: 50%; }
.frw-dot b {
  width: 16px; height: 16px; border-radius: 50%; background: var(--c);
  box-shadow: 0 0 0 5px color-mix(in srgb, var(--c) 30%, transparent), 0 0 18px 4px color-mix(in srgb, var(--c) 55%, transparent), inset 0 1px 1px rgba(255,255,255,.55);
  transition: scale .45s var(--frw-spring), box-shadow .3s;
}
.frw-dot[data-on="true"] b { scale: 1.3; box-shadow: 0 0 0 2.5px #fff, 0 0 0 8px color-mix(in srgb, var(--c) 38%, transparent), 0 0 26px 8px color-mix(in srgb, var(--c) 70%, transparent); }
.frw-dot i { position: absolute; inset: 9px; border-radius: 50%; border: 1.5px solid var(--c); opacity: 0; pointer-events: none; }
.frw-dot i.frw-ping { animation: frw-ping 1.1s cubic-bezier(.2,.7,.3,1) both; }
@keyframes frw-ping { 0% { opacity: .95; scale: 1; } 100% { opacity: 0; scale: 4.6; } }

/* the alert */
.frw-alert {
  position: absolute; left: var(--frw-cl); top: var(--frw-ct); width: 248px; padding: 14px; border-radius: 16px; background: #fff; pointer-events: auto;
  box-shadow: 0 1px 1px rgba(15,25,5,.10), 0 14px 34px -10px rgba(15,25,5,.45), 0 0 0 1px rgba(15,25,5,.04);
  transition: left .72s var(--frw-spring), top .72s var(--frw-spring), opacity .35s;
  scale: calc(1 / var(--frw-zoom)); transform-origin: 0 0;
}
.frw-root[data-pins="false"] .frw-alert { opacity: 0; pointer-events: none; }
.frw-alert-in > * { animation: frw-in .42s cubic-bezier(.2,.8,.2,1) both; }
.frw-alert-in > *:nth-child(2) { animation-delay: .05s; }
.frw-alert-in > *:nth-child(3) { animation-delay: .09s; }
.frw-alert-in > *:nth-child(4) { animation-delay: .13s; }
@keyframes frw-in { from { opacity: 0; translate: 0 6px; } to { opacity: 1; translate: 0 0; } }
.frw-alert-k { display: flex; align-items: center; gap: 6px; font-family: "Geist Mono", ui-monospace, Menlo, monospace; font-size: 10px; letter-spacing: .09em; text-transform: uppercase; color: #2c3312; }
.frw-alert-k em { margin-left: auto; font-style: normal; letter-spacing: 0; text-transform: none; font-size: 10px; color: #6b6f5e; padding: 2px 6px; border-radius: 5px; background: #f1f2ea; }
.frw-alert-t { margin-top: 10px !important; display: flex; align-items: center; gap: 8px; font-size: 17px; font-weight: 500; letter-spacing: -.02em; }
.frw-alert-t i { width: 9px; height: 9px; border-radius: 3px; flex: none; }
.frw-alert-f { margin-top: 4px !important; font-size: 13px; line-height: 1.35; color: #5b5f4f; min-height: 35px; }
.frw-alert-c { margin-top: 9px !important; display: flex; gap: 6px; }
.frw-alert-c span { font-family: "Geist Mono", ui-monospace, Menlo, monospace; font-size: 10.5px; padding: 4px 7px; border-radius: 6px; border: 1px solid #e3e5d8; color: #33381f; white-space: nowrap; }
.frw-root .frw-plan { margin-top: 12px; width: 100%; height: 36px; font-size: 11px; border-radius: 9px; position: relative; overflow: hidden; }
.frw-plan span { display: inline-flex; align-items: center; gap: 7px; transition: translate .4s var(--frw-spring), opacity .25s; }
.frw-plan-b { position: absolute; inset: 0; justify-content: center; translate: 0 100%; opacity: 0; color: #2c3312; }
.frw-alert[data-done="true"] .frw-plan { background: var(--frw-accent); }
.frw-alert[data-done="true"] .frw-plan-a { translate: 0 -120%; opacity: 0; }
.frw-alert[data-done="true"] .frw-plan-b { translate: 0 0; opacity: 1; }

/* map keys */
.frw-keys, .frw-zoom { position: absolute; top: 16px; display: flex; padding: 3px; gap: 2px; border-radius: 11px; background: #fff; box-shadow: 0 1px 2px rgba(15,25,5,.18), 0 8px 20px -10px rgba(15,25,5,.4); }
.frw-keys { left: 332px; }
.frw-zoom { right: 16px; }
.frw-root .frw-key { width: 32px; height: 32px; border-radius: 8px; display: grid; place-items: center; color: #9a9d8c; transition: background .2s, color .2s, scale .15s; }
.frw-root .frw-key:hover { background: #f1f2ea; }
.frw-root .frw-key:active { scale: .92; }
.frw-root .frw-key[aria-pressed="true"], .frw-zoom .frw-key { color: #2c3312; }
.frw-root .frw-key:disabled { color: #c6c8ba; cursor: default; }

/* the panel */
.frw-panel {
  position: absolute; left: 16px; top: 16px; bottom: 16px; width: 300px; border-radius: 16px; background: #fff; display: flex; overflow: hidden;
  box-shadow: 0 1px 2px rgba(15,25,5,.16), 0 24px 50px -24px rgba(15,25,5,.55);
  animation: frw-panel .8s .25s cubic-bezier(.2,.8,.2,1) both;
}
.frw-rail { width: 46px; flex: none; padding: 12px 0; display: flex; flex-direction: column; align-items: center; gap: 6px; border-right: 1px solid #eeefe6; }
.frw-rail .frw-mark { width: 26px; height: 26px; border-radius: 8px; margin-bottom: 10px; }
.frw-rail-i { width: 30px; height: 30px; border-radius: 8px; display: grid; place-items: center; color: #b3b6a6; }
.frw-rail-i[data-on="true"] { color: #2c3312; background: #f1f2ea; }
.frw-me { margin-top: auto; width: 26px; height: 26px; border-radius: 50%; background: #d9e7c4; color: #2c3312; font-size: 9.5px; font-weight: 600; display: grid; place-items: center; letter-spacing: .02em; }
.frw-body { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.frw-head { padding: 14px 14px 12px; border-bottom: 1px solid #eeefe6; }
.frw-title { font-size: 14.5px; font-weight: 500; letter-spacing: -.015em; }
.frw-sub { font-size: 11.5px; color: #8b8e7e; margin-top: 1px !important; }
.frw-chips { margin-top: 11px !important; display: flex; gap: 5px; }
.frw-chips span { font-family: "Geist Mono", ui-monospace, Menlo, monospace; font-size: 9.5px; letter-spacing: .09em; text-transform: uppercase; padding: 4px 7px; border-radius: 5px; background: #f4f4ee; color: #7a7d6d; }
.frw-chips span[data-on="true"] { background: var(--frw-accent); color: #2c3312; }
.frw-date { margin-top: 10px !important; display: flex; align-items: center; gap: 6px; font-size: 11.5px; color: #8b8e7e; }
.frw-date b { font-weight: 500; color: #33381f; font-variant-numeric: tabular-nums; }
.frw-soil { padding: 12px 14px 10px; border-bottom: 1px solid #eeefe6; }
.frw-soil-h { display: flex; align-items: flex-start; justify-content: space-between; font-size: 13px; font-weight: 500; letter-spacing: -.01em; }
.frw-soil-h small { display: block; font-size: 11px; font-weight: 400; color: #8b8e7e; margin-top: 1px; }
.frw-soil-h strong { font-size: 22px; font-weight: 500; letter-spacing: -.03em; font-variant-numeric: tabular-nums; line-height: 1; }
.frw-soil-h strong small { display: inline; font-size: 10.5px; color: #a5a898; letter-spacing: 0; margin-left: 2px; }
.frw-radar { display: block; width: 100%; height: auto; margin-top: 2px; overflow: visible; }
.frw-ring { fill: none; stroke: rgba(23,27,16,.11); stroke-width: .7; }
.frw-then { fill: rgba(234,108,214,.20); stroke: #e56cd0; stroke-width: 1.1; stroke-linejoin: round; }
.frw-now { fill: rgba(46,170,234,.22); stroke: #2aa5e6; stroke-width: 1.3; stroke-linejoin: round; }
.frw-ax { font-size: 7.4px; fill: #a0a392; font-family: "Geist", system-ui, sans-serif; }
.frw-legend { display: flex; gap: 14px; font-size: 10.5px; color: #7a7d6d; }
.frw-legend span { display: inline-flex; align-items: center; gap: 5px; }
.frw-legend i { width: 7px; height: 7px; border-radius: 2px; }
.frw-lg-then { background: #e56cd0; }
.frw-lg-now { background: #2aa5e6; }
.frw-table { padding: 8px 8px 10px; display: flex; flex-direction: column; gap: 1px; flex: 0 1 auto; min-height: 0; overflow: hidden; }
.frw-th, .frw-root .frw-row { flex: none; }
.frw-head, .frw-soil, .frw-foot { flex: none; }
.frw-th, .frw-root .frw-row { display: grid; grid-template-columns: 1fr 34px 44px; align-items: center; padding: 0 6px; text-align: left; }
.frw-th { height: 22px; font-family: "Geist Mono", ui-monospace, Menlo, monospace; font-size: 9px; letter-spacing: .09em; text-transform: uppercase; color: #a5a898; }
.frw-th span:nth-child(n+2), .frw-row span:nth-child(n+2) { text-align: right; font-variant-numeric: tabular-nums; }
.frw-root .frw-row { height: 28px; border-radius: 7px; font-size: 12px; color: #4a4e3c; transition: background .35s, color .35s; }
.frw-row span:first-child { display: flex; align-items: center; gap: 8px; white-space: nowrap; }
.frw-row i { width: 8px; height: 8px; border-radius: 2.5px; flex: none; transition: scale .4s var(--frw-spring); }
.frw-row span:nth-child(n+2) { font-family: "Geist Mono", ui-monospace, Menlo, monospace; font-size: 11px; color: #8b8e7e; }
.frw-root .frw-row:hover { background: #f6f7f0; }
.frw-root .frw-row[data-on="true"] { background: var(--frw-accent); color: #20260d; }
.frw-row[data-on="true"] span:nth-child(n+2) { color: #3b4318; }
.frw-row[data-on="true"] i { scale: 1.25; }
.frw-foot { margin-top: auto !important; padding: 11px 14px 13px; border-top: 1px solid #eeefe6; display: flex; justify-content: space-between; font-size: 11.5px; color: #8b8e7e; }
.frw-foot b { font-weight: 500; color: #33381f; font-variant-numeric: tabular-nums; }

@keyframes frw-up { from { opacity: 0; translate: 0 14px; } to { opacity: 1; translate: 0 0; } }
@keyframes frw-rise { from { opacity: 0; translate: 0 22px; } to { opacity: 1; translate: 0 0; } }
@keyframes frw-panel { from { opacity: 0; translate: -18px 0; } to { opacity: 1; translate: 0 0; } }

/* a shorter photograph: the panel sheds what it can spare, in this order */
@container frwf (max-height: 672px) and (min-width: 700px) { .frw-foot { display: none; } }
@container frwf (max-height: 632px) and (min-width: 700px) { .frw-date { display: none; } .frw-root .frw-row { height: 25px; } }
@container frwf (max-height: 586px) and (min-width: 700px) { .frw-radar { width: 78%; margin-left: auto; margin-right: auto; } }
@container frwf (max-height: 546px) and (min-width: 700px) { .frw-chips { display: none; } }
@container frwf (max-height: 504px) and (min-width: 700px) { .frw-legend, .frw-th { display: none; } .frw-table { padding-top: 4px; } }
@container frwf (max-height: 450px) and (min-width: 700px) { .frw-radar { width: 58%; } .frw-soil { padding-bottom: 4px; } }

/* narrower desks */
@container frw (max-width: 1180px) {
  .frw-links { display: none; }
  .frw-h1 { font-size: 40px; }
  .frw-side { width: 340px; }
  .frw-frame { --frw-s0: 286px; }
  .frw-rail { display: none; }
  .frw-panel { width: 254px; }
  .frw-keys { left: 286px; }
}
/* the phone: the photograph fills the screen, the panel is a sheet */
@container frw (max-width: 760px) {
  .frw-nav { height: 56px; padding: 0 16px; }
  .frw-signin { display: none; }
  .frw-band { padding: 4px 16px 14px; display: block; }
  .frw-h1 { font-size: 31px; line-height: 1.04; margin-top: 10px !important; }
  .frw-side { width: auto; }
  .frw-line { margin-top: 9px !important; font-size: 13.5px; }
  .frw-acts { display: none; }
  .frw-frame { --frw-s0: 0px; margin: 0 10px 10px; border-radius: 22px; clip-path: inset(0 round 22px); }
  .frw-grid { background-size: 78px 78px; background-position: 20px 16px; }
  .frw-root .frw-dot { left: calc(var(--mx) * 1%); top: calc(var(--my) * 1%); }
  .frw-alert { left: var(--frw-ml); top: var(--frw-mt); width: 198px; padding: 11px; border-radius: 14px; }
  .frw-alert-t { font-size: 15px; margin-top: 7px !important; }
  .frw-alert-f { font-size: 12px; min-height: 32px; }
  .frw-alert-c { display: none; }
  .frw-root .frw-plan { margin-top: 9px; height: 32px; }
  .frw-keys { left: 10px; top: 10px; }
  .frw-zoom { display: none; }
  .frw-panel { left: 0; right: 0; top: auto; bottom: 0; width: auto; height: auto; border-radius: 20px 20px 22px 22px; box-shadow: 0 -14px 40px -18px rgba(15,25,5,.6); animation-name: frw-rise; }
  .frw-body { display: block; }
  .frw-foot { display: none; }
  .frw-head { display: none; }
  .frw-soil { grid-column: 1 / -1; display: grid; grid-template-columns: 168px 1fr; column-gap: 10px; padding: 12px 14px 2px; border-bottom: 0; align-items: start; }
  .frw-soil-h { grid-column: 2; grid-row: 1; flex-direction: column; gap: 10px; padding-top: 6px; }
  .frw-soil-h strong { font-size: 30px; }
  .frw-radar { grid-column: 1; grid-row: 1 / 3; margin: 0; }
  .frw-legend { grid-column: 2; grid-row: 2; flex-direction: column; gap: 4px; align-self: end; padding-bottom: 8px; }
  .frw-table { padding: 0 8px 10px; }
  .frw-th { display: none; }
  .frw-root .frw-row { display: none; height: 32px; font-size: 13px; }
  .frw-root .frw-row[data-on="true"], .frw-root .frw-row[data-next="true"] { display: grid; }
  .frw-root .frw-row[data-on="true"] { order: -1; }
}

.frw-root[data-still="true"] .frw-scan { display: none; }
@media (prefers-reduced-motion: reduce) {
  .frw-tag, .frw-h1 span, .frw-side, .frw-frame, .frw-panel, .frw-alert-in > *, .frw-dot i.frw-ping { animation: none !important; }
  .frw-alert, .frw-land, .frw-pins, .frw-dot b, .frw-plan span, .frw-root .frw-row, .frw-root .frw-btn { transition-duration: 1ms !important; }
  .frw-scan { display: none; }
}
`;
