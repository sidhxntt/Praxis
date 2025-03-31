import CTA from "@/components/cta";
import { FrequentlyAskedQuestions } from "@/components/faq";
import { Features } from "@/components/feature";
import { Benefits } from "@/components/benefits";
// import { Hero } from "@/components/hero";
import { SpotlightLogoCloud } from "@/components/logos-cloud";
import { Upcoming } from "@/components/wobble-card";
// import { Pricing } from "@/components/pricing";
// import { Testimonials } from "@/components/testimonials";

export default function Home() {
  return (
    <div>
         {/* <Hero /> */}
      <CTA/>
      <SpotlightLogoCloud />
      <Benefits />
      <Features/>
      {/* <Testimonials /> */}
      {/* <Pricing /> */}
      <FrequentlyAskedQuestions />
      <Upcoming/>
      {/* <Hero /> */}
    </div>
  );
}
