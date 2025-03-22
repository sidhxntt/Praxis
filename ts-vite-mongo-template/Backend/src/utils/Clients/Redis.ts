// Desc: Redis connection utility for establishing a connection to the Redis server.
import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

let redis: Redis | null = null; // Singleton instance

export const redis_connection = (): Redis => {
  if (!redis) {
    redis = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || "15622"),
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
    });

    redis.on("connect", () => {
      console.log("Successfully connected to Redis! ✨");
    });

    redis.on("error", (err) => {
      console.error("Redis connection error:", err);
    });
  }
  return redis;
};

export const disconnectRedis = async () => {
  if (redis) {
    try {
      await redis.quit();
      console.info("Successfully disconnected from Redis 💯");
      redis = null; 
    } catch (error: any) {
      console.error("Failed to disconnect from Redis:", error.message || error);
    }
  }
};
