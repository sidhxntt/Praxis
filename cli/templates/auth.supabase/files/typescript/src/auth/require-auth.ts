import { createClient } from "@supabase/supabase-js";
import type { NextFunction, Request, Response } from "express";

export async function requireAuth(request: Request, response: Response, next: NextFunction): Promise<void> {
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!token || !url || !key) {
    response.status(401).json({ error: "Unauthorized" });
    return;
  }
  const { data, error } = await createClient(url, key).auth.getUser(token);
  if (error || !data.user) {
    response.status(401).json({ error: "Unauthorized" });
    return;
  }
  response.locals.user = data.user;
  next();
}
