import * as p from "@clack/prompts";
import { cancelOperation } from "../controllers/cancelOperation";
import frontend_technology from "./frontend/frontend_technology";
import backend_language from "./backend/backend_language";

export default async function selectProjectType(projectName: string) {
  const projectType = await p.select({
    message: "Pick a project type.",
    options: [
      { value: "frontend", label: "Frontend" },
      { value: "backend", label: "Backend" },
      { value: "both", label: "Both", hint: "recommended" },
    ],
  });

  cancelOperation(projectType);

  // add here
  if (projectType === "backend") {
    await backend_language(projectName);
  }
  else if (projectType === "frontend") {
    await frontend_technology(projectName);
  }
 
}
