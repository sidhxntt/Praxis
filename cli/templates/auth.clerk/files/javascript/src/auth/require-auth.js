import { getAuth } from "@clerk/express";

export function requireAuth(request, response, next) {
  if (!getAuth(request).userId) return response.status(401).json({ error: "Unauthorized" });
  next();
}
