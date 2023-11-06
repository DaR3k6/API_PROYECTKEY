const sql = require("mssql");
const conexion = require("./Conexion");

//FUNCION DE INSERTAR LA FACTURA, DETALLE Y EL METODO DE PAGO
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
    // Convierte cantidad a un número entero
    cantidad = parseInt(cantidad);

    // Verifica que cantidad sea un número válido
    if (isNaN(cantidad)) {
      return JSON.stringify({
        status: false,
        mensaje:
          "Error en la actualización. La cantidad no es un número válido.",
      });
    }

    const pool = await conexion();
    const request = await pool.request();

    if (fechaFactura instanceof Date) {
      fechaFactura = fechaFactura.toISOString().split("T")[0];
    }

    // CONFIGURO LOS PARÁMETROS DEL PROCEDIMIENTO
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

    // EJECUTA EL PROCEDIMIENTO ALMACENADO
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

//FUNCION DE ELIMAR LA FACTURA, DETALLE Y EL METODO DE PAGO
const eliminarFacturaDetalles = async facturaID => {
  try {
    const pool = await conexion();
    const request = await pool.request();

    // Configura los parámetros del procedimiento almacenado
    await request.input("facturaID", sql.Int, facturaID);
    await request.output("resultado", sql.Bit);

    // Ejecuta el procedimiento almacenado
    const result = await request.execute(
      "dbo.EliminarFacturaDetallesYMetodoPago"
    );

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

//FUNCION DE ACTULIZAR LA FACTURA, DETALLE Y LOS METODO DE PAGO
const actualizarFacturaDetalleMetodoPago = async (
  idFactura,
  nuevaFechaFactura,
  nuevoTotal,
  nombre,
  descripcion,
  habilitado,
  cantidad,
  precioUnitario
) => {
  try {
    const pool = await conexion();
    const request = await pool.request();

    // CONFIGURAR LOS PARÁMETROS DEL PROCEDIMIENTO
    await request.input("idFactura", sql.Int, idFactura);
    await request.input("nuevaFechaFactura", sql.Date, nuevaFechaFactura);
    await request.input("nuevoTotal", sql.Decimal(18, 0), nuevoTotal);
    await request.input("nombre", sql.NVarChar(250), nombre);
    await request.input("descripcion", sql.NVarChar(250), descripcion);
    await request.input("habilitado", sql.Bit, habilitado);
    await request.input("cantidad", sql.Int, cantidad);
    await request.input("precioUnitario", sql.Decimal(18, 0), precioUnitario);
    await request.output("resultado", sql.Bit);

    // EJECUTAR EL PROCEDIMIENTO ALMACENADO
    const result = await request.execute(
      "dbo.ActualizarFacturaDetallesYMetodoPago"
    );

    const resultado = result.output.resultado;

    if (resultado) {
      return {
        status: true,
        mensaje: "Actualización exitosa",
      };
    } else {
      return {
        status: false,
        mensaje: "Error en la actualización",
      };
    }
  } catch (error) {
    console.error(
      "Error al actualizar la factura, detalles y método de pago:",
      error
    );

    return {
      status: false,
      mensaje: "Error en la actualización",
      error: error.message,
    };
  }
};

//FUNCION DE LISTRAR LA FACTURA, DETALLE Y LOS METODO DE PAGO
const listarFacturasDetallesMetodosPago = async facturaID => {
  try {
    const pool = await conexion();
    const request = await pool.request();

    // CONFIGURAR LOS PARÁMETROS DEL PROCEDIMIENTO
    await request.input("facturaID", sql.Int, facturaID);

    // EJECUTAR EL PROCEDIMIENTO ALMACENADO
    const result = await request.execute(
      "dbo.ListarFacturasDetallesMetodosPago"
    );
    console.log(result);

    return {
      status: true,
      mensaje: "Lista de facturas, detalles y métodos de pago",
      data: result.recordset,
    };
  } catch (error) {
    console.error(
      "Error al actualizar la factura, detalles y método de pago:",
      error
    );

    return {
      status: false,
      mensaje: "Error en la actualización",
      error: error.message,
    };
  }
};

module.exports = {
  insertarFacturaYDetalle,
  eliminarFacturaDetalles,
  actualizarFacturaDetalleMetodoPago,
  listarFacturasDetallesMetodosPago,
};
