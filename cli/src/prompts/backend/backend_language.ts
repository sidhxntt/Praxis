import * as p from "@clack/prompts";
import { cancelOperation } from "../../controllers/cancelOperation";
import { selectDBforJS, selectDBforTS } from "./backend_databases";

export default async function backend_language(projectName: string) {
  const language = await p.select({
    message: "Pick a language for NodeJS.",
    options: [
      { value: "js", label: "Javascript" },
      { value: "ts", label: "Typescript", hint: "recommneded" },
    ],
  });

  cancelOperation(language);

  if (language === "ts") {
    await selectDBforTS(projectName);
  }
  else if(language === 'js'){
    await selectDBforJS(projectName)
  }}
