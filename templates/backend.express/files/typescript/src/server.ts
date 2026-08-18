import "dotenv/config";
import express from "express";
import { createShutdown } from "./lib/shutdown.js";

// @praxis:imports

const app = express();
const port = Number(process.env.PORT ?? 3000);
const shutdownTasks: Array<() => Promise<void>> = [];
let server: ReturnType<typeof app.listen> | undefined;

const shutdown = createShutdown(shutdownTasks, () => new Promise((resolve, reject) => {
  if (!server) {
    resolve();
    return;
  }
  server.close((error) => error ? reject(error) : resolve());
}));

app.use(express.json());

// @praxis:middleware

app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

async function handleShutdown(signal: NodeJS.Signals): Promise<void> {
  console.log(`${signal} received; shutting down`);
  try {
    await shutdown();
  } catch (error) {
    console.error("Shutdown failed", error);
    process.exitCode = 1;
  }
}

async function start(): Promise<void> {
  // @praxis:startup

  server = app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });

  process.once("SIGINT", () => void handleShutdown("SIGINT"));
  process.once("SIGTERM", () => void handleShutdown("SIGTERM"));
}

start().catch(async (error: unknown) => {
  console.error("Failed to start the server", error);
  try {
    await shutdown();
  } catch (shutdownError) {
    console.error("Startup cleanup failed", shutdownError);
  }
  process.exitCode = 1;
});
