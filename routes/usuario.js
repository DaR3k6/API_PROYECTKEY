const express = require("express");
const router = express.Router();
const usuarioController = require("../controller/usuario");
const auth = require("../helper/auth");

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints relacionados con usuarios
 */

/**
 * @swagger
 * /proyectkey/usuario/registrarUsuario:
 *   post:
 *     summary: Registrar un nuevo usuario.
 *     tags: [Usuarios]
 *     requestBody:
 *       description: Objeto de solicitud para registrar un nuevo usuario.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del usuario.
 *               apellido:
 *                 type: string
 *                 description: Apellido del usuario.
 *               email:
 *                 type: string
 *                 description: Dirección de correo electrónico del usuario.
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario (debe tener al menos 10 caracteres).
 *               idRol:
 *                 type: number
 *                 description: ID del rol del usuario.
 *     responses:
 *       201:
 *         description: Usuario registrado con éxito.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: Usuario registrado correctamente.
 *               status: true
 *               usuario: Datos del usuario registrado
 *       400:
 *         description: Campos faltantes o contraseña corta.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: Los campos no pueden estar vacíos.
 *               status: false
 *       500:
 *         description: Error al registrar el usuario.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: Error al registrar el usuario.
 *               status: false
 *               error: Detalles del error
 */

router.post("/usuario/registrarUsuario", usuarioController.registrarUsuario);

/**
 * @swagger
 * /proyectkey/login:
 *   post:
 *     summary: Iniciar sesión y obtener token de acceso.
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             email: emailEjemplo
 *             password: contraseñaEjemplo
 *     responses:
 *       200:
 *         description: Token de acceso obtenido con éxito.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: Inicio de sesión exitoso.
 *               status: true
 *               token: <tu-token-generado>
 *               usuario:
 *                 id: 1
 *                 nombre: Usuario Ejemplo
 *       401:
 *         description: Credenciales incorrectas.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: Credenciales incorrectas.
 *               status: false
 *       500:
 *         description: Error al procesar la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: Error al procesar la solicitud.
 *               status: false
 *               error: Detalles del error.
 */
router.post("/login", usuarioController.loginUsuario);

/**
 * @swagger
 * /proyectkey/vendedor/registrarVendedor:
 *   post:
 *     summary: Registrar un nuevo vendedor o cliente.
 *     tags: [Usuarios]
 *     requestBody:
 *       description: Objeto de solicitud para registrar un nuevo vendedor o cliente.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documento:
 *                 type: string
 *                 description: Documento del vendedor o cliente.
 *               nombre:
 *                 type: string
 *                 description: Nombre del vendedor o cliente.
 *               fechaNacimiento:
 *                 type: string
 *                 description: Fecha de nacimiento del vendedor o cliente.
 *               usuarioId:
 *                 type: number
 *                 description: ID del usuario relacionado con el vendedor o cliente.
 *     responses:
 *       201:
 *         description: Vendedor o cliente registrado con éxito.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: Vendedor registrado correctamente.
 *               status: true
 *               vendedor: Datos del vendedor registrado
 *       400:
 *         description: Campos faltantes.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: Los campos no pueden estar vacíos.
 *               status: false
 *       500:
 *         description: Error al registrar el vendedor o cliente.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: Error al registrar el vendedor.
 *               status: false
 */

router.post("/vendedor/registrarVendedor", usuarioController.registrarVendedor);
/**
 * @swagger
 * /proyectkey/informacion/usuario/{id}:
 *   get:
 *     summary: Obtener información de un usuario por ID.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a consultar.
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario obtenida con éxito.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: Información del usuario obtenida con éxito.
 *               status: true
 *               usuario:  Datos del usuario obtenido
 *       400:
 *         description: El ID proporcionado no es válido.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: El ID proporcionado no es válido.
 *               status: false
 *       403:
 *         description: Acceso denegado. El ID no coincide con el usuario autenticado.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: Acceso denegado. El ID no coincide con el usuario autenticado.
 *               status: false
 *       404:
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: Usuario no encontrado.
 *               status: false
 *       500:
 *         description: Error al obtener la información del usuario.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: Error al obtener la información del usuario.
 *               status: false
 *               error:  Detalles del error
 */
router.get(
  "/informacion/usuario/:id",
  auth,
  usuarioController.informacionUsuario
);

module.exports = router;
