const UsuarioModelo = require("../model/Usuario");
const bcrypt = require("bcryptjs");

// CONTROLADOR PARA REGISTRAR EL ROL
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
  } catch (error) {
    console.error("Error en el controlador al registrar el rol:", error);
    res.status(500).json({
      error: "Error al registrar el rol de usuario",
      mensaje: error.message,
    });
  }
};

//CONTROALDOR PARA REGISTRAR EL USUARIO
const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password, idRol } = req.body;

    //VALIDACION QUE LOS CAMPOS ESTEN VACIOS
    if (!nombre || !email || !password || !idRol) {
      return res.status(400).json({
        mensaje: "Los campos no pueden estar vacíos.",
      });
    }

    //VALIDACION DE LA CONTRASEÑA
    if (password.length < 10) {
      return res.status(400).json({
        mensaje: "La contraseña debe tener al menos 10 caracteres.",
        status: false,
      });
    }

    //VALIDACION DEL CORREO ELECTRONICO DUPLICADO

    const hashPassword = await bcrypt.hash(password, 10);

    const usuarioRegistrado = await UsuarioModelo.registrarUsuario(
      nombre,
      email,
      hashPassword,
      idRol
    );

    if (usuarioRegistrado === true) {
      return res.status(201).json({
        mensaje: "Usuario registrado correctamente.",
        status: true,
      });
    } else if (usuarioRegistrado === false) {
      return res.status(400).json({
        mensaje: "El correo electrónico ya está registrado.",
        status: false,
      });
    } else {
      return res.status(500).json({
        mensaje: "Error al registrar el cliente.",
        status: false,
      });
    }
  } catch (error) {
    console.error("Error en el controlador al registrar el usuario:", error);
    return res.status(500).json({
      mensaje: "Error al registrar el usuario.",
      mensaje: error.message,
    });
  }
};

module.exports = {
  registrarRol,
  registrarUsuario,
};
