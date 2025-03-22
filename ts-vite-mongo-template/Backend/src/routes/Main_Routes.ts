import tasks from "./tasks";import home from "./home";
import promClient from "prom-client";
import JWT from "../controllers/Authentication";
import { setupOAuthRoutes } from "../controllers/google_&_github";
import users from "./users";
import { payments } from "../utils/helpers/LemonSqueezy";
import { Application, Request, Response, NextFunction } from "express";

const auth = new JWT();

// Prometheus metrics setup
promClient.collectDefaultMetrics();
const getMetrics = async (): Promise<string> => promClient.register.metrics();

class MainRoutes {
  private app: Application;
  private path: string;

  constructor(app: Application) {
    this.app = app;
    this.path = "/api/v1";
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Home route
    this.app.use("/", home);

    // API routes
    this.app.use(this.path, users);
    this.app.use(`${this.path}/tasks`, tasks);
 
    // Metrics route
    this.app.get("/metrics", async (_: Request, res: Response, next: NextFunction) => {
      try {
        const metrics = await getMetrics();
        res.set("Content-Type", promClient.register.contentType);
        res.send(metrics);
      } catch (error) {
        next(error);
      }
    });

    // OAuth Routes
    setupOAuthRoutes(this.app);

    // JWT PAYLOAD CHECK ROUTE
    this.app.get("/auth/check", auth.decryptJWT, (req: Request, res: Response) => {
      res.json({ message: "You have access!", JWT_payload: req.user });
    });

    // Payment Route
    payments(this.app);

    // Catch-all for undefined routes
    this.app.use("*", (_: Request, res: Response) => {
      res.status(404).json({ error: "Route not found" });
    });
  }
}

// Export function with proper type
export default (app: Application): void => {
  new MainRoutes(app);
};
