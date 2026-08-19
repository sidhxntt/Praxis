"use client";

import { IconMenu2, IconX } from "@tabler/icons-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { Logo } from "./logo";

const navItems = [
  { name: "Browse", link: "#gallery" },
  { name: "Frameworks", link: "#frameworks" },
  { name: "Praxis", link: "https://github.com/sidhxntt/Praxis" },
];

export function Navbar() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const [compact, setCompact] = useState(false);
  useMotionValueEvent(scrollY, "change", (latest) => setCompact(latest > 100));

  return <motion.div ref={ref} className="fixed inset-x-0 top-2 z-50 w-full">
    <DesktopNav compact={compact} />
    <MobileNav compact={compact} />
  </motion.div>;
}

function DesktopNav({ compact }: { compact: boolean }) {
  const [hovered, setHovered] = useState<number | null>(null);
  return <motion.nav
    onMouseLeave={() => setHovered(null)}
    animate={{ backdropFilter: "blur(16px)", background: compact ? "rgba(0,0,0,.7)" : "rgba(0,0,0,.4)", width: compact ? "38%" : "80%", height: compact ? 48 : 64, y: compact ? 8 : 0 }}
    initial={{ width: "80%", height: 64, background: "rgba(0,0,0,.4)" }}
    transition={{ type: "spring", stiffness: 400, damping: 30 }}
    className="relative z-[60] mx-auto hidden flex-row items-center justify-between rounded-full px-6 py-2 backdrop-saturate-[1.8] lg:flex"
  >
    <Logo />
    <motion.div className="flex flex-1 items-center justify-center space-x-1 text-sm" animate={{ scale: compact ? .9 : 1, justifyContent: compact ? "flex-end" : "center" }}>
      {navItems.map((item, index) => <div className="relative" key={item.name} onMouseEnter={() => setHovered(index)}>
        <a className="relative px-3 py-1.5 text-white/90 transition-colors" href={item.link}><span className="relative z-10">{item.name}</span>{hovered === index && <motion.span layoutId="gallery-menu-hover" className="absolute inset-0 rounded-full bg-white/10" />}</a>
      </div>)}
    </motion.div>
    {!compact && <a className="rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/30" href="https://github.com/sidhxntt/Praxis">View on GitHub</a>}
  </motion.nav>;
}

function MobileNav({ compact }: { compact: boolean }) {
  const [open, setOpen] = useState(false);
  return <motion.nav
    animate={{ backdropFilter: "blur(16px)", background: compact ? "rgba(0,0,0,.7)" : "rgba(0,0,0,.4)", width: compact ? "80%" : "90%", y: compact ? 0 : 8, borderRadius: open ? 24 : 9999 }}
    className="relative z-50 mx-auto flex max-w-[calc(100vw-2rem)] flex-col items-center justify-between border border-white/40 px-4 py-2 backdrop-saturate-[1.8] lg:hidden"
  >
    <div className="flex w-full items-center justify-between"><Logo /><button type="button" onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"}>{open ? <IconX /> : <IconMenu2 />}</button></div>
    <AnimatePresence>{open && <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute inset-x-0 top-16 flex flex-col gap-4 rounded-3xl bg-black/80 px-6 py-8 backdrop-blur-xl">{navItems.map((item) => <a key={item.name} href={item.link} onClick={() => setOpen(false)} className="text-white/90">{item.name}</a>)}</motion.div>}</AnimatePresence>
  </motion.nav>;
}
