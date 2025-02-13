// Desc: User routes for the API
import { Router } from "express";
import { SubRoutes } from "./Sub_Routes";
import JWT from "../controllers/Authentication";
import limiter from "../controllers/rate_limitter";
import { prisma } from "../utils/Clients/Prisma";
import { UserData } from "../utils/helpers/User";

const createUserRoutes = (): Router => {
  const auth = new JWT()
  const userRoutes = new SubRoutes();
  const user = new UserData(prisma.user);

  userRoutes.endpoint("get", "/", user.getAll.bind(user), [auth.decryptJWT, limiter]);
  userRoutes.endpoint("get", "/:id", user.getOne.bind(user), [auth.decryptJWT, limiter]);
  userRoutes.endpoint("post", "/", user.create.bind(user), [auth.decryptJWT, limiter]);
  userRoutes.endpoint("patch", "/:id", user.update.bind(user), [auth.decryptJWT, limiter]);
  userRoutes.endpoint("delete", "/:id", user.delete.bind(user), [auth.decryptJWT, limiter]);

  return userRoutes.getRouter();
};

const users = createUserRoutes();
export default users;
