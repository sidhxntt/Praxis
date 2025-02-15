import { Highlight } from "./HeroHighlight";

export function HeroHighlightDemo({ text }) {
  return (
    <Highlight className="text-black dark:text-white">
      {text}
    </Highlight>
  );
}
