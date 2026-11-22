"use client";
/**
 * NOCTURNE · website hero
 *
 * The first screen of a streaming service for slow, beautiful films, and the
 * film is already playing. One picture fills the page and moves like a dolly
 * shot: the landscape pushes in, the two women in the foreground come nearer
 * a little faster, haze drifts over the horizon, a few birds cross, dust
 * hangs in the last light and the grain never sits still. Under the title a
 * thin line fills; when it is full the page cuts to the next film: the new
 * picture wipes in behind a soft light leak, the title's letters roll up and
 * the new ones roll in, the rating and the minutes count to their new values
 * and the trailer thumbnail swaps.
 *
 * Previous and Next do the same by hand (arrow keys too). The pointer parts
 * the planes. Point at the trailer thumbnail and it plays. "Play film" draws
 * the cinema bars in for a moment, then gives the page back.
 *
 * One file, React only. The typeface comes from Google Fonts (loaded in the CSS).
 *
 *   <Nocturne />
 *   <Nocturne accent="#9fd4ff" pace={6} onPlay={(title) => player.open(title)} />
 *
 * Props
 *   brand    the wordmark                                  "Nocturne"
 *   accent   the progress line and the small lights        "#ffb561"
 *   pace     seconds a film stays before the cut           4.5
 *   haze     how much haze drifts over the picture, 0–1    0.6
 *   salt     picture of film 1 (the scene)                 "/design/websites/nocturne/salt.webp"
 *   sisters  film 1's foreground, a transparent cut-out    "/design/websites/nocturne/sisters.webp"
 *   tide     picture of film 2                             "/design/websites/nocturne/tide.webp"
 *   north    picture of film 3                             "/design/websites/nocturne/north.webp"
 *   sound    a tiny synthesized click on the keys          true
 *   onPlay   called with the film's title on "Play film"
 *
 * Fills its container's width; height is var(--design-h, 100svh), never under
 * 640px. Responsive by container query: on a phone the picture fills the
 * screen, the title block sits at the bottom and Previous / Next are two
 * round keys.
 * Everything pauses off screen and in a hidden tab. It plays by itself; after
 * a press or a key it waits six seconds before it goes on.
 * Reduced motion: one finished, still frame; Previous / Next swap the film at once.
 * Keyboard: every control is a real button; Left / Right arrows change the
 * film while focus is inside the page.
 * Sound: silent until the visitor interacts, when `sound` is false, and when
 * <html data-cd-mute="1">. The AudioContext is created on the first sound.
 */
import { useCallback, useEffect, useRef, useState } from "react";
const FILMS = [
    {
        title: "The Salt Road",
        line: "Two sisters drive a lighthouse lamp across a dried sea.",
        rating: 8.4,
        minutes: 118,
        date: "March 2026",
        pos: "50% 12%",
        posPhone: "78% 50%",
        org: "60% 30%",
        thumb: [-191, -240],
        leak: "255, 176, 110",
    },
    {
        title: "Low Tide, Late Summer",
        line: "A swimming teacher keeps one glass room open after the season ends.",
        rating: 7.9,
        minutes: 96,
        date: "August 2025",
        pos: "50% 50%",
        posPhone: "68% 50%",
        org: "62% 44%",
        thumb: [-208, -127],
        leak: "255, 206, 170",
    },
    {
        title: "A House with No North",
        line: "A surveyor's child maps the one stone the village will not name.",
        rating: 8.8,
        minutes: 131,
        date: "October 2026",
        pos: "50% 48%",
        posPhone: "81% 50%",
        org: "70% 46%",
        thumb: [-131, -238],
        leak: "255, 150, 178",
    },
];
const NAV = ["Films", "Series", "Collections", "Directors", "Journal"];
const CUT = 1150; // ms: the wipe, the leak and the rolling letters
const REST = 6000; // ms: self-play waits this long after a real touch
/* Fixed data for the small things that drift, so the server and the browser draw the same. */
const BIRDS = [
    { x: 0, y: 14, s: 1, d: 0 },
    { x: 34, y: 0, s: 0.8, d: -0.21 },
    { x: 58, y: 26, s: 0.9, d: -0.38 },
    { x: 96, y: 8, s: 0.7, d: -0.12 },
    { x: 124, y: 30, s: 0.6, d: -0.3 },
    { x: 150, y: 16, s: 0.75, d: -0.44 },
];
const MOTES = [
    { x: 8, y: 78, s: 5, t: 9, d: -1 },
    { x: 17, y: 64, s: 3, t: 12, d: -5 },
    { x: 29, y: 86, s: 4, t: 10, d: -3 },
    { x: 41, y: 70, s: 3, t: 13, d: -8 },
    { x: 52, y: 82, s: 6, t: 11, d: -2 },
    { x: 63, y: 60, s: 3, t: 14, d: -9 },
    { x: 71, y: 88, s: 4, t: 9, d: -6 },
    { x: 83, y: 72, s: 5, t: 12, d: -4 },
    { x: 92, y: 62, s: 3, t: 10, d: -7 },
];
/* Sound: a tiny synthesized click, made in the browser. Silent when `sound`
   is false, when <html data-cd-mute="1">, and until the visitor has interacted.
   Delete this hook and its calls to make the page silent. */
