// Purpose: Handle all routes related to the tasks endpoint.
import { SubRoutes } from "./Sub_Routes.js";
import JWT from "../controllers/Authentication.js";
import limiter from "../controllers/rate_limitter.js";
import { prisma } from "../utils/Clients/Prisma.js";
import { TaskData } from "../utils/helpers/Tasks.js";


const createUserRoutes = () => {
  
  const auth = new JWT();
  const todosRoutes = new SubRoutes();
  const tasks = new TaskData(prisma.task);

  todosRoutes.endpoint("get", "/", tasks.getAll.bind(tasks), [auth.decryptJWT, limiter]);
  todosRoutes.endpoint("get", "/:id", tasks.getOne.bind(tasks), [auth.decryptJWT, limiter]);
  todosRoutes.endpoint("post", "/", tasks.create.bind(tasks), [auth.decryptJWT, limiter]);
  todosRoutes.endpoint("patch", "/:id", tasks.update.bind(tasks), [auth.decryptJWT, limiter]);
  todosRoutes.endpoint("delete", "/:id", tasks.delete.bind(tasks), [auth.decryptJWT, limiter]);

  return todosRoutes.getRouter();
};

const tasks = createUserRoutes();
export default tasks;
