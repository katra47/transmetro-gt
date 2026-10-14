import { useEffect, useMemo, useState } from 'react';

import {
  Alert,
  Box,
  Button,
  Chip,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';

import { DataGrid } from '@mui/x-data-grid';

import {
  actualizarActividadBus,
  actualizarEstadoBus,
  suscribirseABuses,
} from '../../services/busesService';

import {
  dataGridStyles,
  tableContainerStyles,
  tableHeaderStyles,
} from './BusesTable.styles';

const etiquetasEstados = {
  DISPONIBLE: 'Disponible',
  EN_RUTA: 'En ruta',
  MANTENIMIENTO: 'Mantenimiento',
  FUERA_DE_SERVICIO: 'Fuera de servicio',
};

function BusesTable() {
  const [buses, setBuses] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [actualizandoId, setActualizandoId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const cancelarSuscripcion = suscribirseABuses(
      (datos) => {
        setBuses(datos);
        setCargando(false);
        setError('');
      },
      () => {
        setError('No fue posible consultar los buses.');
        setCargando(false);
      },
    );

    return cancelarSuscripcion;
  }, []);

  const cambiarEstado = async (busId, nuevoEstado) => {
    try {
      setActualizandoId(busId);
      setError('');

      await actualizarEstadoBus(busId, nuevoEstado);
    } catch (err) {
      setError(err.message || 'No se pudo actualizar el estado.');
    } finally {
      setActualizandoId('');
    }
  };

  const cambiarActividad = async (bus) => {
    try {
      setActualizandoId(bus.id);
      setError('');

      await actualizarActividadBus(bus.id, !bus.activo);
    } catch (err) {
      setError(err.message || 'No se pudo actualizar el bus.');
    } finally {
      setActualizandoId('');
    }
  };

  const columnas = useMemo(
    () => [
      {
        field: 'codigoInterno',
        headerName: 'Código',
        minWidth: 120,
        flex: 1,
      },
      {
        field: 'placa',
        headerName: 'Placa',
        minWidth: 120,
        flex: 1,
      },
      {
        field: 'marca',
        headerName: 'Marca',
        minWidth: 140,
        flex: 1,
      },
      {
        field: 'modelo',
        headerName: 'Modelo',
        minWidth: 140,
        flex: 1,
      },
      {
        field: 'anio',
        headerName: 'Año',
        minWidth: 90,
      },
      {
        field: 'capacidadMaxima',
        headerName: 'Capacidad',
        minWidth: 110,
      },
      {
        field: 'parqueoId',
        headerName: 'Parqueo',
        minWidth: 150,
        flex: 1,
      },
      {
        field: 'estado',
        headerName: 'Estado operativo',
        minWidth: 190,
        sortable: false,
        renderCell: (parametros) => (
          <Select
            size="small"
            value={parametros.row.estado || 'DISPONIBLE'}
            onChange={(event) => {
              cambiarEstado(
                parametros.row.id,
                event.target.value,
              );
            }}
            disabled={actualizandoId === parametros.row.id}
            sx={{ minWidth: 165 }}
          >
            <MenuItem value="DISPONIBLE">
              Disponible
            </MenuItem>

            <MenuItem value="EN_RUTA">
              En ruta
            </MenuItem>

            <MenuItem value="MANTENIMIENTO">
              Mantenimiento
            </MenuItem>

            <MenuItem value="FUERA_DE_SERVICIO">
              Fuera de servicio
            </MenuItem>
          </Select>
        ),
      },
      {
        field: 'activo',
        headerName: 'Registro',
        minWidth: 120,
        renderCell: (parametros) => (
          <Chip
            label={parametros.row.activo ? 'Activo' : 'Inactivo'}
            color={parametros.row.activo ? 'success' : 'default'}
            size="small"
          />
        ),
      },
      {
        field: 'acciones',
        headerName: 'Acciones',
        minWidth: 130,
        sortable: false,
        filterable: false,
        renderCell: (parametros) => (
          <Button
            size="small"
            color={parametros.row.activo ? 'error' : 'success'}
            disabled={actualizandoId === parametros.row.id}
            onClick={() => cambiarActividad(parametros.row)}
          >
            {parametros.row.activo ? 'Desactivar' : 'Activar'}
          </Button>
        ),
      },
    ],
    [actualizandoId],
  );

  return (
    <Box sx={tableContainerStyles}>
      <Box sx={tableHeaderStyles}>
        <Box>
          <Typography
            variant="h5"
            fontWeight={800}
            color="#0B3C5D"
          >
            Buses registrados
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Consulta y actualiza el estado de las unidades.
          </Typography>
        </Box>

        <Chip
          label={`${buses.length} buses`}
          color="primary"
          variant="outlined"
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <DataGrid
          rows={buses}
          columns={columnas}
          loading={cargando}
          autoHeight
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: {
              paginationModel: {
                page: 0,
                pageSize: 5,
              },
            },
          }}
          sx={dataGridStyles}
        />
      </Box>
    </Box>
  );
}

export default BusesTable;