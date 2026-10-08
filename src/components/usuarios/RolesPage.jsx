import { useEffect, useMemo, useState } from 'react'

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'

import AddRoundedIcon from '@mui/icons-material/AddRounded'
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'
import BlockRoundedIcon from '@mui/icons-material/BlockRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded'

import PermissionGuard from './PermissionGuard'
import RolForm from './RolForm'

import {
  changeRoleStatus,
  observeRoles,
} from './rolesService'

import rolesPageStyles from './RolesPage.styles'

function RolesPage() {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState(null)
  const [error, setError] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)

  useEffect(() => {
    const unsubscribe = observeRoles(
      (rolesData) => {
        setRoles(rolesData)
        setLoading(false)
        setError('')
      },
      () => {
        setLoading(false)
        setError(
          'No fue posible cargar los roles registrados.',
        )
      },
    )

    return unsubscribe
  }, [])

  const summary = useMemo(() => {
    const activeRoles = roles.filter(
      (role) => role.activo !== false,
    ).length

    return {
      total: roles.length,
      active: activeRoles,
      inactive: roles.length - activeRoles,
    }
  }, [roles])

  const handleNewRole = () => {
    setSelectedRole(null)
    setFormOpen(true)
  }

  const handleEditRole = (role) => {
    setSelectedRole(role)
    setFormOpen(true)
  }

  const handleCloseForm = () => {
    setFormOpen(false)
    setSelectedRole(null)
  }

  const handleStatusChange = async (role) => {
    const newStatus = role.activo === false
    const action = newStatus ? 'activar' : 'desactivar'

    const confirmed = window.confirm(
      `¿Deseas ${action} el rol "${role.nombre}"?`,
    )

    if (!confirmed) {
      return
    }

    setProcessingId(role.id)
    setError('')

    try {
      await changeRoleStatus(role.id, newStatus)
    } catch (statusError) {
      console.error(
        'Error al cambiar el estado del rol:',
        statusError,
      )

      setError(
        statusError.message ||
          'No fue posible cambiar el estado del rol.',
      )
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <Box component="main" sx={rolesPageStyles.page}>
      <Box sx={rolesPageStyles.container}>
        <Box sx={rolesPageStyles.header}>
          <Box sx={rolesPageStyles.headerInformation}>
            <Box sx={rolesPageStyles.headerIcon}>
              <AdminPanelSettingsRoundedIcon
                sx={{ fontSize: 32 }}
              />
            </Box>

            <Box>
              <Typography
                component="h1"
                sx={rolesPageStyles.title}
              >
                Roles y permisos
              </Typography>

              <Typography sx={rolesPageStyles.subtitle}>
                Administra los niveles de acceso del sistema.
              </Typography>
            </Box>
          </Box>

          <PermissionGuard permission="roles.crear">
            <Button
              type="button"
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={handleNewRole}
              sx={rolesPageStyles.addButton}
            >
              Nuevo rol
            </Button>
          </PermissionGuard>
        </Box>

        {error && (
          <Alert
            severity="error"
            onClose={() => setError('')}
            sx={rolesPageStyles.errorAlert}
          >
            {error}
          </Alert>
        )}

        <Box sx={rolesPageStyles.summary}>
          <Paper elevation={0} sx={rolesPageStyles.summaryCard}>
            <Box sx={rolesPageStyles.summaryIcon}>
              <SecurityRoundedIcon />
            </Box>

            <Box>
              <Typography sx={rolesPageStyles.summaryValue}>
                {summary.total}
              </Typography>

              <Typography sx={rolesPageStyles.summaryLabel}>
                Roles registrados
              </Typography>
            </Box>
          </Paper>

          <Paper elevation={0} sx={rolesPageStyles.summaryCard}>
            <Box sx={rolesPageStyles.summaryIcon}>
              <CheckCircleRoundedIcon />
            </Box>

            <Box>
              <Typography sx={rolesPageStyles.summaryValue}>
                {summary.active}
              </Typography>

              <Typography sx={rolesPageStyles.summaryLabel}>
                Roles activos
              </Typography>
            </Box>
          </Paper>

          <Paper elevation={0} sx={rolesPageStyles.summaryCard}>
            <Box sx={rolesPageStyles.summaryIcon}>
              <BlockRoundedIcon />
            </Box>

            <Box>
              <Typography sx={rolesPageStyles.summaryValue}>
                {summary.inactive}
              </Typography>

              <Typography sx={rolesPageStyles.summaryLabel}>
                Roles inactivos
              </Typography>
            </Box>
          </Paper>
        </Box>

        <Paper elevation={0} sx={rolesPageStyles.tablePaper}>
          {loading ? (
            <Box sx={rolesPageStyles.loadingContainer}>
              <CircularProgress sx={{ color: '#008F87' }} />
            </Box>
          ) : roles.length === 0 ? (
            <Box sx={rolesPageStyles.emptyContainer}>
              <SecurityRoundedIcon
                sx={rolesPageStyles.emptyIcon}
              />

              <Typography sx={rolesPageStyles.emptyTitle}>
                No hay roles registrados
              </Typography>

              <Typography sx={rolesPageStyles.emptyText}>
                Crea el primer rol para comenzar a asignar
                permisos.
              </Typography>
            </Box>
          ) : (
            <TableContainer sx={rolesPageStyles.tableContainer}>
              <Table sx={{ minWidth: 780 }}>
                <TableHead sx={rolesPageStyles.tableHeader}>
                  <TableRow>
                    <TableCell>Rol</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell align="center">
                      Permisos
                    </TableCell>
                    <TableCell align="center">
                      Estado
                    </TableCell>
                    <TableCell align="right">
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {roles.map((role) => {
                    const isActive = role.activo !== false
                    const isProcessing =
                      processingId === role.id

                    return (
                      <TableRow
                        key={role.id}
                        sx={rolesPageStyles.tableRow}
                      >
                        <TableCell>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                            }}
                          >
                            <Typography
                              sx={rolesPageStyles.roleName}
                            >
                              {role.nombre}
                            </Typography>

                            {role.protegido && (
                              <Chip
                                size="small"
                                icon={<LockRoundedIcon />}
                                label="Protegido"
                                sx={
                                  rolesPageStyles.protectedChip
                                }
                              />
                            )}
                          </Box>
                        </TableCell>

                        <TableCell>
                          {role.descripcion ||
                            'Sin descripción'}
                        </TableCell>

                        <TableCell align="center">
                          <Chip
                            size="small"
                            label={
                              role.permisos?.includes('*')
                                ? 'Acceso total'
                                : `${role.permisos?.length ?? 0} permisos`
                            }
                            sx={
                              rolesPageStyles.permissionsChip
                            }
                          />
                        </TableCell>

                        <TableCell align="center">
                          <Chip
                            size="small"
                            label={
                              isActive
                                ? 'Activo'
                                : 'Inactivo'
                            }
                            sx={
                              isActive
                                ? rolesPageStyles.activeChip
                                : rolesPageStyles.inactiveChip
                            }
                          />
                        </TableCell>

                        <TableCell align="right">
                          <Box sx={rolesPageStyles.actions}>
                            {!role.protegido && (
                              <>
                                <PermissionGuard permission="roles.modificar">
                                  <Tooltip title="Editar rol">
                                    <span>
                                      <IconButton
                                        type="button"
                                        disabled={isProcessing}
                                        onClick={() =>
                                          handleEditRole(role)
                                        }
                                        sx={
                                          rolesPageStyles.editButton
                                        }
                                      >
                                        <EditRoundedIcon />
                                      </IconButton>
                                    </span>
                                  </Tooltip>
                                </PermissionGuard>

                                <PermissionGuard permission="roles.desactivar">
                                  <Tooltip
                                    title={
                                      isActive
                                        ? 'Desactivar rol'
                                        : 'Activar rol'
                                    }
                                  >
                                    <span>
                                      <IconButton
                                        type="button"
                                        disabled={isProcessing}
                                        onClick={() =>
                                          handleStatusChange(role)
                                        }
                                        sx={
                                          isActive
                                            ? rolesPageStyles
                                                .deactivateButton
                                            : rolesPageStyles
                                                .activateButton
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
                              </>
                            )}
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

      <RolForm
        open={formOpen}
        role={selectedRole}
        onClose={handleCloseForm}
      />
    </Box>
  )
}

export default RolesPage