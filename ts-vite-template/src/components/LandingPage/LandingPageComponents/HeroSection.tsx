import { ArrowRight, Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import MaxWidthWrapper from "../LandingPageLayout/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { AnimatedTooltipPreview } from "../AceternityComponents/AnimatedTooltip";
import { HeroHighlightDemo } from "../AceternityComponents/HeroHighlight";

interface HeroSectionProps {
  highlighted_text: string;
}

function HeroSection({ highlighted_text }: HeroSectionProps) {
  return (
    <section className="bg-slate-50 dark:bg-[#020817]" id="about">
      <MaxWidthWrapper className="pt-10 !px-2 lg:!px-10 lg:grid lg:grid-cols-2 lg:gap-x-0 lg:pt-24 lg:pb-20">
        <div className="col-span-1 px-2 lg:px-0">
          <div className="relative mx-auto text-center lg:text-left flex flex-col items-center lg:items-start">
            <h1 className="relative w-fit tracking-tighter text-balance font-bold !leading-tight text-gray-900 dark:text-white text-5xl md:text-6xl">
              Your tagline here for{" "}
              <HeroHighlightDemo text={highlighted_text} />
            </h1>

            <p className="mt-8 text-balance text-lg max-w-prose text-center font-semibold lg:pr-10 md:text-wrap lg:text-left">
              This is a great place to describe your product and what it does.
              This is a great place to describe your product and what it does.
            </p>

            <ul className="hidden mt-8 text-left font-medium md:flex flex-col items-center sm:items-start">
              <div className="space-y-2">
                <li className="flex gap-1.5 items-center text-left">
                  <Check className="h-5 w-5 shrink-0 text-green-600" />
                  Good reason one
                </li>
                <li className="flex gap-1.5 items-center text-left">
                  <Check className="h-5 w-5 shrink-0 text-green-600" />
                  Good reason two
                </li>
                <li className="flex gap-1.5 items-center text-left">
                  <Check className="h-5 w-5 shrink-0 text-green-600" />
                  Good reason three
                </li>
                <li className="flex gap-1.5 items-center text-left">
                  <Check className="h-5 w-5 shrink-0 text-green-600" />
                  Good reason four
                </li>
              </div>
            </ul>
            <div className="flex gap-6 items-center sm:items-start">
              {/* CTA button */}
              <Link
                to="/login"
                target="_blank"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "flex items-center justify-center mt-8 group"
                )}
              >
                <span>Start Now</span>
                <ArrowRight className="ml-1.5 transform h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/documentation"
                target="_blank"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "flex items-center justify-center mt-8 group"
                )}
              >
                <span>Learn More</span>
                <ArrowRight className="ml-1.5 transform h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row sm:items-start items-center gap-5">
              <div className="flex -space-x-1">
                <AnimatedTooltipPreview />
              </div>

              <div className="flex flex-col justify-between items-center sm:items-start">
                <div className="flex gap-1">
                  {Array(5)
                    .fill(null)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-500 fill-yellow-500"
                      />
                    ))}
                </div>

                <p>
                  <span className="font-semibold">5000+</span> happy users
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-full mt-14 md:mt-0 lg:col-span-1">
          <img src="1.jpeg" width={500} height={500} alt="product image" />
        </div>
      </MaxWidthWrapper>
    </section>
  );
}

export default HeroSection;
