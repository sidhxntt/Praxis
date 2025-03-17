// Desc: Post routes for the API
import { SubRoutes } from "./Sub_Routes.js";
import JWT from "../controllers/Authentication.js";
import limiter from "../controllers/rate_limitter.js";
import { prisma } from "../utils/Clients/Prisma.js";
import { PostData } from "../utils/helpers/Posts.js";

const createUserRoutes = () => {

    const auth = new JWT();
    const postRoutes = new SubRoutes();
    const posts = new PostData(prisma.post)

    postRoutes.endpoint('get', '/', posts.getAll.bind(posts), [auth.decryptJWT, limiter]);
    postRoutes.endpoint('get', '/:id', posts.getOne.bind(posts), [auth.decryptJWT, limiter]);
    postRoutes.endpoint('post', '/', posts.create.bind(posts), [auth.decryptJWT, limiter]);
    postRoutes.endpoint('patch', '/:id', posts.update.bind(posts), [auth.decryptJWT, limiter]);
    postRoutes.endpoint('delete', '/:id', posts.delete.bind(posts), [auth.decryptJWT, limiter]);

    return postRoutes.getRouter();
};

const post = createUserRoutes()
export default post;