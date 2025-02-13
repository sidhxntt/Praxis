// Desc: User routes for the API
import { SubRoutes } from "./Sub_Routes.js";
import JWT from "../controllers/Authentication.js";
import limiter from "../controllers/rate_limitter.js";
import { prisma } from "../utils/Clients/Prisma.js";
import { UserData } from "../utils/helpers/User.js";

const createUserRoutes = () => {
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
