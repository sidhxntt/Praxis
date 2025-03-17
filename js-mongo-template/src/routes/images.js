// Desc: Images routes
import { SubRoutes } from "./Sub_Routes.js";
import JWT from "../controllers/Authentication.js";
import limiter from "../controllers/rate_limitter.js";
import { prisma } from "../utils/Clients/Prisma.js";
import { ImageData } from "../utils/helpers/Images.js";

const createUserRoutes = () => {

    const auth = new JWT();
    const imagesRoutes = new SubRoutes();
    const images = new ImageData(prisma.image)

    imagesRoutes.endpoint('get', '/', images.getAll.bind(images), [auth.decryptJWT, limiter]);
    imagesRoutes.endpoint('get', '/:id', images.getOne.bind(images), [auth.decryptJWT, limiter]);
    imagesRoutes.endpoint('post', '/', images.create.bind(images), [auth.decryptJWT, limiter]);
    imagesRoutes.endpoint('patch', '/:id', images.update.bind(images), [auth.decryptJWT, limiter]);
    imagesRoutes.endpoint('delete', '/:id', images.delete.bind(images), [auth.decryptJWT, limiter]);

    return imagesRoutes.getRouter();
};

const images = createUserRoutes()
export default images;