// Purpose: Handle all routes related to albums endpoint.

import JWT from "../controllers/Authentication";
import limiter from "../controllers/rate_limitter";
import { prisma } from "../utils/Clients/Prisma";
import { AlbumData } from "../utils/helpers/Albums";
import { SubRoutes } from "./Sub_Routes";

const createUserRoutes = () => {
    const auth = new JWT();
    const albumRoutes = new SubRoutes();
    const albums = new AlbumData(prisma.album)

    albumRoutes.endpoint('get', '/', albums.getAll.bind(albums), [auth.decryptJWT, limiter]);
    albumRoutes.endpoint('get', '/:id', albums.getOne.bind(albums), [auth.decryptJWT, limiter]);
    albumRoutes.endpoint('post', '/', albums.create.bind(albums), [auth.decryptJWT, limiter]);
    albumRoutes.endpoint('patch', '/:id', albums.update.bind(albums), [auth.decryptJWT, limiter]);
    albumRoutes.endpoint('delete', '/:id', albums.delete.bind(albums), [auth.decryptJWT, limiter]);
    
    return albumRoutes.getRouter();
};

const users = createUserRoutes()
export default users;