import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import association from "./util/assoc.js";
import authRouter from "./router/authRouter.js";
import itemRouter from "./router/itemRouter.js";
import categoryRouter from "./router/categoryRouter.js";
import chatRouter from "./router/chatRouter.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["https://fp-praktikum-938071808488.asia-southeast2.run.app"],
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello there",
  });
});

app.use("/api", authRouter);
app.use("/api", itemRouter);
app.use("/api", categoryRouter);
app.use("/api", chatRouter);

const PORT = process.env.PORT;

association()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error during association:", error.message);
  });
