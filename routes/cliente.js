const express = require("express");
const router = express.Router();
const clienteController = require("../controller/cliente");

// Ruta para registrar un rol de usuario
router.post("/cliente/registrarCliente", clienteController.registrarCliente);
module.exports = router;
