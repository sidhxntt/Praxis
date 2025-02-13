import * as p from "@clack/prompts";
import { cancelOperation } from "../../controllers/cancelOperation";
import { runCommand } from "../../controllers/runCommand";
import { frontend_language_for_next, frontend_language_for_vite } from "./frontend_language";

export async function select_vite_option(projectName: string) {
  const vite = await p.select({
    message: "Choose any one.",
    options: [
      { value: "raw", label: "ViteJS without template" },
      { value: "template", label: "ViteJS with template" },
    ],
  });
  if (vite === "raw") {
    runCommand(`npm create vite@latest`);
  } else {
    cancelOperation(vite);
    await frontend_language_for_vite(projectName);
  }
}

export async function select_next_option(projectName: string) {
  const next = await p.select({
    message: "Choose a Database.",
    options: [
      { value: "raw", label: "NextJS without template" },
      { value: "template", label: "NextJS with template" },
    ],
  });

  if (next === "raw") {
    runCommand(`npx create-next-app@latest`);
  } else {
    cancelOperation(next);
    await frontend_language_for_next(projectName);
  }
}
