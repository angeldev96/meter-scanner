const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

// Open the database
const dbPromise = open({
  filename: path.join(__dirname, 'meters.sqlite'),
  driver: sqlite3.Database
});

const connect = async () => {
  try {
    const db = await dbPromise;
    console.log("Conexión exitosa a la base de datos SQLite");
    return db;
  } catch (error) {
    console.error("Error al conectar con la base de datos SQLite:", error.message);
  }
};

const getLastTransactionDateTime = async (serialnumber) => {
  try {
    const db = await dbPromise;
    const row = await db.get(
      "SELECT created FROM meters WHERE serialnumber = ? ORDER BY created DESC LIMIT 1",
      [serialnumber]
    );
    
    if (row) {
      return row; // Retorna el primer registro
    } else {
      return null; // Si no hay registros, retorna null
    }
  } catch (error) {
    throw error; // Maneja errores apropiadamente
  }
};

module.exports = { connect, getLastTransactionDateTime };