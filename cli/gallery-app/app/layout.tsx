import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "./drawer.css";

export const metadata: Metadata = {
  title: "Choose a Praxis Flow landing page",
  description: "Browse and select one of forty framework-native Praxis landing-page directions.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
