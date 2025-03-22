// Description: This file contains the worker for processing email jobs using BullMQ. It uses Nodemailer to send emails.
import { Worker } from "bullmq";
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
  async (job) => {
    const { email, role, description  } = job.data;
      await transporter.sendMail({
        from: SMTP_FROM,
        to: email,
        subject: "Your Email Subject",
        text: 'Invitation for SaaS',
        html: 
        `<div style="max-width: 42rem; padding: 2rem 1.5rem; margin: 0 auto; background-color: white; color: black; font-family: Arial, sans-serif; line-height: 1.5; background-color: #ffffff;">

        <div style="margin-top: 2rem;">
          <h2 style="color: #374151; font-size: 1.5rem; font-weight: 500; margin-bottom: 1rem;">
            Hi ${email},
          </h2>
      
          <p style="color: #4b5563; font-size: 1rem; margin-top: 1rem; margin-bottom: 2rem;">
            A new invite for <strong>${email}</strong> as <strong>${role}</strong> from ${SMTP_FROM} has come. 
          </p>
      
          <a href="http://localhost:5173/" style="text-decoration: none;">
            <button style="
                padding: 0.5rem 1.5rem;
                font-size: 0.875rem;
                font-weight: 500;
                text-transform: capitalize;
                background-color: #2563eb;
                color: white;
                border: none;
                border-radius: 0.375rem;
                cursor: pointer;
                transition: background-color 0.3s ease-in-out;
                display: inline-block;
              " onmouseover="this.style.backgroundColor='#1e4cb7'" onmouseout="this.style.backgroundColor='#2563eb'">
            Accept Now
            </button>
          </a>
      
          <p style="color: #4b5563; font-size: 1rem; margin-top: 2rem;">
            ${description} <br>
          </p>
        </div>
      </div>`,
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
