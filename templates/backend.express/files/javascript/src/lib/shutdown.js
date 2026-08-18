export function createShutdown(tasks, closeServer) {
  let shutdownPromise;

  return function shutdown() {
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
