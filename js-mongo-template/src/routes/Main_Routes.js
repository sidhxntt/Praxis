// Purpose: Main routes file to define all routes for the application. It imports all the sub-routes and initializes them.
// This file is then imported in the server file to initialize all the routes.

import users from "./users.js";
import Api_user from "./API_user.js";
import addresses from "./addresses.js";
import posts from "./posts.js";
import todos from "./todos.js";
import albums from "./albums.js";
import home from "./home.js";
import images from "./images.js";
import promClient from "prom-client";

// Prometheus metrics
promClient.collectDefaultMetrics();
const getMetrics = async () => promClient.register.metrics();

class MainRoutes {
  constructor(app) {
    this.app = app;
    this.path = "/api/v1";
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Home route
    this.app.use("/", home);

    // API routes
    this.app.use(`${this.path}`, Api_user);
    this.app.use(`${this.path}/users`, users);
    this.app.use(`${this.path}/posts`, posts);
    this.app.use(`${this.path}/todos`, todos);
    this.app.use(`${this.path}/albums`, albums);
    this.app.use(`${this.path}/addresses`, addresses);
    this.app.use(`${this.path}/images`, images);

    // Metrics route
    this.app.get("/metrics", async (_, res, next) => {
      try {
        const metrics = await getMetrics();
        res.set("Content-Type", promClient.register.contentType);
        res.send(metrics);
      } catch (error) {
        next(error);
      }
    });

    // Catch-all for undefined routes
    this.app.use("*", (_, res) => {
      res.status(404).json({ error: "Route not found" });
    });
  }
}

export default (app) => {
  new MainRoutes(app);
};
