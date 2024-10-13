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
  //   ssl: {
  //     rejectUnauthorized: false,
  //   },
});

const databaseName = process.env.DB_NAME; // Asegúrate de que la variable de entorno DATABASE_NAME esté configurada

const connect = async () => {
  try {
    await pool.getConnection();
    console.log("Conexión exitosa a la base de datos", databaseName);
  } catch (error) {
    console.error(
      "Error al conectar con la base de datos:",
      databaseName,
      error
    );
  }
};

const getMeter = async (meterNumber) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM meters WHERE meter_number = ?",
      [meterNumber]
    );
    connection.release();
    return rows;
  } catch (error) {
    console.error("Error al obtener el medidor:", error);
    return null;
  }
};

// Exportar las funciones
module.exports = {
  connect,
  getMeter,
};
