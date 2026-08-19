import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Praxis Pro — Composable Production Backends",
  description: "Generate a Django/DRF or Go/Gin backend with selectable operational capabilities, Docker, Kubernetes, and cloud Terraform.",
};

export default function PraxisProLayout({ children }: { children: React.ReactNode }) {
  return children;
}
