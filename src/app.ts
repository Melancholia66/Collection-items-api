require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import config from "config";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/connectDB";
import userRouter from "./routes/user.route";
import authRouter from "./routes/auth.route";
import collectionRouter from "./routes/collections.route";
import itemRouter from "./routes/item.route";
import commentRouter from "./routes/comment.route";

const app = express();

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(
  cors({
    origin: config.get<string>("origin"),
    credentials: true,
  })
);
app.use("/uploads", express.static("uploads"));

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/collection", collectionRouter);
app.use("/api/item", itemRouter);
app.use("/api/item/comment", commentRouter);

app.get("/healthChecker", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: "success",
    message: "by Kristina Ignatovich",
  });
});

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
  connectDB();
});
