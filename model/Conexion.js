const sql = require("mssql");
require("dotenv/config");

const config = {
  user: process.env.USER,
  password: process.env.PASSWORD,
  server: process.env.SERVER,
  database: process.env.DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const conectarDataBase = async () => {
  try {
    const pool = await sql.connect(config);

    console.log("Conexión exitosa a la base de datos");
    return pool;
  } catch (error) {
    console.log("Error en la cadena de conexión:", error);
  }
};

module.exports = conectarDataBase;
