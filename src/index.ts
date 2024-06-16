import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import userRoute from "./routes/userRoute";
import restaurantRoute from "./routes/restaurantRoute";
import { v2 as cloudinary } from "cloudinary";
import restaurantSearchRoute from "./routes/restaurantSearchRoute";
const port = process.env.PORT || 4000;
const uri = process.env.MONGODB_URI;
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(uri as string).then(() => console.log("Connected to MongoDB"));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "Health OK!" });
});

app.use("/api/user", userRoute);
app.use("/api/restaurant", restaurantRoute);
app.use("/api/v1/restaurant", restaurantSearchRoute);

app.listen(port, () => {
  console.log("listening on port " + port);
});
