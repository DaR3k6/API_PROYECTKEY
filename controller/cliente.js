const { Container } = require("react-bootstrap");
const clienteModelo = require("../model/Cliente");

//CONTROLADOR PARA REGISTAR UN CLIENTE
const registrarCliente = async (req, res) => {
  try {
    const { nombre, apellido, fecha, telefono, email } = req.body;

    //VALIDACION QUE LOS CAMPOS ESTEN VACIOS
    if (!nombre || !apellido || !fecha || !telefono || !email) {
      return res.status(400).json({
        mensaje: "Los campos no pueden estar vacíos.",
        error: error.message,
      });
    }

    //VALIDACION FORMATO DE FECHA
    const fechaFormato = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaFormato.test(fecha)) {
      return res.status(400).json({
        mensaje: "El formato de fecha no es válido.",
        status: false,
      });
    }

    //VALIDACION NUMEROS DE TELEFONO
    const telefonoFormato = /^(\d{7,15}|\d{3,4}-\d{3,4}|\(\d{3,4}\))$/;
    if (!telefonoFormato.test(telefono)) {
      return res.status(400).json({
        mensaje: "El formato de teléfono no es válido.",
        status: false,
      });
    }

    //VALIDACION SI EL CORREO ELECTRONICO ESTA BIEN EL FORMATO
    const emailTest = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailTest.test(email)) {
      return res.status(400).json({
        mensaje: "El formato del correo electrónico no es válido.",
        status: false,
      });
    }

    const clienteRegistrado = await clienteModelo.registroCliente(
      nombre,
      apellido,
      fecha,
      telefono,
      email
    );

    if (clienteRegistrado === true) {
      return res.status(201).json({
        mensaje: "Cliente registrado con éxito.",
        status: true,
      });
    } else if (clienteRegistrado === false) {
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
    console.error("Error en el controlador al registrar cliente:", error);
    res.status(500).json({
      error: "Error al registrar el cliente: " + error,
      mensaje: error.message,
    });
  }
};

module.exports = {
  registrarCliente,
};
