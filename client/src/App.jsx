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

  const handleMeterNumberChange = (event) => {
    setMeterNumber(event.target.value);
  };

  const handleSubmit = () => {
    const year = parseInt(meterNumber.substring(0, 4)); // Extract year from meter number (assuming YYYY format at the beginning)

    if (isNaN(year)) {
      setMessage('Por favor, ingrese un número de medidor válido.');
      return;
    }

    if (year === 2012 || year === 2013) {
      setMessage('Utilice el sistema para medidores viejos.');
    } else {
      setMessage('Este medidor no corresponde a los años 2012 o 2013.');
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
          <Button variant="contained" onClick={handleSubmit}>
            Identificar
          </Button>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1">{message}</Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default App;