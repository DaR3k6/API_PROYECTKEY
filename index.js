//INSTACION LOS VERBOS DE HTTPS
const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");

//PONGO EL PUERTO
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
//ACEPTAN LOS DATOS DEL FORMULARIO FORM-URLCODED
app.use(express.urlencoded({ extended: true }));

//INICIAMOS CON LAS RUTAS QUE POR EL CONTROLADOR
const usuarioRuta = require("./routes/usuario");
const productoRuta = require("./routes/producto");
//RUTAS ACUERDO CON EL CONTROLADOR
app.use("/api/", usuarioRuta);
app.use("/api/", productoRuta);

app.listen(port, () => {
  console.log(`El servidor está conectado en: http://localhost:${port}`);
});
