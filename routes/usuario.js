const express = require("express");
const router = express.Router();
const usuarioController = require("../controller/usuario");

// Ruta para registrar un rol de usuario
router.post("/usuario/registrarRol", usuarioController.registrarRol);
router.post("/usuario/registrarUsuario", usuarioController.registrarUsuario);
module.exports = router;
