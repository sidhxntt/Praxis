// Init router and user controller
import { SubRoutes } from "./Sub_Routes.js";
import User from "../utils/helpers/API_User.js";
import limiter from "../controllers/rate_limitter.js";
import JWT from "../controllers/Authentication.js";
import AUTH from "../controllers/Authorisation.js";
import { prisma } from "../utils/Clients/Prisma.js";


const createUserRoutes = () => {
  const auth = new JWT();
  const APIuserRoutes = new SubRoutes();
  const APIuser = new User(prisma.api_users);

  APIuserRoutes.endpoint("get", "/signup", APIuser.signupPage, [limiter]);
  APIuserRoutes.endpoint("post", "/signup", APIuser.signup, [limiter]);
  APIuserRoutes.endpoint("get", "/login", APIuser.loginPage, [limiter]);
  APIuserRoutes.endpoint("post", "/login", APIuser.login, [limiter]);

  APIuserRoutes.endpoint("get", "/api_users", APIuser.getAll.bind(APIuser), [auth.decryptJWT, AUTH.checkAdmin, limiter]);
  APIuserRoutes.endpoint("get", "/api_users/:id", APIuser.getOne.bind(APIuser), [auth.decryptJWT, AUTH.checkAdmin, limiter]);
  APIuserRoutes.endpoint("delete", "/api_users/:id", APIuser.delete.bind(APIuser), [auth.decryptJWT, AUTH.checkAdmin, limiter]);
  APIuserRoutes.endpoint("patch", "/api_users/:id", APIuser.update.bind(APIuser), [auth.decryptJWT, AUTH.checkAdmin, limiter]);

  return APIuserRoutes.getRouter();
};

const users = createUserRoutes();
export default users;