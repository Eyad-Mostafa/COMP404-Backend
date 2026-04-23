import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../utils/swagger.js";
import { globalErrorHandling } from "../utils/errorHandling.js";
import connectionDB from "./DB/config/connection.js";
import AuthRouter from "./modules/Auth/auth.router.js";

const bootstrap = async (app, express) => {
  await connectionDB();

  app.use(express.json());
  app.use(cors());
  app.use("/auth", AuthRouter);
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCssUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui.min.css",
      customJs: [
        "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-bundle.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-standalone-preset.min.js",
      ],
    }),
  );
  app.all(/(.*)/, (req, res) => {
    res.status(404).json({ message: "Page not found" });
  });
  app.use(globalErrorHandling);
  await connectionDB();
};

export default bootstrap;
