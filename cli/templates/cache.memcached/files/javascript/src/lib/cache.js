import { Client } from "memjs";

const client = Client.create(process.env.CACHE_URL ?? "localhost:11211");
let disconnected = false;

export async function connectCache() {
  try {
    await new Promise((resolve, reject) => {
      client.set("praxis:readiness", "ready", { expires: 5 }, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
    await cacheGet("praxis:readiness");
  } catch (error) {
    await disconnectCache();
    throw error;
  }
}

export function cacheGet(key) {
  return new Promise((resolve, reject) => {
    client.get(key, (error, value) => {
      if (error) reject(error);
      else resolve(value?.toString() ?? null);
    });
  });
}

export function cacheSet(key, value) {
  return new Promise((resolve, reject) => {
    client.set(key, value, {}, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

export async function disconnectCache() {
  if (disconnected) return;
  disconnected = true;
  client.quit();
}
