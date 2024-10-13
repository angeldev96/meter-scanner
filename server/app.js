const express = require("express");
const db = require("./database");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();

const app = express();

app.use(bodyParser.json());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.post("/api/meter", async (req, res) => {
  const { meterNumber } = req.body;
  let message = "";
  let year = null;

  console.log("Received meter number:", meterNumber); // Log received meter number

  try {
    year = await db.getMeterYear(meterNumber);
    console.log("Year returned from database:", year); // Log year returned from database

    if (year === null) {
      message = "Número de medidor no encontrado.";
    } else if (year <= 2013) {
      message = `Utilice el sistema para medidores viejos.`;
    } else {
      message = `Este medidor corresponde al sistema nuevo.`;
    }

    console.log("Sending response:", { message, year }); // Log response being sent
    res.json({ message, year });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ message: "Error al procesar la solicitud. Por favor, inténtelo de nuevo." });
  }
});

app.listen(process.env.PORT || 3001, async () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT || 3001}`);
  await db.connect();
});