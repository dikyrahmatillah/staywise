import { App } from "./app.js";

const PORT = process.env.PORT || "8000";
const server = new App();
server.listen(PORT);
