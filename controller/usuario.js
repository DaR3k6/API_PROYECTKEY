const UsuarioModelo = require("../model/Usuario");
const bcrypt = require("bcryptjs");

// Controlador para registrar un rol de usuario
const registrarRol = async (req, res) => {
  try {
    const { nombre } = req.body;

    const idRol = await UsuarioModelo.registrarRol(nombre);
    if (idRol !== false) {
      res.status(200).json({
        mensaje: "Rol registrado con éxito",
        idRol: idRol,
        status: true,
      });
    } else {
      res.status(404).json({
        mensaje: "El rol ya existe",
        status: false,
      });
    }
    res.status(200).json({ idRol });
  } catch (error) {
    console.error("Error en el controlador al registrar el rol:", error);
    res.status(500).json({
      error: "Error al registrar el rol de usuario",
      mensaje: error.message,
    });
  }
};

//Controlador para registar un nuevo usuario
const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password, idRol } = req.body;

    if (!nombre || !email || !password || !idRol) {
      return res.status(400).json({
        mensaje: "Los campos no pueden estar vacíos.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const usuarioRegistrado = await UsuarioModelo.registrarUsuario(
      nombre,
      email,
      hashPassword,
      idRol
    );

    if (usuarioRegistrado !== false) {
      return res.status(201).json({
        mensaje: "Usuario registrado correctamente.",
        status: true,
      });
    } else {
      return res.status(500).json({
        mensaje: "Error al registrar el usuario.",
        status: false,
      });
    }
  } catch (error) {
    console.error("Error en el controlador al registrar el usuario:", error);
    return res.status(500).json({
      mensaje: "Error al registrar el usuario.",
    });
  }
};

module.exports = {
  registrarRol,
  registrarUsuario,
};
