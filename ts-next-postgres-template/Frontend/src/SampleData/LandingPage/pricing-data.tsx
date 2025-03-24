import { Building2 } from "lucide-react";
import { PricingPlan } from "@/lib/types";

export const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    price: "$0",
    period: "/ month",
    description: "Perfect for getting started with basic features.",
    features: ["Basic stuff", "Basic stuff", "Basic stuff", "Basic stuff"],
    buttonText: "Start for Free",
    buttonLink: "#",
  },
  {
    name: "Pro",
    price: "$999",
    period: "/ yearly",
    description: "Ideal for professionals needing full access.",
    features: [
      "Unlimited daily uses",
      "Premium stuff",
      "Premium stuff",
      "Premium stuff",
      "Premium stuff",
      "Premium stuff",
      "Premium stuff",
    ],
    buttonText: "Subscribe Now",
    buttonLink: "#",
    highlight: true,
  },
  {
    name: "Enterprise",
    description: "Tailored solutions with exclusive enterprise tools.",
    features: [
      "Custom stuff",
      "High-end stuff",
      "High-end stuff",
      "High-end stuff",
      "High-end stuff",
    ],
    buttonText: "Contact Us",
    buttonLink: "#",
    icon: <Building2 className="h-8 w-8 text-[#6B7989]" />,
  },
];
