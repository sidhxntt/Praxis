"use client";
/**
 * FARSIGHT · website hero
 *
 * The first screen of a magazine of places photographed from very far away.
 * On a black page, under a thin serif headline, seven tall photographs stand
 * on a ring in real 3D: the one in the middle faces you, its neighbours turn
 * away in perspective and the outer two are slivers. The pictures are the
 * light of the page: each one spills its own colour onto the floor under it,
 * is mirrored there, and the one in the middle lights the room behind it.
 *
 * The ring never stops. It glides so every picture takes the middle in turn
 * (slow as it arrives, quick between two), the one arriving opens a little
 * wider, its caption rises, its photograph slides inside its frame like a
 * view through a window, and a band of light crosses each card as it turns.
 * The counter in the corner rolls with it.
 *
 * The pointer leans the whole ring and tilts the middle card. Drag the row to
 * spin it (throw it and it carries on), click a side card to bring it in, or
 * use the arrow keys. After a touch the ring waits six seconds, then goes on.
 *
 * One file, React only. The typefaces come from Google Fonts (loaded in the CSS).
 *
 *   <Farsight />
 *   <Farsight pace={1.4} glow={1.2} onOpen={(place) => router.push(`/places/${place.slug}`)} />
 *
 * Props
 *   brand    the wordmark                                        "Farsight"
 *   cta      the button in the nav                               "Subscribe"
 *   places   the pictures: { slug, src, title: [line, line], hue }  seven aerial photographs
 *   pace     how fast the ring travels (1 = a picture every 2.2 s)  1
 *   glow     how much light the pictures throw (0.4 to 1.6)       1
 *   turn     how far the side cards turn away (0.7 to 1.2)        1
 *   sound    a tiny tick as a picture passes under your hand       true
 *   onCta    called when the nav button is pressed
 *   onOpen   called with the place when the middle card is pressed
 *
 * Fills its container's width; height is var(--design-h, 100svh), never under
 * 640px. Everything is sized from one unit that follows the smaller of the
 * width and the height, so it holds from a phone to a cinema screen. On a
 * phone (container under 640px) the headline stacks above one card and two
 * slivers. The ring pauses off screen and in a hidden tab. Reduced motion: no
 * travel and no drift; drag, click and keys still move it, at once.
 * Keyboard: Tab to the row, Left/Right step, Home/End jump, Enter opens.
 * Sound: silent until the visitor interacts, when `sound` is false, and when
 * <html data-cd-mute="1">. The AudioContext is created on the first tick.
 */
import { useCallback, useEffect, useRef } from "react";
const DIR = "/design/websites/farsight/";
const PLACES = [
    { slug: "delta", src: DIR + "delta.webp", title: ["River deltas that", "look like lungs"], hue: "#35bfb0" },
    { slug: "salt", src: DIR + "salt.webp", title: ["Salt pans, sorted", "by colour"], hue: "#ff4d7d" },
    { slug: "glacier", src: DIR + "glacier.webp", title: ["A glacier, one day", "from the sea"], hue: "#6fc9f0" },
    { slug: "dunes", src: DIR + "dunes.webp", title: ["Sand seas and", "their slow waves"], hue: "#ff7a1f" },
    { slug: "reef", src: DIR + "reef.webp", title: ["Reefs drawn", "in turquoise"], hue: "#12c8c4" },
    { slug: "fields", src: DIR + "fields.webp", title: ["Fields,", "as a quilt"], hue: "#d6d21f" },
    { slug: "city", src: DIR + "city.webp", title: ["Cities", "at 3 a.m."], hue: "#ffb14a" },
];
/* Where a card stands, by its distance from the middle (0, 1, 2, 3 cards away).
   Units: x and z in the layout unit (see --fsg-u), turn in degrees. */
