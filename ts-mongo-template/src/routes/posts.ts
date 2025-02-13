// Desc: Post routes for the API
import { Router } from "express";
import { SubRoutes } from "./Sub_Routes";
import JWT from "../controllers/Authentication";
import limiter from "../controllers/rate_limitter";
import { prisma } from "../utils/Clients/Prisma";
import { PostData } from "../utils/helpers/Posts";

const createUserRoutes = (): Router => {

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