// Purpose: JWT class to handle token creation and decryption
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export default class JWT {
  constructor() {
    if (!process.env.JWT_SECRET || !process.env.MAX_AGE) {
      throw new Error("Missing environment variables JWT_SECRET or MAX_AGE");
    }
    this.secretKey = process.env.JWT_SECRET;
    this.maxAge = process.env.MAX_AGE;
  }

  createToken(payload) {
    return (
      new Promise() <
      string >
      ((resolve, reject) => {
        jwt.sign(
          payload,
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
      })
    );
  }

  decryptJWT = (req, res, next) => {
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
        req.user = decoded;
        next();
      });
    } catch (error) {
      next(error);
    }
  };
}
