// This file is used to create a sub route for the main route.
// It contains a class that creates a router object and adds endpoints to it.
import { Router } from "express";

export class SubRoutes {
  constructor() {
    this.router = Router();
  }

  endpoint(
    method,
    path,
    handler,
    middlewares // add any number of middlewares (authorisation, authentication & rate limiting already added.)
  ) {
    this.router[method](path, ...middlewares, async (req, res, next) => {
      try {
        await handler(req, res);
      } catch (error) {
        next(error);
      }
    });
  }

  getRouter() {
    return this.router;
  }
}