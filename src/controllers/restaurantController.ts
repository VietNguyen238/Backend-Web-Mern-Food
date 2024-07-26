import { Request, Response } from "express";
import Restaurant from "../models/restaurant";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import Order from "../models/order";

export const uploadImage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;

  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
  return uploadResponse.url;
};

export const RestaurantController = {
  createRestaurant: async (req: Request, res: Response) => {
    try {
      const existingRestaurant = await Restaurant.findOne({ user: req.userId });

      if (existingRestaurant) {
        return res
          .status(409)
          .json({ message: "User restaurant already exists" });
      }

      const image = req.file as Express.Multer.File;
      const base64Image = Buffer.from(image.buffer).toString("base64");
      const dataURI = `data:${image.mimetype};base64,${base64Image}`;

      const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

      const restaurant = new Restaurant(req.body);

      restaurant.imageUrl = uploadResponse.url;
      restaurant.user = new mongoose.Types.ObjectId(req.userId);
      restaurant.lastUpdated = new Date();
      await restaurant.save();

      res.status(201).send(restaurant);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  getRestaurant: async (req: Request, res: Response) => {
    try {
      const restaurant = await Restaurant.findOne({ user: req.userId });

      if (!restaurant) {
        return res.status(404).json({ message: "Restanrant not found" });
      }
      res.json(restaurant);
    } catch (error) {
      res.status(500).json({ message: "Error fetching restaurant" });
    }
  },

  updateRestaurant: async (req: Request, res: Response) => {
    try {
      const restaurant = await Restaurant.findOne({ user: req.userId });

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      restaurant.restaurantName = req.body.restaurantName;
      restaurant.city = req.body.city;
      restaurant.country = req.body.country;
      restaurant.deliveryPrice = req.body.deliveryPrice;
      restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
      restaurant.cuisines = req.body.cuisines;
      restaurant.menuItems = req.body.menuItems;
      restaurant.lastUpdated = new Date();

      if (req.file) {
        const imageUrl = await uploadImage(req.file as Express.Multer.File);
        restaurant.imageUrl = imageUrl;
      }

      await restaurant.save();
      res.status(200).send(restaurant);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  getMyRestaurantOrders: async (req: Request, res: Response) => {
    try {
      const restaurant = await Restaurant.findOne({ user: req.userId });
      if (!restaurant) {
        return res.status(404).json({ message: "restaurant not found" });
      }
      const orders = await Order.find({ restaurant: restaurant._id })
        .populate("restaurant")
        .populate("user");

      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  updateOrderStatus: async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const restaurant = await Restaurant.findById(order.restaurant);

      if (restaurant?.user?._id.toString() !== req.userId) {
        return res.status(401).send();
      }

      order.status = status;
      await order.save();

      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: "Unnable to update order status" });
    }
  },
};
