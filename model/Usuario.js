const sql = require("mssql");
const conexion = require("./Conexion");

//FUNCIÓN PARA REGISTRAR EL USUARIO
const registrarUsuario = async (
  nombreUsuario,
  apellido,
  email,
  password,
  idRol
) => {
  try {
    const pool = await conexion();
    const request = await pool.request();

    //CONFIGURO LOS PARAMETROS DEL PROCEDIMIENTO
    await request.input("nombre", sql.NVarChar, nombreUsuario);
    await request.input("apellido", sql.NVarChar, apellido);
    await request.input("email", sql.NVarChar, email);
    await request.input("password", sql.NVarChar, password);
    await request.input("idRol", sql.BigInt, idRol);
    await request.output("idUsuario", sql.BigInt);
    await request.output("correoExiste", sql.Bit);

    //EJECUTA EL PROCEDIMIENTO ALMACENADO
    const result = await request.execute("dbo.UsuarioRegistrado");

    // VERIFICA SI EL EMAIL YA EXISTE
    const correoExiste = result.output.correoExiste;

    if (correoExiste) {
      console.log("El correo electrónico ya existe");
      return {
        mensaje: "El correo electrónico ya está registrado.",
        status: false,
      };
    }

    // OBTÉN EL ID DEL USUARIO REGISTRADO
    const idUsuario = result.output.idUsuario;

    if (idUsuario !== null && idUsuario !== -1) {
      console.log("Usuario registrado con éxito. ID de usuario:", idUsuario);
      return {
        mensaje: "Usuario registrado correctamente.",
        status: true,
        usuario: {
          id: idUsuario,
          nombre: nombreUsuario,
          apellido,
          email,
          idRol,
        },
      };
    } else if (idUsuario === -1) {
      console.log("El usuario ya existe.");
      return {
        mensaje: "El usuario ya está registrado.",
        status: false,
        error: "Usuario duplicado",
      };
    } else {
      console.error("El procedimiento almacenado devolvió un código de error.");
      return {
        mensaje: "Error al registrar el usuario",
        status: false,
        error: "Error en el procedimiento almacenado",
      };
    }
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    return {
      mensaje: "Error al registrar el usuario",
      status: false,
      error: error.message,
    };
  }
};

//FUNCION DEL REGISTRAR VENDEDOR LLENA UN FORMULARIO
const registrarVendedor = async (
  documento,
  nombre,
  fechaNacimiento,
  usuarioId
) => {
  try {
    const pool = await conexion();
    const request = await pool.request();

    // Configura los parámetros del procedimiento almacenado
    await request.input("documento", sql.NVarChar, documento);
    await request.input("nombre", sql.NVarChar, nombre);
    await request.input("fechaNacimiento", sql.Date, fechaNacimiento);
    await request.input("usuarioId", sql.Int, usuarioId);

    await request.output("idGenerado", sql.BigInt);
    await request.output("registroExitoso", sql.Bit);

    // Ejecuta el procedimiento almacenado
    const result = await request.execute("dbo.RegistrarVendedor");

    // Obtiene el ID del vendedor recién registrado
    const registroExitoso = result.output.registroExitoso;
    
    if (registroExitoso) {
      console.log("El proceso de registro fue exitoso.");
      return {
        status: true,
        vendedor: {
          id: result.output.idGenerado,
          documento,
          nombre,
          fechaNacimiento,
          usuarioId,
        },
      };
    } else {
      console.log("El proceso de registro falló.");
      return {
        status: false,
        mensaje: "Error al registrar el vendedor.",
      };
    }
  } catch (error) {
    console.error("Error al registrar el vendedor:", error);
    return {
      status: false,
      mensaje: "Error al registrar el vendedor",
      error: error.message,
    };
  }
};

//FUNCION DE LOGIN PARA INICAR QUE TIPO DE ROL ES 'VENDEDOR O CLIENTE'
const loginUsuario = async email => {
  try {
    const pool = await conexion();
    const request = await pool.request();

    // CONFIGURAR LOS PARÁMETROS DEL PROCEDIMIENTO
    await request.input("email", sql.NVarChar, email);

    // EJECUTA EL PROCEDIMIENTO ALMACENADO
    const result = await request.execute("dbo.IniciarSesion");

    console.log("Resultado del inicio de sesión:", result.recordset[0]);

    if (result.recordset.length > 0) {
      return result.recordset[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al logear el usuario:", error);
    return {
      mensaje: "Error al logearse",
      status: false,
    };
  }
};

//FUNCION TRAER LA INFORMACION DEL USUARIO
const    = async id => {
  try {
    const pool = await conexion();
    const request = await pool.request();

    // CONFIGURAR LOS PARÁMETROS DEL PROCEDIMIENTO
    await request.input("id", sql.Int, id);

    // EJECUTA EL PROCEDIMIENTO ALMACENADO
    const result = await request.execute("dbo.TraerInformacioUsuario");
    console.log("Resultado del inicio de sesión:", result.recordset[0]);

    if (result.recordset.length > 0) {
      return result.recordset[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al logear el usuario:", error);
    return {
      mensaje: "Error al logearse",
      status: false,
    };
  }
};

module.exports = {
  registrarUsuario,
  loginUsuario,
  registrarVendedor,
  informacionUsuario,
};
