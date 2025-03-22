// Purpose: Middleware for authorisation checks
import { Request, Response, NextFunction } from "express";

interface UserPayload {
  id: number;
  role: string;
}

interface AuthenticatedRequest extends Request {
  user?: UserPayload;
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
          error: "Authentication required",
        });
      }

      // Check if user has admin role
      if (req.user.role !== "superadmin" && req.user.role !== "admin") {
        return res.status(403).json({
          status: 403,
          message: "Forbidden - Admin access required",
          error: "Insufficient permissions",
        });
      }

      // If user is admin or superadmin, proceed to next middleware/route handler
      next();
    } catch (error) {
      next(error);
    }
  }

  // Additional middleware to check for superadmin only
  public static async checkSuperAdmin(
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
          error: "Authentication required",
        });
      }

      // Check if user has superadmin role
      if (req.user.role !== "superadmin") {
        return res.status(403).json({
          status: 403,
          message: "Forbidden - Super Admin access required",
          error: "Insufficient permissions",
        });
      }

      // If user is superadmin, proceed to next middleware/route handler
      next();
    } catch (error) {
      next(error);
    }
  }
}