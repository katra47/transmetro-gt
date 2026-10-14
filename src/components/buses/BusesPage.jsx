import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'

import { DataGrid } from '@mui/x-data-grid'

import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'

import BusForm from './BusForm'

import {
  actualizarActividadBus,
  actualizarEstadoBus,
  eliminarBus,
  suscribirseABuses,
} from '../../services/busesService'

import {
  addButtonStyles,
  dataGridStyles,
  searchFieldStyles,
  tableContainerStyles,
  tableHeaderStyles,
  tableTitleStyles,
} from './BusesTable.styles'

const etiquetasEstados = {
  DISPONIBLE: 'Disponible',
  EN_RUTA: 'En ruta',
  MANTENIMIENTO: 'Mantenimiento',
  FUERA_DE_SERVICIO: 'Fuera de servicio',
}

function BusesTable() {
  const [buses, setBuses] = useState([])
  const [cargando, setCargando] = useState(true)

  const [
    actualizandoId,
    setActualizandoId,
  ] = useState('')

  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')

  /* ========================================
     FORMULARIO AGREGAR / EDITAR
  ======================================== */

  const [formOpen, setFormOpen] =
    useState(false)

  const [
    busSeleccionado,
    setBusSeleccionado,
  ] = useState(null)

  /* ========================================
     ELIMINAR
  ======================================== */

  const [
    dialogoEliminarOpen,
    setDialogoEliminarOpen,
  ] = useState(false)

  const [
    busEliminar,
    setBusEliminar,
  ] = useState(null)

  const [
    eliminando,
    setEliminando,
  ] = useState(false)

  /* ========================================
     FIREBASE
  ======================================== */

  useEffect(() => {
    const cancelarSuscripcion =
      suscribirseABuses(
        (datos) => {
          setBuses(datos)
          setCargando(false)
          setError('')
        },

        (err) => {
          console.error(
            'Error consultando buses:',
            err,
          )

          setError(
            'No fue posible consultar los buses.',
          )

          setCargando(false)
        },
      )

    return cancelarSuscripcion
  }, [])

  /* ========================================
     AGREGAR
  ======================================== */

  const abrirNuevoBus = () => {
    setBusSeleccionado(null)
    setFormOpen(true)
  }

  /* ========================================
     EDITAR
  ======================================== */

  const abrirEditarBus = (bus) => {
    setBusSeleccionado(bus)
    setFormOpen(true)
  }

  const cerrarFormulario = () => {
    setFormOpen(false)
    setBusSeleccionado(null)
  }

  /* ========================================
     CAMBIAR ESTADO
  ======================================== */

  const cambiarEstado = async (
    busId,
    nuevoEstado,
  ) => {
    try {
      setActualizandoId(busId)
      setError('')

      await actualizarEstadoBus(
        busId,
        nuevoEstado,
      )
    } catch (err) {
      console.error(err)

      setError(
        err?.message ||
          'No se pudo actualizar el estado.',
      )
    } finally {
      setActualizandoId('')
    }
  }

  /* ========================================
     ACTIVAR / DESACTIVAR
  ======================================== */

  const cambiarActividad = async (bus) => {
    try {
      setActualizandoId(bus.id)
      setError('')

      await actualizarActividadBus(
        bus.id,
        !bus.activo,
      )
    } catch (err) {
      console.error(err)

      setError(
        err?.message ||
          'No se pudo actualizar el bus.',
      )
    } finally {
      setActualizandoId('')
    }
  }

  /* ========================================
     PREPARAR ELIMINACIÓN
  ======================================== */

  const abrirEliminarBus = (bus) => {
    setBusEliminar(bus)
    setDialogoEliminarOpen(true)
  }

  const cerrarEliminarBus = () => {
    if (eliminando) {
      return
    }

    setDialogoEliminarOpen(false)
    setBusEliminar(null)
  }

  /* ========================================
     ELIMINAR
  ======================================== */

  const confirmarEliminarBus = async () => {
    if (!busEliminar?.id) {
      return
    }

    try {
      setEliminando(true)
      setError('')

      await eliminarBus(
        busEliminar.id,
      )

      setDialogoEliminarOpen(false)
      setBusEliminar(null)
    } catch (err) {
      console.error(
        'Error eliminando bus:',
        err,
      )

      setError(
        err?.message ||
          'No fue posible eliminar el bus.',
      )
    } finally {
      setEliminando(false)
    }
  }

  /* ========================================
     BUSCADOR
  ======================================== */

  const busesFiltrados = useMemo(() => {
    const texto =
      busqueda
        .trim()
        .toLowerCase()

    if (!texto) {
      return buses
    }

    return buses.filter((bus) => {
      const estado =
        etiquetasEstados[bus.estado] ||
        bus.estado ||
        ''

      const contenido = [
        bus.codigoInterno,
        bus.placa,
        bus.marca,
        bus.modelo,
        bus.anio,
        bus.capacidadMaxima,
        bus.parqueoId,
        estado,
        bus.activo
          ? 'activo'
          : 'inactivo',
      ]
        .filter(
          (valor) =>
            valor !== undefined &&
            valor !== null,
        )
        .join(' ')
        .toLowerCase()

      return contenido.includes(texto)
    })
  }, [buses, busqueda])

  /* ========================================
     COLUMNAS
  ======================================== */

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
        minWidth: 130,
        flex: 1,
      },

      /* ESTADO */

      {
        field: 'estado',
        headerName: 'Estado operativo',
        minWidth: 190,
        sortable: false,

        renderCell: (parametros) => (
          <Select
            size="small"
            value={
              parametros.row.estado ||
              'DISPONIBLE'
            }
            onChange={(event) =>
              cambiarEstado(
                parametros.row.id,
                event.target.value,
              )
            }
            disabled={
              actualizandoId ===
              parametros.row.id
            }
            sx={{
              minWidth: 165,
            }}
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

      /* ACTIVO */

      {
        field: 'activo',
        headerName: 'Registro',
        minWidth: 105,

        renderCell: (parametros) => (
          <Chip
            label={
              parametros.row.activo
                ? 'Activo'
                : 'Inactivo'
            }
            color={
              parametros.row.activo
                ? 'success'
                : 'default'
            }
            size="small"
          />
        ),
      },

      /* ACCIONES */

      {
        field: 'acciones',
        headerName: 'Acciones',
        minWidth: 280,
        sortable: false,
        filterable: false,

        renderCell: (parametros) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.7,
            }}
          >
            {/* EDITAR */}

            <Tooltip title="Editar bus">
              <IconButton
                size="small"
                onClick={() =>
                  abrirEditarBus(
                    parametros.row,
                  )
                }
                disabled={
                  actualizandoId ===
                  parametros.row.id
                }
                sx={{
                  width: 34,
                  height: 34,

                  borderRadius: '9px',

                  color: '#0B6E69',

                  backgroundColor:
                    '#E8F5F2',

                  '&:hover': {
                    backgroundColor:
                      '#D5EEE8',
                  },
                }}
              >
                <EditOutlinedIcon
                  sx={{
                    fontSize: 18,
                  }}
                />
              </IconButton>
            </Tooltip>

            {/* ACTIVAR / DESACTIVAR */}

            <Button
              size="small"
              color={
                parametros.row.activo
                  ? 'error'
                  : 'success'
              }
              disabled={
                actualizandoId ===
                parametros.row.id
              }
              onClick={() =>
                cambiarActividad(
                  parametros.row,
                )
              }
            >
              {parametros.row.activo
                ? 'Desactivar'
                : 'Activar'}
            </Button>

            {/* ELIMINAR */}

            <Tooltip title="Eliminar bus">
              <IconButton
                size="small"
                onClick={() =>
                  abrirEliminarBus(
                    parametros.row,
                  )
                }
                disabled={
                  actualizandoId ===
                  parametros.row.id
                }
                sx={{
                  width: 34,
                  height: 34,

                  borderRadius: '9px',

                  color: '#B42318',

                  backgroundColor:
                    '#FEF3F2',

                  '&:hover': {
                    backgroundColor:
                      '#FEE4E2',
                  },
                }}
              >
                <DeleteOutlineRoundedIcon
                  sx={{
                    fontSize: 19,
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],

    [actualizandoId],
  )

  /* ========================================
     INTERFAZ
  ======================================== */

  return (
    <Box sx={tableContainerStyles}>

      {/* ===================================
          ENCABEZADO
      =================================== */}

      <Box sx={tableHeaderStyles}>
        <Box>
          <Typography
            sx={tableTitleStyles}
          >
            Buses registrados
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.4,
            }}
          >
            Consulta, registra y administra
            las unidades.
          </Typography>
        </Box>

        {/* DERECHA */}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,

            flexWrap: 'wrap',
          }}
        >
          <Chip
            label={`${buses.length} ${
              buses.length === 1
                ? 'bus'
                : 'buses'
            }`}
            color="primary"
            variant="outlined"
          />

          <Button
            variant="contained"
            startIcon={
              <AddRoundedIcon />
            }
            onClick={abrirNuevoBus}
            sx={addButtonStyles}
          >
            Agregar bus
          </Button>
        </Box>
      </Box>

      {/* ===================================
          BUSCADOR
      =================================== */}

      <Box
        sx={{
          px: {
            xs: 2,
            sm: 2.5,
          },

          pb: 2,

          display: 'flex',

          justifyContent:
            'flex-end',
        }}
      >
        <TextField
          size="small"
          value={busqueda}
          onChange={(event) =>
            setBusqueda(
              event.target.value,
            )
          }
          placeholder="Buscar bus..."
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon
                    sx={{
                      fontSize: 20,
                      color: '#64748B',
                    }}
                  />
                </InputAdornment>
              ),
            },
          }}
          sx={searchFieldStyles}
        />
      </Box>

      {/* ===================================
          ERROR
      =================================== */}

      {error && (
        <Alert
          severity="error"
          onClose={() =>
            setError('')
          }
          sx={{
            mx: 2.5,
            mb: 2,
            borderRadius: '12px',
          }}
        >
          {error}
        </Alert>
      )}

      {/* ===================================
          TABLA
      =================================== */}

      <Box
        sx={{
          width: '100%',
          overflowX: 'auto',
        }}
      >
        <DataGrid
          rows={busesFiltrados}
          columns={columnas}
          loading={cargando}
          autoHeight
          disableRowSelectionOnClick

          pageSizeOptions={[
            5,
            10,
            20,
          ]}

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

      {/* ===================================
          AGREGAR / EDITAR
      =================================== */}

      {formOpen && (
        <BusForm
          open={formOpen}
          busEditar={
            busSeleccionado
          }
          onClose={
            cerrarFormulario
          }
          onSaved={
            cerrarFormulario
          }
        />
      )}

      {/* ===================================
          CONFIRMAR ELIMINACIÓN
      =================================== */}

      <Dialog
        open={dialogoEliminarOpen}
        onClose={cerrarEliminarBus}
        fullWidth
        maxWidth="xs"
        slotProps={{
          paper: {
            sx: {
              borderRadius: '20px',
              overflow: 'hidden',
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 0,
          }}
        >
          <Box
            sx={{
              px: 3,
              py: 2.5,

              display: 'flex',
              alignItems: 'center',
              gap: 1.5,

              color: '#FFFFFF',

              background:
                'linear-gradient(120deg, #7F1D1D 0%, #B42318 100%)',
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,

                flexShrink: 0,

                display: 'grid',
                placeItems: 'center',

                borderRadius: '13px',

                color: '#7F1D1D',

                backgroundColor:
                  '#FDE68A',
              }}
            >
              <WarningAmberRoundedIcon />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: '1.1rem',
                  fontWeight: 900,
                }}
              >
                Eliminar bus
              </Typography>

              <Typography
                sx={{
                  mt: 0.2,

                  color:
                    'rgba(255,255,255,0.75)',

                  fontSize:
                    '0.75rem',
                }}
              >
                Esta acción no se puede
                deshacer.
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent
          sx={{
            px: 3,

            pt:
              '28px !important',

            pb: 2,
          }}
        >
          <Typography
            sx={{
              color: '#475569',

              fontSize: '0.9rem',

              lineHeight: 1.7,
            }}
          >
            ¿Deseas eliminar el bus{' '}

            <Box
              component="span"
              sx={{
                color: '#082F49',
                fontWeight: 900,
              }}
            >
              {busEliminar
                ?.codigoInterno ||
                ''}
            </Box>

            ?
          </Typography>

          {busEliminar?.placa && (
            <Box
              sx={{
                mt: 2,
                p: 2,

                border:
                  '1px solid #E2E8F0',

                borderRadius:
                  '12px',

                backgroundColor:
                  '#F8FAFC',
              }}
            >
              <Typography
                sx={{
                  color: '#64748B',

                  fontSize:
                    '0.7rem',

                  fontWeight: 800,
                }}
              >
                PLACA
              </Typography>

              <Typography
                sx={{
                  mt: 0.3,

                  color: '#0B5361',

                  fontWeight: 900,
                }}
              >
                {busEliminar.placa}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,

            borderTop:
              '1px solid #E7EEEC',

            backgroundColor:
              '#FAFCFB',
          }}
        >
          <Button
            variant="outlined"
            onClick={
              cerrarEliminarBus
            }
            disabled={eliminando}
            sx={{
              borderRadius: '10px',

              borderColor:
                '#CBD5E1',

              color: '#64748B',

              fontWeight: 800,

              textTransform: 'none',
            }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={
              confirmarEliminarBus
            }
            disabled={eliminando}
            startIcon={
              <DeleteOutlineRoundedIcon />
            }
            sx={{
              borderRadius: '10px',

              fontWeight: 900,

              textTransform: 'none',
            }}
          >
            {eliminando
              ? 'Eliminando...'
              : 'Eliminar bus'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default BusesTable