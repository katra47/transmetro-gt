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

import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import LocalParkingRoundedIcon from '@mui/icons-material/LocalParkingRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'

import {
  actualizarParqueo,
  crearParqueo,
} from './parqueosService'

import parqueoFormStyles from './ParqueoForm.styles'

const formularioInicial = {
  codigo: '',
  nombre: '',
  estacionId: '',
  capacidad: '',
  descripcion: '',
  estado: 'DISPONIBLE',
}

function ParqueoForm({
  open,
  parqueo = null,
  estaciones = [],
  onClose,
  onSaved,
}) {
  const [form, setForm] = useState(() => ({
    ...formularioInicial,
    ...(parqueo ?? {}),
  }))

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const editing = Boolean(parqueo?.id)

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  const validateForm = () => {
    if (!form.codigo.trim()) {
      return 'El código del parqueo es obligatorio.'
    }

    if (!form.nombre.trim()) {
      return 'El nombre del parqueo es obligatorio.'
    }

    if (!form.estacionId) {
      return 'Debes seleccionar una estación.'
    }

    const capacidad = Number(form.capacidad)

    if (!Number.isInteger(capacidad) || capacidad < 1) {
      return 'La capacidad debe ser un número entero mayor que cero.'
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
        await actualizarParqueo(parqueo.id, form)
      } else {
        await crearParqueo(form)
      }

      onSaved(
        editing
          ? 'El parqueo fue actualizado correctamente.'
          : 'El parqueo fue registrado correctamente.',
      )

      onClose()
    } catch (saveError) {
      console.error(
        'Error al guardar el parqueo:',
        saveError,
      )

      setError(
        saveError.message ||
          'No fue posible guardar el parqueo.',
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
          sx: parqueoFormStyles.dialogPaper,
        },
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={parqueoFormStyles.form}
      >
        <DialogTitle sx={parqueoFormStyles.dialogTitle}>
          <Box sx={parqueoFormStyles.header}>
            <Box sx={parqueoFormStyles.headerContent}>
              <Box sx={parqueoFormStyles.headerIcon}>
                <LocalParkingRoundedIcon />
              </Box>

              <Box>
                <Typography
                  component="h2"
                  sx={parqueoFormStyles.title}
                >
                  {editing
                    ? 'Editar parqueo'
                    : 'Registrar parqueo'}
                </Typography>

                <Typography sx={parqueoFormStyles.subtitle}>
                  Registra la estación y capacidad del parqueo.
                </Typography>
              </Box>

              <IconButton
                type="button"
                aria-label="Cerrar formulario"
                onClick={handleClose}
                disabled={saving}
                sx={parqueoFormStyles.closeButton}
              >
                <CloseRoundedIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={parqueoFormStyles.content}>
          {error && (
            <Alert
              severity="error"
              sx={parqueoFormStyles.alert}
            >
              {error}
            </Alert>
          )}

          <Box sx={parqueoFormStyles.formGrid}>
            <TextField
              name="codigo"
              label="Código"
              value={form.codigo}
              onChange={handleChange}
              placeholder="Ejemplo: PAR-001"
              required
              disabled={saving}
              slotProps={{
                htmlInput: {
                  maxLength: 20,
                },
              }}
              sx={parqueoFormStyles.field}
            />

            <TextField
              name="nombre"
              label="Nombre del parqueo"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ejemplo: Parqueo Central"
              required
              disabled={saving}
              slotProps={{
                htmlInput: {
                  maxLength: 100,
                },
              }}
              sx={parqueoFormStyles.field}
            />

            <TextField
              select
              name="estacionId"
              label="Estación"
              value={form.estacionId}
              onChange={handleChange}
              required
              disabled={saving}
              sx={parqueoFormStyles.field}
            >
              {estaciones.map((estacion) => (
                <MenuItem
                  key={estacion.id}
                  value={estacion.id}
                >
                  {estacion.codigo} - {estacion.nombre}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              type="number"
              name="capacidad"
              label="Capacidad de buses"
              value={form.capacidad}
              onChange={handleChange}
              required
              disabled={saving}
              slotProps={{
                htmlInput: {
                  min: 1,
                  step: 1,
                },
              }}
              sx={parqueoFormStyles.field}
            />

            <TextField
              select
              name="estado"
              label="Estado"
              value={form.estado}
              onChange={handleChange}
              disabled={saving}
              sx={parqueoFormStyles.field}
            >
              <MenuItem value="DISPONIBLE">
                Disponible
              </MenuItem>

              <MenuItem value="LLENO">
                Lleno
              </MenuItem>

              <MenuItem value="MANTENIMIENTO">
                En mantenimiento
              </MenuItem>

              <MenuItem value="INACTIVO">
                Inactivo
              </MenuItem>
            </TextField>

            <TextField
              name="descripcion"
              label="Descripción"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Información adicional del parqueo"
              multiline
              minRows={3}
              disabled={saving}
              slotProps={{
                htmlInput: {
                  maxLength: 300,
                },
              }}
              sx={{
                ...parqueoFormStyles.field,
                ...parqueoFormStyles.fullWidthField,
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={parqueoFormStyles.actions}>
          <Button
            type="button"
            variant="outlined"
            onClick={handleClose}
            disabled={saving}
            sx={parqueoFormStyles.cancelButton}
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
            sx={parqueoFormStyles.submitButton}
          >
            {saving
              ? 'Guardando...'
              : editing
                ? 'Guardar cambios'
                : 'Registrar parqueo'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default ParqueoForm