// Code for processing SMS jobs using Twilio

import { Worker, Job } from "bullmq";
import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
  REDIS_HOST,
  REDIS_PORT,
} = process.env;

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
  throw new Error("Twilio credentials are missing in environment variables.");
}

const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Create a BullMQ Worker for processing SMS jobs
const sms_worker = new Worker(
  "user-sms",
  async (job: Job<{ to: string; message: string }>) => {

      await twilioClient.messages.create({
        body: job.data.message,
        to: job.data.to,
        from: TWILIO_PHONE_NUMBER,
      });
  },
  {
    connection: {
      host: REDIS_HOST || "127.0.0.1",
      port: parseInt(REDIS_PORT || "6379"),
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
    },
    autorun: true, // Automatically starts processing jobs
  }
);

// Event Listeners for better debugging
sms_worker.on("active", (job) => {
    console.log(`🔗 Worker connected and processing job | ID: ${job.id}`);
  });

sms_worker.on("completed", (job) => {
  console.log(`✅ SMS Job completed | ID: ${job.id}`);
});

sms_worker.on("failed", (job, err) => {
  console.error(`❌ SMS Job failed | ID: ${job?.id} | Error: ${err.message}`);
});

sms_worker.on("error", (err) => {
  console.error(`🚨 Worker encountered an error: ${err.message}`);
});

sms_worker.on("ioredis:close", () => {
    console.warn(`⚠️ SMS Worker Closed`);
});
export { sms_worker };
