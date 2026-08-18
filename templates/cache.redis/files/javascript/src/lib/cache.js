import { createClient } from "redis";

const client = createClient({
  url: process.env.CACHE_URL ?? "redis://localhost:6379",
});

client.on("error", (error) => console.error("Redis error", error));

export async function connectCache() {
  if (!client.isOpen) await client.connect();
  await client.set("praxis:readiness", "ready");
  await client.get("praxis:readiness");
}

export async function cacheGet(key) {
  return client.get(key);
}

export async function cacheSet(key, value) {
  await client.set(key, value);
}

export async function closeCache() {
  if (client.isOpen) await client.quit();
}
