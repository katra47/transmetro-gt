import { useState } from 'react'

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'

import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'

import {
  createPilot,
  updatePilot,
} from './pilotosService'

import pilotoFormStyles from './PilotoForm.styles'

const emptyForm = {
  codigo: '',
  nombres: '',
  apellidos: '',
  dpi: '',
  numeroLicencia: '',
  tipoLicencia: '',
  telefono: '',
  correo: '',
  fechaNacimiento: '',
  fechaContratacion: '',
  direccion: '',
  municipio: '',
  departamento: 'Guatemala',
  estado: 'ACTIVO',
}

function createInitialForm(pilot) {
  if (!pilot) {
    return emptyForm
  }

  return {
    codigo: pilot.codigo ?? '',
    nombres: pilot.nombres ?? '',
    apellidos: pilot.apellidos ?? '',
    dpi: pilot.dpi ?? '',
    numeroLicencia: pilot.numeroLicencia ?? '',
    tipoLicencia: pilot.tipoLicencia ?? '',
    telefono: pilot.telefono ?? '',
    correo: pilot.correo ?? '',
    fechaNacimiento: pilot.fechaNacimiento ?? '',
    fechaContratacion: pilot.fechaContratacion ?? '',
    direccion: pilot.direccion ?? '',
    municipio: pilot.municipio ?? '',
    departamento: pilot.departamento ?? 'Guatemala',
    estado: pilot.estado ?? 'ACTIVO',
  }
}

