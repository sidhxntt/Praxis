import { createClient } from "@supabase/supabase-js";

export async function requireAuth(request, response, next) {
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
  const { SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: key } = process.env;
  if (!token || !url || !key) return response.status(401).json({ error: "Unauthorized" });
  const { data, error } = await createClient(url, key).auth.getUser(token);
  if (error || !data.user) return response.status(401).json({ error: "Unauthorized" });
  response.locals.user = data.user;
  next();
}
