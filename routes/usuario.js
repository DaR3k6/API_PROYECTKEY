const express = require("express");
const router = express.Router();
const usuarioController = require("../controller/usuario");

// Ruta para registrar un rol de usuario
router.post("/usuario/registrarRol", usuarioController.registrarRol);
router.post("/usuario/registrarUsuario", usuarioController.registrarUsuario);

// Ruta para registrar un vendedor y cliente
router.post("/vendedor/registrarVendedor", usuarioController.registrarVendedor);

//Ruta para iniciar Sesion
router.post("/login", usuarioController.loginUsuario);

module.exports = router;
