const express = require("express");
const usuario = express.Router();
const conexion = require("./model/Conexion.js"); // <-- Posible origen del error
const { promisify } = require("util");

// REGISTRAMOS EL USUARIO JUNTO CON EL ROL
const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, contraseña, idRol } = req.body; // Obtener datos del cuerpo de la solicitud

    const procedimientoAlmacenado = promisify(conexion.query).bind(conexion);
    const result = await procedimientoAlmacenado("[dbo.UsuarioRegistrado]", {
      nombre,
      email,
      contraseña,
      idRol,
    });

    console.log("Usuario registrado en la base de datos:", result);
    res.json(result.recordset);
  } catch (error) {
    console.error("Error en el procedimiento almacenado:", error);
    res.status(500).json({ error: "Error en el procedimiento almacenado" });
  }
};

// ROL DEL USUARIO CUANDO SE REGISTRA Y TENEMOS EL ID DEL ROL
const rolUsuario = async (req, res) => {
  try {
    const procedimientoAlmacenado = promisify(conexion.query).bind(conexion);
    const result = await procedimientoAlmacenado("[dbo.RolUsuario]");

    if (result && result.recordset && result.recordset.length > 0) {
      // Retorna el ID del rol insertado
      console.log("Usuario registrado en la base de datos:", result);
      res.json({ idRol: result.recordset[0].idRol });
    } else {
      throw new Error("El procedimiento no retornó un ID de rol.");
    }
  } catch (error) {
    console.error("Error en el procedimiento almacenado:", error);
    res.status(500).json({ error: "Error en el procedimiento almacenado" });
  }
};

module.exports = {
  registrarUsuario,
  rolUsuario,
};
