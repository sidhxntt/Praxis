import { Cover } from "../AceternityComponents/Cover/Cover";
import { GlowingEffectDemo } from "../AceternityComponents/GlowingEffect";

interface FeatureDisplayProp{
  highlighted_text: string
}

function FeatureDisplay({highlighted_text}: FeatureDisplayProp) {
  return (
    <section className=" py-24 pb-16 bg-[#f8f9fa] dark:bg-[#020817]">
      <div className="max-w-sm sm:max-w-2xl lg:max-w-3xl mx-auto flex flex-col gap-4">
        <h2 className="tracking-tight font-bold text-center md:text-left text-3xl lg:text-5xl lg:leading-[3.5rem]">
          All you need to do Lorem ipsum dolor sit amet{" "}
          <Cover>{highlighted_text}</Cover>
        </h2>
        <p className="font-semibold my-4 text-center md:text-left ">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. In minima
          incidunt, rerum quia asperiores fugit ipsam. Labore iusto dolor autem.
          Lorem ipsum dolor sit amet consectetur adipisicing el
        </p>
        <GlowingEffectDemo />
      </div>
    </section>
  );
}

export default FeatureDisplay;
