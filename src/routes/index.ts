import { Router } from "express";
import auth from "./auth";
import users from "./users";

const routes = Router();

//Middlewares
routes.use("/auth", auth);
routes.use("/users", users);

export default routes;
