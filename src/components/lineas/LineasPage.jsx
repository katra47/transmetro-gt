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
import AltRouteRoundedIcon from '@mui/icons-material/AltRouteRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import PauseCircleRoundedIcon from '@mui/icons-material/PauseCircleRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded'
import ToggleOffRoundedIcon from '@mui/icons-material/ToggleOffRounded'

import PermissionGuard from '../usuarios/PermissionGuard'
import LineaForm from './LineaForm'

import {
  cambiarEstadoLinea,
  suscribirseLineas,
} from './lineasService'

import lineasPageStyles from './LineasPage.styles'

const estadoInformacion = {
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

function LineasPage() {
  const [lineas, setLineas] = useState([])
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [search, setSearch] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [selectedLine, setSelectedLine] = useState(null)

  const [menuAnchor, setMenuAnchor] = useState(null)
  const [menuLine, setMenuLine] = useState(null)

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  })

  useEffect(() => {
    const unsubscribe = suscribirseLineas(
      (lineasData) => {
        setLineas(lineasData)
        setPageError('')
        setLoading(false)
      },
      () => {
        setPageError(
          'No fue posible consultar las líneas registradas.',
        )
        setLoading(false)
      },
    )

    return unsubscribe
  }, [])

  const filteredLines = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    if (!searchValue) {
      return lineas
    }

    return lineas.filter((linea) => {
      const searchableText = [
        linea.codigo,
        linea.nombre,
        linea.municipalidad,
        linea.descripcion,
        linea.estado,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchableText.includes(searchValue)
    })
  }, [lineas, search])

  const activeLines = lineas.filter(
    (linea) => linea.estado === 'ACTIVA',
  ).length

  const maintenanceLines = lineas.filter(
    (linea) => linea.estado === 'MANTENIMIENTO',
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

  const handleNewLine = () => {
    setSelectedLine(null)
    setFormOpen(true)
  }

  const handleEditLine = (linea) => {
    setSelectedLine(linea)
    setFormOpen(true)
    closeActionsMenu()
  }

  const handleCloseForm = () => {
    setFormOpen(false)
    setSelectedLine(null)
  }

  const openActionsMenu = (event, linea) => {
    setMenuAnchor(event.currentTarget)
    setMenuLine(linea)
  }

  const closeActionsMenu = () => {
    setMenuAnchor(null)
    setMenuLine(null)
  }

  const handleChangeStatus = async (newStatus) => {
    if (!menuLine) {
      return
    }

    try {
      await cambiarEstadoLinea(
        menuLine.id,
        newStatus,
      )

      showNotification(
        'El estado de la línea fue actualizado correctamente.',
      )
    } catch (error) {
      console.error(
        'Error al cambiar el estado de la línea:',
        error,
      )

      showNotification(
        error.message ||
          'No fue posible actualizar el estado de la línea.',
        'error',
      )
    } finally {
      closeActionsMenu()
    }
  }

  return (
    <Box sx={lineasPageStyles.page}>
      <Box sx={lineasPageStyles.container}>
        <Box sx={lineasPageStyles.header}>
          <Box sx={lineasPageStyles.headerContent}>
            <Box sx={lineasPageStyles.headerInformation}>
              <Box sx={lineasPageStyles.headerIcon}>
                <AltRouteRoundedIcon sx={{ fontSize: 32 }} />
              </Box>

              <Box>
                <Typography
                  component="h1"
                  sx={lineasPageStyles.title}
                >
                  Líneas
                </Typography>

                <Typography sx={lineasPageStyles.description}>
                  Administra las líneas de transporte,
                  municipalidades y estados operativos.
                </Typography>
              </Box>
            </Box>

            <PermissionGuard permission="lineas.crear">
              <Button
                type="button"
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={handleNewLine}
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
            <Box sx={lineasPageStyles.statisticIcon}>
              <TimelineRoundedIcon />
            </Box>

            <Box>
              <Typography sx={lineasPageStyles.statisticValue}>
                {lineas.length}
              </Typography>

              <Typography sx={lineasPageStyles.statisticLabel}>
                Líneas registradas
              </Typography>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={lineasPageStyles.statisticCard}
          >
            <Box sx={lineasPageStyles.statisticIcon}>
              <CheckCircleRoundedIcon />
            </Box>

            <Box>
              <Typography sx={lineasPageStyles.statisticValue}>
                {activeLines}
              </Typography>

              <Typography sx={lineasPageStyles.statisticLabel}>
                Líneas activas
              </Typography>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={lineasPageStyles.statisticCard}
          >
            <Box sx={lineasPageStyles.statisticIcon}>
              <PauseCircleRoundedIcon />
            </Box>

            <Box>
              <Typography sx={lineasPageStyles.statisticValue}>
                {maintenanceLines}
              </Typography>

              <Typography sx={lineasPageStyles.statisticLabel}>
                En mantenimiento
              </Typography>
            </Box>
          </Paper>
        </Box>

        <Paper
          elevation={0}
          sx={lineasPageStyles.contentCard}
        >
          <Box sx={lineasPageStyles.toolbar}>
            <Typography sx={lineasPageStyles.sectionTitle}>
              Líneas registradas
            </Typography>

            <TextField
              value={search}
              onChange={(event) => setSearch(event.target.value)}
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
              <Box sx={lineasPageStyles.emptyIcon}>
                <AltRouteRoundedIcon sx={{ fontSize: 34 }} />
              </Box>

              <Typography sx={lineasPageStyles.emptyTitle}>
                {search
                  ? 'No se encontraron resultados'
                  : 'No hay líneas registradas'}
              </Typography>

              <Typography
                sx={lineasPageStyles.emptyDescription}
              >
                {search
                  ? 'Prueba utilizando otro código, nombre o municipalidad.'
                  : 'Registra la primera línea para comenzar su administración.'}
              </Typography>
            </Box>
          ) : (
            <TableContainer sx={lineasPageStyles.tableContainer}>
              <Table>
                <TableHead sx={lineasPageStyles.tableHeader}>
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Municipalidad</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell align="right">
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredLines.map((linea) => {
                    const status =
                      estadoInformacion[linea.estado] ??
                      estadoInformacion.INACTIVA

                    return (
                      <TableRow
                        key={linea.id}
                        sx={lineasPageStyles.tableRow}
                      >
                        <TableCell>
                          <Typography sx={lineasPageStyles.code}>
                            {linea.codigo}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography sx={lineasPageStyles.name}>
                            {linea.nombre}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          {linea.municipalidad}
                        </TableCell>

                        <TableCell>
                          <Typography
                            sx={
                              lineasPageStyles.descriptionCell
                            }
                          >
                            {linea.descripcion || 'Sin descripción'}
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

                        <TableCell
                          align="right"
                          sx={lineasPageStyles.actionsCell}
                        >
                          <PermissionGuard permission="lineas.editar">
                            <Tooltip title="Opciones">
                              <IconButton
                                type="button"
                                aria-label={`Opciones de ${linea.nombre}`}
                                onClick={(event) =>
                                  openActionsMenu(event, linea)
                                }
                                sx={
                                  lineasPageStyles.actionButton
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
          onClick={() => handleEditLine(menuLine)}
        >
          <EditRoundedIcon sx={{ marginRight: 1.5 }} />
          Editar información
        </MenuItem>

        {menuLine?.estado !== 'ACTIVA' && (
          <MenuItem
            onClick={() => handleChangeStatus('ACTIVA')}
          >
            <CheckCircleRoundedIcon
              sx={{ marginRight: 1.5 }}
            />
            Marcar como activa
          </MenuItem>
        )}

        {menuLine?.estado !== 'MANTENIMIENTO' && (
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

        {menuLine?.estado !== 'INACTIVA' && (
          <MenuItem
            onClick={() => handleChangeStatus('INACTIVA')}
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
          sx={lineasPageStyles.snackbarAlert}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default LineasPage
