const express = require("express");
const router = express.Router();
const detalleController = require("../controller/detalle");

//RUTA PARA AGREGAR UN DETALLE (POST)
router.post(
  "/agregarFacturaYDetalle",
  detalleController.agregarFacturaYDetalle
);

//RUTA PARA ELIMINAR UN DETALLE Y FACTURA (DELETE)
router.delete(
  "/eliminarFacturaYDetalle/eliminar/:id",
  detalleController.eliminarFacturaDetalles
);

module.exports = router;
