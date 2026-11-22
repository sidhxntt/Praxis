"use client";
/**
 * LEO · website hero
 *
 * The first screen of a film photographer's portfolio, Leo Marchetti. His
 * name is set huge in signal red on a pale wall, and he stands in front of it,
 * a black-and-white cut-out holding his camera. The idea is the glance: Leo
 * turns his head to look at you. Move the pointer and he follows it, left,
 * centre, right; leave him alone and he glances slowly around the room on his
 * own. The turn is real, not a skew: it plays a set of photographs of the
 * same man at different head angles, with the in-between frames morphed by
 * optical flow, so his nose, beard and curls rotate like a person's.
 *
 * Three planes part in a slow dolly and a little more under the pointer: the
 * red name at the back (with Leo's soft shadow on it), Leo, and his film
 * prints at the bottom right in front. The prints shuffle on a rhythm, the
 * frame counter advances with each one; hover a print to lift it, press it to
 * bring it to the top (a soft shutter click).
 *
 * One file, React only. The typeface (Archivo, variable width) and the mono
 * (JetBrains Mono) come from Google Fonts, loaded in the CSS.
 *
 *   <Leo />
 *   <Leo ink="#1f3fd6" name="Leo" />
 *
 * Props
 *   ink       the colour of the giant name               "#e8321e"
 *   ground    the wall                                   "#f2f1ee"
 *   name      the first name in "HI, I'M …"              "Leo"
 *   fullName  the wordmark                               "Leo Marchetti"
 *   line      the one line about him                     (see default)
 *   cta       the main button                            "Commission"
 *   body      cut-out of the body, head zone erased      "/design/websites/leo/body.webp"
 *   heads     sprite of the head-turn frames, left→right "/design/websites/leo/heads.webp"
 *   prints    sprite of four prints, 2 × 2               "/design/websites/leo/prints.webp"
 *   roll      the roll number on the counter             214
 *   sound     tiny synthesized sounds on interaction     true
 *   onCta     called when the main button is pressed
 *
 * Fills its container's width; height is var(--design-h, 100svh), never under
 * 640px. Responsive by container query: on a phone the name stacks ("HI, I'M"
 * over a huge "LEO"), Leo stands centred in front of it and the prints sit at
 * the bottom right. The loop pauses off screen and in a hidden tab.
 * Keyboard: Leo is focusable, left/right arrows turn his head; each print is a
 * button (Enter/Space brings it to the top). Reduced motion: no entrance, no
 * drift, no shuffle, he looks at the camera (and still turns to the arrows).
 * Sound: silent until the visitor interacts, when `sound` is false, and when
 * <html data-cd-mute="1">. The AudioContext is created on the first sound.
 */
import { useCallback, useEffect, useRef, useState } from "react";
/* The head-turn sprite: FRAMES frames, left (his gaze to the left of the frame)
   to right, COLS per row. Each frame covers HEAD (fractions of the body image). */
const FRAMES = 25;
const COLS = 5;
const ROWS = Math.ceil(FRAMES / COLS);
const HEAD = { x: 0.1953, y: 0, w: 0.6152, h: 0.4167 };
/* Where his face is, across the body image (for the pointer). */
const FACE_X = 0.48;
/* He rests only on the five photographed angles (far left … far right);
   the morphed frames between them are only ever seen in motion. */
