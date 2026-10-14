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
import RouteRoundedIcon from '@mui/icons-material/RouteRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'

import {
  actualizarRecorrido,
  crearRecorrido,
} from './recorridosService'

import recorridoFormStyles from './RecorridoForm.styles'

const formularioInicial = {
  lineaId: '',
  busId: '',
  pilotoId: '',
  parqueoId: '',
  estado: 'PROGRAMADO',
  observaciones: '',
}

const estadosRecorrido = [
  {
    value: 'PROGRAMADO',
    label: 'Programado',
  },
  {
    value: 'EN_CURSO',
    label: 'En curso',
  },
  {
    value: 'FINALIZADO',
    label: 'Finalizado',
  },
  {
    value: 'FALLA_MECANICA',
    label: 'Falla mecánica',
  },
]

const obtenerNombrePiloto = (piloto) => {
  return (
    piloto.nombreCompleto ||
    [piloto.nombres, piloto.apellidos]
      .filter(Boolean)
      .join(' ') ||
    piloto.nombre ||
    piloto.codigo ||
    'Piloto'
  )
}

const obtenerNombreBus = (bus) => {
  const identificador =
    bus.codigo ||
    bus.numeroUnidad ||
    bus.numero ||
    'Bus'

  return bus.placa
    ? `${identificador} - ${bus.placa}`
    : identificador
}

