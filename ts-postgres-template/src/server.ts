// Description: This file is the entry point of the application. It starts the server, connects to the database & redis, and initializes the routes.
// It also handles graceful shutdown of the server and database connections.
import express, { Application } from "express";
import AllRoutes from "./routes/Main_Routes";
import error_handling from "./controllers/error";
import cors from "cors";
import GracefulShutdown from "http-graceful-shutdown";
import helmet from "helmet";
import dotenv from "dotenv";
import { connectDB, disconnectDB } from "./utils/Clients/Prisma";
import { redis_connection, disconnectRedis } from "./utils/Clients/Redis";

dotenv.config();

export default class SERVER {
  private app: Application;
  private port: string | number;
  private httpServer: any; 
  private serverUrl: string;

  constructor() {
    this.app = express();
    this.port = process.env.MAIN_SERVER_PORT || 8000;
    this.serverUrl = process.env.MAIN_SERVER_URL || "http://localhost:8000";
    this.initialize_Routes_and_middlewares();
  }

  private initialize_Routes_and_middlewares(): void {
    this.app.use(
      cors({
        origin: process.env.CLIENT,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    ), // Enable CORS

    this.app.use(express.json()); // Parse JSON bodies
    this.app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
    this.app.use(helmet()); //security middleware

    AllRoutes(this.app); // Main routes
    this.app.use(error_handling); // global error handling middlewares
  }

  public async start(): Promise<void> {
    try {
      await connectDB();
      redis_connection();

      this.httpServer = this.app.listen(this.port, () => {
        console.log(`Server is running at: ${this.serverUrl} 🏄`);
      });

      //graceful shutdown 
      GracefulShutdown(this.httpServer, {
        signals: "SIGINT SIGTERM",
        timeout: 3000,
        development: false,
        forceExit: true,
        preShutdown: async () => {
          await disconnectRedis();
        },
        onShutdown: async () => {
          await disconnectDB();
        },
        finally: () => {
          console.info("Server gracefully shut down. 💅");
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
      }
      console.error("An unknown error occurred during server startup");
      process.exit(1);
    }
  }
}

const server = new SERVER();
server.start();
