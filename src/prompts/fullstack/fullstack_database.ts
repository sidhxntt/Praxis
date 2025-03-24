import * as p from "@clack/prompts";
import { cancelOperation } from "../../controllers/cancelOperation";
import {ViteFullstackFrameworkInstaller, NextFullstackFrameworkInstaller} from "../../utils/FullstackFrameworkInstaller";

type db_values= "mongo" | "postgres"

export async function selectDBforfullstackTS_vite(projectName: string) {
  const db = await p.select({
    message: "Choose a Database.",
    options: [
      { value: "mongo", label: "MongoDB", hint: "Mongo Atlas" },
      { value: "postgres", label: "Postgres", hint: "Supabase" },
    ],
  });

  cancelOperation(db);
  const installer = new ViteFullstackFrameworkInstaller(db as db_values, projectName, true);
  await installer.install();
}

export async function selectDBforfullstackjs_vite(projectName: string) {
  const db = await p.select({
    message: "Choose a Database.",
    options: [
      { value: "mongo", label: "MongoDB", hint: "Mongo Atlas" },
      { value: "postgres", label: "Postgres", hint: "Supabase" },
    ],
  });
  
  cancelOperation(db);
  const installer = new ViteFullstackFrameworkInstaller(db as db_values, projectName, false);
  await installer.install();
}

export async function selectDBforfullstackTS_next(projectName: string) {
  const db = await p.select({
    message: "Choose a Database.",
    options: [
      { value: "mongo", label: "MongoDB", hint: "Mongo Atlas" },
      { value: "postgres", label: "Postgres", hint: "Supabase" },
    ],
  });

  cancelOperation(db);
  const installer = new NextFullstackFrameworkInstaller(db as db_values, projectName, true);
  await installer.install();
}


export async function selectDBforfullstackjs_next(projectName: string) {
  const db = await p.select({
    message: "Choose a Database.",
    options: [
      { value: "mongo", label: "MongoDB", hint: "Mongo Atlas" },
      { value: "postgres", label: "Postgres", hint: "Supabase" },
    ],
  });
  
  cancelOperation(db);
  const installer = new NextFullstackFrameworkInstaller(db as db_values, projectName, false);
  await installer.install();
}