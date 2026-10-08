import { useState } from 'react'

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

import AltRouteRoundedIcon from '@mui/icons-material/AltRouteRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'

import {
  actualizarLinea,
  crearLinea,
} from './lineasService'

import lineaFormStyles from './LineaForm.styles'

const formularioInicial = {
  codigo: '',
  nombre: '',
  municipalidad: '',
  descripcion: '',
  estado: 'ACTIVA',
}

function LineaForm({
  open,
  linea = null,
  onClose,
  onSaved,
}) {
  const [form, setForm] = useState(() => ({
    ...formularioInicial,
    ...(linea ?? {}),
  }))

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const editing = Boolean(linea?.id)

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  const validateForm = () => {
    if (!form.codigo.trim()) {
      return 'El código de la línea es obligatorio.'
    }

    if (!form.nombre.trim()) {
      return 'El nombre de la línea es obligatorio.'
    }

    if (!form.municipalidad.trim()) {
      return 'La municipalidad es obligatoria.'
    }

    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validationError = validateForm()

    if (validationError) {
      setError(validationError)
      return
    }

    setSaving(true)
    setError('')

    try {
      if (editing) {
        await actualizarLinea(linea.id, form)
      } else {
        await crearLinea(form)
      }

      if (onSaved) {
        onSaved(
          editing
            ? 'La línea fue actualizada correctamente.'
            : 'La línea fue registrada correctamente.',
        )
      }

      onClose()
    } catch (saveError) {
      console.error('Error al guardar la línea:', saveError)

      setError(
        saveError.message ||
          'No fue posible guardar la información de la línea.',
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
      slotProps={{
        paper: {
          sx: lineaFormStyles.dialogPaper,
        },
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={lineaFormStyles.form}
      >
        <DialogTitle sx={lineaFormStyles.dialogTitle}>
          <Box sx={lineaFormStyles.header}>
            <Box sx={lineaFormStyles.headerContent}>
              <Box sx={lineaFormStyles.headerIcon}>
                <AltRouteRoundedIcon />
              </Box>

              <Box>
                <Typography
                  component="h2"
                  sx={lineaFormStyles.title}
                >
                  {editing
                    ? 'Editar línea'
                    : 'Registrar línea'}
                </Typography>

                <Typography sx={lineaFormStyles.subtitle}>
                  Ingresa la información general de la línea.
                </Typography>
              </Box>

              <IconButton
                type="button"
                aria-label="Cerrar formulario"
                onClick={handleClose}
                disabled={saving}
                sx={lineaFormStyles.closeButton}
              >
                <CloseRoundedIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={lineaFormStyles.content}>
          {error && (
            <Alert
              severity="error"
              sx={lineaFormStyles.alert}
            >
              {error}
            </Alert>
          )}

          <Box sx={lineaFormStyles.formGrid}>
            <TextField
              name="codigo"
              label="Código"
              value={form.codigo}
              onChange={handleChange}
              placeholder="Ejemplo: L01"
              required
              disabled={saving}
              inputProps={{
                maxLength: 15,
              }}
              sx={lineaFormStyles.field}
            />

            <TextField
              name="nombre"
              label="Nombre de la línea"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ejemplo: Línea 1"
              required
              disabled={saving}
              inputProps={{
                maxLength: 80,
              }}
              sx={lineaFormStyles.field}
            />

            <TextField
              name="municipalidad"
              label="Municipalidad"
              value={form.municipalidad}
              onChange={handleChange}
              placeholder="Ejemplo: Guatemala"
              required
              disabled={saving}
              inputProps={{
                maxLength: 100,
              }}
              sx={lineaFormStyles.field}
            />

            <TextField
              select
              name="estado"
              label="Estado"
              value={form.estado}
              onChange={handleChange}
              disabled={saving}
              sx={lineaFormStyles.field}
            >
              <MenuItem value="ACTIVA">
                Activa
              </MenuItem>

              <MenuItem value="INACTIVA">
                Inactiva
              </MenuItem>

              <MenuItem value="MANTENIMIENTO">
                En mantenimiento
              </MenuItem>
            </TextField>

            <TextField
              name="descripcion"
              label="Descripción"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Descripción general de la línea"
              multiline
              minRows={3}
              disabled={saving}
              inputProps={{
                maxLength: 300,
              }}
              sx={{
                ...lineaFormStyles.field,
                ...lineaFormStyles.fullWidthField,
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={lineaFormStyles.actions}>
          <Button
            type="button"
            variant="outlined"
            onClick={handleClose}
            disabled={saving}
            sx={lineaFormStyles.cancelButton}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            startIcon={
              saving
                ? (
                  <CircularProgress
                    size={18}
                    color="inherit"
                  />
                )
                : <SaveRoundedIcon />
            }
            sx={lineaFormStyles.submitButton}
          >
            {saving
              ? 'Guardando...'
              : editing
                ? 'Guardar cambios'
                : 'Registrar línea'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default LineaForm
