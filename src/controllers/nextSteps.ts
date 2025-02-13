import { note } from "@clack/prompts";

export default function displayNextSteps(projectName: string, s:any) {
  s.stop(`Installation successful.`);
  note(`Next steps:
      1. cd ${projectName}/
      2. npm install
      3. Checkout README.md for manual

      HAPPY CODING ✨✨`);
}
