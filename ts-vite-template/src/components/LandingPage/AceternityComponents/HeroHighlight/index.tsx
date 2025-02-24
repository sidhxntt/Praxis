import { Highlight } from "./HeroHighlight";

interface HeroHighlightDemoProps {
  text: string;
}

export function HeroHighlightDemo({ text }: HeroHighlightDemoProps) {
  return (
    <Highlight className="text-black dark:text-white">
      {text}
    </Highlight>
  );
}
