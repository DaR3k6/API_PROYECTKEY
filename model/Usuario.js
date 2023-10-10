const sql = require("mssql");
const conexion = require("./Conexion");

// FUNCIÓN PARA REGISTRAR EL ROL
const registrarRol = async nombre => {
  try {
    const pool = await conexion();

    const request = await pool.request();

    // Verifica si el nombre es nulo o vacío antes de ejecutar el procedimiento almacenado
    if (!nombre) {
      console.error("El nombre no puede estar vacío o nulo.");
      return false;
    }

    // Configura el parámetro 'nombre y idRol' para el procedimiento almacenado
    request.input("nombre", sql.NVarChar, nombre);
    request.output("idRol", sql.BigInt);

    // Ejecuta el procedimiento almacenado
    const result = await request.execute("dbo.RolUsuario");

    // Verifica si el procedimiento almacenado devolvió un resultado válido
    if (result.returnValue === 0) {
      const idRol = result.output.idRol;
      console.log("Rol registrado con éxito.", idRol, nombre);
      return true;
    } else {
      console.error("El procedimiento almacenado devolvió un código de error.");
      return false;
    }
  } catch (error) {
    console.error("Error al registrar el rol:", error);
  }
};

//FUNCIÓN PARA REGISTRAR EL USUARIO
const registrarUsuario = async (nombreUsuario, email, password, idRol) => {
  try {
    const pool = await conexion();
    const request = await pool.request();

    // Verifica que los datos no sean nulos o vacíos antes de ejecutar el procedimiento almacenado
    if (!nombreUsuario || !email || !password || idRol === undefined) {
      console.error("Error: Los datos son nulos o vacíos.");
      return false;
    }

    // Inserta el nuevo usuario en la tabla Usuarios
    await request.input("nombre", sql.NVarChar, nombreUsuario);
    await request.input("email", sql.NVarChar, email);
    await request.input("password", sql.NVarChar, password);
    await request.input("idRol", sql.BigInt, idRol);

    const resultUsuario = await request.execute("dbo.UsuarioRegistrado");

    // Verifica si el procedimiento almacenado [dbo.UsuarioRegistrado] se ejecutó con éxito
    if (resultUsuario.returnValue === 0) {
      console.log("Usuario registrado con éxito.");
      return true;
    } else {
      console.error(
        "Error al registrar el usuario:",
        resultUsuario.returnValue
      );
      return false;
    }
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    return false;
  }
};

module.exports = {
  registrarRol,
  registrarUsuario,
};
