import * as p from "@clack/prompts";
import { UI_STYLES, UiStyleId } from "./catalog";

export async function confirmVisualGallery(): Promise<boolean> {
  return notCancelled(await p.confirm({
    message: "Open the local visual template gallery?",
    initialValue: true,
  })) as boolean;
}

export async function selectUiStyleInTerminal(): Promise<UiStyleId> {
  const query = notCancelled(await p.text({
    message: "Filter landing-page styles (optional)",
    placeholder: "e.g. minimal, editorial, developer",
  })).trim().toLowerCase();
  const matches = UI_STYLES.filter((style) => !query || [
    style.label,
    style.description,
    ...style.traits,
  ].join(" ").toLowerCase().includes(query));
  const choices = matches.length > 0 ? matches : UI_STYLES;
  if (matches.length === 0) p.log.warn("No exact matches; showing all 40 styles.");
  const result = await p.select({
    message: "Landing-page style",
    options: choices.map((style) => ({
      value: style.id,
      label: style.label,
      hint: `${style.theme} · ${style.traits.join(", ")}`,
    })),
    maxItems: 12,
  });
  return notCancelled(result) as UiStyleId;
}

function notCancelled<T>(value: T | symbol): T {
  if (p.isCancel(value)) {
    p.cancel("Operation cancelled");
    throw new Error("Operation cancelled");
  }
  return value as T;
}
