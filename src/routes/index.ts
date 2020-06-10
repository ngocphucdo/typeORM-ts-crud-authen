import { Router } from "express";
import auth from "./auth";
import users from "./users";
import posts from "./posts";
import permision from "./permisions";

const routes = Router();

//Middlewares
routes.use("/auth", auth);
routes.use("/users", users);
routes.use("/posts", posts);
routes.use("/permision", permision);

export default routes;
