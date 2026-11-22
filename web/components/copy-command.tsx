"use client";

import { useState } from "react";

export function CopyCommand({ command, className = "" }: { command: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label={`Copy ${command}`}
      className={`pill relative ${className}`}
      onClick={() =>
        void navigator.clipboard?.writeText(command).then(
          () => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
          },
          () => {},
        )
      }
    >
      <span aria-hidden="true" className="opacity-60">
        $
      </span>
      {command}
      <span aria-live="polite" className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 text-[12px] text-brand-soft">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
}
