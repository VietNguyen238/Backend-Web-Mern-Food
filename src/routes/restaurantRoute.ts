import express from "express";
import { RestaurantController } from "../controllers/restaurantController";
import multer from "multer";
import { jwtCheck, jwtParse } from "../middlewares/userMiddleware";
import { validateRestaurantRequest } from "../middlewares/validation";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.get("/", jwtCheck, jwtParse, RestaurantController.getRestaurant);

router.post(
  "/",
  upload.single("imageFile"),
  validateRestaurantRequest,
  jwtCheck,
  jwtParse,
  RestaurantController.createRestaurant
);

export default router;
