import express, { Application, Request, Response } from "express";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import authRouter from "./routers/auth.router.js";
import logger from "./utils/logger.js";

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

// app.get("/api/health", (request, response) =>
//   response.status(200).json({ message: "API running!" })
// );

// app.get("/api/users", async (request, response) => {
//   const users = await prisma.user.findMany();
//   response.status(200).json(users);
// });

// app.post("/api/users", async (request, response) => {
//   const parsedData = CreateUserSchema.safeParse(request.body);

//   if (!parsedData.success) {
//     return response.status(400).json({ message: parsedData.error });
//   }

//   const user = await prisma.user.create({ data: parsedData.data });

//   response.status(201).json({ message: "User created", user });
// });
