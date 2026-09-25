import { getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";

export function requireAuth(request: Request, response: Response, next: NextFunction): void {
  if (!getAuth(request).userId) {
    response.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}
