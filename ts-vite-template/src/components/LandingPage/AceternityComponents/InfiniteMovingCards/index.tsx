import { moving_card_items } from "@/SampleData/LandingPage/InfiniteMovingCardsDemo-data";
import { InfiniteMovingCards } from "./InfiniteMovingCards";

export function InfiniteMovingCardsDemo() {
  return (
    <div className="h-[20rem] rounded-md flex flex-col antialiased bg-white dark:bg-[#020817] dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={moving_card_items}
        direction="right"
        speed="slow"
      />
    </div>
  );
}
