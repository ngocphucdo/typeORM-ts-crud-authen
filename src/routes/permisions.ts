import { Router } from "express";
import PermisionController from "../controllers/PermisionController";

const router = Router();

router.post("/", PermisionController.newOne);

router.get("/", PermisionController.getAll);

export default router;