const XT = [0, 27, 49, 59];
const ZT = [0, -5, -17, -30];
const RT = [0, 28, 48, 64];
const OT = [1, 1, 0.92, 0]; // how visible
const DT = [0, 0.14, 0.34, 0.66]; // how much shade lies on it
const PERSP = 112; // the camera's distance, in units
const STEP = 2.2; // seconds a picture, at pace 1
const SLOW = 0.8; // how much the ring slows as a picture arrives (0 = steady, 1 = it would stop)
const WAIT = 6; // seconds the ring waits after a touch
const lerpT = (t, a) => {
    const i = Math.min(t.length - 2, Math.floor(a));
    const f = Math.min(1, a - i);
    return t[i] + (t[i + 1] - t[i]) * f;
};
const r2 = (n) => Math.round(n * 100) / 100;
const r3 = (n) => Math.round(n * 1000) / 1000;
/* One card's whole look for a ring position. Strings only, so the server and the browser agree. */
function pose(i, n, pos, t, px, py, hov, turn, glow) {
    let d = (((i - pos) % n) + n) % n;
    if (d > n / 2)
        d -= n;
    const a = Math.min(3, Math.abs(d));
    const s = d < 0 ? -1 : 1;
    const w0 = Math.max(0, 1 - a);
    const w = w0 * w0 * (3 - 2 * w0); // 1 in the middle, 0 a card away
    const x = s * lerpT(XT, a);
    const z = lerpT(ZT, a);
    const ry = s * lerpT(RT, a) * turn + px * 7 * w * hov;
    const rx = -py * 5 * w * hov;
    const op = lerpT(OT, a);
    const sx = 0.9 + 0.1 * w; // the middle card opens wider
    const k = PERSP / (PERSP - z); // how big it is drawn at that depth
    const ph = i * 1.7;
    const ix = -d * 5.2 + Math.sin(t * 0.21 + ph) * 1.6; // the photograph slides inside its frame
    const iy = Math.cos(t * 0.17 + ph) * 2.2 - w * 1.2;
    const is = 1.16 + 0.07 * w + Math.sin(t * 0.13 + ph) * 0.015;
    return {
        card: `translateX(calc(var(--fsg-u) * var(--fsg-kx) * ${r2(x)})) translateZ(calc(var(--fsg-u) * ${r2(z)})) rotateY(calc(var(--fsg-kr) * ${r2(ry)}deg)) rotateX(${r2(rx)}deg) scale(${r3(1 + 0.035 * w)})`,
        op: r3(op),
        face: `scaleX(${r3(sx)})`,
        img: `scaleX(${r3(1 / sx)}) translate3d(${r2(ix)}%, ${r2(iy)}%, 0) scale(${r3(is)})`,
        shade: r3(lerpT(DT, a)),
        cap: `scaleX(${r3(1 / sx)}) translateY(calc(var(--fsg-u) * ${r2((1 - w) * 0.9)}))`,
        capOp: r3(0.62 + 0.38 * w),
        sheen: `translateX(${r2(-d * 150 + px * 26 * hov)}%)`,
        sheenOp: r3(Math.max(0, 1 - Math.abs(d * 1.5)) * 0.6 + 0.14 * w * hov),
        pool: `translateX(calc(var(--fsg-u) * var(--fsg-kx) * ${r2(x * k)})) scale(${r3(k * (0.5 + 0.5 * Math.cos((Math.min(80, Math.abs(ry)) * Math.PI) / 180)) * (1 + 0.25 * w))}, ${r3(k)})`,
        poolOp: r3(Math.min(1, op * (0.5 + 0.5 * w) * glow)),
        room: r3(Math.min(1, w * 0.95 * glow)),
        front: w > 0.5,
    };
}
/* Sound: one tiny tick, made in the browser. Silent when `sound` is false, when
   <html data-cd-mute="1">, and until the visitor has interacted. */
