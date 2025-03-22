import { CircleCheck } from "lucide-react";
import MaxWidthWrapper from "../LandingPageLayout/MaxWidthWrapper";
import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface PricingPlan {
  name: string;
  price?: string;
  period?: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
  highlight?: boolean;
  icon?: ReactNode;
}

interface PricingCardProps {
  plan: PricingPlan;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan }) => {
  return (
    <div
      className={`relative bg-white dark:bg-[#293c4e] p-8 rounded-xl shadow-sm ${
        plan.highlight ? "border-4 border-primary" : ""
      }`}
    >
      {plan.highlight && (
        <div className="absolute top-[-1rem] left-1/2 transform -translate-x-1/2 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold dark:text-black">
          Popular
        </div>
      )}

      <h3 className="text-2xl font-bold mb-4 text-center dark:text-white">
        {plan.name}
      </h3>

      {plan.price && (
        <p className="font-bold mb-6 text-center">
          <span className="text-6xl dark:text-white">{plan.price} </span>
          <span className="text-xs text-[#6B7989] dark:text-white">
            {plan.period}
          </span>
        </p>
      )}

      <div className="flex justify-center my-7">
        {plan.icon ? (
          <div className="bg-[#F8F9FA] rounded-full w-20 h-20 flex items-center justify-center">
            {plan.icon}
          </div>
        ) : (
          <div className="h-20"></div> // Keeps spacing consistent for plans without an icon
        )}
      </div>

      <p className="text-center font-bold text-[#6B7989] dark:text-white">
        {plan.description}
      </p>

      <div className="bg-[#F8F9FA] dark:bg-[#293c4e] w-full py-2 rounded-sm flex items-center justify-center font-medium my-4">
        <p className="text-xs text-[#6B7989] dark:text-white text-center">
          {plan.highlight
            ? "Full access to advanced features"
            : "Access to basic features"}
        </p>
      </div>

      <div className="px-6 mb-6">
        <Link
          to={plan.buttonLink}
          className="flex items-center justify-center cursor-pointer border-2 border-primary px-5 py-[0.45rem] rounded-full dark:hover:text-black hover:bg-primary hover:text-white font-medium text-primary transition-colors duration-200 ease-out"
        >
          {plan.buttonText}
        </Link>
      </div>

      <ul className="text-left text-[#293c4e] dark:text-white font-medium space-y-4 mb-8">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex gap-1.5 items-center">
            <CircleCheck className="h-5 w-5 shrink-0 fill-[#39BAF6] text-white dark:text-black" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Pricing Section
interface PricingSectionProps {
  plans: PricingPlan[];
}

const PricingSection: React.FC<PricingSectionProps> = ({ plans }) => {
  return (
    <section className="bg-[#F8F9FA] dark:bg-[#0f171f]" id="pricing">
      <MaxWidthWrapper className="py-20">
        <div className="flex flex-col items-center justify-center">
          <div className="bg-primary/10 rounded-full px-4 py-2">
            <p className="text-primary text-md font-medium tracking-wide">
              PRICING
            </p>
          </div>

          <div className="max-w-lg text-center mt-4">
            <p className="text-[#6B7989] dark:text-white text-lg">
              Choose a plan that fits your needs.
            </p>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 my-4 md:my-10 text-[#293A51]">
          {plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default PricingSection;
