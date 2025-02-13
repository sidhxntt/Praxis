// Purpose: JWT class to handle token creation and decryption
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & {
        id: number;
        role: string;
      };
    }
  }
}

export default class JWT {
  private readonly secretKey: string;
  private readonly maxAge: string;

  constructor() {
    if (!process.env.JWT_SECRET || !process.env.MAX_AGE) {
      throw new Error("Missing environment variables JWT_SECRET or MAX_AGE");
    }
    this.secretKey = process.env.JWT_SECRET;
    this.maxAge = process.env.MAX_AGE;
  }

  public createToken(id: number, role: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      jwt.sign(
        { id, role }, 
        this.secretKey,
        {
          expiresIn: parseInt(this.maxAge, 10),
        },
        (err, token) => {
          if (err) {
            return reject(err);
          }
          if (!token) {
            return reject(new Error("Failed to create token"));
          }
          resolve(token);
        }
      );
    });
  }

  public decryptJWT = (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "Token is required" });
      }

      jwt.verify(token, this.secretKey, (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Invalid or expired token" });
        }
        // Cast decoded to include both id and role
        req.user = decoded as JwtPayload & { id: number; role: string };
        next();
      });
    } catch (error) {
      next(error);
    }
  };
}