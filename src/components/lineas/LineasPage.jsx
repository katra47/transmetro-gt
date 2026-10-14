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
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Snackbar,
  Tab,
  Tabs,
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
import AltRouteRoundedIcon from '@mui/icons-material/AltRouteRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import PauseCircleRoundedIcon from '@mui/icons-material/PauseCircleRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import ToggleOffRoundedIcon from '@mui/icons-material/ToggleOffRounded'
import TrainRoundedIcon from '@mui/icons-material/TrainRounded'

import PermissionGuard from '../usuarios/PermissionGuard'
import LineaForm from './LineaForm'

import {
  actualizarAsignacionEstacion,
  asignarEstacionLinea,
  calcularDistanciaRuta,
  cambiarEstadoLinea,
  eliminarAsignacionEstacion,
  suscribirseAsignacionesEstaciones,
  suscribirseEstacionesParaLineas,
  suscribirseLineas,
} from './lineasService'

import lineasPageStyles from './LineasPage.styles'

const estados = {
  ACTIVA: {
    label: 'Activa',
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

const assignmentInitialState = {
  estacionId: '',
  orden: '1',
  distanciaAnteriorKm: '0',
}

function LineasPage() {
  const [lineas, setLineas] = useState([])
  const [estaciones, setEstaciones] = useState([])
  const [asignaciones, setAsignaciones] = useState([])

  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [pageError, setPageError] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [selectedLine, setSelectedLine] = useState(null)

  const [menuAnchor, setMenuAnchor] = useState(null)
  const [menuLine, setMenuLine] = useState(null)

  const [stationsOpen, setStationsOpen] = useState(false)
  const [stationsLine, setStationsLine] = useState(null)
  const [direction, setDirection] = useState('IDA')
  const [assignmentForm, setAssignmentForm] =
    useState(assignmentInitialState)
  const [
    editingAssignment,
    setEditingAssignment,
  ] = useState(null)
  const [savingAssignment, setSavingAssignment] =
    useState(false)

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  })

  useEffect(() => {
    let loadedSources = 0

    const markLoaded = () => {
      loadedSources += 1

      if (loadedSources >= 3) {
        setLoading(false)
      }
    }

    const handleError = (error) => {
      console.error(error)
      setPageError(
        'No fue posible cargar la información de líneas.',
      )
      setLoading(false)
    }

    const unsubscribeLines = suscribirseLineas(
      (data) => {
        setLineas(data)
        markLoaded()
      },
      handleError,
    )

    const unsubscribeStations =
      suscribirseEstacionesParaLineas(
        (data) => {
          setEstaciones(data)
          markLoaded()
        },
        handleError,
      )

    const unsubscribeAssignments =
      suscribirseAsignacionesEstaciones(
        (data) => {
          setAsignaciones(data)
          markLoaded()
        },
        handleError,
      )

    return () => {
      unsubscribeLines()
      unsubscribeStations()
      unsubscribeAssignments()
    }
  }, [])

  const stationMap = useMemo(
    () =>
      new Map(
        estaciones.map((station) => [
          station.id,
          station,
        ]),
      ),
    [estaciones],
  )

  const getLineAssignments = (
    lineId,
    selectedDirection = null,
  ) => {
    return asignaciones
      .filter(
        (assignment) =>
          assignment.lineaId === lineId &&
          (
            !selectedDirection ||
            assignment.sentido ===
              selectedDirection
          ),
      )
      .sort(
        (firstAssignment, secondAssignment) =>
          firstAssignment.orden -
          secondAssignment.orden,
      )
  }

  const currentRoute = useMemo(() => {
    if (!stationsLine) {
      return []
    }

    return getLineAssignments(
      stationsLine.id,
      direction,
    )
  }, [
    asignaciones,
    stationsLine,
    direction,
  ])

  const filteredLines = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    if (!searchValue) {
      return lineas
    }

    return lineas.filter((linea) => {
      const stationNames = getLineAssignments(
        linea.id,
      )
        .map(
          (assignment) =>
            stationMap.get(assignment.estacionId)
              ?.nombre,
        )
        .filter(Boolean)

      return [
        linea.codigo,
        linea.nombre,
        linea.descripcion,
        linea.estado,
        ...stationNames,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(searchValue)
    })
  }, [
    lineas,
    search,
    asignaciones,
    stationMap,
  ])

  const activeLines = lineas.filter(
    (linea) => linea.estado === 'ACTIVA',
  ).length

  const uniqueAssignedStations = new Set(
    asignaciones.map(
      (assignment) => assignment.estacionId,
    ),
  ).size

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

  const closeMenu = () => {
    setMenuAnchor(null)
    setMenuLine(null)
  }

  const resetAssignmentForm = (
    selectedDirection = direction,
  ) => {
    const routeLength = stationsLine
      ? getLineAssignments(
        stationsLine.id,
        selectedDirection,
      ).length
      : 0

    setAssignmentForm({
      estacionId: '',
      orden: String(routeLength + 1),
      distanciaAnteriorKm: '0',
    })

    setEditingAssignment(null)
  }

  const openStationsManager = (linea) => {
    const initialRoute = getLineAssignments(
      linea.id,
      'IDA',
    )

    setStationsLine(linea)
    setDirection('IDA')
    setAssignmentForm({
      estacionId: '',
      orden: String(initialRoute.length + 1),
      distanciaAnteriorKm: '0',
    })
    setEditingAssignment(null)
    setStationsOpen(true)
    closeMenu()
  }

  const handleDirectionChange = (
    event,
    newDirection,
  ) => {
    setDirection(newDirection)

    const routeLength = getLineAssignments(
      stationsLine.id,
      newDirection,
    ).length

    setAssignmentForm({
      estacionId: '',
      orden: String(routeLength + 1),
      distanciaAnteriorKm: '0',
    })

    setEditingAssignment(null)
  }

  const handleAssignmentChange = (event) => {
    const { name, value } = event.target

    setAssignmentForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  const handleSaveAssignment = async () => {
    if (!assignmentForm.estacionId) {
      showNotification(
        'Selecciona una estación.',
        'warning',
      )
      return
    }

    setSavingAssignment(true)

    try {
      if (editingAssignment) {
        await actualizarAsignacionEstacion(
          editingAssignment.id,
          assignmentForm,
        )

        showNotification(
          'La asignación fue actualizada.',
        )
      } else {
        await asignarEstacionLinea({
          lineaId: stationsLine.id,
          estacionId:
            assignmentForm.estacionId,
          sentido: direction,
          orden: assignmentForm.orden,
          distanciaAnteriorKm:
            assignmentForm.distanciaAnteriorKm,
        })

        showNotification(
          'La estación fue asignada correctamente.',
        )
      }

      const nextOrder = editingAssignment
        ? currentRoute.length + 1
        : currentRoute.length + 2

      setAssignmentForm({
        estacionId: '',
        orden: String(nextOrder),
        distanciaAnteriorKm: '0',
      })

      setEditingAssignment(null)
    } catch (error) {
      console.error(error)

      showNotification(
        error.message ||
          'No fue posible guardar la asignación.',
        'error',
      )
    } finally {
      setSavingAssignment(false)
    }
  }

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment)

    setAssignmentForm({
      estacionId: assignment.estacionId,
      orden: String(assignment.orden),
      distanciaAnteriorKm: String(
        assignment.distanciaAnteriorKm ?? 0,
      ),
    })
  }

  const handleDeleteAssignment = async (
    assignment,
  ) => {
    const station = stationMap.get(
      assignment.estacionId,
    )

    const confirmed = window.confirm(
      `¿Deseas retirar la estación ${
        station?.nombre ?? ''
      } de este sentido?`,
    )

    if (!confirmed) {
      return
    }

    try {
      await eliminarAsignacionEstacion(
        assignment.id,
      )

      showNotification(
        'La estación fue retirada de la línea.',
      )

      if (
        editingAssignment?.id === assignment.id
      ) {
        resetAssignmentForm()
      }
    } catch (error) {
      showNotification(
        error.message ||
          'No fue posible retirar la estación.',
        'error',
      )
    }
  }

  const getStationTooltip = (linea) => {
    const ida = getLineAssignments(
      linea.id,
      'IDA',
    )

    const regreso = getLineAssignments(
      linea.id,
      'REGRESO',
    )

    return (
      <Box sx={{ padding: 0.7 }}>
        {ida.length > 0 && (
          <Box sx={{ marginBottom: 1 }}>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 800,
              }}
            >
              Sentido de ida
            </Typography>

            {ida.map((assignment) => (
              <Typography
                key={assignment.id}
                sx={{ fontSize: '0.72rem' }}
              >
                {assignment.orden}.{' '}
                {stationMap.get(
                  assignment.estacionId,
                )?.nombre ?? 'No disponible'}
              </Typography>
            ))}
          </Box>
        )}

        {regreso.length > 0 && (
          <Box>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 800,
              }}
            >
              Sentido de regreso
            </Typography>

            {regreso.map((assignment) => (
              <Typography
                key={assignment.id}
                sx={{ fontSize: '0.72rem' }}
              >
                {assignment.orden}.{' '}
                {stationMap.get(
                  assignment.estacionId,
                )?.nombre ?? 'No disponible'}
              </Typography>
            ))}
          </Box>
        )}
      </Box>
    )
  }

  return (
    <Box sx={lineasPageStyles.page}>
      <Box sx={lineasPageStyles.container}>
        <Box sx={lineasPageStyles.header}>
          <Box sx={lineasPageStyles.headerContent}>
            <Box sx={lineasPageStyles.headerInformation}>
              <Box sx={lineasPageStyles.headerIcon}>
                <AltRouteRoundedIcon
                  sx={{ fontSize: 32 }}
                />
              </Box>

              <Box>
                <Typography
                  component="h1"
                  sx={lineasPageStyles.title}
                >
                  Líneas
                </Typography>

                <Typography
                  sx={lineasPageStyles.description}
                >
                  Administra líneas, estaciones y rutas.
                </Typography>
              </Box>
            </Box>

            <PermissionGuard permission="lineas.crear">
              <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={() => {
                  setSelectedLine(null)
                  setFormOpen(true)
                }}
                sx={lineasPageStyles.addButton}
              >
                Registrar línea
              </Button>
            </PermissionGuard>
          </Box>
        </Box>

        {pageError && (
          <Alert
            severity="error"
            sx={lineasPageStyles.alert}
          >
            {pageError}
          </Alert>
        )}

        <Box sx={lineasPageStyles.statisticsGrid}>
          <Paper
            elevation={0}
            sx={lineasPageStyles.statisticCard}
          >
            <Typography
              sx={lineasPageStyles.statisticValue}
            >
              {lineas.length}
            </Typography>

            <Typography
              sx={lineasPageStyles.statisticLabel}
            >
              Líneas registradas
            </Typography>
          </Paper>

          <Paper
            elevation={0}
            sx={lineasPageStyles.statisticCard}
          >
            <Typography
              sx={lineasPageStyles.statisticValue}
            >
              {activeLines}
            </Typography>

            <Typography
              sx={lineasPageStyles.statisticLabel}
            >
              Líneas activas
            </Typography>
          </Paper>

          <Paper
            elevation={0}
            sx={lineasPageStyles.statisticCard}
          >
            <Typography
              sx={lineasPageStyles.statisticValue}
            >
              {uniqueAssignedStations}
            </Typography>

            <Typography
              sx={lineasPageStyles.statisticLabel}
            >
              Estaciones vinculadas
            </Typography>
          </Paper>
        </Box>

        <Paper
          elevation={0}
          sx={lineasPageStyles.contentCard}
        >
          <Box sx={lineasPageStyles.toolbar}>
            <Typography sx={{ fontWeight: 800 }}>
              Líneas registradas
            </Typography>

            <TextField
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Buscar línea..."
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
              sx={lineasPageStyles.searchField}
            />
          </Box>

          {loading ? (
            <Box sx={lineasPageStyles.loadingContainer}>
              <CircularProgress sx={{ color: '#008C7A' }} />
            </Box>
          ) : filteredLines.length === 0 ? (
            <Box sx={lineasPageStyles.emptyContainer}>
              <Typography sx={{ fontWeight: 800 }}>
                No hay líneas registradas
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead
                  sx={lineasPageStyles.tableHeader}
                >
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Estaciones</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell align="right">
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredLines.map((linea) => {
                    const lineAssignments =
                      getLineAssignments(linea.id)

                    const uniqueStations = new Set(
                      lineAssignments.map(
                        (assignment) =>
                          assignment.estacionId,
                      ),
                    )

                    const status =
                      estados[linea.estado] ??
                      estados.INACTIVA

                    return (
                      <TableRow key={linea.id}>
                        <TableCell>
                          <Typography
                            sx={lineasPageStyles.code}
                          >
                            {linea.codigo}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography
                            sx={lineasPageStyles.name}
                          >
                            {linea.nombre}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          {uniqueStations.size > 0 ? (
                            <Tooltip
                              arrow
                              placement="top"
                              title={getStationTooltip(
                                linea,
                              )}
                            >
                              <Chip
                                label={`${
                                  uniqueStations.size
                                } estaciones`}
                                size="small"
                                sx={
                                  lineasPageStyles.stationChip
                                }
                              />
                            </Tooltip>
                          ) : (
                            <Chip
                              label="Sin estaciones"
                              size="small"
                              sx={
                                lineasPageStyles.noStationsChip
                              }
                            />
                          )}
                        </TableCell>

                        <TableCell>
                          <Typography
                            sx={
                              lineasPageStyles.secondaryText
                            }
                          >
                            {linea.descripcion ||
                              'Sin descripción'}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={status.label}
                            size="small"
                            sx={{
                              ...lineasPageStyles.statusChip,
                              color: status.color,
                              backgroundColor:
                                status.backgroundColor,
                            }}
                          />
                        </TableCell>

                        <TableCell align="right">
                          <PermissionGuard permission="lineas.editar">
                            <IconButton
                              onClick={(event) => {
                                setMenuAnchor(
                                  event.currentTarget,
                                )
                                setMenuLine(linea)
                              }}
                            >
                              <MoreVertRoundedIcon />
                            </IconButton>
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
        onClose={closeMenu}
      >
        <MenuItem
          onClick={() => {
            setSelectedLine(menuLine)
            setFormOpen(true)
            closeMenu()
          }}
        >
          <EditRoundedIcon sx={{ marginRight: 1.5 }} />
          Editar información
        </MenuItem>

        <MenuItem
          onClick={() =>
            openStationsManager(menuLine)
          }
        >
          <TrainRoundedIcon sx={{ marginRight: 1.5 }} />
          Administrar estaciones
        </MenuItem>

        {menuLine?.estado !== 'ACTIVA' && (
          <MenuItem
            onClick={async () => {
              await cambiarEstadoLinea(
                menuLine.id,
                'ACTIVA',
              )
              closeMenu()
            }}
          >
            <CheckCircleRoundedIcon
              sx={{ marginRight: 1.5 }}
            />
            Marcar como activa
          </MenuItem>
        )}

        {menuLine?.estado !== 'MANTENIMIENTO' && (
          <MenuItem
            onClick={async () => {
              await cambiarEstadoLinea(
                menuLine.id,
                'MANTENIMIENTO',
              )
              closeMenu()
            }}
          >
            <PauseCircleRoundedIcon
              sx={{ marginRight: 1.5 }}
            />
            En mantenimiento
          </MenuItem>
        )}

        {menuLine?.estado !== 'INACTIVA' && (
          <MenuItem
            onClick={async () => {
              await cambiarEstadoLinea(
                menuLine.id,
                'INACTIVA',
              )
              closeMenu()
            }}
          >
            <ToggleOffRoundedIcon
              sx={{ marginRight: 1.5 }}
            />
            Marcar como inactiva
          </MenuItem>
        )}
      </Menu>

      {formOpen && (
        <LineaForm
          key={selectedLine?.id ?? 'new-line'}
          open={formOpen}
          linea={selectedLine}
          onClose={() => {
            setFormOpen(false)
            setSelectedLine(null)
          }}
          onSaved={showNotification}
        />
      )}

      <Dialog
        open={stationsOpen}
        onClose={() => setStationsOpen(false)}
        fullWidth
        maxWidth="md"
        slotProps={{
          paper: {
            sx: lineasPageStyles.stationDialogPaper,
          },
        }}
      >
        <DialogTitle
          sx={lineasPageStyles.stationDialogTitle}
        >
          <Box
            sx={lineasPageStyles.stationDialogHeader}
          >
            <Box
              sx={lineasPageStyles.stationDialogIcon}
            >
              <TrainRoundedIcon />
            </Box>

            <Box>
              <Typography
                component="h2"
                sx={{ fontWeight: 800 }}
              >
                Estaciones de {stationsLine?.nombre}
              </Typography>

              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.70)',
                  fontSize: '0.8rem',
                }}
              >
                Organiza el recorrido de ida y regreso.
              </Typography>
            </Box>

            <IconButton
              onClick={() => setStationsOpen(false)}
              sx={lineasPageStyles.dialogCloseButton}
            >
              <CloseRoundedIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent
          sx={lineasPageStyles.stationDialogContent}
        >
          <Tabs
            value={direction}
            onChange={handleDirectionChange}
            sx={{ marginBottom: 2 }}
          >
            <Tab label="Sentido de ida" value="IDA" />
            <Tab
              label="Sentido de regreso"
              value="REGRESO"
            />
          </Tabs>

          <Box sx={lineasPageStyles.routeSummary}>
            <Chip
              label={`${currentRoute.length} estaciones`}
              sx={lineasPageStyles.summaryChip}
            />

            <Chip
              label={`${calcularDistanciaRuta(
                currentRoute,
              ).toFixed(2)} km`}
              sx={lineasPageStyles.summaryChip}
            />
          </Box>

          <Box sx={lineasPageStyles.stationForm}>
            <TextField
              select
              name="estacionId"
              label="Estación"
              value={assignmentForm.estacionId}
              onChange={handleAssignmentChange}
              disabled={
                savingAssignment ||
                Boolean(editingAssignment)
              }
              sx={lineasPageStyles.stationField}
            >
              {estaciones
                .filter(
                  (station) =>
                    station.estado === 'OPERATIVA' ||
                    station.id ===
                      assignmentForm.estacionId,
                )
                .map((station) => (
                  <MenuItem
                    key={station.id}
                    value={station.id}
                  >
                    {station.codigo} - {station.nombre}
                  </MenuItem>
                ))}
            </TextField>

            <TextField
              type="number"
              name="orden"
              label="Orden"
              value={assignmentForm.orden}
              onChange={handleAssignmentChange}
              slotProps={{
                htmlInput: {
                  min: 1,
                  step: 1,
                },
              }}
              sx={lineasPageStyles.stationField}
            />

            <TextField
              type="number"
              name="distanciaAnteriorKm"
              label="Distancia anterior (km)"
              value={
                assignmentForm.distanciaAnteriorKm
              }
              onChange={handleAssignmentChange}
              slotProps={{
                htmlInput: {
                  min: 0,
                  step: 0.01,
                },
              }}
              sx={lineasPageStyles.stationField}
            />

            <Button
              variant="contained"
              startIcon={<SaveRoundedIcon />}
              onClick={handleSaveAssignment}
              disabled={savingAssignment}
              sx={lineasPageStyles.addButton}
            >
              {editingAssignment
                ? 'Guardar'
                : 'Agregar'}
            </Button>
          </Box>

          {editingAssignment && (
            <Button
              onClick={() =>
                resetAssignmentForm()
              }
              sx={{ marginBottom: 2 }}
            >
              Cancelar edición
            </Button>
          )}

          {currentRoute.length === 0 ? (
            <Alert severity="info">
              No hay estaciones asignadas en este sentido.
            </Alert>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead
                  sx={lineasPageStyles.tableHeader}
                >
                  <TableRow>
                    <TableCell>Orden</TableCell>
                    <TableCell>Estación</TableCell>
                    <TableCell>
                      Distancia anterior
                    </TableCell>
                    <TableCell align="right">
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {currentRoute.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell>
                        {assignment.orden}
                      </TableCell>

                      <TableCell>
                        {stationMap.get(
                          assignment.estacionId,
                        )?.nombre ?? 'No disponible'}
                      </TableCell>

                      <TableCell>
                        {Number(
                          assignment
                            .distanciaAnteriorKm ?? 0,
                        ).toFixed(2)}{' '}
                        km
                      </TableCell>

                      <TableCell align="right">
                        <IconButton
                          onClick={() =>
                            handleEditAssignment(
                              assignment,
                            )
                          }
                        >
                          <EditRoundedIcon />
                        </IconButton>

                        <IconButton
                          color="error"
                          onClick={() =>
                            handleDeleteAssignment(
                              assignment,
                            )
                          }
                        >
                          <DeleteRoundedIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() =>
          setNotification((current) => ({
            ...current,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Alert
          severity={notification.severity}
          sx={lineasPageStyles.snackbarAlert}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default LineasPage