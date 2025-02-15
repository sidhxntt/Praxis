import FaqSection from "../landingPageComponents/FaqSection";
import FinalPush from "../landingPageComponents/FinalPush";
import PricingSection from "../landingPageComponents/PricingSection";
import DemoSection from "../landingPageComponents/DemoSection";
import FeatureDisplay from "../landingPageComponents/FeatureDisplay";
import HeroSection from "../landingPageComponents/HeroSection";
import BeforeAfter from "../landingPageComponents/BeforeAfter";
import Testimonials from "../landingPageComponents/Testimonials";

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
