import { Client } from "memjs";

const client = Client.create(process.env.CACHE_URL ?? "localhost:11211");

export async function connectCache(): Promise<void> {
  await cacheSet("praxis:readiness", "ready");
  await cacheGet("praxis:readiness");
}

export function cacheGet(key: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    client.get(key, (error, value) => {
      if (error) reject(error);
      else resolve(value?.toString() ?? null);
    });
  });
}

export function cacheSet(key: string, value: string): Promise<void> {
  return new Promise((resolve, reject) => {
    client.set(key, value, {}, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

export async function closeCache(): Promise<void> {
  client.quit();
}
