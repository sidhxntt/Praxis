// Init router and data controller for the address route 
import { SubRoutes } from "./Sub_Routes.js";
import JWT from "../controllers/Authentication.js";
import limiter from "../controllers/rate_limitter.js";
import { prisma } from "../utils/Clients/Prisma.js";
import { AddressData } from "../utils/helpers/Address.js";

const createUserRoutes = () => {

    const auth = new JWT();
    const addressRoutes = new SubRoutes();
    const address = new AddressData(prisma.address, 'address')

    addressRoutes.endpoint('get', '/', address.getAll.bind(address), [auth.decryptJWT, limiter]);
    addressRoutes.endpoint('get', '/:id', address.getOne.bind(address), [auth.decryptJWT, limiter]);
    addressRoutes.endpoint('post', '/', address.create.bind(address), [auth.decryptJWT, limiter]);
    addressRoutes.endpoint('patch', '/:id', address.update.bind(address), [auth.decryptJWT, limiter]);
    addressRoutes.endpoint('delete', '/:id', address.delete.bind(address), [auth.decryptJWT, limiter]);

    return addressRoutes.getRouter();
};

const users = createUserRoutes()
export default users;