function useTick(on) {
    const ctx = useRef(null);
    useEffect(() => () => void ctx.current?.close().catch(() => { }), []);
    return useCallback((high = false) => {
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
            const o = a.createOscillator();
            const g = a.createGain();
            o.type = "triangle";
            o.frequency.setValueAtTime(high ? 1320 : 880, t);
            o.frequency.exponentialRampToValueAtTime(high ? 1760 : 620, t + 0.05);
            g.gain.setValueAtTime(0.0001, t);
            g.gain.exponentialRampToValueAtTime(0.035, t + 0.004);
            g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
            o.connect(g).connect(a.destination);
            o.start(t);
            o.stop(t + 0.08);
        }
        catch {
            /* no sound is fine */
        }
    }, [on]);
}
export default function Farsight({ brand = "Farsight", cta = "Subscribe", places = PLACES, pace = 1, glow = 1, turn = 1, sound = true, onCta, onOpen }) {
    const n = places.length;
    const root = useRef(null);
    const ruler = useRef(null);
    const roll = useRef(null);
    const live = useRef(null);
    const ring = useRef(null);
    const head = useRef(null);
    const cards = useRef([]);
    const pools = useRef([]);
    const rooms = useRef([]);
    const tick = useTick(sound);
    /* Everything that moves lives here, outside React: the loop writes styles straight to the elements. */
    const st = useRef({ pos: 0, goal: null, t: 0, px: 0, py: 0, tx: 0, ty: 0, hov: 0, hovT: 0, touched: -1e9, drag: false, lastX: 0, lastT: 0, v: 0, downX: 0, downI: -1, moved: false, front: 0, still: false });
    const conf = useRef({ pace, glow, turn, n });
    conf.current = { pace, glow, turn, n };
    const cb = useRef({ onOpen, places });
    cb.current = { onOpen, places };
    const paint = useCallback(() => {
        const s = st.current;
        const c = conf.current;
        for (let i = 0; i < c.n; i++) {
            const el = cards.current[i];
            if (!el)
                continue;
            const p = pose(i, c.n, s.pos, s.t, s.px, s.py, s.hov, c.turn, c.glow);
            el.style.transform = p.card;
            el.style.opacity = String(p.op);
            el.style.pointerEvents = p.op < 0.3 ? "none" : "";
            const k = el.children;
            // children: halo, face, mirror
            k[0].style.transform = p.face;
            k[1].style.transform = p.face;
            k[2].style.transform = p.face;
            const f = k[1].children; // img, shade, sheen, caption
            f[0].style.transform = p.img;
            f[1].style.opacity = String(p.shade);
            f[2].style.transform = p.sheen;
            f[2].style.opacity = String(p.sheenOp);
            f[3].style.transform = p.cap;
            f[3].style.opacity = String(p.capOp);
            k[2].firstElementChild.style.transform = p.img;
            const pool = pools.current[i];
            if (pool) {
                pool.style.transform = p.pool;
                pool.style.opacity = String(p.poolOp);
            }
            const room = rooms.current[i];
            if (room)
                room.style.opacity = String(p.room);
        }
        if (roll.current)
            roll.current.style.transform = `translateY(${r3(-((((s.pos % c.n) + c.n) % c.n) / (c.n + 1)) * 100)}%)`;
        if (ring.current)
            ring.current.style.transform = `rotateY(${r2(s.px * 3.2 + Math.sin(s.t * 0.31) * 0.9)}deg) rotateX(${r2(-s.py * 1.6)}deg)`;
        if (head.current)
            head.current.style.transform = `translate3d(calc(var(--fsg-u) * ${r2(-s.px * 0.5)}), calc(var(--fsg-u) * ${r2(-s.py * 0.3)}), 0)`;
        const front = ((Math.round(s.pos) % c.n) + c.n) % c.n;
        if (front !== s.front) {
            s.front = front;
            // the keyboard's place follows the picture in the middle
            const held = cards.current.some((el) => el !== null && el === document.activeElement);
            cards.current.forEach((el, i) => {
                if (!el)
                    return;
                el.tabIndex = i === front ? 0 : -1;
                el.setAttribute("aria-current", i === front ? "true" : "false");
            });
            if (held)
                cards.current[front]?.focus({ preventScroll: true });
            const pl = cb.current.places[front];
            if (live.current && pl)
                live.current.textContent = `${front + 1} of ${c.n}: ${pl.title.join(" ")}`;
            return true;
        }
        return false;
    }, []);
    useEffect(() => {
        const el = root.current;
        if (!el)
            return;
        const s = st.current;
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        s.still = mq.matches;
        const onMq = () => {
            s.still = mq.matches;
        };
        mq.addEventListener("change", onMq);
        let raf = 0;
        let seen = true;
        let last = performance.now();
        const loop = (now) => {
            raf = 0;
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            const c = conf.current;
            if (!s.still)
                s.t += dt;
            // the pointer, eased
            const e = 1 - Math.exp(-dt * 6);
            s.px += (s.tx - s.px) * e;
            s.py += (s.ty - s.py) * e;
            s.hov += (s.hovT - s.hov) * e;
            const quiet = now / 1000 - s.touched;
            if (s.drag) {
                /* in the hand: the pointer handler moves pos */
            }
            else if (s.goal !== null) {
                if (s.still)
                    s.pos = s.goal;
                else
                    s.pos += (s.goal - s.pos) * (1 - Math.exp(-dt * 6.5));
                if (Math.abs(s.goal - s.pos) < 0.002) {
                    s.pos = s.goal;
                    s.goal = null;
                }
            }
            else if (!s.still && quiet > WAIT) {
                // travelling by itself: slow as a picture arrives, quick between two, never still
                const ramp = Math.min(1, (quiet - WAIT) / 1.2);
                const period = 1 / Math.sqrt(1 - SLOW * SLOW);
                const v = ((1 - SLOW * Math.cos(2 * Math.PI * s.pos)) * period) / (STEP / Math.max(0.2, c.pace));
                s.pos += v * dt * ramp;
            }
            const changed = paint();
            if (changed && quiet < WAIT)
                tick();
            if (seen && document.visibilityState === "visible")
                raf = requestAnimationFrame(loop);
        };
        const start = () => {
            if (!raf && seen && document.visibilityState === "visible") {
                last = performance.now();
                raf = requestAnimationFrame(loop);
            }
        };
        const io = new IntersectionObserver(([x]) => {
            seen = x.isIntersecting;
            start();
        });
        io.observe(el);
        document.addEventListener("visibilitychange", start);
        start();
        return () => {
            cancelAnimationFrame(raf);
            io.disconnect();
            document.removeEventListener("visibilitychange", start);
            mq.removeEventListener("change", onMq);
        };
    }, [paint, tick]);
    const touch = () => {
        st.current.touched = performance.now() / 1000;
    };
    /* one card's width on screen, in pointer pixels (the stage may be shown scaled) */
    const cardPx = () => Math.max(40, ruler.current?.getBoundingClientRect().width ?? 320);
    const onMove = (e) => {
        const s = st.current;
        const r = e.currentTarget.getBoundingClientRect();
        s.tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
        s.ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
        s.hovT = e.pointerType === "mouse" ? 1 : 0;
    };
    const onLeave = () => {
        const s = st.current;
        s.tx = 0;
        s.ty = 0;
        s.hovT = 0;
    };
    const down = (e) => {
        if (e.button !== 0)
            return;
        const s = st.current;
        const hit = e.target.closest("[data-fsg-i]");
        s.drag = true;
        s.moved = false;
        s.goal = null;
        s.v = 0;
        s.downX = s.lastX = e.clientX;
        s.lastT = performance.now();
        s.downI = hit ? Number(hit.dataset.fsgI) : -1;
        touch();
        try {
            e.currentTarget.setPointerCapture(e.pointerId);
        }
        catch {
            /* fine */
        }
    };
    const move = (e) => {
        const s = st.current;
        if (!s.drag)
            return;
        const dx = e.clientX - s.lastX;
        if (Math.abs(e.clientX - s.downX) > 6)
            s.moved = true;
        if (!s.moved)
            return;
        const now = performance.now();
        const dp = -dx / cardPx();
        s.pos += dp;
        const dtt = Math.max(1, now - s.lastT) / 1000;
        s.v = s.v * 0.6 + (dp / dtt) * 0.4;
        s.lastX = e.clientX;
        s.lastT = now;
        touch();
    };
    const up = (e) => {
        const s = st.current;
        if (!s.drag)
            return;
        s.drag = false;
        try {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }
        catch {
            /* fine */
        }
        touch();
        if (s.moved) {
            // thrown: it carries on for a moment, then comes to rest on a picture
            const stale = performance.now() - s.lastT > 90 ? 0 : s.v;
            s.goal = Math.round(s.pos + Math.max(-3, Math.min(3, stale * 0.28)));
        }
        else if (s.downI >= 0) {
            bring(s.downI);
        }
    };
    const bring = (i) => {
        const s = st.current;
        const c = conf.current;
        const base = Math.round(s.pos);
        let d = (((i - base) % c.n) + c.n) % c.n;
        if (d > c.n / 2)
            d -= c.n;
        touch();
        if (d === 0) {
            s.goal = base;
            tick(true);
            const pl = cb.current.places[i];
            if (pl)
                cb.current.onOpen?.(pl);
            // a nod, so the press is seen: the middle card dips and comes back
            const el = cards.current[i]?.children[1];
            if (el && !s.still) {
                el.classList.remove("fsg-nod");
                void el.offsetWidth;
                el.classList.add("fsg-nod");
            }
        }
        else {
            s.goal = base + d;
        }
    };
    const onKey = (e) => {
        const s = st.current;
        const c = conf.current;
        const base = s.goal ?? Math.round(s.pos);
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault();
            s.goal = base + (e.key === "ArrowRight" ? 1 : -1);
            touch();
        }
        else if (e.key === "Home" || e.key === "End") {
            e.preventDefault();
            const cur = ((base % c.n) + c.n) % c.n;
            s.goal = base - cur + (e.key === "Home" ? 0 : c.n - 1);
            touch();
        }
    };
    /* a keyboard press on a card (Enter/Space on a button arrives as a click with no pointer) */
    const onCardClick = (i) => (e) => {
        if (e.detail === 0)
            bring(i);
    };
    const vars = { "--fsg-glow": String(glow) };
    const first = places.map((_, i) => pose(i, n, 0, 0, 0, 0, 0, turn, glow));
    const pad = (k) => String(k).padStart(2, "0");
    return (<div ref={root} className="fsg-root" style={vars} onPointerMove={onMove} onPointerLeave={onLeave}>
      <style>{css}</style>
      <div className="fsg-stage">
        <nav className="fsg-nav" aria-label="Farsight">
          <a className="fsg-brand" href="#" onClick={(e) => e.preventDefault()}>
            {brand}
            <i aria-hidden/>
          </a>
          <div className="fsg-links">
            {["Issues", "Places", "Photographers", "About"].map((l) => (<a key={l} href="#" onClick={(e) => e.preventDefault()}>
                {l}
              </a>))}
            <button type="button" className="fsg-cta" onClick={() => onCta?.()}>
              {cta}
            </button>
          </div>
        </nav>

        <div className="fsg-comp">
          <span ref={ruler} className="fsg-ruler" aria-hidden/>
          <div className="fsg-rooms" aria-hidden>
            {places.map((p, i) => (<span key={p.slug} ref={(el) => void (rooms.current[i] = el)} style={{ "--fsg-hue": p.hue, opacity: first[i].room }}/>))}
          </div>

          <div ref={head} className="fsg-head">
            <h1 className="fsg-h1">
              <span>Seven places</span>
              <span>you can only see</span>
              <span>from far away</span>
            </h1>
          </div>

          <div className="fsg-floor" aria-hidden/>
          <div className="fsg-pools" aria-hidden>
            {places.map((p, i) => (<span key={p.slug} ref={(el) => void (pools.current[i] = el)} style={{ "--fsg-hue": p.hue, transform: first[i].pool, opacity: first[i].poolOp }}/>))}
          </div>

          <div className="fsg-row" role="group" aria-roledescription="carousel" aria-label="Seven places. Drag, or use the arrow keys, to turn the row" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onKeyDown={onKey}>
            <div ref={ring} className="fsg-ring">
              {places.map((p, i) => (<button key={p.slug} type="button" ref={(el) => void (cards.current[i] = el)} className="fsg-card" data-fsg-i={i} tabIndex={i === 0 ? 0 : -1} aria-current={i === 0 ? "true" : "false"} aria-label={`${p.title.join(" ")} (${i + 1} of ${n})`} style={{ "--fsg-hue": p.hue, transform: first[i].card, opacity: first[i].op }} onClick={onCardClick(i)}>
                  <span className="fsg-halo" style={{ transform: first[i].face }} aria-hidden/>
                  <span className="fsg-face" style={{ transform: first[i].face }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.src} alt="" draggable={false} style={{ transform: first[i].img }}/>
                    <span className="fsg-shade" style={{ opacity: first[i].shade }} aria-hidden/>
                    <span className="fsg-sheen" style={{ transform: first[i].sheen, opacity: first[i].sheenOp }} aria-hidden/>
                    <span className="fsg-cap" style={{ transform: first[i].cap, opacity: first[i].capOp }}>
                      <span>{p.title[0]}</span>
                      <span>{p.title[1]}</span>
                    </span>
                  </span>
                  <span className="fsg-mirror" style={{ transform: first[i].face }} aria-hidden>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.src} alt="" draggable={false} style={{ transform: first[i].img }}/>
                  </span>
                </button>))}
            </div>
          </div>

          <p className="fsg-note">
            <b>Issue 14</b> · Winter. A quarterly of places photographed from orbit, from aircraft and from very tall ladders.
          </p>
          <div className="fsg-count" aria-hidden>
            <span className="fsg-win">
              <span ref={roll} className="fsg-roll">
                {[...places.map((_, i) => i + 1), 1].map((k, i) => (<span key={i}>{pad(k)}</span>))}
              </span>
            </span>
            <i />
            <span>{pad(n)}</span>
            <em>Drag to turn</em>
          </div>
        </div>
      </div>
      <span ref={live} className="fsg-live" aria-live="polite"/>
    </div>);
}
const css = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400&family=Inter+Tight:wght@400;500;600&display=swap');
.fsg-root{container-type:inline-size;width:100%;height:var(--design-h,100svh);min-height:640px;position:relative;overflow:hidden;isolation:isolate;
  background:#000;color:#fff;font-family:"Inter Tight",ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased;
  --fsg-kx:1;--fsg-kr:1;--fsg-serif:"Fraunces","Cormorant Garamond","Iowan Old Style",Georgia,serif}
