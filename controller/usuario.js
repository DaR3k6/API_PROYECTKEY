const e = require("express");
const UsuarioModelo = require("../model/Usuario");
const bcrypt = require("bcryptjs");

// CONTROLADOR PARA REGISTRAR EL ROL
const registrarRol = async (req, res) => {
  try {
    const { nombre } = req.body;

    const idRol = await UsuarioModelo.registrarRol(nombre);

    if (idRol === true) {
      return res.status(200).json({
        mensaje: "Rol registrado con éxito",
        status: true,
      });
    } else if (idRol === false) {
      return res.status(400).json({
        mensaje: "El rol ya existe",
        status: false,
      });
    } else {
      return res.status(500).json({
        mensaje: "Error al registrar el rol",
        status: false,
        error: idRol,
      });
    }
  } catch (error) {
    console.error("Error en el controlador al registrar el rol:", error);
    return res.status(500).json({
      mensaje: "Error al registrar el rol de usuario",
      status: false,
      error: error.message, // Proporciona más detalles del error
    });
  }
};

// CONTROLADOR PARA REGISTRAR EL USUARIO
const registrarUsuario = async (req, res) => {
  try {
    const { nombre, apellido, email, password, idRol } = req.body;

    // Validación que los campos no estén vacíos
    if (!nombre || !email || !password || !idRol) {
      return res.status(400).json({
        mensaje: "Los campos no pueden estar vacíos.",
        status: false,
      });
    }

    // Validación de la longitud de la contraseña
    if (password.length < 10) {
      return res.status(400).json({
        mensaje: "La contraseña debe tener al menos 10 caracteres.",
        status: false,
      });
    }

    // Validación del correo electrónico duplicado
    const hashPassword = await bcrypt.hash(password, 10);

    const usuarioRegistrado = await UsuarioModelo.registrarUsuario(
      nombre,
      apellido,
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
        mensaje: "Error al registrar el usuario.",
        status: false,
        error: usuarioRegistrado, // Proporciona más detalles del error
      });
    }
  } catch (error) {
    console.error("Error en el controlador al registrar el usuario:", error);
    return res.status(500).json({
      mensaje: "Error al registrar el usuario.",
      status: false,
      error: error.message, // Proporciona más detalles del error
    });
  }
};

//CONTROLADOR PARA REGISTRAR EL VENDEDOR
const registrarVendedor = async (req, res) => {
  try {
    const { documento, nombre, fechaNacimiento, usuarioId } = req.body;

    // Validación que los campos no estén vacíos
    if (!documento || !nombre || !fechaNacimiento || !usuarioId) {
      return res.status(400).json({
        mensaje: "Los campos no pueden estar vacíos.",
        status: false,
      });
    }

    // Asegúrate de llamar al modelo correspondiente para el registro en la base de datos
    const vendedorRegistrado = await UsuarioModelo.registrarVendedor(
      documento,
      nombre,
      fechaNacimiento,
      usuarioId
    );

    if (vendedorRegistrado === true) {
      return res.status(201).json({
        mensaje: "Vendedor registrado correctamente.",
        status: true,
      });
    } else if (vendedorRegistrado === false) {
      return res.status(500).json({
        mensaje: "ya está registrado",
        status: false,
      });
    } else {
      return res.status(500).json({
        mensaje: "Error al registrar el vendedor.",
        status: false,
      });
    }
  } catch (error) {
    console.error("Error en el controlador al registrar el vendedor:", error);
    return res.status(500).json({
      mensaje: "Error al registrar el vendedor.",
      status: false,
      error: error.message,
    });
  }
};

// CONTROLADOR PARA LOGEARSE
const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Campos de email o contraseña faltantes en la solicitud.");
      return res.status(400).json({
        mensaje: "Por favor, proporcione tanto el email como la contraseña.",
        status: false,
      });
    }

    const idUsuario = await UsuarioModelo.loginUsuario(email);
    console.log("Resultado de la autenticación:", idUsuario);

    if (idUsuario !== null) {
      // Agregar console.log para depuración
      console.log("Valor de password:", password);
      console.log("Valor de usuario.Contraseña:", idUsuario.Contraseña);

      const contraseñaValida = await bcrypt.compare(
        password,
        idUsuario.Contraseña
      );
      if (contraseñaValida > 0) {
        return res.status(200).json({
          mensaje: "Inicio de sesión exitoso",
          status: true,
        });
      } else {
        return res.status(401).json({
          mensaje: "Credenciales incorrectas",
          status: false,
        });
      }
    } else {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
        status: false,
      });
    }
  } catch (error) {
    console.error("Error en el controlador logearse:", error);
    return res.status(500).json({
      mensaje: "Error al logearse.",
      status: false,
      error: error.message,
    });
  }
};

module.exports = {
  registrarRol,
  registrarUsuario,
  registrarVendedor,
  loginUsuario,
};
