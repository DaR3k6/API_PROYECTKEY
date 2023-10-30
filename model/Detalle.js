const sql = require("mssql");
const conexion = require("./Conexion");

//FUNCION DE INSERTAR LA FACTURA Y EL DETALLE
const insertarFacturaYDetalle = async (
  fechaFactura,
  total,
  metodoPagoNombre,
  metodoPagoDescripcion,
  habilitado,
  producto_idProducto,
  cantidad,
  precioUnitario
) => {
  try {
    const pool = await conexion();
    const request = await pool.request();

    if (fechaFactura instanceof Date) {
      fechaFactura = fechaFactura.toISOString().split("T")[0];
    }

    await request.input("fechaFactura", sql.Date, fechaFactura);
    await request.input("total", sql.Decimal(18, 0), total);
    await request.input(
      "metodoPagoNombre",
      sql.NVarChar(250),
      metodoPagoNombre
    );
    await request.input(
      "metodoPagoDescripcion",
      sql.NVarChar(250),
      metodoPagoDescripcion
    );
    await request.input("habilitado", sql.Bit, habilitado);
    await request.input("producto_idProducto", sql.Int, producto_idProducto);
    await request.input("cantidad", sql.Int, cantidad);
    await request.input("precioUnitario", sql.Decimal(18, 0), precioUnitario);
    await request.output("resultado", sql.Bit);
    await request.output("nuevoID", sql.Int);

    const result = await request.execute("dbo.InsertarFacturaYDetalle");

    const codigoResultado = result.output.resultado;
    const nuevoID = result.output.nuevoID;

    if (codigoResultado) {
      console.log("Inserción exitosa");
      return {
        mensaje: "Inserción exitosa",
        status: true,
        detalle: {
          resultado: result,
          codigoResultado: codigoResultado,
          nuevoID: nuevoID,
        },
      };
    } else {
      console.log("Error en la inserción");
      return {
        mensaje: "Error en la inserción",
        status: false,
        detalle: [],
      };
    }
  } catch (error) {
    console.error("Error en agregar el detalle:", error);

    return {
      mensaje: "Error en la inserción",
      status: false,
      error: error.message,
      nuevoID: null,
    };
  }
};

//FUNCION DE ELIMAR LA FACTURA Y EL DETALLE
const eliminarFacturaDetalles = async facturaID => {
  try {
    const pool = await conexion();
    const request = await pool.request();

    // Configura los parámetros del procedimiento almacenado
    request.input("facturaID", sql.Int, facturaID);
    request.output("resultado", sql.Bit);

    // Ejecuta el procedimiento almacenado
    const result = await request.execute("dbo.EliminarFacturaDetalles");

    const resultado = result.output.resultado;

    return {
      status: resultado ? true : false,
      mensaje: resultado ? "Eliminación exitosa" : "Error en la eliminación",
    };
  } catch (error) {
    console.error("Error al eliminar la factura y sus detalles:", error);

    return {
      status: false,
      mensaje: "Error en la eliminación",
      error: error.message,
    };
  }
};

module.exports = {
  insertarFacturaYDetalle,
  eliminarFacturaDetalles,
};