function useBlip(on) {
    const ctx = useRef(null);
    useEffect(() => () => void ctx.current?.close().catch(() => { }), []);
    return useCallback((f, to, d = 0.045, g = 0.035) => {
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
            const t = a.currentTime;
            const amp = a.createGain();
            amp.gain.setValueAtTime(0.0001, t);
            amp.gain.exponentialRampToValueAtTime(Math.min(g, 0.06), t + 0.004);
            amp.gain.exponentialRampToValueAtTime(0.0001, t + d);
            amp.connect(a.destination);
            const o = a.createOscillator();
            o.type = "sine";
            o.frequency.setValueAtTime(f, t);
            o.frequency.exponentialRampToValueAtTime(to, t + d);
            o.connect(amp);
            o.start(t);
            o.stop(t + d + 0.01);
        }
        catch {
            /* no sound is fine */
        }
    }, [on]);
}
/* A title as words of single letters, so each letter can roll on its own. */
function Letters({ text }) {
    const words = text.split(" ");
    let n = 0;
    return (<>
      {words.map((w, wi) => (<span key={wi} className="nct-w">
          {Array.from(w).map((c, ci) => (<span key={ci} className="nct-c" style={{ "--i": n++ }}>
              {c}
            </span>))}
          {wi < words.length - 1 ? " " : null}
        </span>))}
    </>);
}
export default function Nocturne({ brand = "Nocturne", accent = "#ffb561", pace = 4.5, haze = 0.6, salt = "/design/websites/nocturne/salt.webp", sisters = "/design/websites/nocturne/sisters.webp", tide = "/design/websites/nocturne/tide.webp", north = "/design/websites/nocturne/north.webp", sound = true, onPlay, }) {
    const root = useRef(null);
    const bar = useRef(null);
    const rateRef = useRef(null);
    const minRef = useRef(null);
    const [cur, setCur] = useState(0);
    const [prev, setPrev] = useState(null);
    const [dir, setDir] = useState(1);
    const [seq, setSeq] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [live, setLive] = useState(true);
    const blip = useBlip(sound);
    const srcs = [salt, tide, north];
    const secs = Math.min(12, Math.max(2, pace || 4.5));
    // what the loop needs, kept in refs so it never restarts
    const st = useRef({ cur: 0, busy: false, t0: 0, rest: 0, playing: false, shownR: FILMS[0].rating, shownM: FILMS[0].minutes, fromR: FILMS[0].rating, fromM: FILMS[0].minutes, tw: 0, px: 0, py: 0, tx: 0, ty: 0, over: false, secs, next: 0 });
    st.current.secs = secs;
    const timers = useRef([]);
    useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);
    const go = useCallback((to, d) => {
        const s = st.current;
        if (s.busy) {
            s.next = d; // pressed during a cut: it goes on from there when the cut is done
            return;
        }
        const n = (to + FILMS.length) % FILMS.length;
        if (n === s.cur)
            return;
        s.busy = true;
        setPrev(s.cur);
        setCur(n);
        setDir(d);
        setSeq((q) => q + 1);
        s.cur = n;
        s.t0 = performance.now();
        s.fromR = s.shownR;
        s.fromM = s.shownM;
        s.tw = s.t0;
        if (bar.current)
            bar.current.style.transform = "scaleX(0)";
        timers.current.push(window.setTimeout(() => {
            s.busy = false;
            setPrev(null);
            const d = s.next;
            s.next = 0;
            if (d)
                goRef.current(s.cur + d, d);
        }, CUT));
    }, []);
    const goRef = useRef(go);
    goRef.current = go;
    /* The loop: the parallax, the progress line, the counting numbers. */
    useEffect(() => {
        const el = root.current;
        if (!el)
            return;
        const s = st.current;
        const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let raf = 0;
        let seen = true;
        let last = 0;
        s.t0 = performance.now();
        const tick = (now) => {
            raf = requestAnimationFrame(tick);
            const dt = Math.min(64, now - (last || now));
            last = now;
            // the numbers count to the film's own
            const f = FILMS[s.cur];
            if (s.shownR !== f.rating || s.shownM !== f.minutes) {
                const k = calm ? 1 : Math.min(1, (now - s.tw) / 760);
                const e = 1 - Math.pow(1 - k, 3);
                s.shownR = k >= 1 ? f.rating : s.fromR + (f.rating - s.fromR) * e;
                s.shownM = k >= 1 ? f.minutes : s.fromM + (f.minutes - s.fromM) * e;
                if (rateRef.current)
                    rateRef.current.textContent = s.shownR.toFixed(1);
                if (minRef.current)
                    minRef.current.textContent = String(Math.round(s.shownM));
            }
            if (calm)
                return;
            // the planes part: under the pointer, or along a slow path of their own
            const t = now / 1000;
            if (!s.over) {
                // a slow ellipse, so the picture never comes to rest
                s.tx = Math.sin(t * 0.62) * 1;
                s.ty = Math.cos(t * 0.62) * 0.8;
            }
            const ease = 1 - Math.pow(0.0025, dt / 1000);
            s.px += (s.tx - s.px) * ease;
            s.py += (s.ty - s.py) * ease;
            el.style.setProperty("--px", s.px.toFixed(3));
            el.style.setProperty("--py", s.py.toFixed(3));
            // the line under the title; a touch makes it wait
            if (s.playing || s.busy || now < s.rest) {
                s.t0 += dt;
            }
            else {
                const p = Math.min(1, Math.max(0, (now - s.t0) / (s.secs * 1000)));
                if (bar.current)
                    bar.current.style.transform = `scaleX(${p.toFixed(4)})`;
                if (p >= 1)
                    goRef.current(s.cur + 1, 1);
            }
        };
        const start = () => {
            if (raf || !seen || document.hidden)
                return;
            last = 0;
            raf = requestAnimationFrame(tick);
            setLive(true);
        };
        const stop = () => {
            if (raf)
                cancelAnimationFrame(raf);
            raf = 0;
            setLive(false);
        };
        const io = new IntersectionObserver(([e]) => {
            seen = e.isIntersecting;
            if (seen)
                start();
            else
                stop();
        });
        io.observe(el);
        const vis = () => (document.hidden ? stop() : start());
        document.addEventListener("visibilitychange", vis);
        start();
        return () => {
            io.disconnect();
            document.removeEventListener("visibilitychange", vis);
            if (raf)
                cancelAnimationFrame(raf);
        };
    }, []);
    const touch = () => {
        const now = performance.now();
        st.current.rest = now + REST;
        st.current.t0 = now; // the loop holds it there while it rests
        if (bar.current)
            bar.current.style.transform = "scaleX(0)";
    };
    const step = (d) => {
        touch();
        blip(d > 0 ? 620 : 480, d > 0 ? 880 : 340);
        go(st.current.cur + d, d);
    };
    const play = () => {
        touch();
        if (st.current.playing)
            return;
        blip(300, 620, 0.07, 0.04);
        st.current.playing = true;
        setPlaying(true);
        onPlay?.(FILMS[st.current.cur].title);
        // a demo: the page comes back by itself. Remove the timer to keep the bars in.
        timers.current.push(window.setTimeout(() => {
            st.current.playing = false;
            setPlaying(false);
        }, 2600));
    };
    const onKey = (e) => {
        if (e.key === "ArrowRight") {
            e.preventDefault();
            step(1);
        }
        else if (e.key === "ArrowLeft") {
            e.preventDefault();
            step(-1);
        }
    };
    const film = FILMS[cur];
    const vars = {
        "--nct-accent": accent,
        "--nct-pace": `${secs}s`,
        "--nct-haze": String(Math.round(Math.min(1, Math.max(0, haze)) * 100) / 100),
        "--nct-leak": film.leak,
    };
    return (<div ref={root} className="nct-root" style={vars} data-live={live} data-playing={playing} onKeyDown={onKey} onPointerMove={(e) => {
            if (e.pointerType !== "mouse")
                return;
            const r = e.currentTarget.getBoundingClientRect();
            const s = st.current;
            s.over = true;
            s.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
            s.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
        }} onPointerLeave={() => (st.current.over = false)}>
      <style>{css}</style>

      {/* the films: all three are laid in, one is on, the one before it leaves under the wipe */}
      <div className="nct-stage" aria-hidden>
        {FILMS.map((f, i) => (<div key={i} className="nct-film" data-state={i === cur ? "on" : i === prev ? "off" : "idle"} data-wipe={i === cur && seq > 0 ? dir : 0} style={{ "--pos": f.pos, "--pos-s": f.posPhone, "--org": f.org }}>
            <div className="nct-par">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="nct-plate" src={srcs[i]} alt="" draggable={false} decoding="async"/>
            </div>
            {i === 0 ? (<div className="nct-forepar">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="nct-fore" src={sisters} alt="" draggable={false} decoding="async"/>
              </div>) : null}
          </div>))}
        <div className="nct-haze">
          <i />
          <i />
        </div>
        <div className="nct-birds">
          <div className="nct-flock">
            {BIRDS.map((b, i) => (<svg key={i} viewBox="0 0 24 10" style={{ left: b.x, top: b.y, width: Math.round(22 * b.s), animationDelay: `${b.d}s` }}>
                <path d="M1 8 Q6.5 0.5 12 7 Q17.5 0.5 23 8"/>
              </svg>))}
          </div>
        </div>
        <div className="nct-motes">
          {MOTES.map((m, i) => (<i key={i} style={{ left: `${m.x}%`, top: `${m.y}%`, width: m.s, height: m.s, animationDuration: `${m.t}s`, animationDelay: `${m.d}s` }}/>))}
        </div>
        {seq > 0 ? <div key={seq} className="nct-leak" data-dir={dir}/> : null}
        <div className="nct-shade"/>
        <div className="nct-grain"/>
      </div>

      <header className="nct-nav">
        <a className="nct-logo" href="#" onClick={(e) => e.preventDefault()} aria-label={brand}>
          <svg viewBox="0 0 24 24" aria-hidden>
            <circle cx="12" cy="12" r="9.2" fill="none" stroke="currentColor" strokeWidth="1.6"/>
            <path d="M2.8 13.2h18.4a9.2 9.2 0 0 1-18.4 0Z" fill="currentColor"/>
          </svg>
          <span>{brand}</span>
        </a>
        <nav className="nct-links" aria-label="Sections">
          {NAV.map((n, i) => (<a key={n} href="#" onClick={(e) => e.preventDefault()} aria-current={i === 0 ? "page" : undefined}>
              {n}
            </a>))}
        </nav>
        <div className="nct-tools">
          <button type="button" className="nct-search" aria-label="Search films">
            <span>Search</span>
            <svg viewBox="0 0 20 20" aria-hidden>
              <circle cx="9" cy="9" r="5.6"/>
              <path d="m13.4 13.4 3.6 3.6"/>
            </svg>
          </button>
          <button type="button" className="nct-me" aria-label="Your account">
            <svg viewBox="0 0 20 20" aria-hidden>
              <circle cx="10" cy="7.2" r="3.2"/>
              <path d="M3.8 17c.7-3.1 3.2-4.9 6.2-4.9s5.5 1.8 6.2 4.9"/>
            </svg>
          </button>
        </div>
      </header>

      <div className="nct-copy" data-roll={seq > 0}>
        <button type="button" key={`t${cur}`} className="nct-thumb" aria-label={`Play the trailer of ${film.title}`} onClick={play}>
          <span className="nct-thumb-pan">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={srcs[cur]} alt="" draggable={false} style={{ left: `${film.thumb[0]}%`, top: `${film.thumb[1]}%` }}/>
          </span>
          <span className="nct-ring" aria-hidden>
            <svg viewBox="0 0 44 44">
              <circle className="nct-ring-bg" cx="22" cy="22" r="19"/>
              <circle className="nct-ring-go" cx="22" cy="22" r="19" pathLength="100"/>
              <path className="nct-ring-play" d="M18.6 15.6v12.8L29 22Z"/>
            </svg>
          </span>
          <span className="nct-thumb-tag">Trailer</span>
        </button>

        <ul className="nct-meta" aria-label={`${film.rating} out of 10, ${film.minutes} minutes, ${film.date}`}>
          <li>
            <svg viewBox="0 0 20 20" aria-hidden>
              <path d="m10 2.6 2.3 4.7 5.2.7-3.8 3.6.9 5.2-4.6-2.5-4.6 2.5.9-5.2L2.5 8l5.2-.7Z"/>
            </svg>
            <span>
              <span ref={rateRef} className="nct-num">
                {FILMS[0].rating.toFixed(1)}
              </span>
              /10
            </span>
          </li>
          <li>
            <svg viewBox="0 0 20 20" aria-hidden>
              <circle cx="10" cy="10" r="7.4"/>
              <path d="M10 5.8V10l2.8 1.8"/>
            </svg>
            <span>
              <span ref={minRef} className="nct-num">
                {FILMS[0].minutes}
              </span>{" "}
              min
            </span>
          </li>
          <li>
            <svg viewBox="0 0 20 20" aria-hidden>
              <rect x="3" y="4.4" width="14" height="12.6" rx="2.4"/>
              <path d="M3 8.4h14M6.8 2.6v3.2M13.2 2.6v3.2"/>
            </svg>
            <span key={cur} className="nct-date">
              {film.date}
            </span>
          </li>
        </ul>

        <h1 className="nct-title" aria-label={film.title} data-roll={seq > 0}>
          {prev !== null ? (<span key={`o${seq}`} className="nct-tl nct-out" aria-hidden>
              <Letters text={FILMS[prev].title}/>
            </span>) : null}
          <span key={`i${seq}`} className="nct-tl nct-in" aria-hidden>
            <Letters text={film.title}/>
          </span>
        </h1>

        <div className="nct-prog" aria-hidden>
          <span className="nct-track">
            <span ref={bar} className="nct-fill"/>
          </span>
          <span className="nct-count">
            <b key={cur}>{String(cur + 1).padStart(2, "0")}</b> / {String(FILMS.length).padStart(2, "0")}
          </span>
        </div>

        <p key={`l${cur}`} className="nct-line" data-roll={seq > 0}>
          {film.line}
        </p>

        <div className="nct-acts">
          <button type="button" className="nct-play" onClick={play}>
            <span className="nct-play-dot" aria-hidden>
              <svg viewBox="0 0 12 12">
                <path d="M4 2.6v6.8L9.6 6Z"/>
              </svg>
            </span>
            Play film
          </button>
          <button type="button" className="nct-more">
            More about it
          </button>
        </div>
        <div className="nct-steps">
          <button type="button" onClick={() => step(-1)} aria-label="Previous film">
            <svg viewBox="0 0 16 16" aria-hidden>
              <path d="M9.8 3.4 5.2 8l4.6 4.6"/>
            </svg>
            <span>Previous</span>
          </button>
          <button type="button" onClick={() => step(1)} aria-label="Next film">
            <span>Next</span>
            <svg viewBox="0 0 16 16" aria-hidden>
              <path d="M6.2 3.4 10.8 8l-4.6 4.6"/>
            </svg>
          </button>
        </div>
      </div>

      {/* the cinema bars, and what is playing */}
      <div className="nct-bars" aria-hidden>
        <i />
        <i />
        <span>
          Now playing <b>{film.title}</b>
        </span>
      </div>
      <span className="nct-sr" role="status">
        {playing ? `Playing ${film.title}` : `${film.title}. ${film.line}`}
      </span>
    </div>);
}
const css = `
@import url("https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;400;500;600&display=swap");

.nct-root {
  --nct-accent: #ffb561;
  --nct-pace: 4.5s;
  --nct-haze: .6;
  --nct-leak: 255, 176, 110;
  --px: 0; --py: 0;
  --nct-out: cubic-bezier(.16, 1, .3, 1);
  --nct-cut: cubic-bezier(.62, 0, .2, 1);
  container-type: inline-size;
  position: relative; isolation: isolate; overflow: hidden;
  width: 100%; height: var(--design-h, 100svh); min-height: 640px;
  background: #0b101c; color: #fff;
  font-family: "Hanken Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px; line-height: 1.4;
  -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility;
  -webkit-tap-highlight-color: transparent;
}
.nct-root *, .nct-root *::before, .nct-root *::after { box-sizing: border-box; }
.nct-root button { font: inherit; color: inherit; background: none; border: 0; padding: 0; cursor: pointer; }
.nct-root a { color: inherit; text-decoration: none; }
.nct-root :focus-visible { outline: 2px solid #fff; outline-offset: 3px; border-radius: 999px; }
.nct-root[data-live="false"] *, .nct-root[data-live="false"] *::before { animation-play-state: paused !important; }

/* ---------- the picture ---------- */
.nct-stage { position: absolute; inset: 0; z-index: 0; overflow: hidden; }
.nct-film { position: absolute; inset: 0; opacity: 0; visibility: hidden; z-index: 0; }
.nct-film[data-state="on"] { opacity: 1; visibility: visible; z-index: 2; }
.nct-film[data-state="off"] { opacity: 1; visibility: visible; z-index: 1; }
.nct-par { position: absolute; inset: -4%; transform: translate3d(calc(var(--px) * -28px), calc(var(--py) * -15px), 0); will-change: transform; }
.nct-plate { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: var(--pos); transform-origin: var(--org); user-select: none; }
.nct-forepar { position: absolute; inset: 0; transform: translate3d(calc(var(--px) * -68px), calc(var(--py) * -20px), 0); will-change: transform; }
.nct-fore { position: absolute; left: 59%; bottom: -8%; height: 49%; width: auto; transform-origin: 50% 100%; user-select: none; filter: brightness(.86) saturate(.9); }
/* a slow dolly: the land pushes in, the women in front come nearer a little faster */
.nct-film[data-state="on"] .nct-plate, .nct-film[data-state="off"] .nct-plate { animation: nct-push calc(var(--nct-pace) + 2.8s) linear both; }
.nct-film[data-state="on"] .nct-fore, .nct-film[data-state="off"] .nct-fore { animation: nct-near calc(var(--nct-pace) + 2.8s) linear both; }
@keyframes nct-push { from { transform: scale(1); } to { transform: scale(1.15); } }
@keyframes nct-near { from { transform: translate3d(0, 2%, 0) scale(1); } to { transform: translate3d(-2.5%, 0, 0) scale(1.2); } }

/* the cut: the new film comes in behind a soft edge */
.nct-film[data-wipe="1"], .nct-film[data-wipe="-1"] {
  -webkit-mask-size: 340% 100%; mask-size: 340% 100%; -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
}
.nct-film[data-wipe="1"] {
  -webkit-mask-image: linear-gradient(100deg, #000 0 42%, transparent 58% 100%); mask-image: linear-gradient(100deg, #000 0 42%, transparent 58% 100%);
  animation: nct-wipe-a ${CUT}ms var(--nct-cut) both;
}
.nct-film[data-wipe="-1"] {
  -webkit-mask-image: linear-gradient(80deg, transparent 0 42%, #000 58% 100%); mask-image: linear-gradient(80deg, transparent 0 42%, #000 58% 100%);
  animation: nct-wipe-b ${CUT}ms var(--nct-cut) both;
}
@keyframes nct-wipe-a { from { -webkit-mask-position: 100% 0; mask-position: 100% 0; } to { -webkit-mask-position: 0% 0; mask-position: 0% 0; } }
@keyframes nct-wipe-b { from { -webkit-mask-position: 0% 0; mask-position: 0% 0; } to { -webkit-mask-position: 100% 0; mask-position: 100% 0; } }

.nct-leak {
  position: absolute; top: -20%; bottom: -20%; left: 0; width: 70%; z-index: 4; pointer-events: none; mix-blend-mode: screen;
  background:
    linear-gradient(100deg, transparent 8%, rgba(var(--nct-leak), .0) 20%, rgba(var(--nct-leak), .82) 46%, rgba(255, 244, 226, .95) 52%, rgba(255, 120, 150, .5) 62%, transparent 86%);
  filter: blur(18px);
  animation: nct-leak-a ${CUT}ms var(--nct-cut) both;
}
.nct-leak[data-dir="-1"] { animation-name: nct-leak-b; }
@keyframes nct-leak-a { 0% { transform: translate3d(-100%, 0, 0); opacity: 0; } 18% { opacity: 1; } 82% { opacity: 1; } 100% { transform: translate3d(150%, 0, 0); opacity: 0; } }
@keyframes nct-leak-b { 0% { transform: translate3d(150%, 0, 0) scaleX(-1); opacity: 0; } 18% { opacity: 1; } 82% { opacity: 1; } 100% { transform: translate3d(-100%, 0, 0) scaleX(-1); opacity: 0; } }

/* haze over the horizon, drifting one way for ever */
.nct-haze { position: absolute; inset: 0; z-index: 3; pointer-events: none; opacity: var(--nct-haze); mix-blend-mode: screen; }
.nct-haze i { position: absolute; left: 0; top: 30%; width: 200%; height: 46%; will-change: transform; }
.nct-haze i:nth-child(1) {
  background:
    radial-gradient(22% 42% at 12% 58%, rgba(214, 226, 255, .30), transparent 70%),
    radial-gradient(18% 34% at 37% 44%, rgba(255, 226, 214, .22), transparent 70%),
    radial-gradient(22% 42% at 62% 58%, rgba(214, 226, 255, .30), transparent 70%),
    radial-gradient(18% 34% at 87% 44%, rgba(255, 226, 214, .22), transparent 70%);
  animation: nct-drift 26s linear infinite;
}
.nct-haze i:nth-child(2) {
  top: 44%; height: 38%;
  background:
    radial-gradient(16% 50% at 24% 50%, rgba(232, 238, 255, .26), transparent 72%),
    radial-gradient(12% 36% at 45% 62%, rgba(255, 236, 226, .2), transparent 72%),
    radial-gradient(16% 50% at 74% 50%, rgba(232, 238, 255, .26), transparent 72%),
    radial-gradient(12% 36% at 95% 62%, rgba(255, 236, 226, .2), transparent 72%);
  animation: nct-drift 17s linear infinite reverse;
}
@keyframes nct-drift { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(-50%, 0, 0); } }

/* a few birds cross, high up */
.nct-birds { position: absolute; left: 0; right: 0; top: 17%; height: 60px; z-index: 3; pointer-events: none; }
.nct-flock { position: absolute; left: 0; top: 0; width: 180px; height: 50px; animation: nct-cross 13s linear infinite; }
.nct-flock svg { position: absolute; height: auto; overflow: visible; fill: none; stroke: rgba(16, 20, 34, .78); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; animation: nct-flap .62s ease-in-out infinite alternate; transform-origin: 50% 80%; }
@keyframes nct-cross { from { transform: translate3d(-200px, 26px, 0); } to { transform: translate3d(calc(100cqi + 60px), -34px, 0); } }
@keyframes nct-flap { from { transform: scaleY(1); } to { transform: scaleY(.25); } }

/* dust in the last light */
.nct-motes { position: absolute; inset: 0; z-index: 3; pointer-events: none; transform: translate3d(calc(var(--px) * -30px), calc(var(--py) * -12px), 0); }
.nct-motes i { position: absolute; border-radius: 50%; background: radial-gradient(closest-side, rgba(255, 236, 206, .95), rgba(255, 236, 206, 0)); animation: nct-mote 11s linear infinite; opacity: 0; }
@keyframes nct-mote { 0% { transform: translate3d(0, 0, 0); opacity: 0; } 12% { opacity: .85; } 80% { opacity: .6; } 100% { transform: translate3d(70px, -150px, 0); opacity: 0; } }

.nct-shade {
  position: absolute; inset: 0; z-index: 5; pointer-events: none;
  background:
    linear-gradient(180deg, rgba(7, 11, 22, .52) 0%, rgba(7, 11, 22, .16) 12%, transparent 26%),
    radial-gradient(86% 96% at 0% 100%, rgba(6, 9, 18, .82) 0%, rgba(6, 9, 18, .52) 34%, transparent 68%),
    linear-gradient(0deg, rgba(6, 9, 18, .5) 0%, transparent 24%);
}
.nct-grain {
  position: absolute; inset: -60px; z-index: 6; pointer-events: none; opacity: .16; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 1.1 -.1'/></filter><rect width='220' height='220' filter='url(%23n)'/></svg>");
  animation: nct-grain .5s steps(1) infinite;
}
@keyframes nct-grain { 0% { transform: translate3d(0, 0, 0); } 25% { transform: translate3d(-31px, 17px, 0); } 50% { transform: translate3d(22px, -38px, 0); } 75% { transform: translate3d(-14px, -22px, 0); } }

/* ---------- the nav ---------- */
.nct-nav { position: absolute; z-index: 8; left: 0; right: 0; top: 0; height: 92px; padding: 0 clamp(22px, 4.2cqi, 60px); display: flex; align-items: center; justify-content: space-between; transition: opacity .5s ease, transform .6s var(--nct-out); }
.nct-logo { display: inline-flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 500; letter-spacing: .16em; text-transform: uppercase; }
.nct-logo svg { width: 22px; height: 22px; }
.nct-links { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); display: flex; gap: clamp(20px, 2.6cqi, 38px); font-size: 14.5px; font-weight: 400; }
.nct-links a { position: relative; padding: 8px 0; opacity: .78; transition: opacity .25s ease; white-space: nowrap; }
.nct-links a:hover, .nct-links a[aria-current] { opacity: 1; }
.nct-links a::after { content: ""; position: absolute; left: 50%; bottom: 0; width: 4px; height: 4px; margin-left: -2px; border-radius: 50%; background: var(--nct-accent); transform: scale(0); transition: transform .35s var(--nct-out); }
.nct-links a[aria-current]::after, .nct-links a:hover::after { transform: scale(1); }
.nct-tools { display: flex; align-items: center; gap: 10px; }
.nct-root .nct-search, .nct-root .nct-me {
  height: 44px; border-radius: 999px; background: rgba(255, 255, 255, .12); border: 1px solid rgba(255, 255, 255, .24);
  -webkit-backdrop-filter: blur(14px) saturate(1.2); backdrop-filter: blur(14px) saturate(1.2);
  display: inline-flex; align-items: center; justify-content: center; gap: 9px; transition: background .25s ease, transform .35s var(--nct-out);
}
.nct-root .nct-search { padding: 0 18px 0 20px; font-size: 14.5px; }
.nct-root .nct-me { width: 44px; }
.nct-root .nct-search:hover, .nct-root .nct-me:hover { background: rgba(255, 255, 255, .2); }
.nct-root .nct-search:active, .nct-root .nct-me:active { transform: scale(.96); }
.nct-tools svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }

/* ---------- the film's words ---------- */
.nct-copy { position: absolute; z-index: 8; left: clamp(22px, 4.2cqi, 60px); right: clamp(22px, 4.2cqi, 60px); bottom: clamp(30px, 5.6cqi, 64px); transition: opacity .5s ease, transform .6s var(--nct-out); }

.nct-root .nct-thumb {
  position: relative; display: block; width: 196px; height: 124px; border-radius: 16px; overflow: hidden; isolation: isolate;
  background: #121826; box-shadow: 0 0 0 1px rgba(255, 255, 255, .28), 0 18px 40px -18px rgba(0, 0, 0, .7);
  transition: transform .5s var(--nct-out), box-shadow .3s ease;
}
.nct-copy[data-roll="true"] .nct-thumb { animation: nct-rise .7s var(--nct-out) .2s both; }
.nct-root .nct-thumb:hover { transform: scale(1.045); box-shadow: 0 0 0 1px rgba(255, 255, 255, .5), 0 22px 44px -18px rgba(0, 0, 0, .8); }
.nct-root .nct-thumb:focus-visible { border-radius: 16px; }
.nct-thumb-pan { position: absolute; inset: 0; animation: nct-pan 7s ease-in-out infinite alternate; }
.nct-thumb-pan img { position: absolute; width: 420%; max-width: none; height: auto; user-select: none; }
.nct-thumb:hover .nct-thumb-pan img, .nct-thumb:focus-visible .nct-thumb-pan img { animation: nct-pan2 2.6s ease-in-out infinite alternate; }
@keyframes nct-pan { from { transform: translate3d(-9%, -3%, 0) scale(1.04); } to { transform: translate3d(9%, 4%, 0) scale(1.16); } }
@keyframes nct-pan2 { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(-3.5%, -1.5%, 0); } }
.nct-thumb::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(8, 12, 22, .05), rgba(8, 12, 22, .42)); }
.nct-ring { position: absolute; left: 50%; top: 50%; width: 46px; height: 46px; margin: -23px 0 0 -23px; z-index: 1; }
.nct-ring svg { width: 100%; height: 100%; overflow: visible; }
.nct-ring-bg { fill: rgba(10, 14, 24, .34); stroke: rgba(255, 255, 255, .78); stroke-width: 1.4; }
.nct-ring-go { fill: none; stroke: var(--nct-accent); stroke-width: 2.2; stroke-linecap: round; stroke-dasharray: 100; stroke-dashoffset: 100; transform: rotate(-90deg); transform-origin: 22px 22px; }
.nct-thumb:hover .nct-ring-go, .nct-thumb:focus-visible .nct-ring-go { animation: nct-ring 2.6s linear infinite; }
@keyframes nct-ring { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }
.nct-ring-play { fill: #fff; }
.nct-thumb-tag { position: absolute; left: 12px; bottom: 9px; z-index: 1; font-size: 11px; font-weight: 500; letter-spacing: .14em; text-transform: uppercase; opacity: .9; }

.nct-meta { list-style: none; margin: 26px 0 0; padding: 0; display: flex; align-items: center; gap: 26px; font-size: 15px; font-weight: 400; color: rgba(255, 255, 255, .86); font-variant-numeric: tabular-nums; }
.nct-meta li { display: inline-flex; align-items: center; gap: 9px; white-space: nowrap; }
.nct-meta svg { width: 19px; height: 19px; fill: none; stroke: currentColor; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
.nct-num { color: #fff; }
.nct-date { display: inline-block; }
.nct-copy[data-roll="true"] .nct-date { animation: nct-rise .6s var(--nct-out) .25s both; }

.nct-title { position: relative; max-width: min(64cqi, 880px); margin: 14px 0 0; font-size: clamp(40px, 4.850cqi, 72px); line-height: 1.08; font-weight: 300; letter-spacing: -.028em; }
.nct-tl { display: block; }
.nct-out { position: absolute; left: 0; bottom: 0; right: 0; }
.nct-w { display: inline-block; overflow: hidden; vertical-align: bottom; padding-bottom: .16em; margin-bottom: -.16em; white-space: pre; }
.nct-c { display: inline-block; will-change: transform; }
.nct-title[data-roll="true"] .nct-in .nct-c { animation: nct-in .72s var(--nct-out) both; animation-delay: calc(300ms + var(--i) * 20ms); }
.nct-out .nct-c { animation: nct-out .46s cubic-bezier(.6, 0, .8, .3) both; animation-delay: calc(var(--i) * 14ms); }
@keyframes nct-in { from { transform: translate3d(0, 112%, 0); } to { transform: translate3d(0, 0, 0); } }
@keyframes nct-out { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(0, -112%, 0); } }

.nct-prog { margin-top: 18px; display: flex; align-items: center; gap: 14px; font-size: 12.5px; letter-spacing: .08em; color: rgba(255, 255, 255, .62); font-variant-numeric: tabular-nums; }
.nct-track { position: relative; display: block; width: 240px; height: 2px; border-radius: 2px; background: rgba(255, 255, 255, .26); overflow: hidden; }
.nct-fill { position: absolute; inset: 0; background: var(--nct-accent); transform: scaleX(0); transform-origin: 0 50%; box-shadow: 0 0 10px var(--nct-accent); will-change: transform; }
.nct-count b { display: inline-block; font-weight: 500; color: #fff; }
.nct-copy[data-roll="true"] .nct-count b { animation: nct-rise .5s var(--nct-out) .3s both; }

.nct-line { margin: 16px 0 0; font-size: clamp(15.5px, 1.320cqi, 19px); line-height: 1.45; font-weight: 400; color: rgba(255, 255, 255, .84); max-width: 34em; text-wrap: pretty; }
.nct-line[data-roll="true"] { animation: nct-rise .8s var(--nct-out) .34s both; }
@keyframes nct-rise { from { opacity: 0; transform: translate3d(0, 12px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }

.nct-acts { margin-top: 28px; display: flex; gap: 12px; }
.nct-root .nct-play, .nct-root .nct-more { height: 50px; border-radius: 999px; font-size: 15.5px; font-weight: 500; display: inline-flex; align-items: center; gap: 11px; white-space: nowrap; transition: transform .35s var(--nct-out), background .25s ease, box-shadow .3s ease; }
.nct-root .nct-play { padding: 0 24px 0 9px; background: #fff; color: #0c1120; box-shadow: 0 10px 30px -12px rgba(0, 0, 0, .6); }
.nct-root .nct-play:hover { transform: translateY(-2px); box-shadow: 0 16px 34px -12px rgba(0, 0, 0, .7); }
.nct-play-dot { width: 32px; height: 32px; border-radius: 50%; background: #0c1120; display: grid; place-items: center; transition: background .25s ease; }
.nct-play:hover .nct-play-dot { background: var(--nct-accent); }
.nct-play-dot svg { width: 12px; height: 12px; fill: #fff; transition: fill .25s ease; }
.nct-play:hover .nct-play-dot svg { fill: #0c1120; }
.nct-root .nct-more { padding: 0 24px; border: 1px solid rgba(255, 255, 255, .5); background: rgba(255, 255, 255, .06); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); }
.nct-root .nct-more:hover { background: rgba(255, 255, 255, .16); }
.nct-root .nct-play:active, .nct-root .nct-more:active { transform: scale(.97); }

/* ---------- previous / next ---------- */
.nct-steps { position: absolute; right: 0; bottom: 0; display: flex; gap: 12px; }
.nct-root .nct-steps button { height: 50px; padding: 0 22px; border-radius: 999px; border: 1px solid rgba(255, 255, 255, .5); background: rgba(255, 255, 255, .06); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); font-size: 15px; font-weight: 400; display: inline-flex; align-items: center; gap: 10px; transition: background .25s ease, transform .35s var(--nct-out); }
.nct-root .nct-steps button:hover { background: rgba(255, 255, 255, .18); }
.nct-root .nct-steps button:active { transform: scale(.95); }
.nct-steps svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; transition: transform .35s var(--nct-out); }
.nct-steps button:first-child:hover svg { transform: translateX(-3px); }
.nct-steps button:last-child:hover svg { transform: translateX(3px); }

/* ---------- "Play film": the cinema bars come in, the page steps back ---------- */
.nct-bars { position: absolute; inset: 0; z-index: 9; pointer-events: none; }
.nct-bars i { position: absolute; left: 0; right: 0; height: 12.5%; background: #000; transition: transform .7s var(--nct-cut); }
.nct-bars i:nth-child(1) { top: 0; transform: translate3d(0, -101%, 0); }
.nct-bars i:nth-child(2) { bottom: 0; transform: translate3d(0, 101%, 0); }
.nct-bars span { position: absolute; left: 0; right: 0; bottom: 4.2%; text-align: center; font-size: 13px; letter-spacing: .16em; text-transform: uppercase; color: rgba(255, 255, 255, .62); opacity: 0; transition: opacity .4s ease; }
.nct-bars b { font-weight: 500; color: #fff; }
.nct-root[data-playing="true"] .nct-bars i { transform: translate3d(0, 0, 0); }
.nct-root[data-playing="true"] .nct-bars span { opacity: 1; transition-delay: .35s; }
.nct-root[data-playing="true"] .nct-copy { opacity: 0; transform: translate3d(0, 14px, 0); pointer-events: none; }
.nct-root[data-playing="true"] .nct-nav { opacity: 0; transform: translate3d(0, -14px, 0); pointer-events: none; }

.nct-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

/* ---------- narrower ---------- */
@container (max-width: 1080px) {
  .nct-links { display: none; }
  .nct-title { max-width: 72cqi; }
}
@container (max-width: 820px) {
  .nct-steps span { display: none; }
  .nct-root .nct-steps button { width: 50px; padding: 0; justify-content: center; }
}

/* ---------- the phone: the picture fills the screen, the words sit at the bottom ---------- */
@container (max-width: 640px) {
  .nct-plate { object-position: var(--pos-s); }
  .nct-forepar { display: none; }
  .nct-par { inset: -4% -4% 19% -4%; }
  .nct-shade {
    background:
      linear-gradient(180deg, rgba(7, 11, 22, .56) 0%, rgba(7, 11, 22, .14) 13%, transparent 26%),
      linear-gradient(0deg, #0b101c 0%, #0b101c 19%, rgba(11, 16, 28, .86) 30%, rgba(11, 16, 28, .34) 47%, transparent 60%);
  }
  .nct-nav { height: 76px; padding: 0 20px; }
  .nct-logo { font-size: 14px; }
  .nct-root .nct-search { width: 44px; padding: 0; }
  .nct-search span { display: none; }
  .nct-copy { left: 20px; right: 20px; bottom: 30px; }
  .nct-title { max-width: none; }
  .nct-root .nct-thumb { width: 132px; height: 84px; border-radius: 13px; }
  .nct-ring { width: 36px; height: 36px; margin: -18px 0 0 -18px; }
  .nct-thumb-tag { font-size: 10px; left: 10px; bottom: 7px; }
  .nct-meta { margin-top: 18px; gap: 16px; font-size: 13.5px; }
  .nct-meta svg { width: 17px; height: 17px; }
  .nct-meta li { gap: 7px; }
  .nct-title { font-size: 38px; margin-top: 10px; letter-spacing: -.024em; }
  .nct-prog { margin-top: 14px; }
  .nct-track { width: auto; flex: 1; }
  .nct-line { font-size: 15.5px; margin-top: 12px; }
  .nct-acts { margin-top: 20px; gap: 10px; }
  .nct-root .nct-play { flex: 1; justify-content: center; padding: 0 20px 0 9px; }
  .nct-root .nct-more { padding: 0 18px; }
  .nct-steps { bottom: auto; top: 19px; gap: 10px; }
  .nct-root .nct-steps button { width: 46px; height: 46px; }
}

@media (prefers-reduced-motion: reduce) {
  .nct-root *, .nct-root *::before, .nct-root *::after { animation: none !important; transition-duration: 1ms !important; }
  .nct-film[data-wipe] { -webkit-mask-image: none !important; mask-image: none !important; }
  .nct-leak, .nct-out, .nct-birds { display: none; }
  .nct-motes i { opacity: .5; }
  .nct-fill { transform: scaleX(.38) !important; }
  .nct-par, .nct-forepar, .nct-motes { transform: none; }
}
`;
