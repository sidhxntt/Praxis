import * as p from "@clack/prompts";
import { cancelOperation } from "../../controllers/cancelOperation";
import { select_framework_option_for_ts, select_framework_option_for_js } from "./fullstack_framework_options";

export default async function fullstack_language(projectName: string) {
  const language = await p.select({
    message: "Pick a language for your Fullstack Framework.",
    options: [
      { value: "js", label: "Javascript" },
      { value: "ts", label: "Typescript", hint: "recommneded" },
    ],
  });

  cancelOperation(language);

  if (language === "ts") {
    await select_framework_option_for_ts(projectName);
  } else if (language === "js") {
    await select_framework_option_for_js(projectName);
  }
}
