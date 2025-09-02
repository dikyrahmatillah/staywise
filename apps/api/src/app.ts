import express, { Application, Request, Response } from "express";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import logger from "./utils/logger.js";
import authRouter from "./routers/auth.router.js";
import propertyRouter from "./routers/property.route.js";

export class App {
  app: Application;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    this.app.use(express.json());
  }

  setupRoutes() {
    this.app.use("/api/v1/auth", authRouter);
    this.app.use("/api/v1/properties", propertyRouter);
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
