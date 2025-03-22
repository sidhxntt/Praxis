// Description: Redis Queue Configuration for Email and SMS Jobs using BullMQ
import { Queue } from "bullmq";
import dotenv from "dotenv";
dotenv.config();

// Redis Connection Configuration
const redisConfig = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
};

// Validate Required Redis Environment Variables
if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) {
  throw new Error("Missing required Redis environment variables.");
}

// Default Job Options
const defaultJobOptions = {
  attempts: 3,
  removeOnComplete: true,
  removeOnFail: true,
};

// Email Queue
export const emailQueue = new Queue("user-emails", {
  connection: redisConfig,
  defaultJobOptions,
});

// SMS Queue
export const smsQueue = new Queue("user-sms", {
  connection: redisConfig,
  defaultJobOptions,
});
