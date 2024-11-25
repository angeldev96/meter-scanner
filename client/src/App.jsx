import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';

const App = () => {
  const [serialNumber, setSerialNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [meters, setMeters] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchMeters();
  }, [page, rowsPerPage]);

  const handleSerialNumberChange = (event) => {
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

    try {
      const response = await fetch(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/addMeter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serialnumber: serialNumber }),
      });
      const data = await response.json();

      setMessage(data.message);
      if (data.meterId) {
        fetchMeters();
      }
    } catch (error) {
      setMessage('Error al procesar la solicitud. Por favor, inténtelo de nuevo.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeters = async () => {
    try {
      const response = await fetch(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/meters?page=${page + 1}&limit=${rowsPerPage}`);
      const data = await response.json();
      setMeters(data.meters);
    } catch (error) {
      console.error('Error al obtener los medidores:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', bgcolor: 'grey.100' }}>
      <Paper elevation={3} sx={{ p: 4, m: 'auto', maxWidth: 800, width: '100%', textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom component="div">
          Registro de Medidores
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <TextField
            label="Número de Medidor"
            variant="outlined"
            value={serialNumber}
            onChange={handleSerialNumberChange}
            onKeyPress={handleKeyPress}
            sx={{ mr: 2, flexGrow: 1 }}
          />
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Procesando...' : 'Registrar'}
          </Button>
        </Box>
        <Typography variant="body1" sx={{ mb: 2 }}>{message}</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Medidores migrados para usar en Juice Nuevo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {meters.map((meter) => (
                <TableRow key={meter.id}>
                  <TableCell>{meter.id}</TableCell>
                  <TableCell>{meter.serialnumber}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={meters.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default App;