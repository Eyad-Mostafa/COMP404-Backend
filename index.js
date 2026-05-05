import express from "express";
import bootstrap from "./Src/index.router.js";
import dotenv from "dotenv";
import { errorMiddleware } from "./Src/middleware/error.middleware.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

await bootstrap(app, express);

app.use(errorMiddleware);

app.listen(port, "0.0.0.0", () => {
  console.log(` Server is running on Port ${port}`);
  console.log(` Environment: ${process.env.NODE_ENV || "development"}`);
});
