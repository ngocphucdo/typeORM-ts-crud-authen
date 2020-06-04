import { Router } from "express";
import auth from "./auth";
import users from "./users";
import posts from "./posts";

const routes = Router();

//Middlewares
routes.use("/auth", auth);
routes.use("/users", users);
routes.use("/posts", posts);

export default routes;
