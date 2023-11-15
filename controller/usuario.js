const UsuarioModelo = require("../model/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const correo = require("../helper/correo");

// FUNCION PARA ENVIOS DE CORREO ELECTRONICO
const enviarCorreoElectronico = async destinatario => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.TOKEN,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: destinatario,
    subject: "Confirmación de registro",
    html: correo,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo electrónico enviado:", info.response);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
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
    if (password.length < 3) {
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
    console.log(usuarioRegistrado);

    if (usuarioRegistrado.status) {
      const contenidoCorreo = `<p>Bienvenido ${nombre} ${apellido}, tu cuenta ha sido registrada con éxito.</p>`;

      // Llama a la función de envío de correo con el contenido correcto
      console.log("Enviando correo al usuario...");
      enviarCorreoElectronico(email, contenidoCorreo);

      return res.status(201).json({
        mensaje: usuarioRegistrado.mensaje,
        status: true,
        usuario: usuarioRegistrado.usuario,
      });
    } else if (!usuarioRegistrado.status) {
      return res.status(404).json({
        mensaje: usuarioRegistrado.mensaje,
        status: false,
        error: usuarioRegistrado.error,
      });
    }
  } catch (error) {
    console.error("Error en el controlador al registrar el usuario:", error);
    return res.status(500).json({
      mensaje: "Error al registrar el usuario.",
      status: false,
      error: error.message,
    });
  }
};

// CONTROLADOR PARA REGISTRAR EL VENDEDOR
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

    console.log("Resultado del modelo:", vendedorRegistrado);

    if (vendedorRegistrado.status) {
      return res.status(201).json({
        mensaje: "Vendedor registrado correctamente.",
        status: true,
        vendedor: vendedorRegistrado.vendedor,
      });
    } else {
      return res.status(500).json({
        mensaje: vendedorRegistrado.mensaje,
        status: false,
        error: vendedorRegistrado.error,
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

module.exports = {
  registrarVendedor,
};

module.exports = {
  registrarVendedor,
};

// CONTROLADOR PARA LOGEARSE
const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        mensaje: "Por favor, proporcione tanto el email como la contraseña.",
        status: false,
      });
    }

    const idUsuario = await UsuarioModelo.loginUsuario(email);

    if (idUsuario !== null) {
      const contraseñaValida = await bcrypt.compare(
        password,
        idUsuario.Contraseña
      );

      // CREO EL TOKEN DE AUTENTICACION
      const token = jwt.sign(
        {
          userId: idUsuario.id,
          email: idUsuario.email,
        },
        process.env.SECRETO,
        {
          expiresIn: "1d",
        }
      );

      if (contraseñaValida) {
        return res.status(200).json({
          mensaje: "Inicio de sesión exitoso",
          usuario: idUsuario,
          token: token,
          status: true,
        });
      } else {
        return res.status(401).json({
          mensaje: "Credenciales incorrectas",
          status: false,
          usuario: idUsuario.error,
        });
      }
    } else {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
        status: false,
        usuario: idUsuario,
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

//CONTROLADOR PARA TREAR TODA LA INFORMACION DEL USUARIO
const informacionUsuario = async (req, res) => {
  try {
    const id = req.params.id;

    // Validación de que el ID es un número válido (puedes ajustarlo según tus necesidades)
    if (isNaN(id)) {
      return res.status(400).json({
        mensaje: "El ID proporcionado no es válido.",
        status: false,
      });
    }

    const informacionUsuario = await UsuarioModelo.informacionUsuario(
      parseInt(id, 10)
    );

    if (informacionUsuario !== null) {
      return res.status(200).json({
        mensaje: "Información del usuario obtenida con éxito.",
        status: true,
        usuario: informacionUsuario,
      });
    } else {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
        status: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error traer la informacion",
      status: false,
      error: error.message,
    });
  }
};

module.exports = {
  registrarUsuario,
  registrarVendedor,
  loginUsuario,
  informacionUsuario,
};
