// Description: This file contains the worker for processing email jobs using BullMQ. It uses Nodemailer to send emails.
import { Worker, Job } from "bullmq";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Ensure SMTP credentials are available
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASSWORD,
  SMTP_FROM,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_USERNAME,
  REDIS_PASSWORD,
} = process.env;

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM) {
  throw new Error("SMTP credentials are missing in environment variables.");
}

if (!REDIS_HOST || !REDIS_PORT) {
  throw new Error("Redis connection details are missing in environment variables.");
}

// Initialize Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: parseInt(SMTP_PORT, 10) || 465, // Fallback to 465
  secure: true, // Use SSL
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

// Create a BullMQ Worker for processing email jobs
const email_worker = new Worker(
  "user-emails",
  async (job: Job<{ email: string; message: string }>) => {

      await transporter.sendMail({
        from: SMTP_FROM,
        to: job.data.email,
        subject: "Your Email Subject",
        text: job.data.message,
        html: `<p>${job.data.message}</p>`,
      });
  },
  {
    connection: {
      host: REDIS_HOST,
      port: parseInt(REDIS_PORT, 10) || 6379,
      username: REDIS_USERNAME,
      password: REDIS_PASSWORD,
    },
    autorun: true, 
  }
);

// Event Listeners for better debugging
email_worker.on("active", (job) => {
    console.log(`🔗 Worker connected and processing job | ID: ${job.id}`);
  });

email_worker.on("completed", (job) => {
  console.log(`✅ Email Job completed | ID: ${job.id}`);
});

email_worker.on("failed", (job, err) => {
  console.error(`❌ Email Job failed | ID: ${job?.id} | Error: ${err.message}`);
});

email_worker.on("error", (err) => {
  console.error(`🚨 Worker encountered an error: ${err.message}`);
});

email_worker.on("ioredis:close", () => {
    console.warn(`⚠️ Email Worker Closed`);
});


export { email_worker };