function PilotoFormDialog({ pilot, onClose }) {
  const [form, setForm] = useState(() =>
    createInitialForm(pilot),
  )

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const editing = Boolean(pilot?.id)

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  const handleDpiChange = (event) => {
    const numericValue = event.target.value
      .replace(/\D/g, '')
      .slice(0, 13)

    setForm((currentForm) => ({
      ...currentForm,
      dpi: numericValue,
    }))
  }

  const handlePhoneChange = (event) => {
    const numericValue = event.target.value
      .replace(/\D/g, '')
      .slice(0, 8)

    setForm((currentForm) => ({
      ...currentForm,
      telefono: numericValue,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setSaving(true)
    setError('')

    try {
      if (editing) {
        await updatePilot(pilot.id, form)
      } else {
        await createPilot(form)
      }

      onClose()
    } catch (submitError) {
      console.error(
        'Error al guardar el piloto:',
        submitError,
      )

      setError(
        submitError.message ||
          'No fue posible guardar la información del piloto.',
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
      open
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      slotProps={{
        paper: {
          sx: pilotoFormStyles.dialogPaper,
        },
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
      >
        <Box sx={pilotoFormStyles.header}>
          <Box sx={pilotoFormStyles.headerInformation}>
            <Box sx={pilotoFormStyles.headerIcon}>
              <BadgeRoundedIcon />
            </Box>

            <Box>
              <Typography
                component="h2"
                sx={pilotoFormStyles.title}
              >
                {editing
                  ? 'Editar piloto'
                  : 'Registrar piloto'}
              </Typography>

              <Typography sx={pilotoFormStyles.subtitle}>
                Información personal, licencia y residencia
              </Typography>
            </Box>
          </Box>

          <IconButton
            type="button"
            onClick={handleClose}
            disabled={saving}
            aria-label="Cerrar formulario"
            sx={pilotoFormStyles.closeButton}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        <Box sx={pilotoFormStyles.content}>
          {error && (
            <Alert
              severity="error"
              onClose={() => setError('')}
              sx={pilotoFormStyles.errorAlert}
            >
              {error}
            </Alert>
          )}

          <Box sx={pilotoFormStyles.section}>
            <Typography sx={pilotoFormStyles.sectionTitle}>
              Información personal
            </Typography>

            <Box sx={pilotoFormStyles.formGrid}>
              <TextField
                name="codigo"
                label="Código del piloto"
                value={form.codigo}
                onChange={handleChange}
                required
                fullWidth
                disabled={saving}
                slotProps={{
                  htmlInput: {
                    maxLength: 20,
                  },
                }}
              />

              <TextField
                name="dpi"
                label="DPI"
                value={form.dpi}
                onChange={handleDpiChange}
                required
                fullWidth
                disabled={saving}
                helperText={`${form.dpi.length}/13 dígitos`}
                slotProps={{
                  htmlInput: {
                    maxLength: 13,
                    inputMode: 'numeric',
                  },
                }}
              />

              <TextField
                name="nombres"
                label="Nombres"
                value={form.nombres}
                onChange={handleChange}
                required
                fullWidth
                disabled={saving}
              />

              <TextField
                name="apellidos"
                label="Apellidos"
                value={form.apellidos}
                onChange={handleChange}
                required
                fullWidth
                disabled={saving}
              />

              <TextField
                name="fechaNacimiento"
                label="Fecha de nacimiento"
                type="date"
                value={form.fechaNacimiento}
                onChange={handleChange}
                fullWidth
                disabled={saving}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />

              <TextField
                name="fechaContratacion"
                label="Fecha de contratación"
                type="date"
                value={form.fechaContratacion}
                onChange={handleChange}
                fullWidth
                disabled={saving}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            </Box>
          </Box>

          <Box sx={pilotoFormStyles.section}>
            <Typography sx={pilotoFormStyles.sectionTitle}>
              Licencia de conducir
            </Typography>

            <Box sx={pilotoFormStyles.formGrid}>
              <TextField
                name="numeroLicencia"
                label="Número de licencia"
                value={form.numeroLicencia}
                onChange={handleChange}
                required
                fullWidth
                disabled={saving}
              />

              <TextField
                select
                name="tipoLicencia"
                label="Tipo de licencia"
                value={form.tipoLicencia}
                onChange={handleChange}
                required
                fullWidth
                disabled={saving}
              >
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

              <TextField
                select
                name="estado"
                label="Estado"
                value={form.estado}
                onChange={handleChange}
                fullWidth
                disabled={saving}
              >
                <MenuItem value="ACTIVO">
                  Activo
                </MenuItem>

                <MenuItem value="INACTIVO">
                  Inactivo
                </MenuItem>

                <MenuItem value="SUSPENDIDO">
                  Suspendido
                </MenuItem>
              </TextField>
            </Box>
          </Box>

          <Box sx={pilotoFormStyles.section}>
            <Typography sx={pilotoFormStyles.sectionTitle}>
              Comunicación y residencia
            </Typography>

            <Box sx={pilotoFormStyles.formGrid}>
              <TextField
                name="telefono"
                label="Teléfono"
                value={form.telefono}
                onChange={handlePhoneChange}
                required
                fullWidth
                disabled={saving}
                helperText={`${form.telefono.length}/8 dígitos`}
                slotProps={{
                  htmlInput: {
                    maxLength: 8,
                    inputMode: 'numeric',
                  },
                }}
              />

              <TextField
                name="correo"
                label="Correo electrónico"
                type="email"
                value={form.correo}
                onChange={handleChange}
                fullWidth
                disabled={saving}
              />

              <TextField
                name="departamento"
                label="Departamento"
                value={form.departamento}
                onChange={handleChange}
                required
                fullWidth
                disabled={saving}
              />

              <TextField
                name="municipio"
                label="Municipio"
                value={form.municipio}
                onChange={handleChange}
                required
                fullWidth
                disabled={saving}
              />

              <TextField
                name="direccion"
                label="Dirección de residencia"
                value={form.direccion}
                onChange={handleChange}
                required
                fullWidth
                multiline
                minRows={2}
                disabled={saving}
                sx={pilotoFormStyles.fullWidthField}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={pilotoFormStyles.actions}>
          <Button
            type="button"
            variant="outlined"
            onClick={handleClose}
            disabled={saving}
            sx={pilotoFormStyles.cancelButton}
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
                  sx={pilotoFormStyles.progress}
                />
              ) : (
                <SaveRoundedIcon />
              )
            }
            sx={pilotoFormStyles.saveButton}
          >
            {saving
              ? 'Guardando...'
              : editing
                ? 'Guardar cambios'
                : 'Registrar piloto'}
          </Button>
        </Box>
      </Box>
    </Dialog>
  )
}

function PilotoForm({ open, pilot, onClose }) {
  if (!open) {
    return null
  }

  return (
    <PilotoFormDialog
      pilot={pilot}
      onClose={onClose}
    />
  )
}

export default PilotoForm