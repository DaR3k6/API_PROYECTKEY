const express = require("express");
const router = express.Router();
const productoController = require("../controller/producto");
const multer = require("multer");

//Definición de la función para filtrar archivos
const fileFilter = (req, file, cb) => {
  const formatoType = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/webp",
    "image/tiff",
    "image/jpg",
    "image/avif",
    "image/svg",
  ];

  if (formatoType.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Formato de archivo no válido"), false);
  }
};

//CONFIGURACION DE ALMECENAMIENTO EN MEMORIA
const storage = multer.memoryStorage();

const upload = multer({ storage: storage, fileFilter: fileFilter });

//RUTA PARA AGREGAR UN NUEVO PRODUCTO (POST)
router.post(
  "/productos",
  upload.single("imagen"),
  productoController.agregarProducto
);

//RUTA PARA ACTUALIZAR UN PRODUCTO EXISTENTE (PUT)
router.put(
  "/productos/:id",
  upload.single("imagen"),
  productoController.actualizarProducto
);

//RUTA PARA BUSCAR EL NOMBRE DEL PRODUCTO (GET)
router.get("/buscar/:nombre", productoController.buscarProductosPorNombre);

//RUTA PARA ELIMINAR UN PRODUCTO (DELETE)
router.delete("/eliminar/:id", productoController.eliminarProductoId);

//RUTA TRAE TODOS LOS PRODUCTOS (GET)
router.get("/listarProducto", productoController.listarProductos);

//RUTA PARA FILTRAR PRODUCTOS POR CATEGORIA (GET)
router.get("/filtrar/:categoria", productoController.filtrarCategoriaPorNombre);

module.exports = router;
