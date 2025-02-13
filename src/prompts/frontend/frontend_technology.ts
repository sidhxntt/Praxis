import * as p from "@clack/prompts";
import { cancelOperation } from "../../controllers/cancelOperation";
import { select_vite_option, select_next_option } from "./framework_options";

export default async function frontend_technology(projectName: string) {
  const framework = await p.select({
    message: "Pick a Frontend Framework.",
    options: [
      { value: "vite", label: "ViteJS" },
      { value: "next", label: "NextJS" },
    ],
  });

  cancelOperation(framework);

  if (framework === "vite") {
    await select_vite_option(projectName);
  } else if (framework === "next") {
    await select_next_option(projectName);
  }
}
