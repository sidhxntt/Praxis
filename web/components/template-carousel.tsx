"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import templates from "@/lib/ui-templates.json";
import { CopyCommand } from "./copy-command";
import { DEVICES, LiveStage, type Device } from "./live-stage";

const pad = (n: number) => String(n).padStart(2, "0");

function Icon({ d, className = "" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`cv-icon ${className}`}>
      <path d={d} />
    </svg>
  );
}
const ICONS = {
  back: "M15 6l-6 6 6 6",
  next: "M9 6l6 6-6 6",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  open: "M14 4h6v6M20 4l-8 8M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5",
  close: "M6 6l12 12M18 6 6 18",
  search: "M11 4.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zM16 16l4 4",
  desktop: "M3 5h18v11H3zM8 20h8M12 16v4",
  phone: "M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM11 18h2",
};

/** /preview: every landing-page hero, running live, one at a time. */
export function TemplateCarousel() {
  // Rendered on the client only (it reads the address), so window is safe below.
  const params = useSearchParams();
  const [index, setIndex] = useState(() => Math.max(0, templates.findIndex((t) => t.id === params.get("t"))));
  const [device, setDevice] = useState<Device>(() => (window.matchMedia("(max-width: 760px)").matches ? "phone" : "desktop"));
  const [query, setQuery] = useState("");
  const stripRef = useRef<HTMLOListElement>(null);
  const gridRef = useRef<HTMLDialogElement>(null);
  const current = templates[index];

  // Keep the address shareable and the filmstrip centred on the current hero.
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("t", current.id);
    window.history.replaceState(null, "", url);
    const strip = stripRef.current;
    const item = strip?.children[index] as HTMLElement | undefined;
    if (strip && item) {
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      strip.scrollTo({ left: item.offsetLeft - (strip.clientWidth - item.clientWidth) / 2, behavior: smooth ? "smooth" : "auto" });
    }
  }, [current.id, index]);

  const go = useCallback((by: number) => setIndex((i) => (i + by + templates.length) % templates.length), []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (gridRef.current?.open) return;
      if (event.target instanceof HTMLElement && event.target.closest("input, textarea")) return;
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
      if (event.key.toLowerCase() === "g") gridRef.current?.showModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const found = useMemo(() => {
    const q = query.trim().toLowerCase();
    return templates
      .map((t, i) => ({ t, i }))
      .filter(({ t }) => !q || [t.label, t.description, t.theme, ...t.traits].join(" ").toLowerCase().includes(q));
  }, [query]);

  const pick = (i: number) => {
    setIndex(i);
    gridRef.current?.close();
  };

  return (
    <div className="cv">
      <header className="cv-top">
        <nav className="cv-bar" aria-label="Preview">
          <Link href="/" className="cv-brand" aria-label="Praxis Flow home">
            <Icon d={ICONS.back} className="cv-brand-back" />
            <span className="cv-dot" aria-hidden="true" />
            Praxis Flow
          </Link>
          <span className="cv-crumb" aria-hidden="true">/</span>
          <span className="cv-section">UI templates</span>
          <span className="cv-spacer" />
          <span className="cv-seg" role="group" aria-label="Preview size">
            {(Object.keys(DEVICES) as Device[]).map((key) => (
              <button key={key} type="button" aria-pressed={device === key} onClick={() => setDevice(key)}>
                <Icon d={ICONS[key]} />
                <span>{DEVICES[key].label}</span>
              </button>
            ))}
          </span>
          <a className="cv-ghost cv-hide-sm" href={current.live} target="_blank" rel="noopener">
            <Icon d={ICONS.open} />
            Full size
          </a>
          <button type="button" className="cv-ghost cv-primary" onClick={() => gridRef.current?.showModal()}>
            <Icon d={ICONS.grid} />
            <span className="cv-hide-sm">All {templates.length}</span>
          </button>
        </nav>
      </header>

      <section className="cv-stage" aria-roledescription="carousel" aria-label="Landing-page templates">
        <button type="button" className="cv-arrow cv-prev" aria-label="Previous template" onClick={() => go(-1)}>
          <Icon d={ICONS.back} />
        </button>
        <div className="cv-slide" role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${templates.length}: ${current.label}`}>
          <LiveStage template={current} device={device} />
        </div>
        <button type="button" className="cv-arrow cv-next" aria-label="Next template" onClick={() => go(1)}>
          <Icon d={ICONS.next} />
        </button>
      </section>

      <footer className="cv-foot">
        <div className="cv-info" aria-live="polite">
          <div className="cv-meta">
            <span className="cv-count">{pad(index + 1)}<i> / {pad(templates.length)}</i></span>
            <span className="cv-theme">{current.theme[0].toUpperCase() + current.theme.slice(1)} theme</span>
          </div>
          <h1 className="cv-name" key={current.id}>{current.label}</h1>
          <p className="cv-desc">{current.description}</p>
          <ul className="cv-traits" aria-label="Traits">
            {current.traits.map((trait) => <li key={trait}>{trait}</li>)}
          </ul>
        </div>

        <div className="cv-side">
          <div className="cv-use">
            <CopyCommand command="npx praxiflow" className="pill-white whitespace-nowrap !py-2.5 !text-[13.5px]" />
            <p>Pick <b>Next.js</b> or <b>Vite (React)</b>, say yes to a template, then choose <b>{current.label}</b>.</p>
          </div>
          <div className="cv-strip-wrap">
            <ol ref={stripRef} className="cv-strip" aria-label="All templates">
              {templates.map((t, i) => (
                <li key={t.id}>
                  <button type="button" aria-current={i === index} aria-label={t.label} onClick={() => setIndex(i)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.thumbnail} alt="" width={160} height={100} loading="lazy" />
                    <span>{t.label}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
          <p className="cv-keys cv-hide-sm"><kbd>←</kbd><kbd>→</kbd> browse <kbd>G</kbd> all templates</p>
        </div>
      </footer>

      <dialog
        ref={gridRef}
        className="cv-grid"
        aria-label="All templates"
        onClick={(event) => { if (event.target === gridRef.current) gridRef.current?.close(); }}
      >
        <div className="cv-grid-head">
          <h2>All templates <span>{found.length} of {templates.length}</span></h2>
          <label className="cv-search">
            <Icon d={ICONS.search} />
            <input type="search" placeholder="Search by name, mood or industry" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <button type="button" className="cv-close" aria-label="Close" onClick={() => gridRef.current?.close()}>
            <Icon d={ICONS.close} />
          </button>
        </div>
        <ul className="cv-grid-list">
          {found.map(({ t, i }) => (
            <li key={t.id}>
              <button type="button" aria-current={i === index} onClick={() => pick(i)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.thumbnail} alt="" width={320} height={200} loading="lazy" />
                <span className="cv-grid-name">{t.label}</span>
                <span className="cv-grid-traits">{t.traits.join(" · ")}</span>
              </button>
            </li>
          ))}
          {found.length === 0 && <li className="cv-empty">No templates match “{query}”.</li>}
        </ul>
      </dialog>
    </div>
  );
}
