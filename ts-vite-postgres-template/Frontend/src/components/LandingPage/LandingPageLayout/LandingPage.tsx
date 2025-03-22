import FaqSection from "../LandingPageComponents/FaqSection";
import FinalPush from "../LandingPageComponents/FinalPush";
import PricingSection from "../LandingPageComponents/PricingSection";
import DemoSection from "../LandingPageComponents/DemoSection";
import FeatureDisplay from "../LandingPageComponents/FeatureDisplay";
import HeroSection from "../LandingPageComponents/HeroSection";
import BeforeAfter from "../LandingPageComponents/BeforeAfter";
import Testimonials from "../LandingPageComponents/Testimonials";
import { pricingPlans } from "@/SampleData/LandingPage/pricing-data";
import { faqs } from "@/SampleData/LandingPage/faq-data";
import { sampleTweets } from "@/SampleData/LandingPage/sample-tweets";

function LandingPage() {
  return (
    <>
      <HeroSection highlighted_text="your cool product"/>
      <BeforeAfter />
      <FeatureDisplay highlighted_text="Random shit"/>
      <DemoSection />
      <PricingSection plans={pricingPlans}/> 
      <FaqSection faqs={faqs}/>
      <Testimonials tweets={sampleTweets} />
      <FinalPush />
    </>
  );
}

export default LandingPage;
