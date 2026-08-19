"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LogoIcon = ({ pro = false }: { pro?: boolean }) => (
  <div
    className={cn(
      "w-8 h-8 bg-black border border-neutral-400 rounded-full",
      "inline-flex items-center justify-center border border-solid", // Changed to flex for alignment
      "[border-image-source:linear-gradient(180deg,#1F1F1F_0%,#858585_100%),linear-gradient(180deg,#1F1F1F_0%,#858585_100%)]",
      "[background:linear-gradient(0deg,#151515,#151515),linear-gradient(180deg,rgba(21,21,21,0)_66.3%,rgba(255,255,255,0.5)_100%),linear-gradient(183.22deg,rgba(255,255,255,0.5)_2.62%,rgba(21,21,21,0)_52.03%)]",
      "shadow-[inset_0px_6px_8px_0px_#FAFAFA40,inset_0px_-6px_8px_0px_#FAFAFA40,0px_0px_0px_0px_#FAFAFA40,0px_0px_0px_0px_#FAFAFA40]",
      "text-white",
      pro
        ? "border-emerald-300/70 [background:radial-gradient(circle_at_35%_30%,#6EE7B7_0%,#10B981_28%,#064E3B_62%,#020B08_100%)] shadow-[inset_0_2px_8px_rgba(167,243,208,0.55),0_0_20px_rgba(16,185,129,0.4)]"
        : "border-blue-300/70 [background:radial-gradient(circle_at_35%_30%,#60A5FA_0%,#2563EB_28%,#172554_62%,#050816_100%)] shadow-[inset_0_2px_8px_rgba(191,219,254,0.55),0_0_20px_rgba(37,99,235,0.4)]"
    )}
  ></div>
);

export const Logo = () => {
  const pathname = usePathname();
  const isPro = pathname.startsWith("/pro");
  return (
    <Link
      href={isPro ? "/" : "/pro"}
      className="font-normal flex gap-2 items-center text-sm text-black px-2 py-1 shrink-0 relative z-20"
    >
      <LogoIcon pro={isPro} />

      <span className="font-medium text-white">{isPro ? "Praxis Pro" : "Praxis Flow"}</span>
    </Link>
  );
};
