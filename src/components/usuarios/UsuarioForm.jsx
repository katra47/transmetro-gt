import { useEffect, useMemo, useState } from 'react'

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'

import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'

import {
  createUser,
  updateUser,
} from './usuariosService'

import { observeRoles } from './rolesService'
import usuarioFormStyles from './UsuarioForm.styles'

const initialForm = {
  uid: '',
  nombres: '',
  correo: '',
  rolId: '',
  personalId: '',
  fotoURL: '',
}

function UsuarioForm({
  open,
  onClose,
  user = null,
  onSaved,
}) {
  const [form, setForm] = useState(initialForm)
  const [roles, setRoles] = useState([])
  const [loadingRoles, setLoadingRoles] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const isEditing = Boolean(user?.id)

  useEffect(() => {
    if (!open) {
      return undefined
    }

    if (user) {
      setForm({
        uid: user.id ?? '',
        nombres: user.nombres ?? '',
        correo: user.correo ?? '',
        rolId: user.rolId ?? '',
        personalId: user.personalId ?? '',
        fotoURL: user.fotoURL ?? '',
      })
    } else {
      setForm(initialForm)
    }

    setError('')
    setSaving(false)
    setLoadingRoles(true)

    const unsubscribe = observeRoles(
      (rolesData) => {
        setRoles(rolesData)
        setLoadingRoles(false)
      },
      () => {
        setRoles([])
        setLoadingRoles(false)
        setError(
          'No fue posible consultar los roles disponibles.',
        )
      },
    )

    return unsubscribe
  }, [open, user])

  const selectableRoles = useMemo(() => {
    return roles.filter(
      (role) =>
        role.activo !== false || role.id === form.rolId,
    )
  }, [roles, form.rolId])

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setSaving(true)
    setError('')

    try {
      if (isEditing) {
        await updateUser(user.id, form)
      } else {
        await createUser(form)
      }

      if (onSaved) {
        onSaved()
      }

      onClose()
    } catch (submitError) {
      console.error(
        'Error al guardar el usuario:',
        submitError,
      )

      setError(
        submitError.message ||
          'No fue posible guardar el usuario.',
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
      maxWidth="sm"
      PaperProps={{
        sx: usuarioFormStyles.dialogPaper,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
      >
        <DialogTitle sx={usuarioFormStyles.dialogTitle}>
          <Box sx={usuarioFormStyles.titleInformation}>
            <Box sx={usuarioFormStyles.titleIcon}>
              <ManageAccountsRoundedIcon />
            </Box>

            <Box>
              <Typography
                component="h2"
                variant="h6"
                sx={usuarioFormStyles.title}
              >
                {isEditing
                  ? 'Editar usuario'
                  : 'Autorizar usuario'}
              </Typography>

              <Typography sx={usuarioFormStyles.subtitle}>
                Configura el perfil y su rol de acceso.
              </Typography>
            </Box>
          </Box>

          <IconButton
            type="button"
            aria-label="Cerrar formulario"
            onClick={handleClose}
            disabled={saving}
            sx={usuarioFormStyles.closeButton}
          >
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={usuarioFormStyles.dialogContent}>
          <Box sx={usuarioFormStyles.form}>
            {!isEditing && (
              <Alert
                severity="info"
                sx={usuarioFormStyles.informationAlert}
              >
                El usuario debe iniciar sesión con Google una vez.
                Después, copia su UID desde Firebase Authentication
                y regístralo en este formulario.
              </Alert>
            )}

            {error && (
              <Alert
                severity="error"
                sx={usuarioFormStyles.errorAlert}
              >
                {error}
              </Alert>
            )}

            <Box sx={usuarioFormStyles.fieldsGrid}>
              <TextField
                name="uid"
                label="UID de Firebase"
                value={form.uid}
                onChange={handleChange}
                required
                fullWidth
                disabled={saving || isEditing}
                helperText={
                  isEditing
                    ? 'El UID no puede modificarse.'
                    : 'Identificador generado por Firebase Authentication.'
                }
                inputProps={{
                  maxLength: 128,
                }}
                sx={usuarioFormStyles.uidField}
              />

              <TextField
                name="nombres"
                label="Nombre completo"
                value={form.nombres}
                onChange={handleChange}
                required
                fullWidth
                disabled={saving}
                inputProps={{
                  maxLength: 100,
                }}
                sx={usuarioFormStyles.field}
              />

              <TextField
                name="correo"
                type="email"
                label="Correo electrónico"
                value={form.correo}
                onChange={handleChange}
                required
                fullWidth
                disabled={saving}
                inputProps={{
                  maxLength: 120,
                }}
                sx={usuarioFormStyles.field}
              />

              <TextField
                name="rolId"
                label="Rol asignado"
                value={form.rolId}
                onChange={handleChange}
                required
                select
                fullWidth
                disabled={saving || loadingRoles}
                helperText={
                  loadingRoles
                    ? 'Cargando roles...'
                    : 'Selecciona el nivel de acceso.'
                }
                sx={usuarioFormStyles.roleField}
              >
                {selectableRoles.map((role) => (
                  <MenuItem
                    key={role.id}
                    value={role.id}
                  >
                    {role.nombre}
                    {role.activo === false
                      ? ' — Inactivo'
                      : ''}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                name="personalId"
                label="ID de personal"
                value={form.personalId}
                onChange={handleChange}
                fullWidth
                disabled={saving}
                helperText="Opcional"
                inputProps={{
                  maxLength: 100,
                }}
                sx={usuarioFormStyles.field}
              />

              <TextField
                name="fotoURL"
                label="Dirección de la fotografía"
                value={form.fotoURL}
                onChange={handleChange}
                fullWidth
                disabled={saving}
                helperText="Opcional; puede utilizarse la fotografía de Google."
                inputProps={{
                  maxLength: 500,
                }}
                sx={[
                  usuarioFormStyles.field,
                  usuarioFormStyles.fullWidthField,
                ]}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={usuarioFormStyles.dialogActions}>
          <Button
            type="button"
            onClick={handleClose}
            disabled={saving}
            sx={usuarioFormStyles.cancelButton}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={saving || loadingRoles}
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
            sx={usuarioFormStyles.saveButton}
          >
            {saving
              ? 'Guardando...'
              : isEditing
                ? 'Guardar cambios'
                : 'Autorizar usuario'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default UsuarioForm