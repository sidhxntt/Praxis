export function createShutdown(tasks, closeServer) {
  let shutdownPromise;

  return function shutdown() {
    shutdownPromise ??= (async () => {
      const pendingTasks = tasks.splice(0);
      let closeError;
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
