import express from "express";

import { prisma } from "@repo/database";
import { CreateUserSchema } from "@repo/schemas";

const app = express();

app.use(express.json());

app.get("/api/health", (request, response) =>
  response.status(200).json({ message: "API running!" })
);

app.get("/api/users", async (request, response) => {
  const users = await prisma.user.findMany();
  response.status(200).json(users);
});

app.post("/api/users", async (request, response) => {
  const parsedData = CreateUserSchema.safeParse(request.body);

  if (!parsedData.success) {
    return response.status(400).json({ message: parsedData.error });
  }

  const user = await prisma.user.create({ data: parsedData.data });

  response.status(201).json({ message: "User created", user });
});

const PORT = process.env.PORT || "8000";
app.listen(PORT, () => console.info(`Server is listening on port: ${PORT}`));

export default app;
