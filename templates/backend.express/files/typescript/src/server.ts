import express from "express";

// @praxis:imports

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(express.json());

// @praxis:middleware

app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

async function start(): Promise<void> {
  const shutdownTasks: Array<() => Promise<void>> = [];

  // @praxis:startup

  const server = app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });

  async function shutdown(signal: NodeJS.Signals): Promise<void> {
    console.log(`${signal} received; shutting down`);
    server.close(async (error) => {
      const results = await Promise.allSettled(shutdownTasks.map((task) => task()));
      const failedTask = results.find((result) => result.status === "rejected");

      if (error || failedTask) {
        if (error) {
          console.error("Failed to close the HTTP server", error);
        }
        if (failedTask?.status === "rejected") {
          console.error("A shutdown task failed", failedTask.reason);
        }
        process.exitCode = 1;
      }
    });
  }

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

start().catch((error: unknown) => {
  console.error("Failed to start the server", error);
  process.exitCode = 1;
});
