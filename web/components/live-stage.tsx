"use client";

import { useEffect, useRef, useState } from "react";
import type templates from "@/lib/ui-templates.json";

export type Template = (typeof templates)[number];

export const DEVICES = {
  desktop: { w: 1440, h: 900, label: "Desktop" },
  phone: { w: 390, h: 844, label: "Phone" },
} as const;
export type Device = keyof typeof DEVICES;

/**
 * The hero itself, running in its own page at a real device size (1440×900 or
 * 390×844) and scaled down to fit whatever space it is given, so it lays out
 * exactly as it would on that screen.
 */
export function LiveStage({ template, device, className = "" }: { template: Template; device: Device; className?: string }) {
  const cellRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const loaded = loadedId === template.id;
  useEffect(() => {
    const el = cellRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setBox({ w: entry.contentRect.width, h: entry.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const d = DEVICES[device];
  const scale = box.w && box.h ? Math.min(box.w / d.w, box.h / d.h) : 0;
  return (
    <div ref={cellRef} className={`live-cell ${className}`} data-device={device}>
      {scale > 0 && (
        <div key={`${template.id}-${device}`} className="live-device" data-loaded={loaded} style={{ width: Math.floor(d.w * scale), height: Math.floor(d.h * scale) }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="live-poster" src={device === "phone" ? template.mobile : template.desktop} alt="" aria-hidden="true" />
          {!loaded && <span className="live-loading" aria-hidden="true" />}
          <iframe
            key={template.id}
            className="live-frame"
            src={template.live}
            title={`${template.label} live preview`}
            onLoad={() => setLoadedId(template.id)}
            style={{ width: d.w, height: d.h, transform: `scale(${scale})` }}
          />
        </div>
      )}
    </div>
  );
}
