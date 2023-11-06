const express = require("express");
const router = express.Router();
const detalleController = require("../controller/detalle");

//RUTA PARA AGREGAR UN DETALLE, FACTURA Y EL METODO PAGO (POST)
router.post(
  "/agregarFacturaYDetalle",
  detalleController.agregarFacturaYDetalle
);

//RUTA PARA ELIMINAR UN DETALLE, FACTURA Y EL METODO PAGO  (DELETE)
router.delete(
  "/eliminarFacturaYDetalle/eliminar/:id",
  detalleController.eliminarFacturaDetalles
);

//RUTA PARA ELIMINAR UN DETALLE, FACTURA Y EL METODO PAGO (PUT)
router.put(
  "/actualizarDetalleFacturaMetodos/:id",
  detalleController.actualizarFacturaDetalleMetodoPago
);

//RUTA PARA LISTAR UN DETALLE, FACTURA Y EL METODO PAGO (GET)
router.get(
  "/listarUnDetalleFacturaMetodos/:id",
  detalleController.listarFacturasDetallesMetodosPago
);

module.exports = router;
