import * as p from "@clack/prompts";
import { cancelOperation } from "../../controllers/cancelOperation";
import {
  selectDBforfullstackTS_next,
  selectDBforfullstackTS_vite,
  selectDBforfullstackjs_next,
  selectDBforfullstackjs_vite,
} from "./fullstack_database";

export async function select_framework_option_for_ts(projectName: string) {
  const framework = await p.select({
    message: "Choose your frontend framework.",
    options: [
      { value: "vite", label: "ViteJS" },
      { value: "next", label: "NextJS" },
    ],
  });
  if (framework === "vite") {
    cancelOperation(framework);
    await selectDBforfullstackTS_vite(projectName);
  } else {
    cancelOperation(framework);
    await selectDBforfullstackTS_next(projectName);
  }
}
export async function select_framework_option_for_js(projectName: string) {
  const framework = await p.select({
    message: "Choose your frontend framework.",
    options: [
      { value: "vite", label: "ViteJS" },
      { value: "next", label: "NextJS" },
    ],
  });
  if (framework === "vite") {
    cancelOperation(framework);
    await selectDBforfullstackjs_vite(projectName);
  } else {
    cancelOperation(framework);
    await selectDBforfullstackjs_next(projectName);
  }
}
