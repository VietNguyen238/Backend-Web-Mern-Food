import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import userRoute from "./routes/userRoute";
const port = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(uri as string).then(() => console.log("Connected to MongoDB"));

app.use("/api/user", userRoute);

app.listen(port, () => {
  console.log("listening on port " + port);
});
