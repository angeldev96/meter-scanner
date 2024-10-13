const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const databaseName = process.env.DB_NAME;

const connect = async () => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    console.log("Conexión exitosa a la base de datos", databaseName);
  } catch (error) {
    console.error(
      "Error al conectar con la base de datos:",
      databaseName,
      error
    );
  }
};

const getMeterYear = async (meterNumber) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT medidor_anio FROM medidor WHERE medidor_id = ?",
      [meterNumber]
    );
    connection.release();
    if (rows.length > 0) {
      return rows[0].medidor_anio;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  connect,
  getMeterYear,
};