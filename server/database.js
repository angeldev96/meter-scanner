const mysql = require('mysql2/promise');
require('dotenv').config();



const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const connect = async () => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    console.log("Conexión exitosa a la base de datos", process.env.DB_NAME);
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error.message);
  }
};

const getLastTransactionDateTime = async (serialnumber) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT created FROM transactionspt1 WHERE serialnumber = ? ORDER BY created DESC LIMIT 1",
      [serialnumber]
    );
    connection.release();
    
    if (rows.length > 0) {
      return rows[0].created; // Retorna la fecha y hora de la última transacción
    } else {
      return null; // Si no hay registros, retorna null
    }
  } catch (error) {
    throw error; // Maneja errores apropiadamente
  }
};


const insertMeter = async (serialnumber) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "INSERT INTO medidores_migrados (serialnumber) VALUES (?)",
      [serialnumber]
    );
    connection.release();
    return result.insertId; // Retorna el ID del nuevo medidor insertado
  } catch (error) {
    throw error; // Maneja errores apropiadamente
  }
};


const getMeters = async () => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute("SELECT * FROM medidores_migrados");
    connection.release();
    return rows;
  } catch (error) {
    throw error; // Maneja errores apropiadamente
  }
};

module.exports = { connect, getLastTransactionDateTime, insertMeter, getMeters };

