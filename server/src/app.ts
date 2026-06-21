import express from "express";
import type { Express } from "express";
import path from "path";
import { fileURLToPath } from "url";
import env from "./config/config.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import authRoutes from "./routes/auth.route.js";
import linkRoutes from "./routes/link.route.js";

// Recreate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createApp = () => {
  const app: Express = express();

  app.use(express.json());
  app.use(cookieParser());

  if (env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  // 1. Serve static files from the built client directory
  const clientBuildPath = path.join(__dirname, "../../client/dist");
  app.use(express.static(clientBuildPath));

  app.get("/health", (_req, res) => {
    res.send("Server running perfectly");
  });

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/links", linkRoutes);

  // 2. Wildcard fallback: Redirect all other GET requests to index.html
  // (This allows React Router to handle client-side routing on page refreshes)
  app.get("/*name", (req, res, next) => {
    // Skip fallback for API calls
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });

  app.use(errorHandler);

  return app;
};

export default createApp;
