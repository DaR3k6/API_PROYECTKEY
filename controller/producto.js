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
      categoria_idCategoria,
    } = req.body;

    // Validaciones
    if (!nombre || !precio || isNaN(precio)) {
      return res.status(400).json({
        mensaje: "Datos de producto no válidos",
        status: false,
      });
    }

    const imagen = req.file.buffer;

    // Llama al modelo para agregar o actualizar el producto
    const resultado = await productoModelo.agregarOActualizarProducto(
      null,
      nombre,
      descripcion,
      precio,
      stock,
      vendedor_idVendedor,
      categoria_idCategoria,
      imagen
    );

    console.log(resultado.categoria);

    if (resultado !== undefined) {
      if (resultado.status) {
        return res.status(200).json({
          mensaje: "Producto agregado o actualizado con éxito",
          status: true,
          producto: resultado,
        });
      } else {
        return res.status(400).json({
          mensaje: "Error al agregar el producto",
          status: false,
          error: resultado.error,
        });
      }
    } else {
      return res.status(500).json({
        mensaje: "Error inesperado en el servidor",
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
      categoria_idCategoria,
    } = req.body;

    // Validaciones, si es necesario
    if (!nombre || !precio || isNaN(precio)) {
      return res.status(400).json({
        mensaje: "Datos de producto no válidos",
        status: false,
      });
    }

    const imagen = req.file.buffer;

    // Llama al modelo para agregar o actualizar el producto
    const resultado = await productoModelo.agregarOActualizarProducto(
      idProducto,
      nombre,
      descripcion,
      precio,
      stock,
      vendedor_idVendedor,
      categoria_idCategoria,
      imagen
    );

    if (resultado !== undefined) {
      if (resultado.status) {
        return res.status(200).json({
          mensaje: "Producto actualizado con éxito",
          status: true,
          producto: resultado,
        });
      } else {
        return res.status(400).json({
          mensaje: resultado.mensaje || "Error al actualizar el producto",
          status: false,
          error: resultado.error || undefined,
        });
      }
    } else {
      return res.status(500).json({
        mensaje: "Error inesperado en el servidor",
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

// CONTROLADOR DE BUSCAR PRODUCTOS POR NOMBRE
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

    const resultadoBusqueda = await productoModelo.traerProductosPorNombre(
      nombreProducto
    );

    if (resultadoBusqueda.status) {
      return res.status(200).json({
        mensaje: resultadoBusqueda.mensaje,
        status: true,
        productos: resultadoBusqueda.productos,
      });
    } else {
      return res.status(404).json({
        mensaje: resultadoBusqueda.mensaje,
        status: false,
        productos: resultadoBusqueda.productos,
      });
    }
  } catch (error) {
    console.error("Error en la ruta buscar productos por nombre", error);
    return res.status(500).json({
      mensaje: "Error al buscar productos por nombre",
      status: false,
      error: error.message,
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
