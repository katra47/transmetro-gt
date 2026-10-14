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
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import BuildRoundedIcon from '@mui/icons-material/BuildRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import RouteRoundedIcon from '@mui/icons-material/RouteRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'

import PermissionGuard from '../usuarios/PermissionGuard'
import RecorridoForm from './RecorridoForm'

import {
  cambiarEstadoRecorrido,
  eliminarRecorrido,
  suscribirseBusesRecorridos,
  suscribirseLineasRecorridos,
  suscribirseParqueosRecorridos,
  suscribirsePilotosRecorridos,
  suscribirseRecorridos,
} from './recorridosService'

import recorridosPageStyles from './RecorridosPage.styles'

const estados = {
  PROGRAMADO: {
    label: 'Programado',
    color: '#075985',
    backgroundColor: '#E0F2FE',
  },

  EN_CURSO: {
    label: 'En curso',
    color: '#087A65',
    backgroundColor: '#DDF5EE',
  },

  FINALIZADO: {
    label: 'Finalizado',
    color: '#475569',
    backgroundColor: '#E2E8F0',
  },

  FALLA_MECANICA: {
    label: 'Falla mecánica',
    color: '#B42318',
    backgroundColor: '#FEE4E2',
  },
}

const nombrePiloto = (piloto) => (
  piloto?.nombreCompleto ||
  [piloto?.nombres, piloto?.apellidos]
    .filter(Boolean)
    .join(' ') ||
  piloto?.nombre ||
  piloto?.codigo ||
  'Piloto no disponible'
)

const nombreBus = (bus) => {
  if (!bus) {
    return 'Bus no disponible'
  }

  const identificador =
    bus.codigo ||
    bus.numeroUnidad ||
    bus.numero ||
    'Bus'

  return bus.placa
    ? `${identificador} - ${bus.placa}`
    : identificador
}

