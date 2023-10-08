const sql = require("mssql");

const userConection = {
  user: process.env.USER,
  password: process.env.PASSWORD,
  server: "localhost",
  database: process.env.DATABASE,
  options: {
    encrypt: false,
  },
};
const pool = new sql.ConnectionPool(userConection);

const conectarDataBase = async () => {
  try {
    await pool.connect();
    console.log("Conexión exitosa a la base de datos");
  } catch (error) {
    console.log("Error en la cadena de conexión:", error);
  }
};

conectarDataBase();

module.exports = pool;
