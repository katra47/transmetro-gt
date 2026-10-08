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
  CircularProgress,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'

import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import PauseCircleRoundedIcon from '@mui/icons-material/PauseCircleRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import ToggleOffRoundedIcon from '@mui/icons-material/ToggleOffRounded'
import TrainRoundedIcon from '@mui/icons-material/TrainRounded'

import PermissionGuard from '../usuarios/PermissionGuard'
import EstacionForm from './EstacionForm'

import {
  cambiarEstadoEstacion,
  suscribirseEstaciones,
} from './estacionesService'

import estacionesPageStyles from './EstacionesPage.styles'

const estadoInformacion = {
  OPERATIVA: {
    label: 'Operativa',
    color: '#087A65',
    backgroundColor: '#DDF5EE',
  },
  INACTIVA: {
    label: 'Inactiva',
    color: '#64748B',
    backgroundColor: '#EEF2F6',
  },
  MANTENIMIENTO: {
    label: 'Mantenimiento',
    color: '#9A6500',
    backgroundColor: '#FFF2CC',
  },
}

function EstacionesPage() {
  const [estaciones, setEstaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [search, setSearch] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [selectedStation, setSelectedStation] =
    useState(null)

  const [menuAnchor, setMenuAnchor] = useState(null)
  const [menuStation, setMenuStation] = useState(null)

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  })

  useEffect(() => {
    const unsubscribe = suscribirseEstaciones(
      (stationsData) => {
        setEstaciones(stationsData)
        setPageError('')
        setLoading(false)
      },
      () => {
        setPageError(
          'No fue posible consultar las estaciones registradas.',
        )
        setLoading(false)
      },
    )

    return unsubscribe
  }, [])

  const filteredStations = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    if (!searchValue) {
      return estaciones
    }

    return estaciones.filter((estacion) => {
      const searchableText = [
        estacion.codigo,
        estacion.nombre,
        estacion.municipalidad,
        estacion.direccion,
        estacion.descripcion,
        estacion.estado,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchableText.includes(searchValue)
    })
  }, [estaciones, search])

  const operationalStations = estaciones.filter(
    (estacion) => estacion.estado === 'OPERATIVA',
  ).length

  const maintenanceStations = estaciones.filter(
    (estacion) => estacion.estado === 'MANTENIMIENTO',
  ).length

  const showNotification = (
    message,
    severity = 'success',
  ) => {
    setNotification({
      open: true,
      message,
      severity,
    })
  }

  const closeNotification = () => {
    setNotification((currentNotification) => ({
      ...currentNotification,
      open: false,
    }))
  }

  const handleNewStation = () => {
    setSelectedStation(null)
    setFormOpen(true)
  }

  const handleEditStation = (estacion) => {
    setSelectedStation(estacion)
    setFormOpen(true)
    closeActionsMenu()
  }

  const handleCloseForm = () => {
    setFormOpen(false)
    setSelectedStation(null)
  }

  const openActionsMenu = (event, estacion) => {
    setMenuAnchor(event.currentTarget)
    setMenuStation(estacion)
  }

  const closeActionsMenu = () => {
    setMenuAnchor(null)
    setMenuStation(null)
  }

  const handleChangeStatus = async (newStatus) => {
    if (!menuStation) {
      return
    }

    try {
      await cambiarEstadoEstacion(
        menuStation.id,
        newStatus,
      )

      showNotification(
        'El estado de la estación fue actualizado correctamente.',
      )
    } catch (error) {
      console.error(
        'Error al cambiar el estado de la estación:',
        error,
      )

      showNotification(
        error.message ||
          'No fue posible actualizar el estado de la estación.',
        'error',
      )
    } finally {
      closeActionsMenu()
    }
  }

  const formatCoordinates = (coordinates) => {
    if (
      coordinates?.latitud === undefined ||
      coordinates?.longitud === undefined
    ) {
      return 'Sin coordenadas'
    }

    return `${coordinates.latitud}, ${coordinates.longitud}`
  }

  return (
    <Box sx={estacionesPageStyles.page}>
      <Box sx={estacionesPageStyles.container}>
        <Box sx={estacionesPageStyles.header}>
          <Box sx={estacionesPageStyles.headerContent}>
            <Box sx={estacionesPageStyles.headerInformation}>
              <Box sx={estacionesPageStyles.headerIcon}>
                <TrainRoundedIcon sx={{ fontSize: 32 }} />
              </Box>

              <Box>
                <Typography
                  component="h1"
                  sx={estacionesPageStyles.title}
                >
                  Estaciones
                </Typography>

                <Typography
                  sx={estacionesPageStyles.description}
                >
                  Administra las estaciones, sus ubicaciones
                  y estados operativos.
                </Typography>
              </Box>
            </Box>

            <PermissionGuard permission="estaciones.crear">
              <Button
                type="button"
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={handleNewStation}
                sx={estacionesPageStyles.addButton}
              >
                Registrar estación
              </Button>
            </PermissionGuard>
          </Box>
        </Box>

        {pageError && (
          <Alert
            severity="error"
            sx={estacionesPageStyles.alert}
          >
            {pageError}
          </Alert>
        )}

        <Box sx={estacionesPageStyles.statisticsGrid}>
          <Paper
            elevation={0}
            sx={estacionesPageStyles.statisticCard}
          >
            <Box sx={estacionesPageStyles.statisticIcon}>
              <TrainRoundedIcon />
            </Box>

            <Box>
              <Typography
                sx={estacionesPageStyles.statisticValue}
              >
                {estaciones.length}
              </Typography>

              <Typography
                sx={estacionesPageStyles.statisticLabel}
              >
                Estaciones registradas
              </Typography>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={estacionesPageStyles.statisticCard}
          >
            <Box sx={estacionesPageStyles.statisticIcon}>
              <CheckCircleRoundedIcon />
            </Box>

            <Box>
              <Typography
                sx={estacionesPageStyles.statisticValue}
              >
                {operationalStations}
              </Typography>

              <Typography
                sx={estacionesPageStyles.statisticLabel}
              >
                Estaciones operativas
              </Typography>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={estacionesPageStyles.statisticCard}
          >
            <Box sx={estacionesPageStyles.statisticIcon}>
              <PauseCircleRoundedIcon />
            </Box>

            <Box>
              <Typography
                sx={estacionesPageStyles.statisticValue}
              >
                {maintenanceStations}
              </Typography>

              <Typography
                sx={estacionesPageStyles.statisticLabel}
              >
                En mantenimiento
              </Typography>
            </Box>
          </Paper>
        </Box>

        <Paper
          elevation={0}
          sx={estacionesPageStyles.contentCard}
        >
          <Box sx={estacionesPageStyles.toolbar}>
            <Typography
              sx={estacionesPageStyles.sectionTitle}
            >
              Estaciones registradas
            </Typography>

            <TextField
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Buscar estación..."
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon />
                    </InputAdornment>
                  ),
                },
              }}
              sx={estacionesPageStyles.searchField}
            />
          </Box>

          {loading ? (
            <Box sx={estacionesPageStyles.loadingContainer}>
              <CircularProgress sx={{ color: '#008C7A' }} />
            </Box>
          ) : filteredStations.length === 0 ? (
            <Box sx={estacionesPageStyles.emptyContainer}>
              <Box sx={estacionesPageStyles.emptyIcon}>
                <TrainRoundedIcon sx={{ fontSize: 34 }} />
              </Box>

              <Typography
                sx={estacionesPageStyles.emptyTitle}
              >
                {search
                  ? 'No se encontraron resultados'
                  : 'No hay estaciones registradas'}
              </Typography>

              <Typography
                sx={estacionesPageStyles.emptyDescription}
              >
                {search
                  ? 'Prueba utilizando otro código, nombre, municipio o dirección.'
                  : 'Registra la primera estación para comenzar su administración.'}
              </Typography>
            </Box>
          ) : (
            <TableContainer
              sx={estacionesPageStyles.tableContainer}
            >
              <Table>
                <TableHead
                  sx={estacionesPageStyles.tableHeader}
                >
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell>Estación</TableCell>
                    <TableCell>Municipalidad</TableCell>
                    <TableCell>Ubicación</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell align="right">
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredStations.map((estacion) => {
                    const status =
                      estadoInformacion[estacion.estado] ??
                      estadoInformacion.INACTIVA

                    return (
                      <TableRow
                        key={estacion.id}
                        sx={estacionesPageStyles.tableRow}
                      >
                        <TableCell>
                          <Typography
                            sx={estacionesPageStyles.code}
                          >
                            {estacion.codigo}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography
                            sx={estacionesPageStyles.name}
                          >
                            {estacion.nombre}
                          </Typography>

                          <Typography
                            sx={
                              estacionesPageStyles.secondaryText
                            }
                          >
                            {estacion.descripcion ||
                              'Sin descripción'}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          {estacion.municipalidad}
                        </TableCell>

                        <TableCell
                          sx={
                            estacionesPageStyles.locationCell
                          }
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 0.8,
                            }}
                          >
                            <LocationOnRoundedIcon
                              sx={{
                                marginTop: '2px',
                                color: '#008C7A',
                                fontSize: 18,
                              }}
                            />

                            <Box sx={{ minWidth: 0 }}>
                              <Typography
                                sx={
                                  estacionesPageStyles.locationText
                                }
                              >
                                {estacion.direccion}
                              </Typography>

                              <Typography
                                sx={
                                  estacionesPageStyles.coordinatesText
                                }
                              >
                                {formatCoordinates(
                                  estacion.coordenadas,
                                )}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={status.label}
                            size="small"
                            sx={{
                              ...estacionesPageStyles.statusChip,
                              color: status.color,
                              backgroundColor:
                                status.backgroundColor,
                            }}
                          />
                        </TableCell>

                        <TableCell
                          align="right"
                          sx={estacionesPageStyles.actionsCell}
                        >
                          <PermissionGuard permission="estaciones.editar">
                            <Tooltip title="Opciones">
                              <IconButton
                                type="button"
                                aria-label={`Opciones de ${estacion.nombre}`}
                                onClick={(event) =>
                                  openActionsMenu(
                                    event,
                                    estacion,
                                  )
                                }
                                sx={
                                  estacionesPageStyles.actionButton
                                }
                              >
                                <MoreVertRoundedIcon />
                              </IconButton>
                            </Tooltip>
                          </PermissionGuard>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeActionsMenu}
      >
        <MenuItem
          onClick={() =>
            handleEditStation(menuStation)
          }
        >
          <EditRoundedIcon sx={{ marginRight: 1.5 }} />
          Editar información
        </MenuItem>

        {menuStation?.estado !== 'OPERATIVA' && (
          <MenuItem
            onClick={() =>
              handleChangeStatus('OPERATIVA')
            }
          >
            <CheckCircleRoundedIcon
              sx={{ marginRight: 1.5 }}
            />
            Marcar como operativa
          </MenuItem>
        )}

        {menuStation?.estado !== 'MANTENIMIENTO' && (
          <MenuItem
            onClick={() =>
              handleChangeStatus('MANTENIMIENTO')
            }
          >
            <PauseCircleRoundedIcon
              sx={{ marginRight: 1.5 }}
            />
            En mantenimiento
          </MenuItem>
        )}

        {menuStation?.estado !== 'INACTIVA' && (
          <MenuItem
            onClick={() =>
              handleChangeStatus('INACTIVA')
            }
          >
            <ToggleOffRoundedIcon
              sx={{ marginRight: 1.5 }}
            />
            Marcar como inactiva
          </MenuItem>
        )}
      </Menu>

      {formOpen && (
        <EstacionForm
          key={selectedStation?.id ?? 'new-station'}
          open={formOpen}
          estacion={selectedStation}
          onClose={handleCloseForm}
          onSaved={showNotification}
        />
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={closeNotification}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Alert
          severity={notification.severity}
          onClose={closeNotification}
          sx={estacionesPageStyles.snackbarAlert}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default EstacionesPage