import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { isUiStyleId, UI_STYLES, UiStyleId } from "./catalog";

export interface GalleryOptions {
  galleryRoot?: string;
  timeoutMs?: number;
  signal?: AbortSignal;
}

export interface GallerySession {
  url: string;
  selection: Promise<UiStyleId>;
  close(): Promise<void>;
}

const STATIC_FILES = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["index.html", "text/html; charset=utf-8"]],
  ["/gallery.css", ["gallery.css", "text/css; charset=utf-8"]],
  ["/gallery.js", ["gallery.js", "text/javascript; charset=utf-8"]],
] as const);
type StaticPath = "/" | "/index.html" | "/gallery.css" | "/gallery.js";

export async function startGallery(options: GalleryOptions = {}): Promise<GallerySession> {
  const root = path.resolve(
    options.galleryRoot ?? path.resolve(__dirname, "../../templates/ui.catalog/gallery"),
  );
  const timeoutMs = options.timeoutMs ?? 5 * 60_000;
  let selected = false;
  let settled = false;
  let resolveSelection!: (id: UiStyleId) => void;
  let rejectSelection!: (error: Error) => void;
  const selection = new Promise<UiStyleId>((resolve, reject) => {
    resolveSelection = resolve;
    rejectSelection = reject;
  });

  const server = createServer(async (request, response) => {
    try {
      await handleRequest(request, response, root, () => selected, (id) => {
        selected = true;
        response.once("finish", () => {
          setTimeout(() => void finish(undefined, id), 20);
        });
      });
    } catch {
      if (!response.headersSent) send(response, 500, "Internal server error");
      else response.destroy();
    }
  });

  const closeServer = (): Promise<void> => new Promise((resolve, reject) => {
    if (!server.listening) return resolve();
    server.close((error) => error ? reject(error) : resolve());
  });
  const finish = async (error?: Error, id?: UiStyleId): Promise<void> => {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
    options.signal?.removeEventListener("abort", onAbort);
    await closeServer();
    if (error) rejectSelection(error);
    else resolveSelection(id!);
  };
  const onAbort = () => void finish(new Error("UI gallery selection cancelled"));
  const timer = setTimeout(
    () => void finish(new Error("UI gallery selection timed out")),
    timeoutMs,
  );
  options.signal?.addEventListener("abort", onAbort, { once: true });

  try {
    await new Promise<void>((resolve, reject) => {
      server.once("error", reject);
      server.listen(0, "127.0.0.1", () => {
        server.off("error", reject);
        resolve();
      });
    });
  } catch (error) {
    clearTimeout(timer);
    options.signal?.removeEventListener("abort", onAbort);
    throw error;
  }
  if (options.signal?.aborted) onAbort();

  const address = server.address();
  if (!address || typeof address === "string") {
    await finish(new Error("UI gallery failed to bind a loopback port"));
    throw new Error("UI gallery failed to bind a loopback port");
  }

  return {
    url: `http://127.0.0.1:${address.port}/`,
    selection,
    close: () => finish(new Error("UI gallery closed before a selection was made")),
  };
}

async function handleRequest(
  request: IncomingMessage,
  response: ServerResponse,
  root: string,
  hasSelection: () => boolean,
  select: (id: UiStyleId) => void,
): Promise<void> {
  const pathname = new URL(request.url ?? "/", "http://127.0.0.1").pathname;
  if (request.method === "GET") {
    if (pathname === "/catalog.json") {
      response.setHeader("content-type", "application/json; charset=utf-8");
      response.setHeader("cache-control", "no-store");
      return send(response, 200, JSON.stringify(UI_STYLES));
    }
    const resource = STATIC_FILES.get(pathname as StaticPath);
    if (!resource) return send(response, 404, "Not found");
    const [filename, contentType] = resource;
    response.setHeader("content-type", contentType);
    response.setHeader("cache-control", "no-store");
    return send(response, 200, await readFile(path.join(root, filename)));
  }
  if (request.method === "POST" && pathname === "/select") {
    if (hasSelection()) return send(response, 409, "A style has already been selected");
    const body = await readJsonBody(request);
    if (!body || typeof body !== "object" || !isUiStyleId((body as { id?: unknown }).id)) {
      return send(response, 400, "Invalid UI style");
    }
    select((body as { id: UiStyleId }).id);
    return send(response, 204, "");
  }
  if (request.method !== "GET" && request.method !== "POST") {
    response.setHeader("allow", "GET, POST");
    return send(response, 405, "Method not allowed");
  }
  send(response, 404, "Not found");
}

async function readJsonBody(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const value = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += value.length;
    if (size > 8_192) throw new Error("selection payload too large");
    chunks.push(value);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return undefined;
  }
}

function send(response: ServerResponse, status: number, body: string | Buffer): void {
  response.statusCode = status;
  response.setHeader("x-content-type-options", "nosniff");
  response.setHeader("content-security-policy", "default-src 'self'; img-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'");
  response.end(body);
}
