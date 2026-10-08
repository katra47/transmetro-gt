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
import BlockRoundedIcon from '@mui/icons-material/BlockRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import GroupRoundedIcon from '@mui/icons-material/GroupRounded'
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded'
import PersonOffRoundedIcon from '@mui/icons-material/PersonOffRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'

import PermissionGuard from './PermissionGuard'
import UsuarioForm from './UsuarioForm'
import { useAuth } from './AuthContext'

import {
  changeUserStatus,
  observeUsers,
} from './usuariosService'

import { observeRoles } from './rolesService'
import usuariosPageStyles from './UsuariosPage.styles'

function UsuariosPage() {
  const { firebaseUser } = useAuth()

  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [loadingRoles, setLoadingRoles] = useState(true)
  const [processingId, setProcessingId] = useState(null)
  const [error, setError] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('TODOS')
  const [statusFilter, setStatusFilter] = useState('TODOS')

  useEffect(() => {
    const unsubscribeUsers = observeUsers(
      (usersData) => {
        setUsers(usersData)
        setLoadingUsers(false)
      },
      () => {
        setLoadingUsers(false)
        setError(
          'No fue posible cargar los usuarios registrados.',
        )
      },
    )

    const unsubscribeRoles = observeRoles(
      (rolesData) => {
        setRoles(rolesData)
        setLoadingRoles(false)
      },
      () => {
        setLoadingRoles(false)
        setError(
          'No fue posible cargar los roles disponibles.',
        )
      },
    )

    return () => {
      unsubscribeUsers()
      unsubscribeRoles()
    }
  }, [])

  const rolesById = useMemo(() => {
    return roles.reduce((result, role) => {
      result[role.id] = role
      return result
    }, {})
  }, [roles])

  const summary = useMemo(() => {
    const activeUsers = users.filter(
      (user) => user.estado === 'ACTIVO',
    ).length

    return {
      total: users.length,
      active: activeUsers,
      inactive: users.length - activeUsers,
    }
  }, [users])

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return users.filter((user) => {
      const matchesSearch =
        !normalizedSearch ||
        user.nombres
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        user.correo
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        user.id
          ?.toLowerCase()
          .includes(normalizedSearch)

      const matchesRole =
        roleFilter === 'TODOS' ||
        user.rolId === roleFilter

      const matchesStatus =
        statusFilter === 'TODOS' ||
        user.estado === statusFilter

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      )
    })
  }, [users, search, roleFilter, statusFilter])

  const handleNewUser = () => {
    setSelectedUser(null)
    setFormOpen(true)
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setFormOpen(true)
  }

  const handleCloseForm = () => {
    setFormOpen(false)
    setSelectedUser(null)
  }

  const handleStatusChange = async (user) => {
    const newStatus =
      user.estado === 'ACTIVO'
        ? 'INACTIVO'
        : 'ACTIVO'

    const action =
      newStatus === 'ACTIVO'
        ? 'activar'
        : 'desactivar'

    const confirmed = window.confirm(
      `¿Deseas ${action} al usuario "${user.nombres}"?`,
    )

    if (!confirmed) {
      return
    }

    setProcessingId(user.id)
    setError('')

    try {
      await changeUserStatus(user.id, newStatus)
    } catch (statusError) {
      console.error(
        'Error al cambiar el estado del usuario:',
        statusError,
      )

      setError(
        statusError.message ||
          'No fue posible cambiar el estado del usuario.',
      )
    } finally {
      setProcessingId(null)
    }
  }

  const loading = loadingUsers || loadingRoles

  return (
    <Box component="main" sx={usuariosPageStyles.page}>
      <Box sx={usuariosPageStyles.container}>
        <Box sx={usuariosPageStyles.header}>
          <Box sx={usuariosPageStyles.headerInformation}>
            <Box sx={usuariosPageStyles.headerIcon}>
              <ManageAccountsRoundedIcon
                sx={{ fontSize: 32 }}
              />
            </Box>

            <Box>
              <Typography
                component="h1"
                sx={usuariosPageStyles.title}
              >
                Usuarios
              </Typography>

              <Typography sx={usuariosPageStyles.subtitle}>
                Administra las cuentas y sus roles de acceso.
              </Typography>
            </Box>
          </Box>

          <PermissionGuard permission="usuarios.crear">
            <Button
              type="button"
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={handleNewUser}
              sx={usuariosPageStyles.addButton}
            >
              Autorizar usuario
            </Button>
          </PermissionGuard>
        </Box>

        {error && (
          <Alert
            severity="error"
            onClose={() => setError('')}
            sx={usuariosPageStyles.errorAlert}
          >
            {error}
          </Alert>
        )}

        <Box sx={usuariosPageStyles.summary}>
          <Paper
            elevation={0}
            sx={usuariosPageStyles.summaryCard}
          >
            <Box sx={usuariosPageStyles.summaryIcon}>
              <GroupRoundedIcon />
            </Box>

            <Box>
              <Typography sx={usuariosPageStyles.summaryValue}>
                {summary.total}
              </Typography>

              <Typography sx={usuariosPageStyles.summaryLabel}>
                Usuarios registrados
              </Typography>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={usuariosPageStyles.summaryCard}
          >
            <Box sx={usuariosPageStyles.summaryIcon}>
              <CheckCircleRoundedIcon />
            </Box>

            <Box>
              <Typography sx={usuariosPageStyles.summaryValue}>
                {summary.active}
              </Typography>

              <Typography sx={usuariosPageStyles.summaryLabel}>
                Usuarios activos
              </Typography>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={usuariosPageStyles.summaryCard}
          >
            <Box sx={usuariosPageStyles.summaryIcon}>
              <PersonOffRoundedIcon />
            </Box>

            <Box>
              <Typography sx={usuariosPageStyles.summaryValue}>
                {summary.inactive}
              </Typography>

              <Typography sx={usuariosPageStyles.summaryLabel}>
                Usuarios inactivos
              </Typography>
            </Box>
          </Paper>
        </Box>

        <Paper
          elevation={0}
          sx={usuariosPageStyles.filtersPaper}
        >
          <Box sx={usuariosPageStyles.filters}>
            <TextField
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              label="Buscar usuario"
              placeholder="Nombre, correo o UID"
              fullWidth
              size="small"
              sx={usuariosPageStyles.filterField}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              select
              label="Rol"
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(event.target.value)
              }
              fullWidth
              size="small"
              sx={usuariosPageStyles.filterField}
            >
              <MenuItem value="TODOS">
                Todos los roles
              </MenuItem>

              {roles.map((role) => (
                <MenuItem
                  key={role.id}
                  value={role.id}
                >
                  {role.nombre}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Estado"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              fullWidth
              size="small"
              sx={usuariosPageStyles.filterField}
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
            </TextField>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={usuariosPageStyles.tablePaper}
        >
          {loading ? (
            <Box sx={usuariosPageStyles.loadingContainer}>
              <CircularProgress sx={{ color: '#008F87' }} />
            </Box>
          ) : filteredUsers.length === 0 ? (
            <Box sx={usuariosPageStyles.emptyContainer}>
              <ManageAccountsRoundedIcon
                sx={usuariosPageStyles.emptyIcon}
              />

              <Typography sx={usuariosPageStyles.emptyTitle}>
                No se encontraron usuarios
              </Typography>

              <Typography sx={usuariosPageStyles.emptyText}>
                No existen registros que coincidan con los
                filtros seleccionados.
              </Typography>
            </Box>
          ) : (
            <TableContainer
              sx={usuariosPageStyles.tableContainer}
            >
              <Table sx={{ minWidth: 960 }}>
                <TableHead sx={usuariosPageStyles.tableHeader}>
                  <TableRow>
                    <TableCell>Usuario</TableCell>
                    <TableCell>UID</TableCell>
                    <TableCell align="center">
                      Rol
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
                  {filteredUsers.map((user) => {
                    const role = rolesById[user.rolId]
                    const isActive =
                      user.estado === 'ACTIVO'
                    const isProcessing =
                      processingId === user.id
                    const isCurrentUser =
                      firebaseUser?.uid === user.id
                    const isProtectedUser =
                      role?.protegido === true

                    return (
                      <TableRow
                        key={user.id}
                        sx={usuariosPageStyles.tableRow}
                      >
                        <TableCell>
                          <Box
                            sx={
                              usuariosPageStyles.userInformation
                            }
                          >
                            <Avatar
                              src={user.fotoURL || undefined}
                              alt={user.nombres}
                              sx={usuariosPageStyles.avatar}
                            >
                              {user.nombres
                                ?.charAt(0)
                                .toUpperCase()}
                            </Avatar>

                            <Box>
                              <Typography
                                sx={
                                  usuariosPageStyles.userName
                                }
                              >
                                {user.nombres}
                              </Typography>

                              <Typography
                                sx={
                                  usuariosPageStyles.userEmail
                                }
                              >
                                {user.correo}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Tooltip title={user.id}>
                            <Typography
                              sx={usuariosPageStyles.uid}
                            >
                              {user.id}
                            </Typography>
                          </Tooltip>
                        </TableCell>

                        <TableCell align="center">
                          <Chip
                            size="small"
                            label={
                              role?.nombre ||
                              'Rol no encontrado'
                            }
                            sx={usuariosPageStyles.roleChip}
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
                                ? usuariosPageStyles.activeChip
                                : usuariosPageStyles.inactiveChip
                            }
                          />
                        </TableCell>

                        <TableCell align="right">
                          <Box sx={usuariosPageStyles.actions}>
                            {!isProtectedUser && (
                              <PermissionGuard permission="usuarios.modificar">
                                <Tooltip title="Editar usuario">
                                  <span>
                                    <IconButton
                                      type="button"
                                      disabled={isProcessing}
                                      onClick={() =>
                                        handleEditUser(user)
                                      }
                                      sx={
                                        usuariosPageStyles.editButton
                                      }
                                    >
                                      <EditRoundedIcon />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                              </PermissionGuard>
                            )}

                            {!isProtectedUser &&
                              !isCurrentUser && (
                                <PermissionGuard permission="usuarios.desactivar">
                                  <Tooltip
                                    title={
                                      isActive
                                        ? 'Desactivar usuario'
                                        : 'Activar usuario'
                                    }
                                  >
                                    <span>
                                      <IconButton
                                        type="button"
                                        disabled={isProcessing}
                                        onClick={() =>
                                          handleStatusChange(user)
                                        }
                                        sx={
                                          isActive
                                            ? usuariosPageStyles
                                                .deactivateButton
                                            : usuariosPageStyles
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

      <UsuarioForm
        open={formOpen}
        user={selectedUser}
        onClose={handleCloseForm}
      />
    </Box>
  )
}

export default UsuariosPage