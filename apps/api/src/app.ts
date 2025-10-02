import express, { Application, Request, Response } from "express";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import cors from "cors";
import logger from "./utils/logger.js";
import authRouter from "./routers/auth.router.js";
import propertyRouter from "./routers/property.route.js";
import bookingsRouter from "./routers/booking.router.js";
import emailRouter from "./routers/email.router.js";
import categoryRouter from "./routers/category.router.js";
import roomRouter from "./routers/room.router.js";
import webhookRouter from "./routers/webhook.route.js";
import reviweRouter from "./routers/review.router.js";

export class App {
  app: Application;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    // Security: Set security headers
    this.app.use((req, res, next) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("X-Frame-Options", "DENY");
      res.setHeader("X-XSS-Protection", "1; mode=block");
      next();
    });

    // CORS configuration
    this.app.use(
      cors({
        origin:
          process.env.API_CORS_ORIGIN ||
          process.env.NEXT_PUBLIC_API_URL ||
          true,
        credentials: true,
      })
    );

    // Body parser with size limits for security
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    // Trust proxy for deployment behind reverse proxy (Vercel)
    this.app.set("trust proxy", 1);
  }

  setupRoutes() {
    this.app.use("/emails", emailRouter);
    this.app.use("/api/v1/auth", authRouter);
    this.app.use("/api/v1/properties", propertyRouter);
    this.app.use("/api/v1/bookings", bookingsRouter);
    this.app.use("/api/v1/categories", categoryRouter);
    this.app.use("/api/v1/rooms", roomRouter);
    this.app.use("/api/webhooks", webhookRouter);
    this.app.use("/api/v1/reviews", reviweRouter);
    this.app.get("/api/v1/health", (request: Request, response: Response) =>
      response.status(200).json({ message: "API running!" })
    );
  }

  setupErrorHandling() {
    this.app.use(errorMiddleware);
  }

  listen(port: string) {
    this.app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  }
}
