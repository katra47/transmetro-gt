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
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import TrainRoundedIcon from '@mui/icons-material/TrainRounded'

import {
  actualizarEstacion,
  crearEstacion,
} from './estacionesService'

import estacionFormStyles from './EstacionForm.styles'

const formularioInicial = {
  codigo: '',
  nombre: '',
  municipalidad: '',
  direccion: '',
  latitud: '',
  longitud: '',
  descripcion: '',
  estado: 'OPERATIVA',
}

const prepararFormulario = (estacion) => {
  if (!estacion) {
    return formularioInicial
  }

  return {
    codigo: estacion.codigo ?? '',
    nombre: estacion.nombre ?? '',
    municipalidad: estacion.municipalidad ?? '',
    direccion: estacion.direccion ?? '',
    latitud: estacion.coordenadas?.latitud ?? '',
    longitud: estacion.coordenadas?.longitud ?? '',
    descripcion: estacion.descripcion ?? '',
    estado: estacion.estado ?? 'OPERATIVA',
  }
}

function EstacionForm({
  open,
  estacion = null,
  onClose,
  onSaved,
}) {
  const [form, setForm] = useState(() =>
    prepararFormulario(estacion),
  )

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const editing = Boolean(estacion?.id)

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  const validateForm = () => {
    if (!form.codigo.trim()) {
      return 'El código de la estación es obligatorio.'
    }

    if (!form.nombre.trim()) {
      return 'El nombre de la estación es obligatorio.'
    }

    if (!form.municipalidad.trim()) {
      return 'La municipalidad es obligatoria.'
    }

    if (!form.direccion.trim()) {
      return 'La dirección o ubicación es obligatoria.'
    }

    const hasLatitude = String(form.latitud).trim() !== ''
    const hasLongitude = String(form.longitud).trim() !== ''

    if (hasLatitude !== hasLongitude) {
      return 'Debes ingresar tanto la latitud como la longitud.'
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
        await actualizarEstacion(estacion.id, form)
      } else {
        await crearEstacion(form)
      }

      if (onSaved) {
        onSaved(
          editing
            ? 'La estación fue actualizada correctamente.'
            : 'La estación fue registrada correctamente.',
        )
      }

      onClose()
    } catch (saveError) {
      console.error(
        'Error al guardar la estación:',
        saveError,
      )

      setError(
        saveError.message ||
          'No fue posible guardar la estación.',
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
      slotProps={{
        paper: {
          sx: estacionFormStyles.dialogPaper,
        },
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={estacionFormStyles.form}
      >
        <DialogTitle sx={estacionFormStyles.dialogTitle}>
          <Box sx={estacionFormStyles.header}>
            <Box sx={estacionFormStyles.headerContent}>
              <Box sx={estacionFormStyles.headerIcon}>
                <TrainRoundedIcon />
              </Box>

              <Box>
                <Typography
                  component="h2"
                  sx={estacionFormStyles.title}
                >
                  {editing
                    ? 'Editar estación'
                    : 'Registrar estación'}
                </Typography>

                <Typography sx={estacionFormStyles.subtitle}>
                  Ingresa la ubicación y los datos generales
                  de la estación.
                </Typography>
              </Box>

              <IconButton
                type="button"
                aria-label="Cerrar formulario"
                onClick={handleClose}
                disabled={saving}
                sx={estacionFormStyles.closeButton}
              >
                <CloseRoundedIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={estacionFormStyles.content}>
          {error && (
            <Alert
              severity="error"
              sx={estacionFormStyles.alert}
            >
              {error}
            </Alert>
          )}

          <Box sx={estacionFormStyles.formGrid}>
            <TextField
              name="codigo"
              label="Código"
              value={form.codigo}
              onChange={handleChange}
              placeholder="Ejemplo: EST-001"
              required
              disabled={saving}
              slotProps={{
                htmlInput: {
                  maxLength: 20,
                },
              }}
              sx={estacionFormStyles.field}
            />

            <TextField
              name="nombre"
              label="Nombre de la estación"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ejemplo: Plaza Municipal"
              required
              disabled={saving}
              slotProps={{
                htmlInput: {
                  maxLength: 100,
                },
              }}
              sx={estacionFormStyles.field}
            />

            <TextField
              name="municipalidad"
              label="Municipalidad"
              value={form.municipalidad}
              onChange={handleChange}
              placeholder="Ejemplo: Guatemala"
              required
              disabled={saving}
              slotProps={{
                htmlInput: {
                  maxLength: 100,
                },
              }}
              sx={estacionFormStyles.field}
            />

            <TextField
              select
              name="estado"
              label="Estado"
              value={form.estado}
              onChange={handleChange}
              disabled={saving}
              sx={estacionFormStyles.field}
            >
              <MenuItem value="OPERATIVA">
                Operativa
              </MenuItem>

              <MenuItem value="INACTIVA">
                Inactiva
              </MenuItem>

              <MenuItem value="MANTENIMIENTO">
                En mantenimiento
              </MenuItem>
            </TextField>

            <TextField
              name="direccion"
              label="Dirección o ubicación"
              value={form.direccion}
              onChange={handleChange}
              placeholder="Ejemplo: 6a avenida, zona 1"
              required
              disabled={saving}
              slotProps={{
                htmlInput: {
                  maxLength: 180,
                },
              }}
              sx={{
                ...estacionFormStyles.field,
                ...estacionFormStyles.fullWidthField,
              }}
            />

            <Box sx={estacionFormStyles.coordinatesSection}>
              <Typography
                sx={estacionFormStyles.coordinatesTitle}
              >
                Coordenadas geográficas
              </Typography>

              <Typography
                sx={estacionFormStyles.coordinatesDescription}
              >
                Las coordenadas son opcionales, pero ambas deben
                ingresarse si deseas registrar la ubicación exacta.
              </Typography>

              <Box sx={estacionFormStyles.coordinatesGrid}>
                <TextField
                  type="number"
                  name="latitud"
                  label="Latitud"
                  value={form.latitud}
                  onChange={handleChange}
                  placeholder="14.6349"
                  disabled={saving}
                  slotProps={{
                    htmlInput: {
                      step: 'any',
                      min: -90,
                      max: 90,
                    },
                  }}
                  sx={estacionFormStyles.field}
                />

                <TextField
                  type="number"
                  name="longitud"
                  label="Longitud"
                  value={form.longitud}
                  onChange={handleChange}
                  placeholder="-90.5069"
                  disabled={saving}
                  slotProps={{
                    htmlInput: {
                      step: 'any',
                      min: -180,
                      max: 180,
                    },
                  }}
                  sx={estacionFormStyles.field}
                />
              </Box>
            </Box>

            <TextField
              name="descripcion"
              label="Descripción"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Descripción general de la estación"
              multiline
              minRows={3}
              disabled={saving}
              slotProps={{
                htmlInput: {
                  maxLength: 300,
                },
              }}
              sx={{
                ...estacionFormStyles.field,
                ...estacionFormStyles.fullWidthField,
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={estacionFormStyles.actions}>
          <Button
            type="button"
            variant="outlined"
            onClick={handleClose}
            disabled={saving}
            sx={estacionFormStyles.cancelButton}
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
            sx={estacionFormStyles.submitButton}
          >
            {saving
              ? 'Guardando...'
              : editing
                ? 'Guardar cambios'
                : 'Registrar estación'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default EstacionForm