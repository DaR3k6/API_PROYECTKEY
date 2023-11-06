const DetalleFacturaMetodoPago = require("../model/Detalle");

// CONTROLADOR PARA AGREGAR FACTURA,DETALLE Y FACTURA
const agregarFacturaYDetalle = async (req, res) => {
  try {
    const {
      fechaFactura,
      total,
      metodoPagoNombre,
      metodoPagoDescripcion,
      habilitado,
      producto_idProducto,
      cantidad,
      precioUnitario,
    } = req.body;

    if (
      !fechaFactura ||
      !total ||
      !metodoPagoNombre ||
      !metodoPagoDescripcion ||
      !habilitado ||
      !producto_idProducto ||
      !cantidad ||
      !precioUnitario
    ) {
      return res.status(400).json({
        mensaje: "Faltan campos obligatorios en la solicitud",
        status: false,
      });
    }

    // Verifica y formatea la fecha en el formato correcto 'AAAA-MM-DD'
    const fecha = new Date(fechaFactura);
    const fechaFormateada = fecha.toISOString().split("T")[0];

    // Llama a la función para insertar el detalle
    const resultado = await DetalleFacturaMetodoPago.insertarFacturaYDetalle(
      fechaFormateada,
      total,
      metodoPagoNombre || null,
      metodoPagoDescripcion || null,
      habilitado || null,
      producto_idProducto,
      cantidad,
      precioUnitario
    );

    if (resultado.status) {
      return res.status(201).json({
        mensaje: "Inserción exitosa",
        status: true,
        resultado,
      });
    } else {
      return res.status(400).json({
        mensaje: "Error al agregar el detalle",
        status: false,
        detalleFactura: resultado.detalle,
        nuevoID: resultado.nuevoID,
      });
    }
  } catch (error) {
    console.error("Error en el controlador para agregar un detalle:", error);
    return res.status(500).json({
      mensaje: "Error en el controlador para agregar un detalle",
      status: false,
      error: error.message,
      detalleFactura: null,
      nuevoID: null,
    });
  }
};

// CONTROLLADOR PARA ELIMINAR FACTURA,DETALLE Y FACTURA
const eliminarFacturaDetalles = async (req, res) => {
  try {
    const facturaID = req.params.id;

    const resultado = await DetalleFacturaMetodoPago.eliminarFacturaDetalles(
      facturaID
    );

    if (resultado.status) {
      return res.status(200).json({
        mensaje: "Eliminación exitosa",
        status: true,
        resultado: resultado,
      });
    } else {
      return res.status(400).json({
        mensaje: "Error al eliminar la factura y sus detalles",
        status: false,
      });
    }
  } catch (error) {
    console.error("Error al eliminar la factura y sus detalles:", error);
    return res.status(500).json({
      mensaje: "Error al eliminar la factura y sus detalles",
      status: false,
      error: error.message,
    });
  }
};

// CONTROLLADOR PARA ACTUALIZAR FACTURA,DETALLE Y FACTURA
const actualizarFacturaDetalleMetodoPago = async (req, res) => {
  try {
    const idFactura = req.params.id;
    const {
      nuevaFechaFactura,
      nuevoTotal,
      cantidad,
      precioUnitario,
      nombre,
      descripcion,
      habilitado,
    } = req.body;

    const resultado =
      await DetalleFacturaMetodoPago.actualizarFacturaDetalleMetodoPago(
        idFactura,
        nuevaFechaFactura,
        nuevoTotal,
        nombre,
        descripcion,
        habilitado,
        cantidad,
        precioUnitario
      );

    if (resultado.status) {
      return res.status(200).json({
        mensaje: "Actualización exitosa",
        status: true,
        resultado: resultado,
      });
    } else {
      return res.status(400).json({
        mensaje: "Error en la actualización",
        status: false,
      });
    }
  } catch (error) {
    console.error(
      "Error al actualizar la factura, detalles y método de pago:",
      error
    );
    return res.status(500).json({
      mensaje: "Error en la actualización",
      status: false,
      error: error.message,
    });
  }
};

// CONTROLLADOR PARA LISTAR UNA FACTURA,DETALLE Y FACTURA
const listarFacturasDetallesMetodosPago = async (req, res) => {
  try {
    const facturaID = req.params.id;

    const result =
      await DetalleFacturaMetodoPago.listarFacturasDetallesMetodosPago(
        facturaID
      );

    if (result.status) {
      // Devuelve los resultados como JSON
      return res.status(200).json({ status: true, result });
    } else {
      return res
        .status(404)
        .json({ mensaje: "Factura no encontrada", status: false });
    }
  } catch (error) {
    console.error(
      "Error al listar facturas, detalles y métodos de pago:",
      error
    );
    return res.status(500).json({
      mensaje: "Error en la solicitud",
      error: error.message,
      status: false,
    });
  }
};

module.exports = {
  agregarFacturaYDetalle,
  eliminarFacturaDetalles,
  actualizarFacturaDetalleMetodoPago,
  listarFacturasDetallesMetodosPago,
};
