import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';

import SaveRoundedIcon from '@mui/icons-material/SaveRounded';

import { registrarBus } from '../../services/busesService';

import {
  buttonContainerStyles,
  formContainerStyles,
  formGridStyles,
  fullWidthFieldStyles,
  submitButtonStyles,
} from './BusForm.styles';

const valoresIniciales = {
  codigoInterno: '',
  placa: '',
  marca: '',
  modelo: '',
  anio: '',
  capacidadMaxima: '',
  parqueoId: '',
  estado: 'DISPONIBLE',
};

function BusForm() {
  const [formulario, setFormulario] = useState(valoresIniciales);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const manejarCambio = (event) => {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  const manejarEnvio = async (event) => {
    event.preventDefault();

    setGuardando(true);
    setMensaje('');
    setError('');

    try {
      await registrarBus(formulario);

      setMensaje('El bus fue registrado correctamente.');
      setFormulario(valoresIniciales);
    } catch (err) {
      setError(err.message || 'No fue posible registrar el bus.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Box component="form" onSubmit={manejarEnvio} sx={formContainerStyles}>
      <Typography variant="h5" fontWeight={800} color="#0B3C5D">
        Registro de buses
      </Typography>

      <Typography variant="body2" color="text.secondary" mt={1}>
        Ingresa la información general y operativa de la unidad.
      </Typography>

      {mensaje && (
        <Alert severity="success" sx={{ mt: 3 }}>
          {mensaje}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={formGridStyles}>
        <TextField
          label="Código interno"
          name="codigoInterno"
          value={formulario.codigoInterno}
          onChange={manejarCambio}
          required
          fullWidth
        />

        <TextField
          label="Placa"
          name="placa"
          value={formulario.placa}
          onChange={manejarCambio}
          required
          fullWidth
        />

        <TextField
          label="Marca"
          name="marca"
          value={formulario.marca}
          onChange={manejarCambio}
          required
          fullWidth
        />

        <TextField
          label="Modelo"
          name="modelo"
          value={formulario.modelo}
          onChange={manejarCambio}
          required
          fullWidth
        />

        <TextField
          label="Año"
          name="anio"
          type="number"
          value={formulario.anio}
          onChange={manejarCambio}
          slotProps={{
            htmlInput: {
              min: 1990,
              max: new Date().getFullYear() + 1,
            },
          }}
          required
          fullWidth
        />

        <TextField
          label="Capacidad máxima"
          name="capacidadMaxima"
          type="number"
          value={formulario.capacidadMaxima}
          onChange={manejarCambio}
          slotProps={{
            htmlInput: {
              min: 1,
            },
          }}
          required
          fullWidth
        />

        <TextField
          label="Parqueo asignado"
          name="parqueoId"
          value={formulario.parqueoId}
          onChange={manejarCambio}
          helperText="Por ahora ingresa el código del parqueo."
          required
          fullWidth
        />

        <TextField
          select
          label="Estado"
          name="estado"
          value={formulario.estado}
          onChange={manejarCambio}
          required
          fullWidth
        >
          <MenuItem value="DISPONIBLE">Disponible</MenuItem>
          <MenuItem value="EN_RUTA">En ruta</MenuItem>
          <MenuItem value="MANTENIMIENTO">Mantenimiento</MenuItem>
          <MenuItem value="FUERA_DE_SERVICIO">
            Fuera de servicio
          </MenuItem>
        </TextField>
      </Box>

      <Box sx={buttonContainerStyles}>
        <Button
          type="submit"
          variant="contained"
          startIcon={
            guardando
              ? <CircularProgress size={18} color="inherit" />
              : <SaveRoundedIcon />
          }
          disabled={guardando}
          sx={submitButtonStyles}
        >
          {guardando ? 'Guardando...' : 'Registrar bus'}
        </Button>
      </Box>
    </Box>
  );
}

export default BusForm;