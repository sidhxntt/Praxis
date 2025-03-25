// Description: This file is the entry point of the application. It starts the server, connects to the database & Redis, and initializes the routes.
// It also handles graceful shutdown of the server and database connections.

import express from "express";
import AllRoutes from "./routes/Main_Routes.js";
import error_handling from "./controllers/error.js";
import cors from "cors";
import GracefulShutdown from "http-graceful-shutdown";
import helmet from "helmet";
import dotenv from "dotenv";
import { connectDB, disconnectDB } from "./utils/Clients/Prisma.js";
import { redis_connection, disconnectRedis } from "./utils/Clients/Redis.js";

dotenv.config();

export default class SERVER {
  constructor() {
    this.app = express();
    this.port = process.env.MAIN_SERVER_PORT;
    this.serverUrl = process.env.MAIN_SERVER_URL;
    this.initializeRoutesAndMiddlewares();
  }

   initializeRoutesAndMiddlewares() {
    this.app.use(
      cors({
        origin: process.env.CLIENT,
        credentials: true,
        methods: ["GET", "POST", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );
    
    this.app.use(
      express.json({
        verify: (req, res, buf) => {
          req.rawBody = buf; 
        },
      })
    ); // Parse JSON bodies

    this.app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
    this.app.use(helmet()); // Security middleware

    AllRoutes(this.app); // Load main routes
    this.app.use(error_handling); // Global error handling middleware
  }

   async start() {
    try {
      await connectDB(); // Connect to database
      redis_connection(); // Connect to Redis

      this.httpServer = this.app.listen(this.port, () => {
        console.log(`🚀 Server is running at: ${this.serverUrl}`);
      });

      // Graceful shutdown setup
      GracefulShutdown(this.httpServer, {
        signals: "SIGINT SIGTERM",
        timeout: 3000,
        development: false,
        forceExit: true,
        preShutdown: async () => {
          console.info("🛑 Closing Redis connection...");
          await disconnectRedis();
        },
        onShutdown: async () => {
          console.info("🛑 Closing database connection...");
          await disconnectDB();
        },
        finally: () => {
          console.info("✅ Server gracefully shut down.");
        },
      });
    } catch (error) {
      console.error("❌ Server startup failed:", error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }
}

const server = new SERVER();
server.start();
