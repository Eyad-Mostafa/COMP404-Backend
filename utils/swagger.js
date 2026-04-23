import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Software Project",
      version: "1.0.0",
      description: `API documentation for Software Project (Updated: ${new Date().toISOString()})`,
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local server",
      },
      {
        url: "",
        description: "Production server",
      },
      {
        url: "",
        description: "Alternative Production server",
      },
    ],
  },
  apis: [path.join(process.cwd(), "Src/modules/**/*.router.js")],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
