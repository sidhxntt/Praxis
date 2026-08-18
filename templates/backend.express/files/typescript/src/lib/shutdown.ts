export type ShutdownTask = () => Promise<void>;

export function createShutdown(
  tasks: ShutdownTask[],
  closeServer: ShutdownTask,
): () => Promise<void> {
  let shutdownPromise: Promise<void> | undefined;

  return function shutdown(): Promise<void> {
    shutdownPromise ??= (async () => {
      const pendingTasks = tasks.splice(0);
      const results = await Promise.allSettled([
        closeServer(),
        ...pendingTasks.map((task) => task()),
      ]);
      const failure = results.find((result) => result.status === "rejected");
      if (failure?.status === "rejected") throw failure.reason;
    })();
    return shutdownPromise;
  };
}
