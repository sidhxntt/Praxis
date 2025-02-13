// Init router and data controller for the address route 
import { Router } from "express";
import { SubRoutes } from "./Sub_Routes";
import JWT from "../controllers/Authentication";
import limiter from "../controllers/rate_limitter";
import { prisma } from "../utils/Clients/Prisma";
import { BaseData } from "../utils/helpers/BaseData";

const createUserRoutes = (): Router => {

    const auth = new JWT();
    const addressRoutes = new SubRoutes();
    const address = new BaseData(prisma.address, 'address')

    addressRoutes.endpoint('get', '/', address.getAll.bind(address), [auth.decryptJWT, limiter]);
    addressRoutes.endpoint('get', '/:id', address.getOne.bind(address), [auth.decryptJWT, limiter]);

    return addressRoutes.getRouter();
};

const users = createUserRoutes()
export default users;