import * as p from "@clack/prompts";
import { cancelOperation } from "../../controllers/cancelOperation";
import FullstackFrameworkInstaller from "../../utils/FullstackFrameworkInstaller";

type db_values= "mongo" | "postgres"

export async function selectDBforfullstackTS(projectName: string) {
  const db = await p.select({
    message: "Choose a Database.",
    options: [
      { value: "mongo", label: "MongoDB", hint: "Mongo Atlas" },
      { value: "postgres", label: "Postgres", hint: "Supabase" },
    ],
  });

  cancelOperation(db);
  const installer = new FullstackFrameworkInstaller(db as db_values, projectName, true);
  await installer.install();
}

export async function selectDBforfullstackJS(projectName: string) {
  const db = await p.select({
    message: "Choose a Database.",
    options: [
      { value: "mongo", label: "MongoDB", hint: "Mongo Atlas" },
      { value: "postgres", label: "Postgres", hint: "Supabase" },
    ],
  });
  
  cancelOperation(db);
  const installer = new FullstackFrameworkInstaller(db as db_values, projectName, false);
  await installer.install();
}
