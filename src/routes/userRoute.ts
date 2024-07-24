import express from "express";
import userController from "../controllers/UserController";
import { jwtCheck, jwtParse } from "../middlewares/userMiddleware";
import { validateUserRequest } from "../middlewares/validation";

const router = express.Router();

router.get("/", jwtCheck, jwtParse, userController.getCurrentUser);
router.post("/", jwtCheck, userController.createCurrentUser);
router.put(
  "/",
  jwtCheck,
  jwtParse,
  validateUserRequest,
  userController.updateCurrentUser
);

export default router;
