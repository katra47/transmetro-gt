import { useEffect, useMemo, useState } from 'react'

import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
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
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded'
import BlockRoundedIcon from '@mui/icons-material/BlockRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import PersonOffRoundedIcon from '@mui/icons-material/PersonOffRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'

import PermissionGuard from '../usuarios/PermissionGuard'
import PilotoForm from './PilotoForm'

import {
  changePilotStatus,
  observePilots,
} from './pilotosService'

import pilotosPageStyles from './PilotosPage.styles'

function getInitials(names, surnames) {
  const firstName = names?.trim().charAt(0) ?? ''
  const firstSurname = surnames?.trim().charAt(0) ?? ''

  return `${firstName}${firstSurname}`.toUpperCase() || 'P'
}

function getStatusLabel(status) {
  const statusLabels = {
    ACTIVO: 'Activo',
    INACTIVO: 'Inactivo',
    SUSPENDIDO: 'Suspendido',
  }

  return statusLabels[status] || status
}

function getStatusStyle(status) {
  if (status === 'ACTIVO') {
    return pilotosPageStyles.activeChip
  }

  if (status === 'SUSPENDIDO') {
    return pilotosPageStyles.suspendedChip
  }

  return pilotosPageStyles.inactiveChip
}

function PilotosPage() {
  const [pilots, setPilots] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState(null)
  const [error, setError] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [selectedPilot, setSelectedPilot] = useState(null)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('TODOS')
  const [licenseFilter, setLicenseFilter] = useState('TODAS')

  useEffect(() => {
    const unsubscribe = observePilots(
      (pilotsData) => {
        setPilots(pilotsData)
        setLoading(false)
        setError('')
      },
      (observeError) => {
        console.error(
          'Error al consultar los pilotos:',
          observeError,
        )

        setLoading(false)
        setError(
          'No fue posible cargar los pilotos registrados.',
        )
      },
    )

    return unsubscribe
  }, [])

  const summary = useMemo(() => {
    const active = pilots.filter(
      (pilot) => pilot.estado === 'ACTIVO',
    ).length

    const inactive = pilots.filter(
      (pilot) => pilot.estado === 'INACTIVO',
    ).length

    const suspended = pilots.filter(
      (pilot) => pilot.estado === 'SUSPENDIDO',
    ).length

    return {
      total: pilots.length,
      active,
      inactive,
      suspended,
    }
  }, [pilots])

  const filteredPilots = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase()

    return pilots.filter((pilot) => {
      const matchesSearch =
        !normalizedSearch ||
        pilot.nombreCompleto
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        pilot.codigo
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        pilot.dpi
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        pilot.numeroLicencia
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        pilot.telefono
          ?.toLowerCase()
          .includes(normalizedSearch)

      const matchesStatus =
        statusFilter === 'TODOS' ||
        pilot.estado === statusFilter

      const matchesLicense =
        licenseFilter === 'TODAS' ||
        pilot.tipoLicencia === licenseFilter

      return (
        matchesSearch &&
        matchesStatus &&
        matchesLicense
      )
    })
  }, [
    pilots,
    search,
    statusFilter,
    licenseFilter,
  ])

  const handleNewPilot = () => {
    setSelectedPilot(null)
    setFormOpen(true)
  }

  const handleEditPilot = (pilot) => {
    setSelectedPilot(pilot)
    setFormOpen(true)
  }

  const handleCloseForm = () => {
    setFormOpen(false)
    setSelectedPilot(null)
  }

  const handleStatusChange = async (pilot) => {
    const newStatus =
      pilot.estado === 'ACTIVO'
        ? 'INACTIVO'
        : 'ACTIVO'

    const action =
      newStatus === 'ACTIVO'
        ? 'activar'
        : 'desactivar'

    const confirmed = window.confirm(
      `¿Deseas ${action} al piloto "${pilot.nombreCompleto}"?`,
    )

    if (!confirmed) {
      return
    }

    setProcessingId(pilot.id)
    setError('')

    try {
      await changePilotStatus(
        pilot.id,
        newStatus,
      )
    } catch (statusError) {
      console.error(
        'Error al cambiar el estado del piloto:',
        statusError,
      )

      setError(
        statusError.message ||
          'No fue posible cambiar el estado del piloto.',
      )
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <Box component="main" sx={pilotosPageStyles.page}>
      <Box sx={pilotosPageStyles.container}>
        <Box sx={pilotosPageStyles.header}>
          <Box sx={pilotosPageStyles.headerInformation}>
            <Box sx={pilotosPageStyles.headerIcon}>
              <BadgeRoundedIcon sx={{ fontSize: 32 }} />
            </Box>

            <Box>
              <Typography
                component="h1"
                sx={pilotosPageStyles.title}
              >
                Pilotos
              </Typography>

              <Typography sx={pilotosPageStyles.subtitle}>
                Registro y administración de pilotos del
                Transmetro.
              </Typography>
            </Box>
          </Box>

          <PermissionGuard permission="pilotos.crear">
            <Button
              type="button"
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={handleNewPilot}
              sx={pilotosPageStyles.addButton}
            >
              Registrar piloto
            </Button>
          </PermissionGuard>
        </Box>

        {error && (
          <Alert
            severity="error"
            onClose={() => setError('')}
            sx={pilotosPageStyles.errorAlert}
          >
            {error}
          </Alert>
        )}

        <Box sx={pilotosPageStyles.summary}>
          <Paper
            elevation={0}
            sx={pilotosPageStyles.summaryCard}
          >
            <Box sx={pilotosPageStyles.summaryIcon}>
              <BadgeRoundedIcon />
            </Box>

            <Box>
              <Typography sx={pilotosPageStyles.summaryValue}>
                {summary.total}
              </Typography>

              <Typography sx={pilotosPageStyles.summaryLabel}>
                Pilotos registrados
              </Typography>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={pilotosPageStyles.summaryCard}
          >
            <Box sx={pilotosPageStyles.summaryIcon}>
              <VerifiedUserRoundedIcon />
            </Box>

            <Box>
              <Typography sx={pilotosPageStyles.summaryValue}>
                {summary.active}
              </Typography>

              <Typography sx={pilotosPageStyles.summaryLabel}>
                Pilotos activos
              </Typography>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={pilotosPageStyles.summaryCard}
          >
            <Box sx={pilotosPageStyles.summaryIcon}>
              <PersonOffRoundedIcon />
            </Box>

            <Box>
              <Typography sx={pilotosPageStyles.summaryValue}>
                {summary.inactive}
              </Typography>

              <Typography sx={pilotosPageStyles.summaryLabel}>
                Pilotos inactivos
              </Typography>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={pilotosPageStyles.summaryCard}
          >
            <Box sx={pilotosPageStyles.summaryIcon}>
              <WarningAmberRoundedIcon />
            </Box>

            <Box>
              <Typography sx={pilotosPageStyles.summaryValue}>
                {summary.suspended}
              </Typography>

              <Typography sx={pilotosPageStyles.summaryLabel}>
                Pilotos suspendidos
              </Typography>
            </Box>
          </Paper>
        </Box>

        <Paper
          elevation={0}
          sx={pilotosPageStyles.filtersPaper}
        >
          <Box sx={pilotosPageStyles.filters}>
            <TextField
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              label="Buscar piloto"
              placeholder="Nombre, código, DPI o licencia"
              fullWidth
              size="small"
              sx={pilotosPageStyles.filterField}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              select
              label="Estado"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              fullWidth
              size="small"
              sx={pilotosPageStyles.filterField}
            >
              <MenuItem value="TODOS">
                Todos los estados
              </MenuItem>

              <MenuItem value="ACTIVO">
                Activos
              </MenuItem>

              <MenuItem value="INACTIVO">
                Inactivos
              </MenuItem>

              <MenuItem value="SUSPENDIDO">
                Suspendidos
              </MenuItem>
            </TextField>

            <TextField
              select
              label="Tipo de licencia"
              value={licenseFilter}
              onChange={(event) =>
                setLicenseFilter(event.target.value)
              }
              fullWidth
              size="small"
              sx={pilotosPageStyles.filterField}
            >
              <MenuItem value="TODAS">
                Todas las licencias
              </MenuItem>

              <MenuItem value="A">
                Tipo A
              </MenuItem>

              <MenuItem value="B">
                Tipo B
              </MenuItem>

              <MenuItem value="C">
                Tipo C
              </MenuItem>

              <MenuItem value="M">
                Tipo M
              </MenuItem>

              <MenuItem value="E">
                Tipo E
              </MenuItem>
            </TextField>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={pilotosPageStyles.tablePaper}
        >
          {loading ? (
            <Box sx={pilotosPageStyles.loadingContainer}>
              <CircularProgress sx={{ color: '#008C7A' }} />
            </Box>
          ) : filteredPilots.length === 0 ? (
            <Box sx={pilotosPageStyles.emptyContainer}>
              <BadgeRoundedIcon
                sx={pilotosPageStyles.emptyIcon}
              />

              <Typography sx={pilotosPageStyles.emptyTitle}>
                No se encontraron pilotos
              </Typography>

              <Typography sx={pilotosPageStyles.emptyText}>
                No existen registros que coincidan con los
                filtros seleccionados.
              </Typography>
            </Box>
          ) : (
            <TableContainer
              sx={pilotosPageStyles.tableContainer}
            >
              <Table sx={{ minWidth: 1150 }}>
                <TableHead sx={pilotosPageStyles.tableHeader}>
                  <TableRow>
                    <TableCell>Piloto</TableCell>
                    <TableCell>Código</TableCell>
                    <TableCell>DPI</TableCell>
                    <TableCell align="center">
                      Licencia
                    </TableCell>
                    <TableCell>Teléfono</TableCell>
                    <TableCell>Residencia</TableCell>
                    <TableCell align="center">
                      Estado
                    </TableCell>
                    <TableCell align="right">
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredPilots.map((pilot) => {
                    const isActive =
                      pilot.estado === 'ACTIVO'

                    const isProcessing =
                      processingId === pilot.id

                    return (
                      <TableRow
                        key={pilot.id}
                        sx={pilotosPageStyles.tableRow}
                      >
                        <TableCell>
                          <Box
                            sx={
                              pilotosPageStyles.pilotInformation
                            }
                          >
                            <Avatar
                              sx={pilotosPageStyles.avatar}
                            >
                              {getInitials(
                                pilot.nombres,
                                pilot.apellidos,
                              )}
                            </Avatar>

                            <Box>
                              <Typography
                                sx={pilotosPageStyles.pilotName}
                              >
                                {pilot.nombreCompleto}
                              </Typography>

                              <Typography
                                sx={pilotosPageStyles.pilotEmail}
                              >
                                {pilot.correo ||
                                  'Sin correo registrado'}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Typography
                            sx={pilotosPageStyles.code}
                          >
                            {pilot.codigo}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          {pilot.dpi}
                        </TableCell>

                        <TableCell align="center">
                          <Chip
                            size="small"
                            label={`${pilot.tipoLicencia} - ${pilot.numeroLicencia}`}
                            sx={pilotosPageStyles.licenseChip}
                          />
                        </TableCell>

                        <TableCell>
                          {pilot.telefono}
                        </TableCell>

                        <TableCell>
                          {pilot.municipio},{' '}
                          {pilot.departamento}
                        </TableCell>

                        <TableCell align="center">
                          <Chip
                            size="small"
                            label={getStatusLabel(
                              pilot.estado,
                            )}
                            sx={getStatusStyle(
                              pilot.estado,
                            )}
                          />
                        </TableCell>

                        <TableCell align="right">
                          <Box sx={pilotosPageStyles.actions}>
                            <PermissionGuard permission="pilotos.modificar">
                              <Tooltip title="Editar piloto">
                                <span>
                                  <IconButton
                                    type="button"
                                    disabled={isProcessing}
                                    onClick={() =>
                                      handleEditPilot(pilot)
                                    }
                                    sx={
                                      pilotosPageStyles.editButton
                                    }
                                  >
                                    <EditRoundedIcon />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </PermissionGuard>

                            <PermissionGuard permission="pilotos.desactivar">
                              <Tooltip
                                title={
                                  isActive
                                    ? 'Desactivar piloto'
                                    : 'Activar piloto'
                                }
                              >
                                <span>
                                  <IconButton
                                    type="button"
                                    disabled={isProcessing}
                                    onClick={() =>
                                      handleStatusChange(pilot)
                                    }
                                    sx={
                                      isActive
                                        ? pilotosPageStyles.deactivateButton
                                        : pilotosPageStyles.activateButton
                                    }
                                  >
                                    {isProcessing ? (
                                      <CircularProgress
                                        size={20}
                                      />
                                    ) : isActive ? (
                                      <BlockRoundedIcon />
                                    ) : (
                                      <CheckCircleRoundedIcon />
                                    )}
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </PermissionGuard>
                          </Box>
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

      <PilotoForm
        open={formOpen}
        pilot={selectedPilot}
        onClose={handleCloseForm}
      />
    </Box>
  )
}

export default PilotosPage