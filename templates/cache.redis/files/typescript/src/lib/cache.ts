import { createClient } from "redis";

const client = createClient({
  url: process.env.CACHE_URL ?? "redis://localhost:6379",
});

client.on("error", (error) => console.error("Redis error", error));

export async function connectCache(): Promise<void> {
  if (!client.isOpen) await client.connect();
  await client.set("praxis:readiness", "ready");
  await client.get("praxis:readiness");
}

export async function cacheGet(key: string): Promise<string | null> {
  return client.get(key);
}

export async function cacheSet(key: string, value: string): Promise<void> {
  await client.set(key, value);
}

export async function disconnectCache(): Promise<void> {
  if (client.isOpen) await client.quit();
}
