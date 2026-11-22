import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#047857" },
    { media: "(prefers-color-scheme: dark)", color: "#022c22" },
  ],
};

export default function PraxisProLayout({ children }: { children: React.ReactNode }) {
  return children;
}
