import * as p from "@clack/prompts";
import { cancelOperation } from "../../controllers/cancelOperation";
import FrontedFrameworkInstaller from "../../utils/FrontedFrameworkInstaller";


type language = "ts" | "js"

export  async function frontend_language_for_vite(projectName: string) {
  const language = await p.select({
    message: "Pick a language for NodeJS.",
    options: [
      { value: "js", label: "Javascript" },
      { value: "ts", label: "Typescript", hint: "recommneded" },
    ],
  });

  cancelOperation(language);
  const installer = new FrontedFrameworkInstaller(language as language, 'vite' , projectName)
  await installer.install();
}

export  async function frontend_language_for_next(projectName: string) {
  const language = await p.select({
    message: "Pick a language for NodeJS.",
    options: [
      { value: "js", label: "Javascript" },
      { value: "ts", label: "Typescript", hint: "recommneded" },
    ],
  });

  cancelOperation(language);
  const installer = new FrontedFrameworkInstaller(language as language, 'next' , projectName)
  await installer.install();
}
