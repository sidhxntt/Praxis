// Code to connect and disconnect from the database using PrismaClient
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.info("Successfully connected to database 🎯");
  } catch (error) {
    console.error("Error connecting to database:", error.message || error);
  }
};

export const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    console.info("Successfully disconnected from database 🙌");
  } catch (error) {
    console.error("Failed to disconnect from database:", error.message || error);
  }
};
