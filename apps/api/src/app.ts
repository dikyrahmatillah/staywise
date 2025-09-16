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

export class App {
  app: Application;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    this.app.use(
      cors({
        origin:
          process.env.API_CORS_ORIGIN ||
          process.env.NEXT_PUBLIC_API_URL ||
          true,
        credentials: true,
      })
    );
    this.app.use(express.json());
  }

  setupRoutes() {
    this.app.use("/emails", emailRouter);
    this.app.use("/api/v1/auth", authRouter);
    this.app.use("/api/v1/properties", propertyRouter);
    this.app.use("/api/v1/bookings", bookingsRouter);
    this.app.use("/api/v1/categories", categoryRouter);
    this.app.use("/api/v1/rooms", roomRouter);
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
