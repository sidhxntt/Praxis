#!/usr/bin/env node

import * as p from "@clack/prompts";
import { runCli } from "./cli/run";
import { runCreate } from "./workflow/runCreate";

runCli(process.argv.slice(2), { create: runCreate }).catch(
  (error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    p.log.error(message);
    process.exitCode = 1;
  },
);
