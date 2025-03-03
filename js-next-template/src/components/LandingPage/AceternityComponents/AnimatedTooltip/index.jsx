import { people } from "@/SampleData/LandingPage/AnimatedTooltip-data";
import { AnimatedTooltip } from "./AnimatedTooltip";

export function AnimatedTooltipPreview() {
  return (
    <div className="flex flex-row items-center justify-center mb-10 w-full scale-90">
      <AnimatedTooltip items={people} />
    </div>
  );
}
