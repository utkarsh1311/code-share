import express from "express";
import morgan from "morgan";
import cors from "cors";
import userRouter from "./routes/userRouter";
import mongoose from "mongoose";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/users", userRouter);

app.use(errorHandler);

export default app;
