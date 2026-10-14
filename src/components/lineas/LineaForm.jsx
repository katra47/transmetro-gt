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
  descripcion: '',
  estado: 'ACTIVA',
}

const prepararFormulario = (linea) => ({
  codigo: linea?.codigo ?? '',
  nombre: linea?.nombre ?? '',
  descripcion: linea?.descripcion ?? '',
  estado: linea?.estado ?? 'ACTIVA',
})

function LineaForm({
  open,
  linea = null,
  onClose,
  onSaved,
}) {
  const [form, setForm] = useState(() =>
    linea
      ? prepararFormulario(linea)
      : formularioInicial,
  )

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

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.codigo.trim()) {
      setError(
        'El código de la línea es obligatorio.',
      )
      return
    }

    if (!form.nombre.trim()) {
      setError(
        'El nombre de la línea es obligatorio.',
      )
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

      onSaved(
        editing
          ? 'La línea fue actualizada correctamente.'
          : 'La línea fue registrada correctamente.',
      )

      onClose()
    } catch (saveError) {
      console.error(saveError)

      setError(
        saveError.message ||
          'No fue posible guardar la línea.',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
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
                  Ingresa los datos generales de la línea.
                </Typography>
              </Box>

              <IconButton
                type="button"
                onClick={onClose}
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
              required
              disabled={saving}
              placeholder="Ejemplo: L01"
              slotProps={{
                htmlInput: {
                  maxLength: 15,
                },
              }}
              sx={lineaFormStyles.field}
            />

            <TextField
              name="nombre"
              label="Nombre de la línea"
              value={form.nombre}
              onChange={handleChange}
              required
              disabled={saving}
              placeholder="Ejemplo: Línea Central"
              slotProps={{
                htmlInput: {
                  maxLength: 80,
                },
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
              multiline
              minRows={3}
              disabled={saving}
              slotProps={{
                htmlInput: {
                  maxLength: 300,
                },
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
            onClick={onClose}
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