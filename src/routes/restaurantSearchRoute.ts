import express from "express";
import { param } from "express-validator";
import { RestaurantSearchController } from "../controllers/restaurantSearchController";

const router = express.Router();

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
