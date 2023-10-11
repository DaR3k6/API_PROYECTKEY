const sql = require("mssql");
const conexion = require("./Conexion");

// FUNCIÓN PARA REGISTRAR EL ROL
const registrarRol = async nombre => {
  try {
    const pool = await conexion();

    const request = await pool.request();

    //CONFIGURO LOS PARAMETROS DEL PROCEDIMIENTO
    await request.input("nombre", sql.NVarChar, nombre);
    await request.output("idRol", sql.BigInt);

    //EJECUTA EL PROCEDIMIENTO ALMACENADO
    const result = await request.execute("dbo.RolUsuario");

    //VEREFICA SI EL PROCEDIMINETO ALMACENADO RESULTO VALIDO
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

    //CONFIGURO LOS PARAMETROS DEL PROCEDIMIENTO
    await request.input("nombre", sql.NVarChar, nombreUsuario);
    await request.input("email", sql.NVarChar, email);
    await request.input("password", sql.NVarChar, password);
    await request.input("idRol", sql.BigInt, idRol);
    await request.output("idUsuario", sql.BigInt);
    await request.output("correoExiste", sql.Bit);

    //EJECUTA EL PROCEDIMIENTO ALMACENADO
    const result = await request.execute("dbo.UsuarioRegistrado");

    //VEREFICA SI EL PROCEDIMINETO ALMACENADO RESULTO VALIDO
    const idUsuario = result.output.idUsuario;
    const correoExiste = result.output.correoExiste;

    //VEREFICO SI EL EMAIL EXISTE
    if (correoExiste) {
      console.log("El correo electronico ya existe");
      return false;
    }

    if (idUsuario) {
      console.log("Usuario registrado con éxito.");
      return true;
    } else {
      console.error("El procedimiento almacenado devolvió un código de error.");
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
