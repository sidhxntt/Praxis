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

  createToken(user) {
    return new Promise((resolve, reject) => {
      if (!user || !user.id || !user.role) {
        return reject(new Error("Invalid user object for token creation"));
      }

      // console.log("Creating token with user:", user); // Debug log

      jwt.sign(
        { id: user.id, role: user.role }, // Extract only required fields
        this.secretKey,
        { expiresIn: parseInt(this.maxAge, 10) },
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


  decryptJWT = (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          message: "Token is required",
          error: "Authentication failed",
        });
      }

      jwt.verify(token, this.secretKey, (err, decoded) => {
        if (err) {
          return res.status(403).json({
            message: "Invalid or expired token",
            error: err.message,
          });
        }

        // console.log("Decoded JWT:", decoded); // Debug log

        // Attach decoded user data to request
        req.user = decoded;
        next();
      });
    } catch (error) {
      console.error("JWT Verification Error:", error);
      return res.status(500).json({
        message: "Error processing token",
        error: error.message,
      });
    }
  };

}