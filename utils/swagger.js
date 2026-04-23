import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Software Project",
      version: "1.0.0",
      description: `API documentation for Software Project (Updated: ${new Date().toLocaleTimeString()})`,
    },
    servers: [
      {
        url: "https://comp-404-backend.vercel.app",
        description: "Production server",
      },
      {
        url: "http://localhost:5000",
        description: "Local server",
      }
    ],
  },
  apis: [path.join(process.cwd(), "Src/modules/**/*.router.js")],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
