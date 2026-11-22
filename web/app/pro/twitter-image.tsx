import { ogSize, renderOg } from "@/lib/og";

export const alt = "Praxis Pro — Production APIs, built by capability.";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg("pro");
}
