import { useEffect, useState } from 'react'

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
import DirectionsBusRoundedIcon from '@mui/icons-material/DirectionsBusRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'

import {
  actualizarBus,
  registrarBus,
} from '../../services/busesService'

import {
  dialogPaperStyles,
  dialogTitleStyles,
  headerStyles,
  headerContentStyles,
  headerIconStyles,
  titleStyles,
  subtitleStyles,
  closeButtonStyles,
  contentStyles,
  formGridStyles,
  fieldStyles,
  actionsStyles,
  cancelButtonStyles,
  submitButtonStyles,
} from './BusForm.styles'

/* ==========================================
   VALORES INICIALES
========================================== */

const valoresIniciales = {
  codigoInterno: '',
  placa: '',
  marca: '',
  modelo: '',
  anio: '',
  capacidadMaxima: '',
  parqueoId: '',
  estado: 'DISPONIBLE',
}

/* ==========================================
   COMPONENTE
========================================== */

function BusForm({
  open,
  onClose,
  onSaved,
  busEditar = null,
}) {
  const [formulario, setFormulario] =
    useState(valoresIniciales)

  const [guardando, setGuardando] =
    useState(false)

  const [error, setError] =
    useState('')

  /* ========================================
     MODO EDICIÓN
  ======================================== */

  const modoEdicion = Boolean(busEditar?.id)

  /* ========================================
     CARGAR DATOS DEL BUS
  ======================================== */

  useEffect(() => {
    if (!open) {
      return
    }

    setError('')

    if (busEditar) {
      setFormulario({
        codigoInterno:
          busEditar.codigoInterno || '',

        placa:
          busEditar.placa || '',

        marca:
          busEditar.marca || '',

        modelo:
          busEditar.modelo || '',

        anio:
          busEditar.anio || '',

        capacidadMaxima:
          busEditar.capacidadMaxima || '',

        parqueoId:
          busEditar.parqueoId || '',

        estado:
          busEditar.estado || 'DISPONIBLE',
      })

      return
    }

    setFormulario(valoresIniciales)
  }, [open, busEditar])

  /* ========================================
     CAMBIO DE CAMPOS
  ======================================== */

  const manejarCambio = (evento) => {
    const {
      name,
      value,
    } = evento.target

    setFormulario(
      (anterior) => ({
        ...anterior,
        [name]: value,
      }),
    )

    if (error) {
      setError('')
    }
  }

  /* ========================================
     VALIDACIONES
  ======================================== */

  const validarFormulario = () => {
    if (!formulario.codigoInterno.trim()) {
      return 'El código interno es obligatorio.'
    }

    if (!formulario.placa.trim()) {
      return 'La placa es obligatoria.'
    }

    if (!formulario.marca.trim()) {
      return 'La marca es obligatoria.'
    }

    if (!formulario.modelo.trim()) {
      return 'El modelo es obligatorio.'
    }

    const anio =
      Number(formulario.anio)

    const anioActual =
      new Date().getFullYear()

    if (
      !anio ||
      anio < 1990 ||
      anio > anioActual + 1
    ) {
      return `El año debe estar entre 1990 y ${
        anioActual + 1
      }.`
    }

    if (
      Number(formulario.capacidadMaxima) <= 0
    ) {
      return 'La capacidad máxima debe ser mayor que cero.'
    }

    if (!formulario.parqueoId.trim()) {
      return 'Debe indicar el parqueo asignado.'
    }

    if (!formulario.estado) {
      return 'Debe seleccionar un estado.'
    }

    return null
  }

  /* ========================================
     GUARDAR / ACTUALIZAR
  ======================================== */

  const manejarEnvio = async (evento) => {
    evento.preventDefault()

    const errorValidacion =
      validarFormulario()

    if (errorValidacion) {
      setError(errorValidacion)
      return
    }

    try {
      setGuardando(true)
      setError('')

      const datosBus = {
        codigoInterno:
          formulario.codigoInterno.trim(),

        placa:
          formulario.placa
            .trim()
            .toUpperCase(),

        marca:
          formulario.marca.trim(),

        modelo:
          formulario.modelo.trim(),

        anio:
          Number(formulario.anio),

        capacidadMaxima:
          Number(
            formulario.capacidadMaxima,
          ),

        parqueoId:
          formulario.parqueoId.trim(),

        estado:
          formulario.estado,
      }

      /* ====================================
         EDITAR
      ==================================== */

      if (modoEdicion) {
        await actualizarBus(
          busEditar.id,
          datosBus,
        )
      }

      /* ====================================
         CREAR
      ==================================== */

      else {
        await registrarBus(datosBus)
      }

      setFormulario(valoresIniciales)

      if (onSaved) {
        onSaved()
      }
    } catch (err) {
      console.error(
        'Error guardando bus:',
        err,
      )

      setError(
        err?.message ||
          'No fue posible guardar el bus.',
      )
    } finally {
      setGuardando(false)
    }
  }

  /* ========================================
     CERRAR
  ======================================== */

  const manejarCierre = () => {
    if (guardando) {
      return
    }

    setFormulario(valoresIniciales)
    setError('')

    if (onClose) {
      onClose()
    }
  }

  /* ========================================
     INTERFAZ
  ======================================== */

  return (
    <Dialog
      open={open}
      onClose={manejarCierre}
      fullWidth
      maxWidth="md"
      slotProps={{
        paper: {
          sx: dialogPaperStyles,
        },
      }}
    >
      <Box
        component="form"
        onSubmit={manejarEnvio}
      >
        {/* =================================
            ENCABEZADO
        ================================= */}

        <DialogTitle sx={dialogTitleStyles}>
          <Box sx={headerStyles}>
            <Box sx={headerContentStyles}>
              <Box sx={headerIconStyles}>
                <DirectionsBusRoundedIcon />
              </Box>

              <Box>
                <Typography sx={titleStyles}>
                  {modoEdicion
                    ? 'Editar bus'
                    : 'Agregar bus'}
                </Typography>

                <Typography
                  sx={subtitleStyles}
                >
                  {modoEdicion
                    ? 'Actualiza la información del bus seleccionado.'
                    : 'Registra una nueva unidad en el sistema.'}
                </Typography>
              </Box>

              <IconButton
                onClick={manejarCierre}
                disabled={guardando}
                sx={closeButtonStyles}
              >
                <CloseRoundedIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        {/* =================================
            CONTENIDO
        ================================= */}

        <DialogContent sx={contentStyles}>
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2.5,
                borderRadius: '12px',
              }}
            >
              {error}
            </Alert>
          )}

          <Box sx={formGridStyles}>
            {/* CÓDIGO */}

            <TextField
              label="Código interno"
              name="codigoInterno"
              value={
                formulario.codigoInterno
              }
              onChange={manejarCambio}
              placeholder="BUS-001"
              required
              fullWidth
              sx={fieldStyles}
            />

            {/* PLACA */}

            <TextField
              label="Placa"
              name="placa"
              value={formulario.placa}
              onChange={manejarCambio}
              placeholder="C123ABC"
              required
              fullWidth
              sx={fieldStyles}
            />

            {/* MARCA */}

            <TextField
              label="Marca"
              name="marca"
              value={formulario.marca}
              onChange={manejarCambio}
              placeholder="Mercedes-Benz"
              required
              fullWidth
              sx={fieldStyles}
            />

            {/* MODELO */}

            <TextField
              label="Modelo"
              name="modelo"
              value={formulario.modelo}
              onChange={manejarCambio}
              placeholder="Torino"
              required
              fullWidth
              sx={fieldStyles}
            />

            {/* AÑO */}

            <TextField
              label="Año"
              name="anio"
              type="number"
              value={formulario.anio}
              onChange={manejarCambio}
              required
              fullWidth
              sx={fieldStyles}
              slotProps={{
                htmlInput: {
                  min: 1990,
                  max:
                    new Date().getFullYear() +
                    1,
                },
              }}
            />

            {/* CAPACIDAD */}

            <TextField
              label="Capacidad máxima"
              name="capacidadMaxima"
              type="number"
              value={
                formulario.capacidadMaxima
              }
              onChange={manejarCambio}
              placeholder="80"
              required
              fullWidth
              sx={fieldStyles}
              slotProps={{
                htmlInput: {
                  min: 1,
                },
              }}
            />

            {/* PARQUEO */}

            <TextField
              label="Parqueo asignado"
              name="parqueoId"
              value={
                formulario.parqueoId
              }
              onChange={manejarCambio}
              placeholder="a1"
              helperText="Identificador del parqueo asignado."
              required
              fullWidth
              sx={fieldStyles}
            />

            {/* ESTADO */}

            <TextField
              select
              label="Estado"
              name="estado"
              value={formulario.estado}
              onChange={manejarCambio}
              required
              fullWidth
              sx={fieldStyles}
            >
              <MenuItem value="DISPONIBLE">
                Disponible
              </MenuItem>

              <MenuItem value="EN_RUTA">
                En ruta
              </MenuItem>

              <MenuItem value="MANTENIMIENTO">
                Mantenimiento
              </MenuItem>

              <MenuItem value="FUERA_DE_SERVICIO">
                Fuera de servicio
              </MenuItem>
            </TextField>
          </Box>
        </DialogContent>

        {/* =================================
            BOTONES
        ================================= */}

        <DialogActions sx={actionsStyles}>
          <Button
            type="button"
            variant="outlined"
            onClick={manejarCierre}
            disabled={guardando}
            sx={cancelButtonStyles}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={guardando}
            startIcon={
              guardando ? (
                <CircularProgress
                  size={17}
                  color="inherit"
                />
              ) : (
                <SaveRoundedIcon />
              )
            }
            sx={submitButtonStyles}
          >
            {guardando
              ? 'Guardando...'
              : modoEdicion
                ? 'Guardar cambios'
                : 'Guardar bus'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default BusForm