export type ShutdownTask = () => Promise<void>;

export function createShutdown(
  tasks: ShutdownTask[],
  closeServer: ShutdownTask,
): () => Promise<void> {
  let shutdownPromise: Promise<void> | undefined;

  return function shutdown(): Promise<void> {
    shutdownPromise ??= (async () => {
      const pendingTasks = tasks.splice(0);
      let closeError: unknown;
      try {
        await closeServer();
      } catch (error) {
        closeError = error;
      }
      const results = await Promise.allSettled(
        pendingTasks.map((task) => task()),
      );
      if (closeError) throw closeError;
      const failure = results.find((result) => result.status === "rejected");
      if (failure?.status === "rejected") throw failure.reason;
    })();
    return shutdownPromise;
  };
}
