import { checkJWT } from "../middlewares/checkJWT";
import { Router } from "express";
import UserController from "../controllers/UserController";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

//Route get all
router.get("/", [checkJWT, checkRole(["ADMIN"])], UserController.getAll);

//Route get user by ID
router.get(
  "/:id([0-9]+)",
  [checkJWT, checkRole(["ADMIN"])],
  UserController.getOneById
);

//Route Create a new user
router.post("/register", UserController.newOne);

//Route Edit user
router.patch(
  "/:id([0-9]+)",
  [checkJWT, checkRole(["ADMIN"])],
  UserController.editOneById
);

//Route delete user
router.delete(
  "/:id",
  [checkJWT, checkRole(["ADMIN"])],
  UserController.deleteOneById
);

export default router;
