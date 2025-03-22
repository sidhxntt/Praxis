import * as p from "@clack/prompts";
import { cancelOperation } from "../../controllers/cancelOperation";
import {
  selectDBforfullstackTS,
  selectDBforfullstackJS,
} from "./fullstack_database";

export default async function fullstack_language(projectName: string) {
  const language = await p.select({
    message: "Pick a language for NodeJS.",
    options: [
      { value: "js", label: "Javascript" },
      { value: "ts", label: "Typescript", hint: "recommneded" },
    ],
  });

  cancelOperation(language);

  if (language === "ts") {
    await selectDBforfullstackTS(projectName);
  } else if (language === "js") {
    await selectDBforfullstackJS(projectName);
  }
}
