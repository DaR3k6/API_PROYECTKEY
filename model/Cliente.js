const sql = require("mssql");
const conexion = require("./Conexion");

// FUNCIÓN PARA REGISTRAR EL CLIENTE
const registroCliente = async (nombre, apellido, fecha, telefono, email) => {
  try {
    const pool = await conexion();

    const request = await pool.request();

    //CONFIGURO LOS PARAMETROS DEL PROCEDIMIENTO
    await request.input("nombre", sql.NVarChar, nombre);
    await request.input("apellido", sql.NVarChar, apellido);
    await request.input("fechaNacimiento", sql.Date, fecha);
    await request.input("telefono", sql.NVarChar, telefono);
    await request.input("email", sql.NVarChar, email);
    await request.output("idCliente", sql.BigInt);
    await request.output("correoExiste", sql.Bit);

    //EJECUTA EL PROCEDIMIENTO ALMACENADO
    const result = await request.execute("dbo.RegistarCliente");

    //VEREFICA SI EL PROCEDIMINETO ALMACENADO RESULTO VALIDO
    const idCliente = result.output.idCliente;
    const correoExiste = result.output.correoExiste;

    //VEREFICO SI EL EMAIL EXISTE
    if (correoExiste) {
      console.log("El correo electronico ya existe");
      return false;
    }

    if (idCliente) {
      console.log("Cliente registrado con éxito.");
      return true;
    } else {
      console.error("El procedimiento almacenado devolvió un código de error.");
      return false;
    }
  } catch (error) {
    console.error("Error al registrar el cliente:", error);
  }
};

// FUNCIÓN PARA ACTUALIZAR EL CLIENTE
const actualizarCliente = async (
  idCliente,
  nombre,
  apellido,
  fecha,
  telefono,
  email
) => {
  try {
    const pool = await conexion();

    const request = await pool.request();

    // Verifica si el nombre es nulo o vacío antes de ejecutar el procedimiento almacenado
    if (!nombre || !apellido || !fecha || !telefono || !email || !idCliente) {
      console.error("El verefica no puede estar vacío");
      return false;
    }

    // Configura el parámetro 'nombre,apellido,fecha,telefono,email,id' para el procedimiento almacenado
    await request.input("idCliente", sql.BigInt);
    await request.input("nombre", sql.NVarChar, nombre);
    await request.input("apellido", sql.NVarChar, apellido);
    await request.input("fechaNacimiento", sql.Date, fecha);
    await request.input("telefono ", sql.NVarChar, telefono);
    await request.input("email", sql.NVarChar, email);

    // Ejecuta el procedimiento almacenado
    const result = await request.execute("dbo.ActualizarCliente");

    // Verifica si el procedimiento almacenado devolvió un resultado válido
    if (result.returnValue === 0) {
      console.log(
        "Cliente actualizado con éxito.",
        idCliente,
        nombre,
        apellido,
        fecha,
        telefono,
        email
      );
      return true;
    } else {
      console.error("El procedimiento almacenado devolvió un código de error.");
      return false;
    }
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
  }
};
// FUNCIÓN PARA BORRAR EL CLIENTE
const eliminarCliente = async idCliente => {
  try {
    const pool = await conexion();

    const request = await pool.request();

    // Verifica si el nombre es nulo o vacío antes de ejecutar el procedimiento almacenado
    if (!idCliente) {
      console.error("El verefica no puede estar vacío");
      return false;
    }

    // Configura el parámetro 'nombre,apellido,fecha,telefono,email' para el procedimiento almacenado
    await request.input("idCliente", sql.BigInt);

    // Ejecuta el procedimiento almacenado
    const result = await request.execute("dbo.EliminarCliente");

    // Verifica si el procedimiento almacenado devolvió un resultado válido
    if (result.returnValue === 0) {
      console.log("Cliente eliminar con éxito.", idCliente);
      return true;
    } else {
      console.error("El procedimiento almacenado devolvió un código de error.");
      return false;
    }
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
  }
};

module.exports = {
  registroCliente,
  actualizarCliente,
  eliminarCliente,
};
