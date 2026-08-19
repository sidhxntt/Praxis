import * as p from "@clack/prompts";
import { cancelOperation } from "../../controllers/cancelOperation";
import BackendFrameworkInstaller from "../../utils/BackendFrameworkInstaller";

type db_values= "mongo" | "postgres"

export async function selectDBforTS(projectName: string) {
  const db = await p.select({
    message: "Choose a Database.",
    options: [
      { value: "mongo", label: "MongoDB", hint: "Mongo Atlas" },
      { value: "postgres", label: "Postgres", hint: "Supabase" },
    ],
  });

  cancelOperation(db);
  const installer = new BackendFrameworkInstaller(db as db_values, projectName, true);
  await installer.install();
}

export async function selectDBforJS(projectName: string) {
  const db = await p.select({
    message: "Choose a Database.",
    options: [
      { value: "mongo", label: "MongoDB", hint: "Mongo Atlas" },
      { value: "postgres", label: "Postgres", hint: "Supabase" },
    ],
  });
  
  cancelOperation(db);
  const installer = new BackendFrameworkInstaller(db as db_values, projectName, false);
  await installer.install();
}
