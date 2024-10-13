import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
} from '@mui/material';

const App = () => {
  const [meterNumber, setMeterNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(null);

  const handleMeterNumberChange = (event) => {
    setMeterNumber(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');
    setYear(null);
    try {
      console.log("Sending request with meter number:", meterNumber); // Log the meter number being sent
      const response = await fetch(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/meter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ meterNumber }),
      });
      const data = await response.json();
      console.log("Received response:", data); // Log the entire response

      setMessage(data.message);

      if (data.year !== undefined && data.year !== null) {
        setYear(data.year);
        console.log("Año del medidor:", data.year);
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
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
      <Paper sx={{ p: 4, m: 'auto', maxWidth: 400, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom component="div">
          Identificación de Medidor
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <TextField
            label="Número de Medidor"
            variant="outlined"
            value={meterNumber}
            onChange={handleMeterNumberChange}
            sx={{ mr: 2, width: 250 }}
          />
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Procesando...' : 'Identificar'}
          </Button>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1">{message}</Typography>
          {year !== null && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Año del medidor: {year}
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default App;