const KEYS = [-1, -0.5, 0, 0.5, 1];
/* His own glance when nobody points: [angle, seconds he holds it]. */
const GLANCE = [
    [0, 1.0],
    [1, 1.5],
    [0, 0.9],
    [-1, 1.5],
];
const MOVE = 0.95; // seconds a glance takes to arrive
/* The four prints and where they lie (px at 1440 wide; scaled with the hero). */
const PRINT_ALT = ["Procida harbour at sunset", "A night train on a viaduct in the Alps", "A woman among peonies", "A portrait on mint green"];
const SLOTS = [
    { x: 172, y: 26, r: 5 },
    { x: 0, y: 64, r: -6 },
    { x: 96, y: 8, r: -1.5 },
    { x: 130, y: 0, r: 2.5 },
];
const SHUFFLE_EVERY = 3.2; // seconds between shuffles
const SHUFFLE_TIME = 1.15; // seconds a shuffle takes
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export default function Leo({ ink = "#e8321e", ground = "#f2f1ee", name = "Leo", fullName = "Leo Marchetti", line = "I shoot people and places on 35 mm film. Ten years, forty countries, one camera.", cta = "Commission", body = "/design/websites/leo/body.webp", heads = "/design/websites/leo/heads.webp", prints = "/design/websites/leo/prints.webp", roll = 214, sound = true, onCta, }) {
    const root = useRef(null);
    const typeRef = useRef(null);
    const manRef = useRef(null);
    const shadowRef = useRef(null);
    const deckRef = useRef(null);
    const headA = useRef(null);
    const headB = useRef(null);
    const cards = useRef([]);
    const audio = useRef(null);
    const [frame, setFrame] = useState(17);
    const [ready, setReady] = useState(false);
    const [busy, setBusy] = useState(false);
    /* Shared state the loop reads (no re-renders per frame). */
    const st = useRef({
        order: [0, 1, 2, 3], // order[slot] = print index; slot 0 is on top
        shuffleAt: 0, // time the current shuffle started (s), -1 = none
        from: [0, 1, 2, 3], // slot each print starts from in the shuffle
        flyer: -1, // print that leaves the top and goes to the back
        hover: -1,
        lift: [0, 0, 0, 0],
        nextShuffle: SHUFFLE_EVERY,
        px: 0,
        py: 0,
        pActive: 0, // time of the last pointer move (s)
        keyTurn: 0, // -1..1 from the arrow keys
        keyAt: -99,
        angle: 0,
        key: 2,
        vel: 0,
        cam: 0,
        camY: 0,
        reduced: false,
    });
    /* ── sound ───────────────────────────────────────────────────────────── */
    const ac = useCallback(() => {
        if (!sound || document.documentElement.dataset.cdMute === "1")
            return null;
        try {
            if (!audio.current) {
                const AC = window.AudioContext || window.webkitAudioContext;
                if (!AC)
                    return null;
                audio.current = new AC();
            }
            if (audio.current.state === "suspended")
                void audio.current.resume();
            return audio.current;
        }
        catch {
            return null;
        }
    }, [sound]);
    /* A film-camera shutter: a short high click, 30 ms of filtered noise (the
       curtain), and a lower click 40 ms later (the mirror). Peak .05. */
    const shutter = useCallback(() => {
        const a = ac();
        if (!a)
            return;
        try {
            const t = a.currentTime;
            const len = Math.floor(a.sampleRate * 0.035);
            const buf = a.createBuffer(1, len, a.sampleRate);
            const d = buf.getChannelData(0);
            for (let i = 0; i < len; i++)
                d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
            const n = a.createBufferSource();
            n.buffer = buf;
            const bp = a.createBiquadFilter();
            bp.type = "bandpass";
            bp.frequency.value = 3200;
            bp.Q.value = 0.8;
            const g = a.createGain();
            g.gain.value = 0.05;
            n.connect(bp).connect(g).connect(a.destination);
            n.start(t);
            [0, 0.045].forEach((dt, k) => {
                const o = a.createOscillator();
                const og = a.createGain();
                o.type = "square";
                o.frequency.setValueAtTime(k ? 900 : 2100, t + dt);
                og.gain.setValueAtTime(0.0001, t + dt);
                og.gain.exponentialRampToValueAtTime(k ? 0.03 : 0.04, t + dt + 0.002);
                og.gain.exponentialRampToValueAtTime(0.0001, t + dt + 0.018);
                o.connect(og).connect(a.destination);
                o.start(t + dt);
                o.stop(t + dt + 0.03);
            });
        }
        catch {
            /* no sound, no problem */
        }
    }, [ac]);
    /* A soft tick for the button. */
    const tick = useCallback(() => {
        const a = ac();
        if (!a)
            return;
        try {
            const t = a.currentTime;
            const o = a.createOscillator();
            const g = a.createGain();
            o.type = "sine";
            o.frequency.setValueAtTime(1250, t);
            o.frequency.exponentialRampToValueAtTime(700, t + 0.04);
            g.gain.setValueAtTime(0.0001, t);
            g.gain.exponentialRampToValueAtTime(0.05, t + 0.004);
            g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
            o.connect(g).connect(a.destination);
            o.start(t);
            o.stop(t + 0.06);
        }
        catch {
            /* ignore */
        }
    }, [ac]);
    /* ── prints: start a shuffle that brings print `p` to the top ───────────── */
    const clock = useRef(0);
    const shuffleTo = useCallback((p) => {
        const s = st.current;
        if (s.shuffleAt >= 0)
            return false;
        const cur = s.order.slice();
        let next;
        let flyer;
        if (p === null) {
            flyer = cur[0];
            next = [cur[1], cur[2], cur[3], cur[0]];
        }
        else {
            if (cur[0] === p)
                return false;
            flyer = p;
            next = [p, ...cur.filter((x) => x !== p)];
        }
        s.from = [0, 1, 2, 3].map((i) => cur.indexOf(i));
        s.order = next;
        s.flyer = flyer;
        s.shuffleAt = s.reduced ? -1 : clock.current;
        setFrame((f) => (f >= 36 ? 1 : f + 1));
        return true;
    }, []);
    /* ── the loop ────────────────────────────────────────────────────────── */
    useEffect(() => {
        const el = root.current;
        if (!el)
            return;
        const s = st.current;
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        s.reduced = mq.matches;
        const onMq = () => (s.reduced = mq.matches);
        mq.addEventListener?.("change", onMq);
        let raf = 0;
        let visible = true;
        let last = performance.now();
        let t = 0;
        let shownA = -1;
        let shownB = -1;
        let opB = -1;
        // Two neighbouring frames are mixed exactly (A × (1 − f) + B × f, edges included) where the
        // browser can add layers; elsewhere B simply fades in over A.
        const exact = typeof CSS !== "undefined" && CSS.supports("mix-blend-mode", "plus-lighter");
        const place = (node, f) => {
            if (!node)
                return;
            const c = f % COLS;
            const r = Math.floor(f / COLS);
            node.style.backgroundPosition = `${(c / (COLS - 1)) * 100}% ${(r / Math.max(1, ROWS - 1)) * 100}%`;
        };
        const step = (now) => {
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            t += dt;
            clock.current = t;
            const W = el.clientWidth || 1440;
            const unit = W / 1440;
            const phone = W < 640;
            const pu = phone ? unit * 2.3 : unit; // the prints are bigger on a phone
            /* where he looks: pointer, arrows, or his own slow glance */
            let target = 0;
            const pointerOn = t - s.pActive < 2.6 && s.pActive > 0;
            if (t - s.keyAt < 4)
                target = s.keyTurn;
            else if (pointerOn) {
                const man = manRef.current;
                const r = man ? man.getBoundingClientRect() : null;
                const box = el.getBoundingClientRect();
                const cx = r ? r.left - box.left + r.width * FACE_X : W / 2;
                const raw = clamp((s.px - cx) / (W * (phone ? 0.36 : 0.26)), -1, 1);
                // snap to the nearest photographed angle, with a little hysteresis
                const cur = KEYS[s.key];
                if (Math.abs(raw - cur) > 0.25 + 0.06) {
                    let best = 0;
                    for (let i = 1; i < KEYS.length; i++)
                        if (Math.abs(KEYS[i] - raw) < Math.abs(KEYS[best] - raw))
                            best = i;
                    s.key = best;
                }
                target = KEYS[s.key];
            }
            else if (!s.reduced) {
                let span = 0;
                for (const g of GLANCE)
                    span += g[1] + MOVE;
                let u = (t + 0.4) % span;
                let i = 0;
                while (u > GLANCE[i][1] + MOVE) {
                    u -= GLANCE[i][1] + MOVE;
                    i++;
                }
                target = GLANCE[i][0];
            }
            if (!pointerOn)
                s.key = KEYS.indexOf(target) >= 0 ? KEYS.indexOf(target) : 2;
            // critically damped: eases in and out like a neck, never overshoots
            const k = pointerOn || t - s.keyAt < 4 ? 30 : 17;
            const acc = (target - s.angle) * k - 2 * Math.sqrt(k) * s.vel;
            s.vel += acc * dt;
            s.angle += s.vel * dt;
            const a = clamp(s.angle, -1, 1);
            const f = ((a + 1) / 2) * (FRAMES - 1);
            const i0 = Math.floor(f);
            const i1 = Math.min(FRAMES - 1, i0 + 1);
            const fr = f - i0;
            if (i0 !== shownA) {
                place(headA.current, i0);
                shownA = i0;
            }
            if (i1 !== shownB) {
                place(headB.current, i1);
                shownB = i1;
            }
            const ob = Math.round(fr * 100) / 100;
            if (ob !== opB && headB.current) {
                headB.current.style.opacity = String(ob);
                if (exact && headA.current)
                    headA.current.style.opacity = String(1 - ob);
                opB = ob;
            }
            /* the dolly: slow on its own, more under the pointer */
            const amb = s.reduced ? 0 : Math.sin((t / 15) * Math.PI * 2);
            const ambY = s.reduced ? 0 : Math.sin((t / 11) * Math.PI * 2 + 1.1);
            const tx = pointerOn ? clamp((s.px / W) * 2 - 1, -1, 1) : 0;
            const ty = pointerOn ? clamp((s.py / (el.clientHeight || 810)) * 2 - 1, -1, 1) : 0;
            const kc = 1 - Math.exp(-dt * 3);
            s.cam += (amb * 0.75 + tx * 0.9 - s.cam) * kc;
            s.camY += (ambY * 0.5 + ty * 0.7 - s.camY) * kc;
            const cx = s.cam * unit;
            const cy = s.camY * unit;
            if (typeRef.current)
                typeRef.current.style.transform = `translate3d(${(cx * 9).toFixed(2)}px, ${(cy * 4).toFixed(2)}px, 0)`;
            if (manRef.current)
                manRef.current.style.transform = `translate3d(${(-cx * 10).toFixed(2)}px, ${(-cy * 5).toFixed(2)}px, 0)`;
            if (shadowRef.current)
                shadowRef.current.style.transform = `translate3d(${(-cx * 3 + 34 * unit).toFixed(2)}px, ${(-cy * 1 + 16 * unit).toFixed(2)}px, 0)`;
            if (deckRef.current)
                deckRef.current.style.transform = `translate3d(${(-cx * 26).toFixed(2)}px, ${(-cy * 12).toFixed(2)}px, 0)`;
            /* prints */
            if (!s.reduced && s.hover < 0 && s.shuffleAt < 0 && t >= s.nextShuffle) {
                shuffleTo(null);
            }
            let p = 1;
            if (s.shuffleAt >= 0) {
                p = clamp((t - s.shuffleAt) / SHUFFLE_TIME, 0, 1);
                if (p >= 1) {
                    s.shuffleAt = -1;
                    s.flyer = -1;
                    s.nextShuffle = t + SHUFFLE_EVERY - SHUFFLE_TIME;
                }
            }
            const e = ease(p);
            for (let i = 0; i < 4; i++) {
                const c = cards.current[i];
                if (!c)
                    continue;
                const to = s.order.indexOf(i);
                const fromSlot = s.shuffleAt >= 0 ? s.from[i] : to;
                const A = SLOTS[fromSlot];
                const B = SLOTS[to];
                let x = A.x + (B.x - A.x) * e;
                let y = A.y + (B.y - A.y) * e;
                let r = A.r + (B.r - A.r) * e;
                let z = 10 - to;
                if (s.shuffleAt >= 0) {
                    const arc = Math.sin(Math.PI * e);
                    if (i === s.flyer && to > fromSlot) {
                        // leaves the top: lifts clear, swings right, slides in at the back
                        y -= arc * 168;
                        x += arc * 70;
                        r += arc * 7;
                        z = e < 0.5 ? 20 : 1;
                    }
                    else if (i === s.flyer) {
                        // comes up from the back: rises clear, then lands on top
                        y -= arc * 168;
                        x -= arc * 40;
                        r -= arc * 5;
                        z = e < 0.5 ? 1 : 20;
                    }
                    else
                        z = 10 - (e < 0.5 ? fromSlot : to);
                }
                const want = s.hover === i && s.shuffleAt < 0 ? 1 : 0;
                s.lift[i] += (want - s.lift[i]) * (1 - Math.exp(-dt * 14));
                const L = s.lift[i];
                y -= L * 16;
                r *= 1 - L * 0.5;
                const sc = 1 + L * 0.06;
                c.style.transform = `translate3d(${(x * pu).toFixed(2)}px, ${(y * pu).toFixed(2)}px, 0) rotate(${r.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
                c.style.zIndex = String(L > 0.05 ? 30 : z);
                c.style.setProperty("--leo-lift", L.toFixed(3));
            }
            raf = visible && !document.hidden ? requestAnimationFrame(step) : 0;
        };
        const start = () => {
            if (!raf && visible && !document.hidden) {
                last = performance.now();
                raf = requestAnimationFrame(step);
            }
        };
        const io = new IntersectionObserver(([en]) => {
            visible = en.isIntersecting;
            if (visible)
                start();
            else if (raf) {
                cancelAnimationFrame(raf);
                raf = 0;
            }
        });
        io.observe(el);
        const onVis = () => {
            if (!document.hidden)
                start();
        };
        document.addEventListener("visibilitychange", onVis);
        const onMove = (ev) => {
            const b = el.getBoundingClientRect();
            s.px = ev.clientX - b.left;
            s.py = ev.clientY - b.top;
            s.pActive = clock.current || 0.001;
        };
        const onLeave = () => {
            s.pActive = 0;
        };
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        start();
        const id = window.setTimeout(() => setReady(true), 30);
        return () => {
            cancelAnimationFrame(raf);
            io.disconnect();
            document.removeEventListener("visibilitychange", onVis);
            el.removeEventListener("pointermove", onMove);
            el.removeEventListener("pointerleave", onLeave);
            mq.removeEventListener?.("change", onMq);
            window.clearTimeout(id);
        };
    }, [shuffleTo]);
    useEffect(() => () => {
        void audio.current?.close().catch(() => { });
    }, []);
    const pick = (i) => {
        if (shuffleTo(i))
            shutter();
        else if (st.current.order[0] === i)
            shutter();
    };
    const onManKey = (e) => {
        const s = st.current;
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
            s.keyTurn = clamp(s.keyTurn + (e.key === "ArrowLeft" ? -0.5 : 0.5), -1, 1);
            s.keyAt = clock.current;
            tick();
        }
        else if (e.key === "Home") {
            s.keyTurn = 0;
            s.keyAt = clock.current;
        }
    };
    const press = () => {
        tick();
        setBusy(true);
        onCta?.();
        // Demo only: the button resets after 1.8 s so the next visitor can press it.
        window.setTimeout(() => setBusy(false), 1800);
    };
    const vars = { "--leo-ink": ink, "--leo-ground": ground };
    const sprite = (src) => ({ backgroundImage: `url("${src}")`, backgroundSize: `${COLS * 100}% ${ROWS * 100}%` });
    const centre = Math.floor(FRAMES / 2);
    const centrePos = `${((centre % COLS) / (COLS - 1)) * 100}% ${(Math.floor(centre / COLS) / Math.max(1, ROWS - 1)) * 100}%`;
    const headBox = { left: `${HEAD.x * 100}%`, top: `${HEAD.y * 100}%`, width: `${HEAD.w * 100}%`, height: `${HEAD.h * 100}%` };
    return (<section ref={root} className={`leo-root${ready ? " leo-in" : ""}`} style={vars} aria-label={`${fullName}, film photographer`}>
      <style>{css}</style>
      <div className="leo-wall" aria-hidden="true"/>

      <nav className="leo-nav">
        <span className="leo-logo">{fullName}</span>
        <div className="leo-links">
          <a href="#work">Work</a>
          <a href="#prints">Prints</a>
          <a href="#workshops">Workshops</a>
        </div>
        <button type="button" className="leo-cta" onClick={press} aria-live="polite">
          {busy ? "Thanks, I'll write back" : cta}
        </button>
      </nav>

      <div className="leo-type" ref={typeRef}>
        <h1 className="leo-h1">
          <span className="leo-w leo-w1">
            <span>HI,</span>
          </span>{" "}
          <span className="leo-w leo-w2">
            <span>I&rsquo;M</span>
          </span>{" "}
          <span className="leo-w leo-w3">
            <span>{name.toUpperCase()}</span>
          </span>
        </h1>
      </div>

      <div className="leo-figure leo-shadowbox" ref={shadowRef} aria-hidden="true">
        <img className="leo-body" src={body} alt="" draggable={false}/>
        <div className="leo-head" style={{ ...headBox, ...sprite(heads), backgroundPosition: centrePos }}/>
      </div>

      <div className="leo-figure leo-man" ref={manRef} tabIndex={0} role="img" aria-label={`${fullName} holding a 35 mm camera. He turns his head toward the pointer; use the left and right arrow keys to turn it.`} onKeyDown={onManKey}>
        <img className="leo-body" src={body} alt="" draggable={false}/>
        <div className="leo-heads" style={headBox}>
          <div className="leo-head leo-head-a" ref={headA} style={{ ...sprite(heads), backgroundPosition: centrePos }}/>
          <div className="leo-head leo-head-b" ref={headB} style={{ ...sprite(heads), backgroundPosition: centrePos, opacity: 0 }}/>
        </div>
      </div>

      <p className="leo-line">{line}</p>

      <div className="leo-deck" ref={deckRef} id="prints" aria-label="Prints">
        {[0, 1, 2, 3].map((i) => (<button key={i} type="button" className="leo-print" ref={(n) => {
                cards.current[i] = n;
            }} style={{ backgroundImage: `url("${prints}")`, backgroundPosition: `${(i % 2) * 100}% ${Math.floor(i / 2) * 100}%` }} aria-label={`Print: ${PRINT_ALT[i]}. Bring to the top.`} onPointerEnter={() => (st.current.hover = i)} onPointerLeave={() => (st.current.hover = st.current.hover === i ? -1 : st.current.hover)} onFocus={() => (st.current.hover = i)} onBlur={() => (st.current.hover = -1)} onClick={() => pick(i)}/>))}
      </div>

      <span className="leo-roll" aria-live="off">
        ROLL {roll} · FRAME {String(frame).padStart(2, "0")}
      </span>
    </section>);
}
const css = `
@import url("https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap");

.leo-root {
  container-type: inline-size;
  position: relative;
  overflow: hidden;
  isolation: isolate;
  width: 100%;
  height: var(--design-h, 100svh);
  min-height: 640px;
  background: var(--leo-ground);
  color: #111;
  font-family: "Inter Tight", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
.leo-wall {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(60% 70% at 30% 20%, rgba(255, 255, 255, 0.7), transparent 70%),
    radial-gradient(80% 60% at 80% 110%, rgba(0, 0, 0, 0.06), transparent 70%);
}
.leo-wall::after {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.1;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>");
}

/* nav */
.leo-nav {
  position: absolute;
  z-index: 40;
  left: 3.05cqi;
  right: 3.05cqi;
  top: 30px;
  display: flex;
  align-items: center;
  gap: 30px;
  font-size: 14px;
  font-weight: 500;
}
.leo-logo { font-weight: 600; font-size: 18px; letter-spacing: -0.01em; margin-right: auto; }
.leo-links { display: flex; gap: 28px; }
.leo-links a { color: inherit; text-decoration: none; opacity: 0.8; border-radius: 4px; }
.leo-links a:hover { opacity: 1; }
.leo-cta {
  font: inherit;
  font-size: 13.5px;
  padding: 10px 18px;
  border: 0;
  border-radius: 999px;
  background: #111;
  color: #fff;
  cursor: pointer;
  transition: transform 0.18s cubic-bezier(0.3, 1.4, 0.5, 1), background 0.2s;
}
.leo-cta:hover { background: #2a2a2a; }
.leo-cta:active { transform: scale(0.97); }
.leo-root :focus-visible { outline: 2px solid var(--leo-ink); outline-offset: 3px; }

/* plane 1: the name */
.leo-type {
  position: absolute;
  z-index: 2;
  left: 0;
  right: 0;
  top: 14.8%;
  will-change: transform;
  pointer-events: none;
}
.leo-h1 {
  margin: 0;
  text-align: center;
  font-family: "Archivo", "Arial Narrow", sans-serif;
  font-weight: 900;
  font-stretch: 62%;
  font-variation-settings: "wdth" 62;
  font-size: 20.83cqi;
  line-height: 0.82;
  letter-spacing: -0.01em;
  color: var(--leo-ink);
  white-space: nowrap;
}
.leo-w { display: inline-block; overflow: hidden; vertical-align: top; padding-bottom: 0.04em; }
.leo-w > span { display: inline-block; transform: translateY(105%); }
.leo-in .leo-w > span { transform: none; transition: transform 1s cubic-bezier(0.2, 0.8, 0.2, 1); }
.leo-in .leo-w2 > span { transition-delay: 0.08s; }
.leo-in .leo-w3 > span { transition-delay: 0.16s; }

/* plane 2: Leo (and his shadow on the wall) */
.leo-figure {
  position: absolute;
  bottom: -4.94%;
  left: 46.08cqi;
  height: 86.42%;
  aspect-ratio: 2 / 3;
  translate: -50% 0;
  will-change: transform;
}
.leo-man { z-index: 5; outline: none; opacity: 0; scale: 1.025; transition: opacity 0.9s ease-out, scale 1.2s cubic-bezier(0.2, 0.8, 0.2, 1); }
.leo-in .leo-man { opacity: 1; scale: 1; }
.leo-man:focus-visible::after {
  content: "";
  position: absolute;
  left: 22%;
  right: 22%;
  bottom: 12%;
  height: 2px;
  background: var(--leo-ink);
}
.leo-shadowbox {
  z-index: 3;
  filter: brightness(0) blur(12px);
  opacity: 0;
  transition: opacity 1.2s ease-out 0.2s;
  pointer-events: none;
}
.leo-in .leo-shadowbox { opacity: 0.22; }
.leo-body { position: absolute; inset: 0; width: 100%; height: 100%; display: block; user-select: none; -webkit-user-drag: none; }
.leo-head { position: absolute; background-repeat: no-repeat; pointer-events: none; }
/* the turning head: two neighbouring frames, added together inside their own group */
.leo-heads { position: absolute; isolation: isolate; pointer-events: none; }
.leo-heads .leo-head { inset: 0; }
@supports (mix-blend-mode: plus-lighter) { .leo-head-b { mix-blend-mode: plus-lighter; } }

/* the line */
.leo-line {
  position: absolute;
  z-index: 8;
  left: 3.9cqi;
  bottom: 56px;
  max-width: 330px;
  margin: 0;
  font-size: 16px;
  line-height: 1.45;
  letter-spacing: -0.005em;
  opacity: 0;
  transition: opacity 0.8s ease-out 0.5s;
}
.leo-in .leo-line { opacity: 1; }

/* plane 3: the prints */
.leo-deck {
  position: absolute;
  z-index: 10;
  right: 4.86cqi;
  bottom: 9.9%;
  width: calc(var(--leo-pw) + 172 / 1440 * 100cqi);
  height: calc(var(--leo-ph) + 64 / 1440 * 100cqi);
  --leo-pw: 13.2cqi;
  --leo-ph: 9.03cqi;
  will-change: transform;
  opacity: 0;
  transition: opacity 0.7s ease-out 0.7s;
}
.leo-in .leo-deck { opacity: 1; }
.leo-print {
  position: absolute;
  left: 0;
  top: 0;
  width: var(--leo-pw);
  height: var(--leo-ph);
  padding: 0;
  border: 0.42cqi solid #fff;
  border-radius: 1px;
  background-color: #ddd;
  background-size: 200% 200%;
  background-repeat: no-repeat;
  background-origin: content-box;
  background-clip: content-box;
  cursor: pointer;
  --leo-lift: 0;
  box-shadow:
    0 1px 1px rgba(0, 0, 0, 0.08),
    0 calc(10px + 14px * var(--leo-lift)) calc(22px + 18px * var(--leo-lift)) rgba(0, 0, 0, calc(0.16 + 0.08 * var(--leo-lift)));
  transform-origin: 50% 60%;
}

.leo-roll {
  position: absolute;
  z-index: 12;
  right: 4.17cqi;
  bottom: 40px;
  font-family: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 12px;
  letter-spacing: 0.1em;
  font-variant-numeric: tabular-nums;
}

/* 1440×900 and taller: a touch more air under the name */
@container (min-width: 641px) and (max-width: 1100px) {
  .leo-links { gap: 20px; }
  .leo-line { max-width: 280px; font-size: 15px; }
}

/* phone: the name stacks, Leo stands centred in front of it */
@container (max-width: 640px) {
  .leo-nav { top: 18px; left: 20px; right: 20px; gap: 12px; }
  .leo-logo { font-size: 16px; }
  .leo-links { display: none; }
  .leo-cta { padding: 9px 15px; font-size: 13px; }
  .leo-type { top: 108px; }
  .leo-h1 { white-space: normal; line-height: 0.8; }
  .leo-w1, .leo-w2 { font-size: 34cqi; }
  .leo-w3 { display: block; font-size: 66cqi; line-height: 0.8; margin-top: 0.02em; }
  .leo-figure { left: 44cqi; height: 66%; bottom: -4%; }
  .leo-line { left: 20px; right: 20px; top: 66px; bottom: auto; max-width: none; font-size: 13.5px; line-height: 1.4; }
  .leo-deck { right: -6px; bottom: 2.4%; --leo-pw: 27cqi; --leo-ph: 18.5cqi; width: calc(var(--leo-pw) + 172 / 1440 * 230cqi); height: calc(var(--leo-ph) + 64 / 1440 * 230cqi); }
  .leo-print { border-width: 1.1cqi; }
  .leo-roll { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .leo-w > span, .leo-man, .leo-shadowbox, .leo-line, .leo-deck { transition: none !important; }
  .leo-w > span { transform: none; }
  .leo-man, .leo-line, .leo-deck { opacity: 1; scale: 1; }
  .leo-shadowbox { opacity: 0.22; }
}
`;