.fsg-root *,.fsg-root *::before,.fsg-root *::after{box-sizing:border-box}
/* one unit for everything: 1/100 of the width, or less when the screen is short (1440×900 gives 14.4px) */
.fsg-stage{position:absolute;inset:0;container-type:size;--fsg-u:min(1cqw,1.6cqh)}
.fsg-comp{position:absolute;left:50%;top:50%;width:calc(var(--fsg-u)*100);height:calc(var(--fsg-u)*62.5);transform:translate(-50%,-50%)}
.fsg-ruler{position:absolute;left:0;top:0;height:0;visibility:hidden;pointer-events:none;width:calc(var(--fsg-u)*var(--fsg-kx)*27)}
.fsg-live{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}

.fsg-nav{position:absolute;z-index:5;left:calc(var(--fsg-u)*4.1);right:calc(var(--fsg-u)*4.1);top:calc(var(--fsg-u)*2.9);display:flex;align-items:center;justify-content:space-between}
.fsg-brand{display:flex;align-items:center;gap:calc(var(--fsg-u)*.75);font-size:calc(var(--fsg-u)*1.16);font-weight:600;letter-spacing:-.015em;color:#fff;text-decoration:none}
.fsg-brand i{display:block;width:calc(var(--fsg-u)*1.9);height:max(1.5px,calc(var(--fsg-u)*.13));background:#fff;border-radius:2px}
.fsg-links{display:flex;align-items:center;gap:calc(var(--fsg-u)*2.5)}
.fsg-links a{font-size:calc(var(--fsg-u)*.98);font-weight:500;color:rgba(255,255,255,.86);text-decoration:none;transition:color .2s}
.fsg-links a:hover{color:#fff}
.fsg-cta{font:inherit;font-size:calc(var(--fsg-u)*.98);font-weight:600;color:#0a0a0a;background:#fff;border:0;border-radius:99px;padding:calc(var(--fsg-u)*.72) calc(var(--fsg-u)*1.35);cursor:pointer;transition:transform .2s cubic-bezier(.2,.8,.2,1),background .2s}
.fsg-cta:hover{transform:translateY(-1px)}
.fsg-cta:active{transform:scale(.96)}
.fsg-brand:focus-visible,.fsg-links a:focus-visible,.fsg-cta:focus-visible{outline:2px solid #fff;outline-offset:3px;border-radius:6px}
.fsg-cta:focus-visible{border-radius:99px}

/* the light the middle picture throws on the room behind it */
.fsg-rooms{position:absolute;inset:0;pointer-events:none}
.fsg-rooms span{position:absolute;left:50%;top:calc(var(--fsg-u)*41);width:calc(var(--fsg-u)*86);height:calc(var(--fsg-u)*56);margin:calc(var(--fsg-u)*-28) 0 0 calc(var(--fsg-u)*-43);
  background:radial-gradient(closest-side,color-mix(in srgb,var(--fsg-hue) 42%,transparent) 0,color-mix(in srgb,var(--fsg-hue) 17%,transparent) 42%,transparent 100%);will-change:opacity}

.fsg-head{position:absolute;left:0;right:0;top:calc(var(--fsg-u)*8.9);z-index:2;will-change:transform;pointer-events:none}
.fsg-h1{margin:0;font-family:var(--fsg-serif);font-weight:300;font-variation-settings:"opsz" 144;font-size:calc(var(--fsg-u)*3.72);line-height:1.085;letter-spacing:-.022em;text-align:center;color:#fff}
.fsg-h1 span{display:block;animation:fsg-rise .9s cubic-bezier(.2,.8,.2,1) both}
.fsg-h1 span:nth-child(2){animation-delay:.07s}
.fsg-h1 span:nth-child(3){animation-delay:.14s}
@keyframes fsg-rise{from{opacity:0;transform:translateY(calc(var(--fsg-u)*1.2))}to{opacity:1;transform:none}}

/* the floor: a faint sheen where the cards stand, and a pool of each picture's colour under it */
.fsg-floor{position:absolute;left:0;right:0;top:calc(var(--fsg-u)*56.2);height:calc(var(--fsg-u)*6.3);pointer-events:none;
  background:linear-gradient(180deg,rgba(255,255,255,.055),rgba(255,255,255,0) 70%);-webkit-mask-image:linear-gradient(90deg,transparent,#000 22%,#000 78%,transparent);mask-image:linear-gradient(90deg,transparent,#000 22%,#000 78%,transparent)}
.fsg-pools{position:absolute;left:50%;top:calc(var(--fsg-u)*56.6);width:0;height:0;pointer-events:none}
.fsg-pools span{position:absolute;left:calc(var(--fsg-u)*-17);top:calc(var(--fsg-u)*-4.6);width:calc(var(--fsg-u)*34);height:calc(var(--fsg-u)*9.2);will-change:transform,opacity;
  background:radial-gradient(closest-side,color-mix(in srgb,var(--fsg-hue) 70%,#fff 8%) 0,color-mix(in srgb,var(--fsg-hue) 38%,transparent) 34%,transparent 100%);mix-blend-mode:screen}

.fsg-row{position:absolute;left:0;right:0;top:calc(var(--fsg-u)*24.6);height:calc(var(--fsg-u)*37.9);z-index:3;perspective:calc(var(--fsg-u)*112);perspective-origin:50% 42%;touch-action:pan-y;cursor:grab;-webkit-user-select:none;user-select:none}
.fsg-row:active{cursor:grabbing}
.fsg-ring{position:absolute;left:50%;top:0;width:0;height:0;transform-style:preserve-3d;will-change:transform}
.fsg-card{position:absolute;left:calc(var(--fsg-u)*-11.6);top:calc(var(--fsg-u)*.9);width:calc(var(--fsg-u)*23.2);height:calc(var(--fsg-u)*31);padding:0;border:0;background:none;color:inherit;font:inherit;cursor:inherit;
  transform-style:preserve-3d;will-change:transform,opacity;-webkit-tap-highlight-color:transparent;outline:none}
.fsg-halo{position:absolute;inset:calc(var(--fsg-u)*-3.4);border-radius:calc(var(--fsg-u)*5);pointer-events:none;
  background:radial-gradient(closest-side,color-mix(in srgb,var(--fsg-hue) calc(36% * var(--fsg-glow)),transparent) 30%,transparent 100%);transform-origin:50% 50%}
.fsg-face{position:absolute;inset:0;display:block;overflow:hidden;border-radius:calc(var(--fsg-u)*1.55);background:#111;transform-origin:50% 50%;will-change:transform;
  box-shadow:0 0 0 1px rgba(255,255,255,.1) inset}
.fsg-face img,.fsg-mirror img{position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover;display:block;will-change:transform;-webkit-user-drag:none}
.fsg-face::after{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:inset 0 0 0 1px rgba(255,255,255,.16),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:none}
.fsg-shade{position:absolute;inset:0;background:#000;pointer-events:none}
.fsg-sheen{position:absolute;top:-10%;bottom:-10%;left:-20%;width:140%;pointer-events:none;mix-blend-mode:screen;
  background:linear-gradient(100deg,transparent 30%,rgba(255,255,255,.36) 46%,rgba(255,255,255,.62) 50%,rgba(255,255,255,.36) 54%,transparent 70%)}
.fsg-cap{position:absolute;left:0;right:0;bottom:0;padding:calc(var(--fsg-u)*5) calc(var(--fsg-u)*1.2) calc(var(--fsg-u)*1.7);text-align:center;transform-origin:50% 100%;
  font-family:var(--fsg-serif);font-weight:400;font-variation-settings:"opsz" 60;font-size:calc(var(--fsg-u)*1.5);line-height:1.08;letter-spacing:-.015em;color:#fff;
  background:linear-gradient(180deg,transparent,rgba(0,0,0,.34) 46%,rgba(0,0,0,.62));text-shadow:0 1px calc(var(--fsg-u)*.9) rgba(0,0,0,.45)}
.fsg-cap span{display:block;white-space:nowrap}
/* the mirror: the same picture, upside down under the card, fading into the floor */
.fsg-mirror{position:absolute;left:0;right:0;top:calc(100% + var(--fsg-u)*.42);height:100%;display:block;overflow:hidden;border-radius:calc(var(--fsg-u)*1.55);transform-origin:50% 50%;pointer-events:none;opacity:.5;scale:1 -1;
  -webkit-mask-image:linear-gradient(0deg,rgba(0,0,0,.62),rgba(0,0,0,.16) 9%,transparent 21%);mask-image:linear-gradient(0deg,rgba(0,0,0,.62),rgba(0,0,0,.16) 9%,transparent 21%)}
.fsg-card:focus-visible .fsg-face{box-shadow:0 0 0 2px #000,0 0 0 4px #fff}
.fsg-nod{animation:fsg-nod .5s cubic-bezier(.3,1.6,.5,1)}
@keyframes fsg-nod{0%{scale:1}35%{scale:.955}100%{scale:1}}

.fsg-note{position:absolute;z-index:4;left:calc(var(--fsg-u)*4.1);bottom:calc(var(--fsg-u)*2.5);margin:0;width:calc(var(--fsg-u)*21);font-size:calc(var(--fsg-u)*.92);line-height:1.38;font-weight:400;color:rgba(255,255,255,.56)}
.fsg-note b{font-weight:600;color:#fff}
.fsg-count{position:absolute;z-index:4;right:calc(var(--fsg-u)*4.1);bottom:calc(var(--fsg-u)*2.5);display:flex;align-items:center;gap:calc(var(--fsg-u)*.7);font-size:calc(var(--fsg-u)*.98);font-weight:500;font-variant-numeric:tabular-nums;color:rgba(255,255,255,.56)}
.fsg-win{display:block;height:1.3em;overflow:hidden;color:#fff}
.fsg-roll{display:flex;flex-direction:column;will-change:transform}
.fsg-roll span{display:block;height:1.3em;line-height:1.3em}
.fsg-count i{display:block;width:calc(var(--fsg-u)*2.2);height:1px;background:rgba(255,255,255,.4)}
.fsg-count em{font-style:normal;margin-left:calc(var(--fsg-u)*1.3);padding-left:calc(var(--fsg-u)*1.3);border-left:1px solid rgba(255,255,255,.2)}

/* the phone: the headline, then one card and two slivers */
@container (max-width:640px){
  .fsg-root{--fsg-kx:.6;--fsg-kr:2.15}
  .fsg-stage{--fsg-u:min(2.564cqw,1.185cqh)}
  .fsg-comp{width:calc(var(--fsg-u)*39);height:calc(var(--fsg-u)*84.4)}
  .fsg-nav{left:calc(var(--fsg-u)*2.2);right:calc(var(--fsg-u)*2.2);top:calc(var(--fsg-u)*6.4)}
  .fsg-brand{font-size:calc(var(--fsg-u)*1.7)}
  .fsg-brand i{width:calc(var(--fsg-u)*2.2)}
  .fsg-links a{display:none}
  .fsg-cta{font-size:calc(var(--fsg-u)*1.4);padding:calc(var(--fsg-u)*.95) calc(var(--fsg-u)*1.7)}
  .fsg-head{top:calc(var(--fsg-u)*15.2)}
  .fsg-h1{font-size:calc(var(--fsg-u)*4.25)}
  .fsg-rooms span{top:calc(var(--fsg-u)*52);width:calc(var(--fsg-u)*56);height:calc(var(--fsg-u)*64);margin:calc(var(--fsg-u)*-32) 0 0 calc(var(--fsg-u)*-28)}
  .fsg-row{top:calc(var(--fsg-u)*32.2);height:calc(var(--fsg-u)*46);perspective:calc(var(--fsg-u)*78)}
  .fsg-card{left:calc(var(--fsg-u)*-12.6);width:calc(var(--fsg-u)*25.2);height:calc(var(--fsg-u)*34.4)}
  .fsg-halo,.fsg-face,.fsg-mirror{backface-visibility:hidden}
  .fsg-cap{font-size:calc(var(--fsg-u)*1.75)}
  .fsg-floor{top:calc(var(--fsg-u)*67.3)}
  .fsg-pools{top:calc(var(--fsg-u)*67.8)}
  .fsg-pools span{left:calc(var(--fsg-u)*-15);width:calc(var(--fsg-u)*30)}
  .fsg-note{left:calc(var(--fsg-u)*2.2);bottom:calc(var(--fsg-u)*3.4);width:calc(var(--fsg-u)*22);font-size:calc(var(--fsg-u)*1.22)}
  .fsg-count{right:calc(var(--fsg-u)*2.2);bottom:calc(var(--fsg-u)*3.4);font-size:calc(var(--fsg-u)*1.3)}
  .fsg-count em{display:none}
}
@media (prefers-reduced-motion: reduce){
  .fsg-h1 span,.fsg-nod{animation:none}
  .fsg-cta{transition:none}
}
`;
