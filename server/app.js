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
    methods: ["GET", "POST", "PUT", "DELETE"], // Permite métodos específicos
    credentials: true, // Permite el envío de cookies
  })
);

app.post("/api/meter", async (req, res) => {
  const { meterNumber } = req.body;
  let message = "";

  const year = parseInt(meterNumber.substring(0, 4)); // Extraer año del número de medidor (asumiendo formato YYYY al principio)

  if (isNaN(year)) {
    message = "Por favor, ingrese un número de medidor válido.";
  } else if (year === 2012 || year === 2013) {
    message = "Utilice el sistema para medidores viejos.";
  } else {
    message = "Este medidor no corresponde a los años 2012 o 2013.";
  }

  res.json({ message });
});

app.listen(process.env.PORT || 3001, async () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT || 3001}`);
  await db.connect();
});
