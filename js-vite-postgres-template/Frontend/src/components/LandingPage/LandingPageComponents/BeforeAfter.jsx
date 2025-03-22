import { Check, Star, X } from "lucide-react";
import MaxWidthWrapper from "../LandingPageLayout/MaxWidthWrapper";
import { InfiniteMovingCardsDemo } from "../AceternityComponents/InfiniteMovingCards";

function BeforeAfter() {
  return (
    <section className="">
      <MaxWidthWrapper className="pb-10 pt-20">
        <div className="max-w-3xl mx-auto tracking-tight flex flex-col items-center justify-center gap-5">
          <div className="flex items-center justify-center gap-1.5">
            <X className="w-8 h-8 sm:w-6 sm:h-6 text-red-600" />
            <h2 className="font-bold text-xl md:text-3xl text-center">
              Insert reason for not using other bad alternatives
            </h2>
          </div>

          <div className="flex items-center justify-center gap-1.5">
            <Check className="w-8 h-8 sm:w-6 sm:h-6 text-green-600" />
            <h2 className="font-bold text-xl md:text-3xl text-center text-balance">
              Insert reason for why using your product is better
            </h2>
          </div>
        </div>
      </MaxWidthWrapper>
      <InfiniteMovingCardsDemo />
      <MaxWidthWrapper>
        <div className="max-w-lg mx-auto my-20 flex flex-col items-center sm:items-start">
          <div className="mx-auto flex items-center justify-center gap-1 mb-4">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className="h-5 w-5 text-yellow-500 fill-yellow-500"
              />
            ))}
          </div>

          <div className="text-center font-semibold text-balance ">
            I can't imagine my life without{" "}
            <span className="bg-yellow-200 dark:text-black">
              using this app
            </span>{" "}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet,
            assumenda Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Iusto, odit
          </div>

          <div className="flex mx-auto items-center justify-center gap-4 my-6">
            <img
              src="user.png"
              alt="user"
              className="inline-block pointer-events-none object-cover h-12 w-12 rounded-full ring-2 ring-gray-300"
            />
            <div className="flex flex-col">
              <p className="font-semibold">John D</p>
              <p className="text-sm">User One</p>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}

export default BeforeAfter;
