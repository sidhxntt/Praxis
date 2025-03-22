// This file is used to create a nodemailer transporter object that can be used to send emails.
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
  throw new Error("SMTP credentials are missing.");
}

const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export default emailTransporter;
