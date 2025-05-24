import CTA from "@/components/cta";
import { FrequentlyAskedQuestions } from "@/components/faq";
import { Features } from "@/components/feature";
import { Benefits } from "@/components/benefits";
import { Hero } from "@/components/hero";
import { SpotlightLogoCloud } from "@/components/logos-cloud";
import { Pricing } from "@/components/pricing";
// import { Testimonials } from "@/components/testimonials";

export default function Home() {
  return (
    <div>
        {/* <Pricing /> */}
         <Hero />
      {/* <SpotlightLogoCloud /> */}
      {/* <Benefits /> */}
      <Features/>
      {/* <Testimonials /> */}
      <FrequentlyAskedQuestions />
      {/* <Hero /> */}
    </div>
  );
}
