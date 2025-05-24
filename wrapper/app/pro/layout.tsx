// app/pro/layout.tsx
import type { Metadata } from "next";
import { NavbarPro } from "@/components/navbar2";
import { FooterPro } from "@/components/footer2";

export const metadata: Metadata = {
  title: "Praxis Pro",
  description: "Advance Django Backend Boilerplate generator",
};

export default function ProLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavbarPro />
      <main>{children}</main>
      <FooterPro />
    </>
  );
}

