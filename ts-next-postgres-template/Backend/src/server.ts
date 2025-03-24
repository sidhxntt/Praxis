// Description: This file is the entry point of the application. It starts the server, connects to the database & Redis, and initializes the routes.
// It also handles graceful shutdown of the server and database connections.

import express, { Application, Request, Response } from "express";
import AllRoutes from "./routes/Main_Routes";
import error_handling from "./controllers/error";
import cors from "cors";
import GracefulShutdown from "http-graceful-shutdown";
import helmet from "helmet";
import dotenv from "dotenv";
import { connectDB, disconnectDB } from "./utils/Clients/Prisma";
import { redis_connection, disconnectRedis } from "./utils/Clients/Redis";

dotenv.config();

// Extend Express Request type to include rawBody
declare global {
  namespace Express {
    interface Request {
      rawBody?: Buffer;
    }
  }
}

export default class SERVER {
  private app: Application;
  private port: string | number;
  private httpServer: any; // Explicitly typed as Server
  private serverUrl: string;

  constructor() {
    this.app = express();
    this.port = process.env.MAIN_SERVER_PORT || 8000;
    this.serverUrl = process.env.MAIN_SERVER_URL || "http://localhost:8000";
    this.initializeRoutesAndMiddlewares();
  }

  private initializeRoutesAndMiddlewares(): void {
    this.app.use(
      cors({
        origin: process.env.CLIENT || "http://localhost:5173", // ✅ Allow frontend origin
        credentials: true, // ✅ Required for cookies to be saved
        methods: ["GET", "POST", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"], // ✅ Remove `WithCredentials` (not a valid header)
      })
    );
    
    this.app.use(
      express.json({
        verify: (req: Request, res: Response, buf: Buffer) => {
          req.rawBody = buf; 
        },
      })
    ); // Parse JSON bodies

    this.app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
    this.app.use(helmet()); // Security middleware

    AllRoutes(this.app); // Load main routes
    this.app.use(error_handling); // Global error handling middleware
  }

  public async start(): Promise<void> {
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
