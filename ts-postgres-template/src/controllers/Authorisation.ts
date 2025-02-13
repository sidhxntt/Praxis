// Purpose: Middleware for authorisation checks
import { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export default class AUTH {
  public static async checkAdmin(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      // Check if user exists in request
      if (!req.user) {
        return res.status(401).json({
          status: 401,
          message: "Unauthorized - No user found",
          error: "Authentication required"
        });
      }

      // Check if user has admin role
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          status: 403,
          message: "Forbidden - Admin access required",
          error: "Insufficient permissions"
        });
      }

      // If user is admin, proceed to next middleware/route handler
      next();
    } catch (error) {
      next(error)
    }
  }
}