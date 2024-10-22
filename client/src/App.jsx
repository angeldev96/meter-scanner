import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Chip,
} from '@mui/material';

const App = () => {
  const [serialNumber, setSerialNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(null);
  const [systemType, setSystemType] = useState(null);
  const [lastTransactionDateTime, setLastTransactionDateTime] = useState(null);

  const handleMeterNumberChange = (event) => {
    setSerialNumber(event.target.value.replace(/\s+/g, ''));
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (serialNumber.trim() === '') {
      setMessage('El número de medidor no puede estar vacío.');
      return;
    }

    setLoading(true);
    setMessage('');
    setYear(null);
    setSystemType(null);
    setLastTransactionDateTime(null); // Reiniciamos la fecha de la última transacción
    try {
      const response = await fetch(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/lastTransaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serialNumber }),
      });
      const data = await response.json();

      setMessage(data.message);

      if (data.lastTransactionDateTime !== undefined && data.lastTransactionDateTime !== null) {
        setLastTransactionDateTime(data.lastTransactionDateTime);

        // Verificamos los primeros cuatro dígitos para determinar el año
        if (serialNumber.startsWith('3712')) {
          setYear(2012);
          setSystemType('viejo');
        } else {
          setYear('reciente');
          setSystemType('nuevo');
        }
      } else {
        console.log("No se recibió información de la última transacción desde el servidor");
      }
    } catch (error) {
      setMessage('Error al procesar la solicitud. Por favor, inténtelo de nuevo.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = () => {
    if (!lastTransactionDateTime) {
      alert("No hay información de la última transacción disponible");
      return;
    }


    const url = systemType === 'nuevo'
      ? 'http://192.168.1.30'
      : 'https://192.168.1.31/juice36/index.juice?mode=accounts';

    window.open(url, '_blank');
  };


  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', bgcolor: 'grey.100' }}>
      <Paper elevation={3} sx={{ p: 4, m: 'auto', maxWidth: 400, width: '100%', textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom component="div">
          Identificación de Medidor
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <TextField
            label="Número de Medidor"
            variant="outlined"
            value={serialNumber}
            onChange={handleMeterNumberChange}
            onKeyPress={handleKeyPress}
            sx={{ mr: 2, flexGrow: 1 }}
          />
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Procesando...' : 'Identificar'}
          </Button>
        </Box>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body1">{message}</Typography>
          {year !== null && (
            <Box sx={{ mt: 2 }}>
              <Chip
                label={`Usar Sistema ${systemType === 'nuevo' ? 'Nuevo' : 'Viejo'}`}
                color={systemType === 'nuevo' ? 'primary' : 'default'}
                sx={{
                  mb: 1,
                  bgcolor: systemType === 'viejo' ? 'lightcoral' : 'default',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: systemType === 'viejo' ? 'lightpink' : '#4fc3f7',
                  },
                }}
                onClick={handleChipClick}
              />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Año del medidor: {year}
              </Typography>
              {lastTransactionDateTime && (
                <Typography variant="body2" sx={{ marginTop: 1 }}>
                  Última transacción: {new Date(Date.parse(lastTransactionDateTime.created)).toLocaleString()}                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default App;
