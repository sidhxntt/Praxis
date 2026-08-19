import { spawn } from "node:child_process";

export interface BrowserCommand {
  command: string;
  args: string[];
}

export function browserLaunchCommand(
  rawUrl: string,
  platform: NodeJS.Platform = process.platform,
): BrowserCommand {
  const url = new URL(rawUrl);
  if (url.protocol !== "http:" || url.hostname !== "127.0.0.1") {
    throw new Error("UI gallery browser URL must be an HTTP loopback address");
  }
  if (platform === "darwin") return { command: "open", args: [url.href] };
  if (platform === "win32") {
    return { command: "cmd", args: ["/c", "start", "", url.href] };
  }
  return { command: "xdg-open", args: [url.href] };
}

export async function openBrowser(url: string): Promise<boolean> {
  const launch = browserLaunchCommand(url);
  return new Promise((resolve) => {
    const child = spawn(launch.command, launch.args, {
      detached: true,
      stdio: "ignore",
      shell: false,
    });
    child.once("error", () => resolve(false));
    child.once("spawn", () => {
      child.unref();
      resolve(true);
    });
  });
}
