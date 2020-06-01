import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { checkJWT } from "../middlewares/checkJWT";

const router = Router();
//Login route
router.post("/login", AuthController.login);

//Change password
router.post("/change-password", [checkJWT], AuthController.changePassword);

export default router;
