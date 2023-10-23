const productoModelo = require("../model/Producto");

//CONTROLADOR DE AGREGAR PRODUCTO
const agregarProducto = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      precio,
      stock,
      vendedor_idVendedor,
      categoria,
    } = req.body;

    // Validaciones
    if (!nombre || !precio || isNaN(precio)) {
      return res.status(400).json({
        mensaje: "Datos de producto no válidos",
        status: false,
      });
    }

    const imagen = Buffer.from(req.body.imagen, "base64");

    // Llama al modelo para agregar o actualizar el producto
    const resultado = await productoModelo.agregarOActualizarProducto(
      null,
      nombre,
      descripcion,
      precio,
      stock,
      vendedor_idVendedor,
      categoria,
      imagen
    );

    if (resultado > 0) {
      return res.status(200).json({
        mensaje: "Producto agregado con éxito",
        status: true,
        idProducto: resultado,
      });
    } else {
      return res.status(400).json({
        mensaje: "Error al agregar el producto",
        status: false,
      });
    }
  } catch (error) {
    console.error("Error en la ruta para agregar producto", error);
    return res.status(500).json({
      mensaje: "Error al agregar producto",
      status: false,
      error: error.message,
    });
  }
};

//CONTROLADOR DE ACTUALIZAR PRODUCTO
const actualizarProducto = async (req, res) => {
  try {
    const idProducto = req.params.id;

    const {
      nombre,
      descripcion,
      precio,
      stock,
      vendedor_idVendedor,
      categoria,
    } = req.body;

    // Validaciones, si es necesario
    if (!nombre || !precio || isNaN(precio)) {
      return res.status(400).json({
        mensaje: "Datos de producto no válidos",
        status: false,
      });
    }

    const imagen = Buffer.from(req.body.imagen, "base64");

    // Llama al modelo para agregar o actualizar el producto
    const resultado = await productoModelo.agregarOActualizarProducto(
      idProducto, // Utiliza el ID del producto para actualizar
      nombre,
      descripcion,
      precio,
      stock,
      vendedor_idVendedor,
      categoria,
      imagen
    );

    if (resultado > 0) {
      return res.status(200).json({
        mensaje: "Producto actualizado con éxito",
        status: true,
        idProducto: resultado,
      });
    } else {
      return res.status(400).json({
        mensaje: "Error al actualizar el producto",
        status: false,
      });
    }
  } catch (error) {
    console.error("Error en la ruta para actualizar el producto", error);
    return res.status(500).json({
      mensaje: "Error al actualizar el producto",
      status: false,
      error: error.message,
    });
  }
};

//CONTROLADOR DE BUSCAR EL NOMBRE DEL PRODUCTO
const buscarProductosPorNombre = async (req, res) => {
  try {
    const nombreProducto = req.params.nombre;

    // Validación: Verificar si se proporcionó un nombre de producto válido
    if (!nombreProducto || nombreProducto.trim() === "") {
      return res.status(400).json({
        mensaje: "Nombre de producto no válido",
        status: false,
      });
    }

    const productosEncontrados = await productoModelo.traerProductosPorNombre(
      nombreProducto
    );

    if (productosEncontrados.length > 0) {
      return res.status(200).json({
        mensaje: "Productos encontrados con éxito",
        status: true,
        productos: productosEncontrados,
      });
    } else {
      return res.status(404).json({
        mensaje: "No se encontraron productos con ese nombre",
        status: false,
      });
    }
  } catch (error) {
    console.error("Error en la ruta actualizar el producto", error);
    return res.status(500).json({
      mensaje: "Error al actualizar el producto",
      status: false,
    });
  }
};

//CONTROLADOR DE ELIMINAR PRODUCTO
const eliminarProductoId = async (req, res) => {
  try {
    const idProducto = req.params.id;

    // Validación: Verificar si el ID del producto es un número válido
    if (!idProducto || isNaN(idProducto)) {
      return res.status(400).json({
        mensaje: "ID de producto no válido",
        status: false,
      });
    }

    const productoEliminado = await productoModelo.eliminarProductoId(
      idProducto
    );

    if (productoEliminado) {
      console.log("Producto eliminado con exito");
      return res.status(200).json({
        mensaje: "Producto eliminado con éxito",
        status: true,
      });
    } else {
      console.log("Producto no existe");
      return res.status(404).json({
        mensaje: "El producto no existe",
        status: false,
      });
    }
  } catch (error) {
    console.error("Error en la ruta para eliminar el producto", error);
    return res.status(500).json({
      mensaje: "Error al eliminar el producto",
      status: false,
      error: error.message,
    });
  }
};

//CONTROLADOR PARA LISTAR TODOS LOS PRODUCTOS
const listarProductos = async (req, res) => {
  try {
    const productos = await productoModelo.todosProductos();

    if (productos.status) {
      return res.status(200).json({
        mensaje: "Productos obtenidos con éxito",
        status: true,
        productos: productos.productos,
      });
    } else {
      return res.status(404).json({
        mensaje: "No se encontraron productos",
        status: false,
        productos: [],
      });
    }
  } catch (error) {
    console.error("Error al listar productos", error);
    return res.status(500).json({
      mensaje: "Error al listar productos",
      status: false,
      error: error.message,
    });
  }
};

//CONTROLADOR DE FILTRAR CATEGORÍA POR NOMBRE
const filtrarCategoriaPorNombre = async (req, res) => {
  try {
    const nombreCategoria = req.params.categoria;
    console.log(nombreCategoria);
    const categoria = await productoModelo.filtrarPorCategoria(nombreCategoria);

    if (categoria.status) {
      return res.status(200).json({
        mensaje: "Categoría encontrada con éxito",
        status: true,
        categoria: categoria.productos,
      });
    } else {
      return res.status(404).json({
        mensaje: "Categoría no encontrada",
        status: false,
        categoria: [],
      });
    }
  } catch (error) {
    console.error("Error en la ruta para filtrar categoría por nombre", error);
    return res.status(500).json({
      mensaje: "Error al filtrar categoría por nombre",
      status: false,
      error: error.message,
    });
  }
};

module.exports = {
  agregarProducto,
  actualizarProducto,
  buscarProductosPorNombre,
  eliminarProductoId,
  listarProductos,
  filtrarCategoriaPorNombre,
};
