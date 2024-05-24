import express from "express";
import userController from "../controllers/userController";
import { jwtCheck, jwtParse } from "../middlewares/userMiddleware";
import { validateUserRequest } from "../middlewares/validation";

const router = express.Router();

router.post("/", userController.createCurrentUser);
router.put(
  "/",
  jwtCheck,
  jwtParse,
  validateUserRequest,
  userController.updateCurrentUser
);

export default router;
