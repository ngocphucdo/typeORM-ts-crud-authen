import { Post } from "./../entity/Post";
import { Response, Request } from "express";
import { Router } from "express";
import PostController from "../controllers/PostController";
import { checkRole } from "../middlewares/checkRole";
import { checkJWT } from "../middlewares/checkJWT";

const router = Router();

router.get("/", [checkJWT], PostController.getAll);

router.get("/:id([0-9]+)", [checkJWT], PostController.getOneById);

router.post("/", [checkJWT], PostController.newOne);

router.patch("/:id([0-9]+)", [checkJWT], PostController.editOneById);

router.delete("/:id([0-9]+)", [checkJWT], PostController.deleteOneById);

export default router;
