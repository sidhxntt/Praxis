"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import Balancer from "react-wrap-balancer";
import { Navbar } from "../components/navbar";

type Preview = { path: string; alt: string };
type Style = {
  id: string;
  label: string;
  description: string;
  traits: string[];
  theme: "light" | "dark" | "mixed";
  previews: { thumbnail: Preview; desktop: Preview; mobile: Preview };
};

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

export default function GalleryPage() {
  const [styles, setStyles] = useState<Style[]>([]);
  const [query, setQuery] = useState("");
  const [trait, setTrait] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [active, setActive] = useState<Style | null>(null);
  const [selectionState, setSelectionState] = useState<"idle" | "sending" | "selected" | "error">("idle");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previewArtRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/catalog.json").then((response) => response.json()).then(setStyles);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("drawer-open", filtersOpen);
    return () => document.body.classList.remove("drawer-open");
  }, [filtersOpen]);

  const traits = useMemo(() => [...new Set(styles.flatMap((style) => style.traits))].sort(), [styles]);
  const visible = useMemo(() => styles
    .filter((style) => !trait || style.traits.includes(trait))
    .filter((style) => !query.trim() || [style.label, style.description, ...style.traits]
      .join(" ").toLowerCase().includes(query.trim().toLowerCase())), [styles, query, trait]);

  const openPreview = (style: Style) => {
    setActive(style);
    setSelectionState("idle");
    dialogRef.current?.showModal();
    requestAnimationFrame(() => { if (previewArtRef.current) previewArtRef.current.scrollTop = 0; });
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

  const clearFilters = () => { setQuery(""); setTrait(""); };
  const status = selectionState === "selected"
    ? "Selected. You can return to the terminal."
    : selectionState === "error"
      ? "The CLI is no longer waiting. Return to the terminal and try again."
      : "Your CLI will continue as soon as you choose.";

  return <>
    <Navbar />
    <header className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-4 pb-24 pt-32 text-center md:px-8 md:pb-36 md:pt-44" data-design-source="web">
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">40 original directions · fully offline</motion.p>
      <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }} className="relative z-20 mx-auto max-w-5xl text-center text-4xl font-semibold tracking-[-0.04em] text-neutral-100 md:text-7xl"><Balancer>Choose your landing-page direction</Balancer></motion.h1>
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15 }} className="relative z-20 mx-auto mt-6 max-w-2xl text-center text-base leading-7 text-neutral-400 md:text-lg">Preview complete, framework-native landing pages and send your choice directly back to the waiting Praxis CLI.</motion.p>
      <motion.a href="#gallery" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25 }} className="mt-8 inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/10 px-7 text-sm font-bold text-white shadow-[inset_0_6px_8px_#FAFAFA20] transition hover:-translate-y-0.5 hover:bg-white/20">Browse directions</motion.a>
      <motion.aside id="frameworks" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35 }} className="compatibility hero-compatibility" aria-label="Framework compatibility">
        <span className="terminal-dots" aria-hidden="true"><i /><i /><i /></span>
        <p><strong>Built for your frontend stack.</strong> Next.js, Vite (React), Vue, and Astro support JavaScript or TypeScript; Angular, which is TypeScript-only, is included too.</p>
      </motion.aside>
    </header>

    <main>
      <section className="gallery-actions" aria-label="Gallery controls">
        <div><p className="gallery-kicker">Landing page library</p><h2>Explore all directions</h2></div>
        <div className="gallery-action-buttons">
          <p id="count" aria-live="polite">{visible.length} of {styles.length} styles</p>
          <button id="open-filters" className="open-filters" type="button" aria-expanded={filtersOpen} aria-controls="filter-drawer" onClick={() => setFiltersOpen(true)}><FilterIcon /><span>Search &amp; filter</span>{(query || trait) && <i aria-label="Filters active" />}</button>
        </div>
      </section>

      <section id="gallery" className="gallery" aria-label="Landing-page styles">
        {visible.map((style) => <button key={style.id} type="button" className="card" onClick={() => openPreview(style)}>
          <span className="swatch-wrap"><img className="swatch" src={`/${style.previews.thumbnail.path}`} alt={style.previews.thumbnail.alt} loading="lazy" width="640" height="400" /><span className="preview-hint">View full preview <ArrowIcon /></span></span>
          <span className="card-copy"><span className="card-heading"><h2>{style.label}</h2><span className="theme-dot" data-theme={style.theme} aria-hidden="true" /></span><p>{style.description}</p><span className="tag">{style.traits.join(" · ")}</span></span>
        </button>)}
      </section>
      {visible.length === 0 && <p id="empty" className="empty">No directions match those filters. Clear them and explore all forty.</p>}
    </main>

    <div className="filter-drawer" data-open={filtersOpen} aria-hidden={!filtersOpen}>
      <button className="drawer-backdrop" type="button" aria-label="Close filters" tabIndex={filtersOpen ? 0 : -1} onClick={() => setFiltersOpen(false)} />
      <aside id="filter-drawer" className="filter-panel" aria-label="Search and filter landing-page styles">
        <header><div><p>Refine library</p><h2>Find your direction</h2></div><button className="drawer-close" type="button" aria-label="Close filters" onClick={() => setFiltersOpen(false)}><CloseIcon /></button></header>
        <label className="search-field"><span>Search styles</span><SearchIcon /><input id="search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by style, mood, or industry" autoComplete="off" /></label>
        <div className="drawer-section-heading"><span>Visual traits</span><span>{traits.length}</span></div>
        <div id="traits" className="traits" aria-label="Filter by trait">
          {traits.map((item) => <button key={item} type="button" aria-pressed={trait === item} onClick={() => setTrait(trait === item ? "" : item)}>{item}</button>)}
        </div>
        <footer><button id="clear-filters" className="clear-filters" type="button" onClick={clearFilters}>Clear filters</button><button className="show-results" type="button" onClick={() => setFiltersOpen(false)}>Show {visible.length} directions</button></footer>
      </aside>
    </div>

    <dialog id="preview" ref={dialogRef} aria-labelledby="preview-title" onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current?.close(); }}>
      <button className="close" type="button" aria-label="Close preview" onClick={() => dialogRef.current?.close()}><CloseIcon /></button>
      {active && <>
        <div className="preview-art" ref={previewArtRef} tabIndex={0} aria-label="Scrollable full-page preview">
          <div className="preview-art-bar"><span>Full-page preview</span><span>Scroll to inspect</span></div>
          <picture><source id="preview-mobile" media="(max-width: 700px)" srcSet={`/${active.previews.mobile.path}`} /><img id="preview-image" src={`/${active.previews.desktop.path}`} alt={active.previews.desktop.alt} /></picture>
        </div>
        <aside className="preview-copy">
          <div className="preview-copy-main">
            <span className="direction-label" id="preview-theme">{active.theme} direction</span>
            <h2 id="preview-title">{active.label}</h2>
            <p id="preview-description" className="preview-description">{active.description}</p>
            <div id="preview-traits" className="traits" aria-label="Template traits">{active.traits.map((item) => <span className="tag" key={item}>{item}</span>)}</div>
            <dl id="preview-details" className="preview-details">
              <div><dt>Frameworks</dt><dd>Next.js, React, Vue, Astro, Angular</dd></div>
              <div><dt>Responsive</dt><dd>Desktop and mobile layouts included</dd></div>
              <div><dt>Handoff</dt><dd>Source files plus a generated DESIGN.md guide</dd></div>
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
