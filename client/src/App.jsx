import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Chip,
} from '@mui/material';

const App = () => {
  const [meterNumber, setMeterNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(null);
  const [systemType, setSystemType] = useState(null);

  const handleMeterNumberChange = (event) => {
    setMeterNumber(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');
    setYear(null);
    setSystemType(null);
    try {
      const response = await fetch(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/meter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ meterNumber }),
      });
      const data = await response.json();

      setMessage(data.message);

      if (data.year !== undefined && data.year !== null) {
        setYear(data.year);
        setSystemType(data.year >= 2015 ? 'nuevo' : 'viejo');
      } else {
        console.log("No year data received from server");
      }
    } catch (error) {
      setMessage('Error al procesar la solicitud. Por favor, inténtelo de nuevo.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
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
            value={meterNumber}
            onChange={handleMeterNumberChange}
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
                label={`Usar Sistema ${systemType}`}
                color={systemType === 'nuevo' ? 'primary' : 'default'}
                sx={{ mb: 1 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Año del medidor: {year}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default App;