function RecorridosPage() {
  const [recorridos, setRecorridos] = useState([])
  const [lineas, setLineas] = useState([])
  const [buses, setBuses] = useState([])
  const [pilotos, setPilotos] = useState([])
  const [parqueos, setParqueos] = useState([])

  const [loadingSources, setLoadingSources] =
    useState({
      recorridos: true,
      lineas: true,
      buses: true,
      pilotos: true,
      parqueos: true,
    })

  const [search, setSearch] = useState('')
  const [pageError, setPageError] = useState('')

  const [formOpen, setFormOpen] = useState(false)

  const [selectedRecord, setSelectedRecord] =
    useState(null)

  const [menuAnchor, setMenuAnchor] =
    useState(null)

  const [menuRecord, setMenuRecord] =
    useState(null)

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false)

  const [recordToDelete, setRecordToDelete] =
    useState(null)

  const [deleting, setDeleting] =
    useState(false)

  const [notification, setNotification] =
    useState({
      open: false,
      message: '',
      severity: 'success',
    })

  useEffect(() => {
    const markAsLoaded = (source) => {
      setLoadingSources((currentSources) => ({
        ...currentSources,
        [source]: false,
      }))
    }

    const handleError = (source, error) => {
      console.error(error)

      setPageError(
        'No fue posible cargar la información de recorridos.',
      )

      markAsLoaded(source)
    }

    const unsubscribeRecorridos =
      suscribirseRecorridos(
        (data) => {
          setRecorridos(data)
          markAsLoaded('recorridos')
        },
        (error) =>
          handleError('recorridos', error),
      )

    const unsubscribeLineas =
      suscribirseLineasRecorridos(
        (data) => {
          setLineas(data)
          markAsLoaded('lineas')
        },
        (error) =>
          handleError('lineas', error),
      )

    const unsubscribeBuses =
      suscribirseBusesRecorridos(
        (data) => {
          setBuses(data)
          markAsLoaded('buses')
        },
        (error) =>
          handleError('buses', error),
      )

    const unsubscribePilotos =
      suscribirsePilotosRecorridos(
        (data) => {
          setPilotos(data)
          markAsLoaded('pilotos')
        },
        (error) =>
          handleError('pilotos', error),
      )

    const unsubscribeParqueos =
      suscribirseParqueosRecorridos(
        (data) => {
          setParqueos(data)
          markAsLoaded('parqueos')
        },
        (error) =>
          handleError('parqueos', error),
      )

    return () => {
      unsubscribeRecorridos()
      unsubscribeLineas()
      unsubscribeBuses()
      unsubscribePilotos()
      unsubscribeParqueos()
    }
  }, [])

  const loading = Object.values(
    loadingSources,
  ).some(Boolean)

  const lineMap = useMemo(
    () =>
      new Map(
        lineas.map((linea) => [
          linea.id,
          linea,
        ]),
      ),
    [lineas],
  )

  const busMap = useMemo(
    () =>
      new Map(
        buses.map((bus) => [
          bus.id,
          bus,
        ]),
      ),
    [buses],
  )

  const pilotMap = useMemo(
    () =>
      new Map(
        pilotos.map((piloto) => [
          piloto.id,
          piloto,
        ]),
      ),
    [pilotos],
  )

  const parkingMap = useMemo(
    () =>
      new Map(
        parqueos.map((parqueo) => [
          parqueo.id,
          parqueo,
        ]),
      ),
    [parqueos],
  )

  const filteredRecords = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase()

    if (!searchValue) {
      return recorridos
    }

    return recorridos.filter((recorrido) => {
      const linea =
        lineMap.get(recorrido.lineaId)

      const bus =
        busMap.get(recorrido.busId)

      const piloto =
        pilotMap.get(recorrido.pilotoId)

      const parqueo =
        parkingMap.get(recorrido.parqueoId)

      const estado =
        estados[recorrido.estado]?.label ??
        recorrido.estado

      return [
        estado,
        linea?.nombre,
        linea?.codigo,
        nombreBus(bus),
        nombrePiloto(piloto),
        parqueo?.nombre,
        parqueo?.codigo,
        recorrido.observaciones,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(searchValue)
    })
  }, [
    recorridos,
    search,
    lineMap,
    busMap,
    pilotMap,
    parkingMap,
  ])

  const programados = recorridos.filter(
    (recorrido) =>
      recorrido.estado === 'PROGRAMADO',
  ).length

  const enCurso = recorridos.filter(
    (recorrido) =>
      recorrido.estado === 'EN_CURSO',
  ).length

  const finalizados = recorridos.filter(
    (recorrido) =>
      recorrido.estado === 'FINALIZADO',
  ).length

  const fallas = recorridos.filter(
    (recorrido) =>
      recorrido.estado === 'FALLA_MECANICA',
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
    setNotification(
      (currentNotification) => ({
        ...currentNotification,
        open: false,
      }),
    )
  }

  const closeMenu = () => {
    setMenuAnchor(null)
    setMenuRecord(null)
  }

  const handleNewRecord = () => {
    if (
      lineas.length === 0 ||
      buses.length === 0 ||
      pilotos.length === 0 ||
      parqueos.length === 0
    ) {
      showNotification(
        'Debes tener líneas, buses, pilotos y parqueos registrados.',
        'warning',
      )

      return
    }

    setSelectedRecord(null)
    setFormOpen(true)
  }

  const handleEdit = () => {
    if (!menuRecord) {
      return
    }

    const record = menuRecord

    closeMenu()

    setSelectedRecord(record)
    setFormOpen(true)
  }

  const handleChangeStatus = async (
    status,
  ) => {
    if (!menuRecord) {
      return
    }

    const record = menuRecord

    closeMenu()

    try {
      await cambiarEstadoRecorrido(
        record.id,
        status,
      )

      const estado =
        estados[status]?.label ?? status

      showNotification(
        `El recorrido ahora está: ${estado}.`,
      )
    } catch (error) {
      console.error(
        'Error al cambiar el estado:',
        error,
      )

      showNotification(
        error.message ||
          'No fue posible actualizar el estado del recorrido.',
        'error',
      )
    }
  }

  const handleDeleteRequest = () => {
    if (!menuRecord) {
      return
    }

    const record = menuRecord

    closeMenu()

    setRecordToDelete(record)
    setDeleteDialogOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    if (deleting) {
      return
    }

    setDeleteDialogOpen(false)
    setRecordToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (!recordToDelete) {
      return
    }

    setDeleting(true)

    try {
      await eliminarRecorrido(
        recordToDelete.id,
      )

      showNotification(
        'El recorrido fue eliminado correctamente.',
      )

      setDeleteDialogOpen(false)
      setRecordToDelete(null)
    } catch (error) {
      console.error(
        'Error al eliminar el recorrido:',
        error,
      )

      showNotification(
        error.message ||
          'No fue posible eliminar el recorrido.',
        'error',
      )
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Box sx={recorridosPageStyles.page}>
      <Box sx={recorridosPageStyles.container}>
        <Box sx={recorridosPageStyles.header}>
          <Box
            sx={
              recorridosPageStyles.headerContent
            }
          >
            <Box
              sx={
                recorridosPageStyles.headerInformation
              }
            >
              <Box
                sx={
                  recorridosPageStyles.headerIcon
                }
              >
                <RouteRoundedIcon
                  sx={{ fontSize: 32 }}
                />
              </Box>

              <Box>
                <Typography
                  component="h1"
                  sx={recorridosPageStyles.title}
                >
                  Recorridos
                </Typography>

                <Typography
                  sx={
                    recorridosPageStyles.description
                  }
                >
                  Administra los recorridos,
                  buses, pilotos y parqueos
                  asignados.
                </Typography>
              </Box>
            </Box>

            <PermissionGuard permission="recorridos.crear">
              <Button
                type="button"
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={handleNewRecord}
                sx={
                  recorridosPageStyles.addButton
                }
              >
                Crear recorrido
              </Button>
            </PermissionGuard>
          </Box>
        </Box>

        {pageError && (
          <Alert
            severity="error"
            sx={recorridosPageStyles.alert}
          >
            {pageError}
          </Alert>
        )}

        {/* ESTADÍSTICAS */}

        <Box
          sx={
            recorridosPageStyles.statisticsGrid
          }
        >
          <Paper
            elevation={0}
            sx={
              recorridosPageStyles.statisticCard
            }
          >
            <Typography
              sx={
                recorridosPageStyles.statisticValue
              }
            >
              {recorridos.length}
            </Typography>

            <Typography
              sx={
                recorridosPageStyles.statisticLabel
              }
            >
              Total de recorridos
            </Typography>
          </Paper>

          <Paper
            elevation={0}
            sx={
              recorridosPageStyles.statisticCard
            }
          >
            <Typography
              sx={
                recorridosPageStyles.statisticValue
              }
            >
              {programados}
            </Typography>

            <Typography
              sx={
                recorridosPageStyles.statisticLabel
              }
            >
              Programados
            </Typography>
          </Paper>

          <Paper
            elevation={0}
            sx={
              recorridosPageStyles.statisticCard
            }
          >
            <Typography
              sx={
                recorridosPageStyles.statisticValue
              }
            >
              {enCurso}
            </Typography>

            <Typography
              sx={
                recorridosPageStyles.statisticLabel
              }
            >
              En curso
            </Typography>
          </Paper>

          <Paper
            elevation={0}
            sx={
              recorridosPageStyles.statisticCard
            }
          >
            <Typography
              sx={
                recorridosPageStyles.statisticValue
              }
            >
              {finalizados}
            </Typography>

            <Typography
              sx={
                recorridosPageStyles.statisticLabel
              }
            >
              Finalizados
            </Typography>
          </Paper>

          <Paper
            elevation={0}
            sx={
              recorridosPageStyles.statisticCard
            }
          >
            <Typography
              sx={
                recorridosPageStyles.statisticValue
              }
            >
              {fallas}
            </Typography>

            <Typography
              sx={
                recorridosPageStyles.statisticLabel
              }
            >
              Fallas mecánicas
            </Typography>
          </Paper>
        </Box>

        {/* TABLA */}

        <Paper
          elevation={0}
          sx={recorridosPageStyles.contentCard}
        >
          <Box
            sx={recorridosPageStyles.toolbar}
          >
            <Typography
              sx={{ fontWeight: 800 }}
            >
              Recorridos registrados
            </Typography>

            <TextField
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Buscar recorrido..."
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
              sx={
                recorridosPageStyles.searchField
              }
            />
          </Box>

          {loading ? (
            <Box
              sx={
                recorridosPageStyles.loadingContainer
              }
            >
              <CircularProgress
                sx={{ color: '#008C7A' }}
              />
            </Box>
          ) : filteredRecords.length === 0 ? (
            <Box
              sx={
                recorridosPageStyles.emptyContainer
              }
            >
              <Typography
                sx={{ fontWeight: 800 }}
              >
                {search
                  ? 'No se encontraron resultados'
                  : 'No hay recorridos registrados'}
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead
                  sx={
                    recorridosPageStyles.tableHeader
                  }
                >
                  <TableRow>
                    <TableCell>
                      Línea
                    </TableCell>

                    <TableCell>
                      Bus
                    </TableCell>

                    <TableCell>
                      Piloto
                    </TableCell>

                    <TableCell>
                      Parqueo asignado
                    </TableCell>

                    <TableCell>
                      Estado
                    </TableCell>

                    <TableCell>
                      Observaciones
                    </TableCell>

                    <TableCell align="right">
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredRecords.map(
                    (recorrido) => {
                      const estado =
                        estados[
                          recorrido.estado
                        ] ??
                        estados.PROGRAMADO

                      const linea =
                        lineMap.get(
                          recorrido.lineaId,
                        )

                      const parqueo =
                        parkingMap.get(
                          recorrido.parqueoId,
                        )

                      return (
                        <TableRow
                          key={recorrido.id}
                          hover
                        >
                          <TableCell>
                            <Typography
                              sx={
                                recorridosPageStyles.primaryText
                              }
                            >
                              {linea?.nombre ??
                                'No disponible'}
                            </Typography>

                            <Typography
                              sx={
                                recorridosPageStyles.secondaryText
                              }
                            >
                              {linea?.codigo ?? ''}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            {nombreBus(
                              busMap.get(
                                recorrido.busId,
                              ),
                            )}
                          </TableCell>

                          <TableCell>
                            {nombrePiloto(
                              pilotMap.get(
                                recorrido.pilotoId,
                              ),
                            )}
                          </TableCell>

                          <TableCell>
                            <Typography
                              sx={
                                recorridosPageStyles.primaryText
                              }
                            >
                              {parqueo?.nombre ??
                                'No disponible'}
                            </Typography>

                            <Typography
                              sx={
                                recorridosPageStyles.secondaryText
                              }
                            >
                              {parqueo?.codigo ??
                                ''}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Chip
                              label={
                                estado.label
                              }
                              size="small"
                              sx={{
                                ...recorridosPageStyles.statusChip,
                                color:
                                  estado.color,
                                backgroundColor:
                                  estado.backgroundColor,
                              }}
                            />
                          </TableCell>

                          <TableCell>
                            <Typography
                              sx={
                                recorridosPageStyles.secondaryText
                              }
                            >
                              {recorrido.observaciones ||
                                'Sin observaciones'}
                            </Typography>
                          </TableCell>

                          <TableCell align="right">
                            <PermissionGuard permission="recorridos.editar">
                              <Tooltip title="Opciones">
                                <IconButton
                                  type="button"
                                  onClick={(
                                    event,
                                  ) => {
                                    setMenuAnchor(
                                      event.currentTarget,
                                    )

                                    setMenuRecord(
                                      recorrido,
                                    )
                                  }}
                                >
                                  <MoreVertRoundedIcon />
                                </IconButton>
                              </Tooltip>
                            </PermissionGuard>
                          </TableCell>
                        </TableRow>
                      )
                    },
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>

      {/* MENÚ DE ACCIONES */}

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
      >
        <MenuItem onClick={handleEdit}>
          <EditRoundedIcon
            sx={{ marginRight: 1.5 }}
          />
          Editar recorrido
        </MenuItem>

        {menuRecord?.estado !==
          'PROGRAMADO' && (
          <MenuItem
            onClick={() =>
              handleChangeStatus(
                'PROGRAMADO',
              )
            }
          >
            <ReplayRoundedIcon
              sx={{ marginRight: 1.5 }}
            />
            Marcar como programado
          </MenuItem>
        )}

        {menuRecord?.estado !==
          'EN_CURSO' && (
          <MenuItem
            onClick={() =>
              handleChangeStatus(
                'EN_CURSO',
              )
            }
          >
            <PlayCircleRoundedIcon
              sx={{ marginRight: 1.5 }}
            />
            Marcar en curso
          </MenuItem>
        )}

        {menuRecord?.estado !==
          'FINALIZADO' && (
          <MenuItem
            onClick={() =>
              handleChangeStatus(
                'FINALIZADO',
              )
            }
          >
            <CheckCircleRoundedIcon
              sx={{ marginRight: 1.5 }}
            />
            Marcar como finalizado
          </MenuItem>
        )}

        {menuRecord?.estado !==
          'FALLA_MECANICA' && (
          <MenuItem
            onClick={() =>
              handleChangeStatus(
                'FALLA_MECANICA',
              )
            }
          >
            <BuildRoundedIcon
              sx={{ marginRight: 1.5 }}
            />
            Reportar falla mecánica
          </MenuItem>
        )}

        <MenuItem
          onClick={handleDeleteRequest}
          sx={{ color: '#B42318' }}
        >
          <DeleteRoundedIcon
            sx={{ marginRight: 1.5 }}
          />
          Eliminar recorrido
        </MenuItem>
      </Menu>

      {/* FORMULARIO */}

      {formOpen && (
        <RecorridoForm
          key={
            selectedRecord?.id ??
            'new-record'
          }
          open={formOpen}
          recorrido={selectedRecord}
          lineas={lineas}
          buses={buses}
          pilotos={pilotos}
          parqueos={parqueos}
          onClose={() => {
            setFormOpen(false)
            setSelectedRecord(null)
          }}
          onSaved={showNotification}
        />
      )}

      {/* CONFIRMACIÓN DE ELIMINACIÓN */}

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          Eliminar recorrido
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas
            eliminar este recorrido? Esta
            acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={
              handleCloseDeleteDialog
            }
            disabled={deleting}
          >
            Cancelar
          </Button>

          <Button
            onClick={handleConfirmDelete}
            disabled={deleting}
            color="error"
            variant="contained"
            startIcon={
              deleting ? (
                <CircularProgress
                  size={18}
                  color="inherit"
                />
              ) : (
                <DeleteRoundedIcon />
              )
            }
          >
            {deleting
              ? 'Eliminando...'
              : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* NOTIFICACIONES */}

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
          sx={
            recorridosPageStyles.snackbarAlert
          }
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default RecorridosPage