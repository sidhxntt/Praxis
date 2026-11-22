"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import PraxisHero from "../components/PraxisHero";
import grain from "./grain.svg";

type Preview = { path: string; alt: string };
type Style = {
  id: string;
  label: string;
  description: string;
  traits: string[];
  theme: "light" | "dark" | "mixed";
  previews: { thumbnail: Preview; desktop: Preview; mobile: Preview };
};

const REPO = "https://github.com/sidhxntt/Praxis";
const FRAMEWORKS = ["Next.js", "Vite (React)", "TypeScript", "JavaScript"];

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14M14 7l5 5-5 5" /></svg>;
}

function CloseIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg>;
}

function SearchIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg>;
}

function FilterIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M10 14v6" /></svg>;
}

const DEVICES = {
  desktop: { w: 1440, h: 900, label: "Desktop" },
  phone: { w: 390, h: 844, label: "Phone" },
} as const;
type Device = keyof typeof DEVICES;

/** The hero itself, running in its own page at a real device size, scaled to fit the stage. */
function LivePreview({ style, device }: { style: Style; device: Device }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setBox({ w: entry.contentRect.width, h: entry.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => setLoaded(false), [style.id]);
  const d = DEVICES[device];
  // Desktop fills the 16:10 stage edge to edge; the phone sits whole inside it.
  const fit = device === "desktop" ? Math.max : Math.min;
  const scale = box.w && box.h ? fit(box.w / d.w, box.h / d.h) : 0;
  const poster = device === "phone" ? style.previews.mobile : style.previews.desktop;
  return <div className="live-stage" ref={stageRef} data-device={device}>
    {scale > 0 && <div className="live-device" style={{ width: d.w * scale, height: d.h * scale }}>
      {!loaded && <img className="live-poster" src={`/${poster.path}`} alt="" aria-hidden="true" />}
      <iframe
        key={style.id}
        id="preview-frame"
        className="live-frame"
        src={`/live/${style.id}/`}
        title={`${style.label} live preview`}
        onLoad={() => setLoaded(true)}
        style={{ width: d.w, height: d.h, transform: `scale(${scale})` }}
      />
    </div>}
  </div>;
}

/** "Apple inspired" → "Apple" + italic "inspired", same text content. */
function StyleTitle({ label }: { label: string }) {
  const m = /^(.*) (inspired)$/.exec(label);
  if (!m) return <>{label}</>;
  return <>{m[1]} <em>{m[2]}</em></>;
}

export default function GalleryPage() {
  const [styles, setStyles] = useState<Style[]>([]);
  const [query, setQuery] = useState("");
  const [trait, setTrait] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [active, setActive] = useState<Style | null>(null);
  const [device, setDevice] = useState<Device>("desktop");
  const [selectionState, setSelectionState] = useState<"idle" | "sending" | "selected" | "error">("idle");
  const [navShown, setNavShown] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    fetch("/catalog.json").then((response) => response.json()).then(setStyles);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("drawer-open", filtersOpen);
    return () => document.body.classList.remove("drawer-open");
  }, [filtersOpen]);

  useEffect(() => {
    const onScroll = () => setNavShown(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const traits = useMemo(() => [...new Set(styles.flatMap((style) => style.traits))].sort(), [styles]);
  const visible = useMemo(() => styles
    .filter((style) => !trait || style.traits.includes(trait))
    .filter((style) => !query.trim() || [style.label, style.description, ...style.traits]
      .join(" ").toLowerCase().includes(query.trim().toLowerCase())), [styles, query, trait]);

  const openPreview = (style: Style) => {
    setActive(style);
    setDevice(window.matchMedia("(max-width: 860px)").matches ? "phone" : "desktop");
    setSelectionState("idle");
    dialogRef.current?.showModal();
  };

  const selectStyle = async () => {
    if (!active) return;
    setSelectionState("sending");
    try {
      const response = await fetch("/select", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: active.id }),
      });
      if (!response.ok) throw new Error("selection rejected");
      setSelectionState("selected");
    } catch {
      setSelectionState("error");
    }
  };

  const browse = () => document.getElementById("library")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  const clearFilters = () => { setQuery(""); setTrait(""); };
  const status = selectionState === "selected"
    ? "Selected. You can return to the terminal."
    : selectionState === "error"
      ? "The CLI is no longer waiting. Return to the terminal and try again."
      : "Your CLI will continue as soon as you choose.";

  return <>
    <div className="site-nav" data-shown={navShown} aria-hidden={!navShown}>
      <header>
        <a className="site-nav-logo" href="#home" tabIndex={navShown ? 0 : -1}><span aria-hidden="true" />Praxis Flow</a>
        <nav aria-label="Sections">
          <a href="#gallery" tabIndex={navShown ? 0 : -1}>Browse</a>
          <a href="#frameworks" tabIndex={navShown ? 0 : -1}>Frameworks</a>
        </nav>
        <button type="button" className="pill pill-brand" tabIndex={navShown ? 0 : -1} onClick={() => setFiltersOpen(true)}>Search &amp; filter</button>
      </header>
    </div>

    <PraxisHero
      brand="Praxis Flow"
      line1="Choose a direction,"
      line2="then make it yours."
      lede="Preview each animated landing-page hero, then send your choice straight back to the waiting Praxis CLI."
      cta="Browse directions"
      demo={false}
      onCta={browse}
      altLabel="Search & filter"
      onAlt={() => setFiltersOpen(true)}
      links={[
        { label: "Browse", href: "#gallery" },
        { label: "Frameworks", href: "#frameworks" },
        { label: "Praxis", href: REPO },
      ]}
      navCta={{ label: "View on GitHub", href: REPO }}
      stat={[styles.length ? String(styles.length) : "", "animated heroes · fully offline"]}
      meta="Next.js · Vite (React)"
      grain={grain.src}
      fonts={false}
      sound={false}
      ball={false}
    />

    <section id="frameworks" className="frameworks" aria-label="Framework compatibility">
      <div className="compatibility">
        <p><strong>Built for React.</strong> Each hero is one self-contained React component, shipped as written for Next.js and Vite in TypeScript or JavaScript. Vue, Astro and Angular projects start from the plain starter.</p>
        <ul aria-label="Supported frameworks">{FRAMEWORKS.map((f) => <li key={f}>{f}</li>)}</ul>
      </div>
    </section>

    <main id="library">
      <section className="gallery-actions" aria-label="Gallery controls">
        <div>
          <p className="eyebrow">Landing page library</p>
          <h2 className="display">Explore every <em>hero.</em></h2>
        </div>
        <div className="gallery-action-buttons">
          <p id="count" aria-live="polite">{visible.length} of {styles.length} styles</p>
          <button id="open-filters" className="open-filters" type="button" aria-expanded={filtersOpen} aria-controls="filter-drawer" onClick={() => setFiltersOpen(true)}><FilterIcon /><span>Search &amp; filter</span>{(query || trait) && <i aria-label="Filters active" />}</button>
        </div>
      </section>

      <section id="gallery" className="gallery" aria-label="Landing-page styles">
        {visible.map((style) => <button key={style.id} type="button" className="card" onClick={() => openPreview(style)}>
          <span className="swatch-wrap"><img className="swatch" src={`/${style.previews.thumbnail.path}`} alt={style.previews.thumbnail.alt} loading="lazy" width="640" height="400" /><span className="preview-hint">View full preview <ArrowIcon /></span></span>
          <span className="card-copy"><span className="card-heading"><h2><StyleTitle label={style.label} /></h2><span className="theme-dot" data-theme={style.theme} title={`${style.theme} theme`} aria-hidden="true" /></span><p>{style.description}</p><span className="card-traits">{style.traits.map((t) => <span className="tag" key={t}>{t}</span>)}</span></span>
        </button>)}
      </section>
      {visible.length === 0 && <p id="empty" className="empty">No directions match those filters. <button type="button" onClick={clearFilters}>Clear them</button> and explore them all.</p>}
    </main>

    <footer className="gallery-foot">
      <span><span className="dot" aria-hidden="true" />Praxis Flow</span>
      <span>Nothing leaves your machine. Pick a direction and the CLI carries on.</span>
    </footer>

    <div className="filter-drawer" data-open={filtersOpen} aria-hidden={!filtersOpen}>
      <button className="drawer-backdrop" type="button" aria-label="Close filters" tabIndex={filtersOpen ? 0 : -1} onClick={() => setFiltersOpen(false)} />
      <aside id="filter-drawer" className="filter-panel" aria-label="Search and filter landing-page styles">
        <header><div><p className="eyebrow">Refine library</p><h2 className="display">Find your <em>direction.</em></h2></div><button className="drawer-close" type="button" aria-label="Close filters" onClick={() => setFiltersOpen(false)}><CloseIcon /></button></header>
        <label className="search-field"><span>Search styles</span><SearchIcon /><input id="search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by style, mood, or industry" autoComplete="off" /></label>
        <div className="drawer-section-heading"><span>Visual traits</span><span>{traits.length}</span></div>
        <div id="traits" className="traits" aria-label="Filter by trait">
          {traits.map((item) => <button key={item} type="button" aria-pressed={trait === item} onClick={() => setTrait(trait === item ? "" : item)}>{item}</button>)}
        </div>
        <footer><button id="clear-filters" className="clear-filters" type="button" onClick={clearFilters}>Clear filters</button><button className="show-results pill pill-brand" type="button" onClick={() => setFiltersOpen(false)}>Show {visible.length} directions</button></footer>
      </aside>
    </div>

    <dialog id="preview" ref={dialogRef} aria-labelledby="preview-title" onClose={() => setActive(null)} onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current?.close(); }}>
      <button className="close" type="button" aria-label="Close preview" onClick={() => dialogRef.current?.close()}><CloseIcon /></button>
      {active && <>
        <div className="preview-art">
          <div className="preview-art-bar">
            <span className="preview-dots" aria-hidden="true"><i /><i /><i /></span>
            <span className="preview-live"><b aria-hidden="true" />Live preview</span>
            <span className="preview-tools">
              <span className="device-toggle" role="group" aria-label="Preview size">
                {(Object.keys(DEVICES) as Device[]).map((key) => <button key={key} type="button" aria-pressed={device === key} onClick={() => setDevice(key)}>{DEVICES[key].label}</button>)}
              </span>
              <a className="open-full" href={`/live/${active.id}/`} target="_blank" rel="noopener">Full size</a>
            </span>
          </div>
          <LivePreview style={active} device={device} />
        </div>
        <aside className="preview-copy">
          <div className="preview-copy-main">
            <span className="eyebrow" id="preview-theme">{active.theme} direction</span>
            <h2 id="preview-title" className="display"><StyleTitle label={active.label} /></h2>
            <p id="preview-description" className="preview-description">{active.description}</p>
            <div id="preview-traits" className="traits" aria-label="Template traits">{active.traits.map((item) => <span className="tag" key={item}>{item}</span>)}</div>
            <dl id="preview-details" className="preview-details">
              <div><dt>Frameworks</dt><dd>Next.js, Vite (React)</dd></div>
              <div><dt>Responsive</dt><dd>Desktop and mobile layouts included</dd></div>
              <div><dt>Handoff</dt><dd>One React component, its pictures, and its design brief in DESIGN.md</dd></div>
            </dl>
          </div>
          <div className="selection-panel">
            <button id="select" className="select" type="button" disabled={selectionState === "sending" || selectionState === "selected"} onClick={selectStyle}><span>{selectionState === "sending" ? "Sending selection…" : selectionState === "selected" ? "Direction selected" : selectionState === "error" ? "Try again" : "Use this direction"}</span><ArrowIcon /></button>
            <p id="status" role="status">{status}</p>
          </div>
        </aside>
      </>}
    </dialog>
  </>;
}
