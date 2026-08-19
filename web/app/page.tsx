import CTA from "@/components/cta";
import { FrequentlyAskedQuestions } from "@/components/faq";
import { Features } from "@/components/features";
import { Hero } from "@/components/hero";
import { SpotlightLogoCloud } from "@/components/logos-cloud";
import { Testimonials } from "@/components/testimonials";

export default function Home() {
  return (
    <div>
      <Hero product="flow" />
      <SpotlightLogoCloud product="flow" />
      <Features product="flow" />
      <Testimonials product="flow" />
      <FrequentlyAskedQuestions product="flow" />
      <CTA product="flow" />
    </div>
  );
}
