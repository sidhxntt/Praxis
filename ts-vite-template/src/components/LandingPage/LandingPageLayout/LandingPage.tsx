import FaqSection from "../LandingPageComponents/FaqSection";
import FinalPush from "../LandingPageComponents/FinalPush";
import PricingSection from "../LandingPageComponents/PricingSection";
import DemoSection from "../LandingPageComponents/DemoSection";
import FeatureDisplay from "../LandingPageComponents/FeatureDisplay";
import HeroSection from "../LandingPageComponents/HeroSection";
import BeforeAfter from "../LandingPageComponents/BeforeAfter";
import Testimonials from "../LandingPageComponents/Testimonials";

function LandingPage() {
  return (
    <>
      <HeroSection />
      <BeforeAfter />
      <FeatureDisplay />
      <DemoSection />
      <PricingSection /> 
      <FaqSection />
      <Testimonials />
      <FinalPush />
    </>
  );
}

export default LandingPage;
