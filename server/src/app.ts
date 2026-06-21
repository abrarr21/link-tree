import express from "express";
import type { Express } from "express";
import env from "./config/config.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import authRoutes from "./routes/auth.route.js";
import linkRoutes from "./routes/link.route.js";

const createApp = () => {
  const app: Express = express();

  app.use(express.json());
  app.use(cookieParser());

  if (env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  app.get("/health", (_req, res) => {
    res.send("Server running perfectly");
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/links", linkRoutes);

  app.use(errorHandler);

  return app;
};

export default createApp;
