const { NodeSSH } = require('node-ssh');
const mysql = require('mysql2/promise');
require('dotenv').config();

const ssh = new NodeSSH();

const connectSSH = async () => {
  await ssh.connect({
    host: '192.168.1.31',
    username: 'root',
    password: 'Fl3x-Upco',
    port: 8021,
    algorithms: {
      serverHostKey: ['ssh-rsa'],
      kex: ['diffie-hellman-group1-sha1'], // Para el intercambio de claves
    },
  });

  // Establecer un túnel a la base de datos
  await ssh.forwardOut(
    '127.0.0.1', // dirección local
    3306,        // puerto local
    '127.0.0.1', // dirección remota (localhost en el servidor)
    3306         // puerto remoto (puerto de MySQL)
  );
};

const pool = mysql.createPool({
  host: '127.0.0.1', // Cambiar a localhost
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
    await connectSSH(); // Conectar al túnel SSH
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

module.exports = { connect, getLastTransactionDateTime };
