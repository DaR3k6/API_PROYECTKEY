const sql = require("mssql");
const conexion = require("./Conexion");

//FUNCION AGREGAR PRODUCTO
const agregarOActualizarProducto = async (
  idProducto,
  nombre,
  descripcion,
  precio,
  stock,
  vendedor_idVendedor,
  categoria,
  imagen
) => {
  try {
    const pool = await conexion();
    const request = await pool.request();

    //CONFIGURO LOS PARAMETROS DEL PROCEDIMIENTO
    await request.input("idProducto", sql.Int, idProducto);
    await request.input("nombre", sql.NVarChar, nombre);
    await request.input("descripcion", sql.NVarChar, descripcion);
    await request.input("precio", sql.Decimal, precio);
    await request.input("stock", sql.Int, stock);
    await request.input("vendedor_idVendedor", sql.Int, vendedor_idVendedor);
    await request.input("categoria", sql.NVarChar, categoria);
    await request.input("imagen", sql.VarBinary, imagen);

    //EJECUTA EL PROCEDIMIENTO ALMACENADO
    const result = await request.execute("dbo.AgregarProducto");

    //VEREFICO SI EL PROCEDIMINETO ALMCENADO RETORNA
    const codigoResultado = result.returnValue;

    if (codigoResultado === 0) {
      console.log("Producto agregado o actualizado con éxito");
      return true;
    } else if (codigoResultado === 1) {
      console.log("El producto ya existe");
      return false;
    } else {
      console.log("Error en la operación");
      return false;
    }
  } catch (error) {
    console.log("Error en agregar el producto:", error);

    return {
      mensaje: "Error en agregar el producto",
      status: false,
      error: error.message,
    };
  }
};

//FUNCION DE TRAER POR ID EL PRODUCTO
const traerProductosPorNombre = async nombreProducto => {
  try {
    const pool = await conexion();
    const request = await pool.request();

    // CONFIGURO LOS PARÁMETROS DEL PROCEDIMIENTO
    await request.input("nombre", sql.NVarChar, nombreProducto);

    // EJECUTA EL PROCEDIMIENTO ALMACENADO
    const result = await request.execute("dbo.ObtenerProductoPorNombre");

    if (result.recordset.length > 0) {
      console.log("Productos encontrados con éxito");
      return result.recordset;
    } else {
      console.log("No se encontraron productos con ese nombre");
      return [];
    }
  } catch (error) {
    console.log("Error al buscar el producto:", error);

    return {
      mensaje: "Error al buscar el producto",
      status: false,
      error: error.message,
    };
  }
};

//FUNCION DE ELIMNAR PRODUCTO
const eliminarProductoId = async idProducto => {
  try {
    const pool = await conexion();
    const request = await pool.request();

    // CONFIGURO LOS PARÁMETROS DEL PROCEDIMIENTO
    await request.input("idProducto", sql.Int, idProducto);

    // EJECUTA EL PROCEDIMIENTO ALMACENADO
    const result = await request.execute("dbo.EliminarProductoPorId");

    if (result.rowsAffected[0] > 0) {
      console.log("Producto eliminado");
      return {
        mensaje: "Producto eliminado con éxito",
        status: true,
      };
    } else {
      console.log("Producto no existe");
      return {
        mensaje: "El producto no existe",
        status: false,
      };
    }
  } catch (error) {
    console.log("Error de eliminar producto", error);

    return {
      mensaje: "Error eliminar al producto",
      status: false,
      error: error.message,
    };
  }
};

//FUNCION DE TRAER TODOS LOS PRODUCTOS
const todosProductos = async () => {
  try {
    const pool = await conexion();
    const request = await pool.request();

    // EJECUTA EL PROCEDIMIENTO ALMACENADO
    const result = await request.execute("dbo.TodosProductos");

    if (result.recordset && result.recordset.length > 0) {
      console.log("Traen todos los productos");
      return {
        mensaje: "Productos obtenidos con éxito",
        status: true,
        productos: result.recordset,
      };
    } else {
      console.log("No encontraron todos los productos");
      return {
        mensaje: "No se encontraron productos",
        status: false,
        productos: [],
      };
    }
  } catch (error) {
    console.log("Error no trae todos los productos", error);

    return {
      mensaje: "Error no trae todos los productos",
      status: false,
      error: error.message,
    };
  }
};

//FUNCION DE TRAER TODA LA CATEGORIA DEL PRODUCTO
const filtrarPorCategoria = async nombreCategoria => {
  try {
    const pool = await conexion();
    const request = await pool.request();

    // CONFIGURO LOS PARÁMETROS DEL PROCEDIMIENTO
    await request.input("nombreCategoria", sql.NVarChar, nombreCategoria);

    // EJECUTA EL PROCEDIMIENTO ALMACENADO
    const result = await request.execute("dbo.FiltrarCategoriasPorNombre");

    if (result.recordset && result.recordset.length > 0) {
      console.log("Categoría encontrada");
      return {
        mensaje: "Categoría obtenida con éxito",
        status: true,
        productos: result.recordset,
      };
    } else {
      console.log("No se encontraron categorías");
      return {
        mensaje: "Categoría no encontrada",
        status: false,
        productos: [],
      };
    }
  } catch (error) {
    console.log("Error al traer la categoría del producto", error);
    return {
      mensaje: "Error al traer la categoría del producto",
      status: false,
      error: error.message,
    };
  }
};

module.exports = {
  agregarOActualizarProducto,
  traerProductosPorNombre,
  eliminarProductoId,
  todosProductos,
  filtrarPorCategoria,
};
