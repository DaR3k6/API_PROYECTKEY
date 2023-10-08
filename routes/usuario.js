const express = require("express");
const router = express.Router();
const usuarioController = require("../controller/usuario/usuario");

router.post("/usuario/registrar", usuarioController.registrarUsuario);
router.post("/usuario/registrarRol", usuarioController.rolUsuario);
module.exports = router;
