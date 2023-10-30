const DetalleFactura = require("../model/Detalle");

// CONTROLADOR PARA AGREGAR FACTURA Y DETALLE
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
    const resultado = await DetalleFactura.insertarFacturaYDetalle(
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

// CONTROLLADOR PARA ELIMINAR FACTURA Y DETALLE
const eliminarFacturaDetalles = async (req, res) => {
  try {
    const facturaID = req.params.id;
    console.log(facturaID);
    const resultado = await DetalleFactura.eliminarFacturaDetalles(facturaID);

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

module.exports = {
  agregarFacturaYDetalle,
  eliminarFacturaDetalles,
};
