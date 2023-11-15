const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation PROYECT KEY",
      version: "1.0.0",
      description: "Descripción de la API de ejemplo",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/usuario.js", "./routes/productos.js"],
};
const specs = swaggerJsdoc(options);

module.exports = specs;
