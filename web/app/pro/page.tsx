import CTA from "@/components/cta";
import { FrequentlyAskedQuestions } from "@/components/faq";
import { Features } from "@/components/features";
import { Hero } from "@/components/hero";
import { SpotlightLogoCloud } from "@/components/logos-cloud";
import { Testimonials } from "@/components/testimonials";

export default function PraxisProPage() {
  return (
    <main>
      <Hero product="pro" />
      <SpotlightLogoCloud product="pro" />
      <Features product="pro" />
      <Testimonials product="pro" />
      <FrequentlyAskedQuestions product="pro" />
      <CTA product="pro" />
    </main>
  );
}
