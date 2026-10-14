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
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import LocalParkingRoundedIcon from '@mui/icons-material/LocalParkingRounded'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'

import PermissionGuard from '../usuarios/PermissionGuard'
import { suscribirseEstaciones } from '../estaciones/estacionesService'
import ParqueoForm from './ParqueoForm'

import {
  cambiarEstadoParqueo,
  suscribirseParqueos,
} from './parqueosService'

import parqueosPageStyles from './ParqueosPage.styles'

const estados = {
  DISPONIBLE: {
    label: 'Disponible',
    color: '#087A65',
    backgroundColor: '#DDF5EE',
  },
  LLENO: {
    label: 'Lleno',
    color: '#9A6500',
    backgroundColor: '#FFF2CC',
  },
  MANTENIMIENTO: {
    label: 'Mantenimiento',
    color: '#A14C13',
    backgroundColor: '#FDE8D8',
  },
  INACTIVO: {
    label: 'Inactivo',
    color: '#64748B',
    backgroundColor: '#EEF2F6',
  },
}

function ParqueosPage() {
  const [parqueos, setParqueos] = useState([])
  const [estaciones, setEstaciones] = useState([])
  const [loadingParqueos, setLoadingParqueos] =
    useState(true)
  const [loadingEstaciones, setLoadingEstaciones] =
    useState(true)
  const [pageError, setPageError] = useState('')
  const [search, setSearch] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [selectedParking, setSelectedParking] =
    useState(null)

  const [menuAnchor, setMenuAnchor] = useState(null)
  const [menuParking, setMenuParking] = useState(null)

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  })

  useEffect(() => {
    return suscribirseParqueos(
      (data) => {
        setParqueos(data)
        setLoadingParqueos(false)
      },
      () => {
        setPageError(
          'No fue posible consultar los parqueos.',
        )
        setLoadingParqueos(false)
      },
    )
  }, [])

  useEffect(() => {
    return suscribirseEstaciones(
      (data) => {
        setEstaciones(data)
        setLoadingEstaciones(false)
      },
      () => {
        setPageError(
          'No fue posible consultar las estaciones.',
        )
        setLoadingEstaciones(false)
      },
    )
  }, [])

  const stationNames = useMemo(() => {
    return new Map(
      estaciones.map((estacion) => [
        estacion.id,
        `${estacion.codigo} - ${estacion.nombre}`,
      ]),
    )
  }, [estaciones])

  const filteredParking = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    if (!searchValue) {
      return parqueos
    }

    return parqueos.filter((parqueo) => {
      const stationName =
        stationNames.get(parqueo.estacionId) ?? ''

      return [
        parqueo.codigo,
        parqueo.nombre,
        parqueo.descripcion,
        parqueo.estado,
        stationName,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(searchValue)
    })
  }, [parqueos, search, stationNames])

  const availableParking = parqueos.filter(
    (parqueo) => parqueo.estado === 'DISPONIBLE',
  ).length

  const totalCapacity = parqueos.reduce(
    (total, parqueo) =>
      total + Number(parqueo.capacidad ?? 0),
    0,
  )

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
    setNotification((current) => ({
      ...current,
      open: false,
    }))
  }

  const handleNewParking = () => {
    if (estaciones.length === 0) {
      showNotification(
        'Debes registrar una estación antes de crear un parqueo.',
        'warning',
      )
      return
    }

    setSelectedParking(null)
    setFormOpen(true)
  }

  const handleEditParking = (parqueo) => {
    setSelectedParking(parqueo)
    setFormOpen(true)
    closeActionsMenu()
  }

  const handleCloseForm = () => {
    setFormOpen(false)
    setSelectedParking(null)
  }

  const openActionsMenu = (event, parqueo) => {
    setMenuAnchor(event.currentTarget)
    setMenuParking(parqueo)
  }

  const closeActionsMenu = () => {
    setMenuAnchor(null)
    setMenuParking(null)
  }

  const handleChangeStatus = async (status) => {
    if (!menuParking) {
      return
    }

    try {
      await cambiarEstadoParqueo(
        menuParking.id,
        status,
      )

      showNotification(
        'El estado del parqueo fue actualizado.',
      )
    } catch (error) {
      showNotification(
        error.message ||
          'No fue posible actualizar el parqueo.',
        'error',
      )
    } finally {
      closeActionsMenu()
    }
  }

  const loading =
    loadingParqueos || loadingEstaciones

  return (
    <Box sx={parqueosPageStyles.page}>
      <Box sx={parqueosPageStyles.container}>
        <Box sx={parqueosPageStyles.header}>
          <Box sx={parqueosPageStyles.headerContent}>
            <Box sx={parqueosPageStyles.headerInformation}>
              <Box sx={parqueosPageStyles.headerIcon}>
                <LocalParkingRoundedIcon
                  sx={{ fontSize: 32 }}
                />
              </Box>

              <Box>
                <Typography
                  component="h1"
                  sx={parqueosPageStyles.title}
                >
                  Parqueos
                </Typography>

                <Typography
                  sx={parqueosPageStyles.description}
                >
                  Administra los espacios disponibles para
                  las unidades de transporte.
                </Typography>
              </Box>
            </Box>

            <PermissionGuard permission="parqueos.crear">
              <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={handleNewParking}
                sx={parqueosPageStyles.addButton}
              >
                Registrar parqueo
              </Button>
            </PermissionGuard>
          </Box>
        </Box>

        {pageError && (
          <Alert
            severity="error"
            sx={parqueosPageStyles.alert}
          >
            {pageError}
          </Alert>
        )}

        <Box sx={parqueosPageStyles.statisticsGrid}>
          <Paper
            elevation={0}
            sx={parqueosPageStyles.statisticCard}
          >
            <Box sx={parqueosPageStyles.statisticIcon}>
              <LocalParkingRoundedIcon />
            </Box>

            <Box>
              <Typography
                sx={parqueosPageStyles.statisticValue}
              >
                {parqueos.length}
              </Typography>

              <Typography
                sx={parqueosPageStyles.statisticLabel}
              >
                Parqueos registrados
              </Typography>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={parqueosPageStyles.statisticCard}
          >
            <Box sx={parqueosPageStyles.statisticIcon}>
              <LocalParkingRoundedIcon />
            </Box>

            <Box>
              <Typography
                sx={parqueosPageStyles.statisticValue}
              >
                {availableParking}
              </Typography>

              <Typography
                sx={parqueosPageStyles.statisticLabel}
              >
                Parqueos disponibles
              </Typography>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={parqueosPageStyles.statisticCard}
          >
            <Box sx={parqueosPageStyles.statisticIcon}>
              <LocalParkingRoundedIcon />
            </Box>

            <Box>
              <Typography
                sx={parqueosPageStyles.statisticValue}
              >
                {totalCapacity}
              </Typography>

              <Typography
                sx={parqueosPageStyles.statisticLabel}
              >
                Capacidad total de buses
              </Typography>
            </Box>
          </Paper>
        </Box>

        <Paper
          elevation={0}
          sx={parqueosPageStyles.contentCard}
        >
          <Box sx={parqueosPageStyles.toolbar}>
            <Typography
              sx={parqueosPageStyles.sectionTitle}
            >
              Parqueos registrados
            </Typography>

            <TextField
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Buscar parqueo..."
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
              sx={parqueosPageStyles.searchField}
            />
          </Box>

          {loading ? (
            <Box sx={parqueosPageStyles.loadingContainer}>
              <CircularProgress sx={{ color: '#008C7A' }} />
            </Box>
          ) : filteredParking.length === 0 ? (
            <Box sx={parqueosPageStyles.emptyContainer}>
              <Box>
                <Typography
                  sx={parqueosPageStyles.emptyTitle}
                >
                  {search
                    ? 'No se encontraron resultados'
                    : 'No hay parqueos registrados'}
                </Typography>

                <Typography
                  sx={parqueosPageStyles.emptyDescription}
                >
                  Registra un parqueo asociado a una estación.
                </Typography>
              </Box>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead
                  sx={parqueosPageStyles.tableHeader}
                >
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell>Parqueo</TableCell>
                    <TableCell>Estación</TableCell>
                    <TableCell>Capacidad</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell align="right">
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredParking.map((parqueo) => {
                    const status =
                      estados[parqueo.estado] ??
                      estados.INACTIVO

                    return (
                      <TableRow
                        key={parqueo.id}
                        sx={parqueosPageStyles.tableRow}
                      >
                        <TableCell>
                          <Typography
                            sx={parqueosPageStyles.code}
                          >
                            {parqueo.codigo}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography
                            sx={parqueosPageStyles.name}
                          >
                            {parqueo.nombre}
                          </Typography>

                          <Typography
                            sx={
                              parqueosPageStyles.secondaryText
                            }
                          >
                            {parqueo.descripcion ||
                              'Sin descripción'}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          {stationNames.get(
                            parqueo.estacionId,
                          ) ?? 'Estación no disponible'}
                        </TableCell>

                        <TableCell>
                          {parqueo.capacidad} buses
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={status.label}
                            size="small"
                            sx={{
                              ...parqueosPageStyles.statusChip,
                              color: status.color,
                              backgroundColor:
                                status.backgroundColor,
                            }}
                          />
                        </TableCell>

                        <TableCell align="right">
                          <PermissionGuard permission="parqueos.editar">
                            <Tooltip title="Opciones">
                              <IconButton
                                onClick={(event) =>
                                  openActionsMenu(
                                    event,
                                    parqueo,
                                  )
                                }
                                sx={
                                  parqueosPageStyles.actionButton
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
            handleEditParking(menuParking)
          }
        >
          <EditRoundedIcon sx={{ marginRight: 1.5 }} />
          Editar información
        </MenuItem>

        {Object.entries(estados).map(
          ([value, information]) =>
            menuParking?.estado !== value && (
              <MenuItem
                key={value}
                onClick={() =>
                  handleChangeStatus(value)
                }
              >
                {information.label}
              </MenuItem>
            ),
        )}
      </Menu>

      {formOpen && (
        <ParqueoForm
          key={selectedParking?.id ?? 'new-parking'}
          open={formOpen}
          parqueo={selectedParking}
          estaciones={estaciones}
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
          sx={parqueosPageStyles.snackbarAlert}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ParqueosPage