import { startGallery, GallerySession } from "./gallery";
import { openBrowser } from "./openBrowser";
import { confirmVisualGallery, selectUiStyleInTerminal } from "./terminalSelector";
import { UiStyleId } from "./catalog";

export interface ResolveUiDependencies {
  confirmGallery: () => Promise<boolean>;
  startGallery: (options: { signal?: AbortSignal }) => Promise<GallerySession>;
  openBrowser: (url: string) => Promise<boolean>;
  selectTerminal: () => Promise<UiStyleId>;
  env: NodeJS.ProcessEnv | Record<string, string | undefined>;
  signal?: AbortSignal;
}

const defaults: ResolveUiDependencies = {
  confirmGallery: confirmVisualGallery,
  startGallery,
  openBrowser,
  selectTerminal: selectUiStyleInTerminal,
  env: process.env,
};

export async function resolveUiStyle(
  dependencies: ResolveUiDependencies = defaults,
): Promise<UiStyleId> {
  if (dependencies.signal?.aborted) throw new Error("UI selection cancelled");
  if (isHeadless(dependencies.env)) return dependencies.selectTerminal();
  if (!(await dependencies.confirmGallery())) return dependencies.selectTerminal();

  let gallery: GallerySession;
  try {
    gallery = await dependencies.startGallery({ signal: dependencies.signal });
  } catch {
    if (dependencies.signal?.aborted) throw new Error("UI selection cancelled");
    return dependencies.selectTerminal();
  }
  const selection = gallery.selection.then(
    (id) => ({ id }),
    () => undefined,
  );
  if (!(await dependencies.openBrowser(gallery.url))) {
    await gallery.close();
    return dependencies.selectTerminal();
  }
  const result = await selection;
  if (result) return result.id;
  if (dependencies.signal?.aborted) throw new Error("UI selection cancelled");
  return dependencies.selectTerminal();
}

function isHeadless(env: ResolveUiDependencies["env"]): boolean {
  const ci = env.CI?.toLowerCase();
  return (Boolean(ci) && ci !== "false" && ci !== "0") || env.TERM === "dumb";
}
