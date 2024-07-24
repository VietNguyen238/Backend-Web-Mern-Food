import express from "express";
import { param } from "express-validator";
import { RestaurantSearchController } from "../controllers/RestaurantSearchController";

const router = express.Router();

router.get(
  "/:restaurantId",
  param("restaurantId")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Restaurant paramenter must be a valid string"),
  RestaurantSearchController.getARestaurant
);

router.get(
  "/search/:city",
  param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("City paramenter must be a valid string"),
  RestaurantSearchController.searchRestaurants
);

export default router;
