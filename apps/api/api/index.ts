import { App } from "../src/app.js";

const appInstance = new App();
const app = appInstance.app; // Express instance from your class

export default app;
