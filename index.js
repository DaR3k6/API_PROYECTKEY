//INSTACION LOS VERBOS DE HTTPS
const express = require("express");
const app = express();
const cors = require("cors");

// Configuración de Swagger
const swaggerOptions = require("./Swagger");
const swaggerUi = require("swagger-ui-express");

//PONGO EL PUERTO
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
//ACEPTAN LOS DATOS DEL FORMULARIO FORM-URLCODED
app.use(express.urlencoded({ extended: true }));

//INICIAMOS CON LAS RUTAS QUE POR EL CONTROLADOR
const usuarioRuta = require("./routes/usuario");
const productoRuta = require("./routes/producto");
const detalleRuta = require("./routes/detalle");

//RUTAS ACUERDO CON EL CONTROLADOR
app.use("/proyectkey/", usuarioRuta);
app.use("/proyectkey/", productoRuta);
app.use("/proyectkey/", detalleRuta);

// Configuración de Swagger en una ruta específica
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOptions));

app.listen(port, () => {
  console.log(`El servidor está conectado en: http://localhost:${port}`);
});
