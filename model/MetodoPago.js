const sql = require("mssql");
const conexion = require("./Conexion");

const eliminarMetodoPago = async idMetodoPago => {
  try {
    const pool = await conexion();
    const request = await pool.request();

    request.input("idMetodoPago", sql.Int, idMetodoPago);

    const result = await request.execute("dbo.EliminarMetodoPago");

    return {
      status: true,
      mensaje: "Método de pago eliminado con éxito",
    };
  } catch (error) {
    console.error("Error al eliminar el método de pago:", error);
    return {
      status: false,
      mensaje: "Error al eliminar el método de pago",
      error: error.message,
    };
  }
};

module.exports = {
  eliminarMetodoPago,
};
