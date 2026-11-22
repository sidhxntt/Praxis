import { ogSize, renderOg } from "@/lib/og";

export const alt = "Praxis Flow — Your whole stack, composed to order.";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg("flow");
}
