import express from "express";
import { jwtCheck, jwtParse } from "../middlewares/userMiddleware";
import { OrderController } from "../controllers/OrderController";

const router = express.Router();

router.post(
  "/checkout/create-checkout-session",
  jwtCheck,
  jwtParse,
  OrderController.createCheckoutSession
);

router.get("/", jwtCheck, jwtParse, OrderController.getMyOrder);

router.post("/checkout/webhook", OrderController.stripeWebhookHandler);

export default router;
