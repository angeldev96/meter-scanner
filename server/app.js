const express = require("express");
const db = require("./database");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();

const app = express();

app.use(bodyParser.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


app.get("/api/meters", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const meters = await db.getMeters(parseInt(page), parseInt(limit));
    res.json({ meters });
  } catch (error) {
    console.error("Error al obtener los medidores:", error);
    res.status(500).json({ message: "Error al obtener los medidores. Por favor, inténtelo de nuevo." });
  }
});

app.post("/api/meter", async (req, res) => {
  const { meterNumber } = req.body;
  let message = "";
  let year = null;


  try {
    year = await db.getMeterYear(meterNumber);

    if (year === null) {
      message = "Número de medidor no encontrado.";
    }

    res.json({ message, year });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ message: "Error al procesar la solicitud. Por favor, inténtelo de nuevo." });
  }
});

app.post("/api/lastTransaction", async (req, res) => {
  const { serialNumber } = req.body;
  let message = "";
  let lastTransactionDateTime = null;

  try {
    lastTransactionDateTime = await db.getLastTransactionDateTime(serialNumber);

    if (lastTransactionDateTime === null) {
      message = "No se encontró la última transacción para el número de medidor proporcionado.";
    }

    res.json({ message, lastTransactionDateTime });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ message: "Error al procesar la solicitud. Por favor, inténtelo de nuevo." });
  }
});


app.post("/api/addMeter", async (req, res) => {
  const { serialnumber } = req.body;
  let message = "";
  let meterId = null;

  try {
    meterId = await db.insertMeter(serialnumber);

    if (meterId) {
      message = "Medidor insertado exitosamente.";
    } else {
      message = "Error al insertar el medidor.";
    }

    res.json({ message, meterId });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ message: "Error al procesar la solicitud. Por favor, inténtelo de nuevo." });
  }
});





app.listen(process.env.PORT || 3001, async () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT || 3001}`);
  await db.connect();
});