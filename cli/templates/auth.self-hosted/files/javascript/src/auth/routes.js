import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

export const authRouter = Router();

authRouter.post("/register", async (request, response) => {
  const { email, password } = request.body;
  if (!email || !password || password.length < 8) return response.status(400).json({ error: "Email and an 8+ character password are required" });
  if (await prisma.user.findUnique({ where: { email } })) return response.status(409).json({ error: "Email is already registered" });
  const user = await prisma.user.create({ data: { email, passwordHash: await bcrypt.hash(password, 12) }, select: { id: true, email: true } });
  response.status(201).json({ user, token: signToken(user.id) });
});

authRouter.post("/login", async (request, response) => {
  const { email, password } = request.body;
  const user = email ? await prisma.user.findUnique({ where: { email } }) : null;
  if (!user || !password || !(await bcrypt.compare(password, user.passwordHash))) return response.status(401).json({ error: "Invalid email or password" });
  response.json({ user: { id: user.id, email: user.email }, token: signToken(user.id) });
});

function signToken(userId) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is required");
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}
