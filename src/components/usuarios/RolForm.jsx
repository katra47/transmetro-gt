import { useEffect, useState } from 'react'

import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'

import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded'

import {
  availablePermissions,
  createRole,
  updateRole,
} from './rolesService'

import rolFormStyles from './RolForm.styles'

const initialForm = {
  nombre: '',
  descripcion: '',
  permisos: [],
}

const actionLabels = {
  consultar: 'Consultar',
  crear: 'Crear',
  modificar: 'Modificar',
  desactivar: 'Desactivar',
  cancelar: 'Cancelar',
  registrar: 'Registrar',
  anular: 'Anular',
  exportar: 'Exportar',
}

function getPermissionLabel(permission) {
  const action = permission.split('.')[1]

  return actionLabels[action] ?? action
}

function RolForm({
  open,
  onClose,
  role = null,
  onSaved,
}) {
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const isEditing = Boolean(role?.id)

  useEffect(() => {
    if (!open) {
      return
    }

    if (role) {
      setForm({
        nombre: role.nombre ?? '',
        descripcion: role.descripcion ?? '',
        permisos: role.permisos ?? [],
      })
    } else {
      setForm(initialForm)
    }

    setError('')
    setSaving(false)
  }, [open, role])

  const handleFieldChange = (event) => {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  const handlePermissionChange = (permission) => {
    setForm((currentForm) => {
      const permissionExists =
        currentForm.permisos.includes(permission)

      return {
        ...currentForm,
        permisos: permissionExists
          ? currentForm.permisos.filter(
              (currentPermission) =>
                currentPermission !== permission,
            )
          : [...currentForm.permisos, permission],
      }
    })
  }

  const handleModuleChange = (modulePermissions) => {
    setForm((currentForm) => {
      const allSelected = modulePermissions.every(
        (permission) =>
          currentForm.permisos.includes(permission),
      )

      if (allSelected) {
        return {
          ...currentForm,
          permisos: currentForm.permisos.filter(
            (permission) =>
              !modulePermissions.includes(permission),
          ),
        }
      }

      return {
        ...currentForm,
        permisos: [
          ...new Set([
            ...currentForm.permisos,
            ...modulePermissions,
          ]),
        ],
      }
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setSaving(true)
    setError('')

    try {
      if (isEditing) {
        await updateRole(role.id, form)
      } else {
        await createRole(form)
      }

      if (onSaved) {
        onSaved()
      }

      onClose()
    } catch (submitError) {
      console.error('Error al guardar el rol:', submitError)

      setError(
        submitError.message ||
          'No fue posible guardar el rol.',
      )
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    if (!saving) {
      onClose()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: rolFormStyles.dialogPaper,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
      >
        <DialogTitle sx={rolFormStyles.dialogTitle}>
          <Box sx={rolFormStyles.titleInformation}>
            <Box sx={rolFormStyles.titleIcon}>
              <SecurityRoundedIcon />
            </Box>

            <Box>
              <Typography
                component="h2"
                variant="h6"
                sx={rolFormStyles.title}
              >
                {isEditing
                  ? 'Editar rol'
                  : 'Crear nuevo rol'}
              </Typography>

              <Typography sx={rolFormStyles.subtitle}>
                Define el nombre y los permisos de acceso.
              </Typography>
            </Box>
          </Box>

          <IconButton
            type="button"
            aria-label="Cerrar formulario"
            onClick={handleClose}
            disabled={saving}
            sx={rolFormStyles.closeButton}
          >
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={rolFormStyles.dialogContent}>
          <Box sx={rolFormStyles.form}>
            {error && (
              <Alert
                severity="error"
                sx={rolFormStyles.errorAlert}
              >
                {error}
              </Alert>
            )}

            <TextField
              name="nombre"
              label="Nombre del rol"
              value={form.nombre}
              onChange={handleFieldChange}
              required
              fullWidth
              disabled={saving}
              inputProps={{
                maxLength: 60,
              }}
              sx={rolFormStyles.field}
            />

            <TextField
              name="descripcion"
              label="Descripción"
              value={form.descripcion}
              onChange={handleFieldChange}
              fullWidth
              multiline
              minRows={3}
              disabled={saving}
              inputProps={{
                maxLength: 250,
              }}
              sx={rolFormStyles.field}
            />

            <Box sx={rolFormStyles.permissionsSection}>
              <Box sx={rolFormStyles.permissionsHeader}>
                <Typography sx={rolFormStyles.permissionsTitle}>
                  Permisos del rol
                </Typography>

                <Typography
                  sx={rolFormStyles.permissionsDescription}
                >
                  Selecciona las acciones que podrán realizar los
                  usuarios que tengan este rol.
                </Typography>
              </Box>

              {availablePermissions.map((moduleItem) => {
                const selectedCount =
                  moduleItem.permissions.filter(
                    (permission) =>
                      form.permisos.includes(permission),
                  ).length

                const allSelected =
                  selectedCount ===
                  moduleItem.permissions.length

                const partiallySelected =
                  selectedCount > 0 && !allSelected

                return (
                  <Box
                    key={moduleItem.module}
                    sx={rolFormStyles.moduleCard}
                  >
                    <Box sx={rolFormStyles.moduleHeader}>
                      <Typography
                        sx={rolFormStyles.moduleName}
                      >
                        {moduleItem.module}
                      </Typography>

                      <FormControlLabel
                        label="Seleccionar todo"
                        control={
                          <Checkbox
                            checked={allSelected}
                            indeterminate={partiallySelected}
                            disabled={saving}
                            onChange={() =>
                              handleModuleChange(
                                moduleItem.permissions,
                              )
                            }
                          />
                        }
                      />
                    </Box>

                    <Box
                      sx={rolFormStyles.modulePermissions}
                    >
                      {moduleItem.permissions.map(
                        (permission) => (
                          <FormControlLabel
                            key={permission}
                            sx={
                              rolFormStyles.permissionLabel
                            }
                            label={getPermissionLabel(
                              permission,
                            )}
                            control={
                              <Checkbox
                                checked={form.permisos.includes(
                                  permission,
                                )}
                                disabled={saving}
                                onChange={() =>
                                  handlePermissionChange(
                                    permission,
                                  )
                                }
                              />
                            }
                          />
                        ),
                      )}
                    </Box>
                  </Box>
                )
              })}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={rolFormStyles.dialogActions}>
          <Button
            type="button"
            onClick={handleClose}
            disabled={saving}
            sx={rolFormStyles.cancelButton}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            startIcon={
              saving ? (
                <CircularProgress
                  size={18}
                  sx={{ color: '#FFFFFF' }}
                />
              ) : (
                <SaveRoundedIcon />
              )
            }
            sx={rolFormStyles.saveButton}
          >
            {saving ? 'Guardando...' : 'Guardar rol'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default RolForm