import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())


export default app;


