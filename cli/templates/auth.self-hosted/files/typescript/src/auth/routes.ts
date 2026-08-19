import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

export const authRouter = Router();

authRouter.post("/register", async (request, response) => {
  const { email, password } = request.body as { email?: string; password?: string };
  if (!email || !password || password.length < 8) {
    response.status(400).json({ error: "Email and an 8+ character password are required" });
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    response.status(409).json({ error: "Email is already registered" });
    return;
  }

  const user = await prisma.user.create({
    data: { email, passwordHash: await bcrypt.hash(password, 12) },
    select: { id: true, email: true },
  });
  response.status(201).json({ user, token: signToken(user.id) });
});

authRouter.post("/login", async (request, response) => {
  const { email, password } = request.body as { email?: string; password?: string };
  const user = email ? await prisma.user.findUnique({ where: { email } }) : null;
  if (!user || !password || !(await bcrypt.compare(password, user.passwordHash))) {
    response.status(401).json({ error: "Invalid email or password" });
    return;
  }
  response.json({ user: { id: user.id, email: user.email }, token: signToken(user.id) });
});

function signToken(userId: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is required");
  return jwt.sign({ sub: userId }, secret, { expiresIn: "7d" });
}
