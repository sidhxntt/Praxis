// Purpose: Handle all routes related to the todos endpoint.
import { Router } from "express";
import { SubRoutes } from "./Sub_Routes";
import JWT from "../controllers/Authentication";
import limiter from "../controllers/rate_limitter";
import { prisma } from "../utils/Clients/Prisma";
import { TodoData } from "../utils/helpers/Todo";


const createUserRoutes = (): Router => {
  
  const auth = new JWT();
  const todosRoutes = new SubRoutes();
  const todos = new TodoData(prisma.todos);

  todosRoutes.endpoint("get", "/", todos.getAll.bind(todos), [auth.decryptJWT, limiter]);
  todosRoutes.endpoint("get", "/:id", todos.getOne.bind(todos), [auth.decryptJWT, limiter]);
  todosRoutes.endpoint("post", "/", todos.create.bind(todos), [auth.decryptJWT, limiter]);
  todosRoutes.endpoint("patch", "/:id", todos.update.bind(todos), [auth.decryptJWT, limiter]);
  todosRoutes.endpoint("delete", "/:id", todos.delete.bind(todos), [auth.decryptJWT, limiter]);

  return todosRoutes.getRouter();
};

const todos = createUserRoutes();
export default todos;