function RecorridoForm({
  open,
  recorrido = null,
  lineas = [],
  buses = [],
  pilotos = [],
  parqueos = [],
  onClose,
  onSaved,
}) {
  const [form, setForm] = useState(() => ({
    ...formularioInicial,
    ...(recorrido ?? {}),
    estado: recorrido?.estado || 'PROGRAMADO',
  }))

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const editing = Boolean(recorrido?.id)

  /*
   * Si estamos editando un recorrido, permitimos que los
   * elementos actualmente seleccionados sigan apareciendo
   * aunque después hayan cambiado de estado.
   */

  const lineasDisponibles = lineas.filter(
    (linea) =>
      linea.estado === 'ACTIVA' ||
      linea.id === form.lineaId,
  )

  const busesDisponibles = buses.filter(
    (bus) =>
      ![
        'INACTIVO',
        'MANTENIMIENTO',
        'FUERA_SERVICIO',
      ].includes(bus.estado) ||
      bus.id === form.busId,
  )

  const pilotosDisponibles = pilotos.filter(
    (piloto) =>
      !['INACTIVO', 'SUSPENDIDO'].includes(
        piloto.estado,
      ) ||
      piloto.id === form.pilotoId,
  )

  const parqueosDisponibles = parqueos.filter(
    (parqueo) =>
      !['INACTIVO', 'MANTENIMIENTO'].includes(
        parqueo.estado,
      ) ||
      parqueo.id === form.parqueoId,
  )

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))

    if (error) {
      setError('')
    }
  }

  const validateForm = () => {
    if (!form.lineaId) {
      return 'Debes seleccionar una línea.'
    }

    if (!form.busId) {
      return 'Debes seleccionar un bus.'
    }

    if (!form.pilotoId) {
      return 'Debes seleccionar un piloto.'
    }

    if (!form.parqueoId) {
      return 'Debes seleccionar un parqueo de salida.'
    }

    if (!form.estado) {
      return 'Debes seleccionar el estado del recorrido.'
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
        await actualizarRecorrido(
          recorrido.id,
          form,
        )
      } else {
        await crearRecorrido(form)
      }

      if (onSaved) {
        onSaved(
          editing
            ? 'El recorrido fue actualizado correctamente.'
            : 'El recorrido fue creado correctamente.',
        )
      }

      onClose()
    } catch (saveError) {
      console.error(
        'Error al guardar el recorrido:',
        saveError,
      )

      setError(
        saveError.message ||
          'No fue posible guardar el recorrido.',
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
          sx: recorridoFormStyles.dialogPaper,
        },
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={recorridoFormStyles.form}
      >
        <DialogTitle
          sx={recorridoFormStyles.dialogTitle}
        >
          <Box sx={recorridoFormStyles.header}>
            <Box
              sx={recorridoFormStyles.headerContent}
            >
              <Box
                sx={recorridoFormStyles.headerIcon}
              >
                <RouteRoundedIcon />
              </Box>

              <Box>
                <Typography
                  component="h2"
                  sx={recorridoFormStyles.title}
                >
                  {editing
                    ? 'Editar recorrido'
                    : 'Crear recorrido'}
                </Typography>

                <Typography
                  sx={recorridoFormStyles.subtitle}
                >
                  Selecciona la línea, bus, piloto,
                  parqueo y estado del recorrido.
                </Typography>
              </Box>

              <IconButton
                type="button"
                aria-label="Cerrar formulario"
                onClick={handleClose}
                disabled={saving}
                sx={recorridoFormStyles.closeButton}
              >
                <CloseRoundedIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent
          sx={recorridoFormStyles.content}
        >
          {error && (
            <Alert
              severity="error"
              sx={recorridoFormStyles.alert}
            >
              {error}
            </Alert>
          )}

          <Box sx={recorridoFormStyles.formGrid}>
            {/* LÍNEA */}

            <TextField
              select
              name="lineaId"
              label="Línea"
              value={form.lineaId}
              onChange={handleChange}
              required
              disabled={saving}
              sx={recorridoFormStyles.field}
            >
              {lineasDisponibles.map((linea) => (
                <MenuItem
                  key={linea.id}
                  value={linea.id}
                >
                  {linea.codigo
                    ? `${linea.codigo} - `
                    : ''}
                  {linea.nombre}
                </MenuItem>
              ))}
            </TextField>

            {/* BUS */}

            <TextField
              select
              name="busId"
              label="Bus"
              value={form.busId}
              onChange={handleChange}
              required
              disabled={saving}
              sx={recorridoFormStyles.field}
            >
              {busesDisponibles.map((bus) => (
                <MenuItem
                  key={bus.id}
                  value={bus.id}
                >
                  {obtenerNombreBus(bus)}
                </MenuItem>
              ))}
            </TextField>

            {/* PILOTO */}

            <TextField
              select
              name="pilotoId"
              label="Piloto"
              value={form.pilotoId}
              onChange={handleChange}
              required
              disabled={saving}
              sx={recorridoFormStyles.field}
            >
              {pilotosDisponibles.map((piloto) => (
                <MenuItem
                  key={piloto.id}
                  value={piloto.id}
                >
                  {obtenerNombrePiloto(piloto)}
                </MenuItem>
              ))}
            </TextField>

            {/* PARQUEO */}

            <TextField
              select
              name="parqueoId"
              label="Parqueo asignado"
              value={form.parqueoId}
              onChange={handleChange}
              required
              disabled={saving}
              sx={recorridoFormStyles.field}
            >
              {parqueosDisponibles.map(
                (parqueo) => (
                  <MenuItem
                    key={parqueo.id}
                    value={parqueo.id}
                  >
                    {parqueo.codigo
                      ? `${parqueo.codigo} - `
                      : ''}
                    {parqueo.nombre}
                  </MenuItem>
                ),
              )}
            </TextField>

            {/* ESTADO */}

            <TextField
              select
              name="estado"
              label="Estado"
              value={form.estado}
              onChange={handleChange}
              required
              disabled={saving}
              sx={{
                ...recorridoFormStyles.field,
                ...recorridoFormStyles.fullWidthField,
              }}
            >
              {estadosRecorrido.map((estado) => (
                <MenuItem
                  key={estado.value}
                  value={estado.value}
                >
                  {estado.label}
                </MenuItem>
              ))}
            </TextField>

            {/* OBSERVACIONES */}

            <TextField
              name="observaciones"
              label="Observaciones"
              value={form.observaciones}
              onChange={handleChange}
              placeholder="Información adicional del recorrido"
              multiline
              minRows={3}
              disabled={saving}
              slotProps={{
                htmlInput: {
                  maxLength: 300,
                },
              }}
              sx={{
                ...recorridoFormStyles.field,
                ...recorridoFormStyles.fullWidthField,
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions
          sx={recorridoFormStyles.actions}
        >
          <Button
            type="button"
            variant="outlined"
            onClick={handleClose}
            disabled={saving}
            sx={recorridoFormStyles.cancelButton}
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
                  color="inherit"
                />
              ) : (
                <SaveRoundedIcon />
              )
            }
            sx={recorridoFormStyles.submitButton}
          >
            {saving
              ? 'Guardando...'
              : editing
                ? 'Guardar cambios'
                : 'Crear recorrido'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default RecorridoForm