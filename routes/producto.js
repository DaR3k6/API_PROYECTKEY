const express = require("express");
const router = express.Router();
const productoController = require("../controller/producto");
const multer = require("multer");
const auth = require("../helper/auth");

// Definición de la función para filtrar archivos
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

// CONFIGURACIÓN DE ALMACENAMIENTO EN MEMORIA
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, fileFilter: fileFilter });

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Endpoints relacionados con productos
 */

/**
 * @swagger
 * /proyectkey/agregarProducto:
 *   post:
 *     summary: Agregar un nuevo producto.
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del producto.
 *               descripcion:
 *                 type: string
 *                 description: Descripción del producto.
 *               precio:
 *                 type: number
 *                 description: Precio del producto.
 *               stock:
 *                 type: number
 *                 description: Stock del producto.
 *               vendedor_idVendedor:
 *                 type: number
 *                 description: ID del vendedor del producto.
 *               categoria_idCategoria:
 *                 type: number
 *                 description: ID de la categoría del producto.
 *               imagen:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del producto en formato base64.
 *     responses:
 *       200:
 *         description: Producto agregado o actualizado con éxito.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: Producto agregado o actualizado con éxito.
 *               status: true
 *               idProducto: 1
 *               productoExistente: false
 *       400:
 *         description: Error al agregar o actualizar el producto. Datos no válidos o formato de archivo no válido.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: Error al agregar o actualizar el producto.
 *               status: false
 *       500:
 *         description: Error inesperado en el servidor.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: Error inesperado en el servidor.
 *               status: false
 */

// RUTA PARA AGREGAR UN NUEVO PRODUCTO (POST)
router.post(
  "/agregarProducto",
  auth,
  upload.single("imagen"),
  productoController.agregarProducto
);

/**
 * @swagger
 * /proyectkey/actualizarProductos/{id}:
 *   put:
 *     summary: Actualizar un producto existente.
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a actualizar.
 *         schema:
 *           type: integer
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nuevo nombre del producto.
 *               descripcion:
 *                 type: string
 *                 description: Nueva descripción del producto.
 *               precio:
 *                 type: number
 *                 description: Nuevo precio del producto.
 *               stock:
 *                 type: number
 *                 description: Nuevo stock del producto.
 *               vendedor_idVendedor:
 *                 type: number
 *                 description: Nuevo ID del vendedor del producto.
 *               categoria_idCategoria:
 *                 type: number
 *                 description: Nuevo ID de la categoría del producto.
 *               imagen:
 *                 type: string
 *                 format: binary
 *                 description: Nueva imagen del producto en formato binario.
 *     responses:
 *       200:
 *         description: Producto actualizado con éxito.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: Producto actualizado con éxito.
 *               status: true
 *               idProducto: 1
 *       400:
 *         description: Datos de producto no válidos o formato de archivo no válido.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: Datos de producto no válidos.
 *               status: false
 *       401:
 *         description: Acceso no autorizado.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: Acceso no autorizado.
 *               status: false
 *       404:
 *         description: El producto no existe.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: El producto no existe.
 *               status: false
 *       500:
 *         description: Error al actualizar el producto.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: Error al actualizar el producto.
 *               status: false
 */
// RUTA PARA ACTUALIZAR UN PRODUCTO EXISTENTE (PUT)
router.put(
  "/actualizarProductos/:id",
  auth,
  upload.single("imagen"),
  productoController.actualizarProducto
);


/**
 * @swagger
 * /proyectkey/buscarProducto/{nombre}:
 *   get:
 *     summary: Buscar productos por nombre.
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         description: Nombre del producto a buscar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Productos encontrados con éxito.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: Productos encontrados con éxito.
 *               status: true
 *               productos: [...]
 *       400:
 *         description: Nombre de producto no válido.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: Nombre de producto no válido.
 *               status: false
 *       401:
 *         description: Acceso no autorizado.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: Acceso no autorizado.
 *               status: false
 *       404:
 *         description: No se encontraron productos con ese nombre.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: No se encontraron productos con ese nombre.
 *               status: false
 *       500:
 *         description: Error al buscar productos por nombre.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: Error al buscar productos por nombre.
 *               status: false
 */
// RUTA PARA BUSCAR EL NOMBRE DEL PRODUCTO (GET)
router.get(
  "/buscarProducto/:nombre",
  auth,
  productoController.buscarProductosPorNombre
);

/**
 * @swagger
 * /proyectkey/eliminarProducto/{id}:
 *   delete:
 *     summary: Eliminar un producto por ID.
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a eliminar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado con éxito.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: Producto eliminado con éxito.
 *               status: true
 *       400:
 *         description: ID de producto no válido.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: ID de producto no válido.
 *               status: false
 *       401:
 *         description: Acceso no autorizado.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: Acceso no autorizado.
 *               status: false
 *       404:
 *         description: El producto no existe.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: El producto no existe.
 *               status: false
 */
module.exports = router;
