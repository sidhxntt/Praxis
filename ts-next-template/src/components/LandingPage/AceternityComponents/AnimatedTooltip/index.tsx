import { AnimatedTooltip } from "./AnimatedTooltip";
import { people } from "@/SampleData/LandingPage/AnimatedTooltip-data";

export function AnimatedTooltipPreview() {
  return (
    <div className="flex flex-row items-center justify-center mb-10 w-full scale-90">
      <AnimatedTooltip items={people} />
    </div>
  );
}
