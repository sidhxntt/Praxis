import { Building2, CircleCheck } from "lucide-react";
import MaxWidthWrapper from "../LandingPageLayout/MaxWidthWrapper";
import { Link } from "react-router-dom";

function PricingSection() {
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
              Choose Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            </p>
          </div>
        </div>

        {/* price chart */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 my-4 md:my-10 text-[#293A51]">
          {/* free plan */}
          <div className="bg-white dark:bg-[#293c4e] p-8 rounded-xl shadow-sm mt-14">
            <h3 className="text-2xl font-bold mb-4 text-center dark:text-white">
              Free
            </h3>

            <p className="font-bold mb-6 text-center">
              <span className="text-6xl dark:text-white">$0 </span>
              <span className="text-xs text-[#6B7989] dark:text-white">
                / month
              </span>
            </p>

            <p className="text-center font-bold text-[#6B7989] dark:text-white">
              Perfect for Lorem ipsum dolor sit amet.
            </p>

            <div className="bg-[#F8F9FA] dark:bg-[#293c4e] w-full py-2 rounded-sm flex items-center justify-center font-medium my-4">
              <p className="text-xs text-[#6B7989] dark:text-white">
                Access to basic features
              </p>
            </div>

            <div className="px-6">
              <Link
                to="#"
                className="flex items-center justify-center cursor-pointer border-2 border-primary px-5 py-[0.45rem] rounded-full dark:hover:text-black hover:bg-primary hover:text-white font-medium text-primary transition-colors duration-200 ease-out"
              >
                Start for Free
              </Link>
            </div>

            <p className="font-medium mt-6 mb-4">Basic features included</p>

            <ul className="text-left text-[#293c4e] dark:text-white font-medium space-y-4 mb-8">
              <li className="flex gap-1.5 items-center text-left">
                <CircleCheck className="h-5 w-5 shrink-0 fill-[#39BAF6] text-white dark:text-black" />
                Basic stuff
              </li>
              <li className="flex gap-1.5 items-center text-left">
                <CircleCheck className="h-5 w-5 shrink-0 fill-[#39BAF6] text-white dark:text-black" />
                Basic stuff
              </li>
              <li className="flex gap-1.5 items-center text-left">
                <CircleCheck className="h-5 w-5 shrink-0 fill-[#39BAF6] text-white dark:text-black" />
                Basic stuff
              </li>
              <li className="flex gap-1.5 items-center text-left">
                <CircleCheck className="h-5 w-5 shrink-0 fill-[#39BAF6] text-white dark:text-black" />
                Basic stuff
              </li>
            </ul>
          </div>

          {/* pro plan */}
          <div className="relative bg-white dark:bg-[#293c4e] p-4 md:p-8 rounded-xl shadow-sm border-2 md:border-4 border-primary">
            <div className="absolute top-[-1rem] left-1/2 transform -translate-x-1/2 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold dark:text-black">
              Popular
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center">Pro</h3>

            <p className="font-bold mb-6 text-center">
              <span className="text-6xl dark:text-white">$999 </span>
              <span className="text-xs text-[#6B7989]  dark:text-white">
                / yearly
              </span>
            </p>

            <p className="text-center font-bold text-primary">
              Ideal for Lorem ipsum, dolor sit amet consectetur adipisicing
              elit.
            </p>

            <div className="bg-[#F8F9FA] dark:bg-[#293c4e] w-full py-2 rounded-sm flex items-center justify-center font-medium my-4">
              <p className="text-xs text-[#6B7989]  dark:text-white">
                Full access to advanced features
              </p>
            </div>

            <div className="px-6 mb-6">
              <Link
                to="#"
                className="flex items-center justify-center cursor-pointer border-2 border-primary px-5 py-[0.45rem] rounded-full dark:hover:text-black hover:bg-primary hover:text-white font-medium text-primary transition-colors duration-200 ease-out"
              >
                Subscribe Now
              </Link>
            </div>

            <ul className="text-left text-[#293c4e] dark:text-white font-medium space-y-4 mb-8">
              <li className="flex gap-1.5 items-center text-left">
                <CircleCheck className="h-5 w-5 shrink-0 fill-[#39BAF6] text-white  dark:text-black " />
                <span className="font-bold text-[#293A51] dark:text-white">
                  Unlimited
                </span>{" "}
                daily uses
              </li>
              <li className="flex gap-1.5 items-center text-left">
                <CircleCheck className="h-5 w-5 shrink-0 fill-[#39BAF6] text-white dark:text-black" />
                Premium stuff
              </li>
              <li className="flex gap-1.5 items-center text-left">
                <CircleCheck className="h-5 w-5 shrink-0 fill-[#39BAF6] text-white  dark:text-black" />
                Premium stuff
              </li>
              <li className="flex gap-1.5 items-center text-left">
                <CircleCheck className="h-5 w-5 shrink-0 fill-[#39BAF6] text-white  dark:text-black" />
                Premium stuff
              </li>
              <li className="flex gap-1.5 items-center text-left">
                <CircleCheck className="h-5 w-5 shrink-0 fill-[#39BAF6] text-white  dark:text-black" />
                Premium stuff
              </li>
              <li className="flex gap-1.5 items-center text-left">
                <CircleCheck className="h-5 w-5 shrink-0 fill-[#39BAF6] text-white  dark:text-black" />
                Premium stuff
              </li>
              <li className="flex gap-1.5 items-center text-left">
                <CircleCheck className="h-5 w-5 shrink-0 fill-[#39BAF6] text-white  dark:text-black" />
                Premium stuff
              </li>
            </ul>
          </div>

          {/* enterprise plan */}
          <div className="bg-white dark:bg-[#293c4e] p-8 rounded-xl shadow-sm mt-14">
            <h3 className="dark:text-white text-2xl font-bold text-center">
              Enterprise
            </h3>
            <div className="bg-[#F8F9FA] rounded-full w-20 h-20 flex items-center justify-center mx-auto my-7">
              <Building2 className="h-8 w-8 text-[#6B7989]" />
            </div>

            <p className="dark:text-white text-center font-bold text-[#6B7989]">
              Tailored to Lorem ipsum dolor sit amet consectetur adipisicing
              elit.
            </p>

            <div className="dark:bg-[#293c4e] dark:text-white bg-[#F8F9FA] w-full py-2 px-6 rounded-sm flex items-center justify-center font-medium my-4">
              <p className="dark:text-white text-xs text-[#6B7989] text-center">
                Full access to all features, including exclusive enterprise
                tools
              </p>
            </div>

            <div className="px-6">
              <Link
                to="#"
                className="flex items-center justify-center cursor-pointer border-2 border-primary px-5 py-[0.45rem] rounded-full dark:hover:text-black hover:bg-primary hover:text-white font-medium text-primary transition-colors duration-200 ease-out"
              >
                Contact Us
              </Link>
            </div>

            <p className="font-medium mt-6 mb-4">Everything in Pro, plus</p>

            <ul className="dark:text-white text-left text-[#6B7989] font-medium space-y-4 mb-8">
              <li className="flex gap-1.5 items-center text-left">
                <CircleCheck className="h-5 w-5 shrink-0 fill-[#39BAF6] text-white dark:text-black" />
                <span className="font-bold text-[#293A51] dark:text-white">
                  Custom
                </span>{" "}
                stuff
              </li>
              <li className="flex gap-1.5 items-center text-left">
                <CircleCheck className="h-5 w-5 shrink-0 fill-[#39BAF6] text-white dark:text-black" />
                High-end stuff
              </li>
              <li className="flex gap-1.5 items-center text-left">
                <CircleCheck className="h-5 w-5 shrink-0 fill-[#39BAF6] text-white dark:text-black" />
                High-end stuff
              </li>
              <li className="flex gap-1.5 items-center text-left">
                <CircleCheck className="h-5 w-5 shrink-0 fill-[#39BAF6] text-white dark:text-black" />
                High-end stuff
              </li>
              <li className="flex gap-1.5 items-center text-left">
                <CircleCheck className="h-5 w-5 shrink-0 fill-[#39BAF6] text-white dark:text-black" />
                High-end stuff
              </li>
            </ul>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}

export default PricingSection;
