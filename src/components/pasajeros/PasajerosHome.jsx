import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material'

import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import AltRouteRoundedIcon from '@mui/icons-material/AltRouteRounded'
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded'

import { useAuth } from '../usuarios/AuthContext'
import MapaEstaciones from './MapaEstaciones'

import {
  suscribirseEstacionesPublicas,
  filtrarEstaciones,
  obtenerEnlaceMapa,
} from './pasajerosService'

import {
  pasajerosHomeStyles as styles,
} from './PasajerosHome.styles'

function PasajerosHome() {
  const {
    firebaseUser,
    isPassenger,
    loading: cargandoSesion,
  } = useAuth()

  const [estaciones, setEstaciones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const [busqueda, setBusqueda] = useState('')
  const [estacionSeleccionadaId, setEstacionSeleccionadaId] =
    useState('')

  useEffect(() => {
    let vigente = true

    const cancelar = suscribirseEstacionesPublicas(
      (registros) => {
        if (!vigente) return

        setEstaciones(registros)
        setCargando(false)
        setError('')
      },

      () => {
        if (!vigente) return

        setEstaciones([])
        setCargando(false)

        setError(
          'No fue posible consultar las estaciones. Comprueba tu conexión e intenta nuevamente más tarde.',
        )
      },
    )

    return () => {
      vigente = false
      cancelar()
    }
  }, [])

  const estacionesFiltradas = useMemo(
    () => filtrarEstaciones(estaciones, busqueda),
    [estaciones, busqueda],
  )

  const estacionSeleccionada = estaciones.find(
    (estacion) => estacion.id === estacionSeleccionadaId,
  )

  const enlaceSeleccionada = obtenerEnlaceMapa(
    estacionSeleccionada?.coordenadas,
  )

  const seleccionarEstacion = (id) => {
    setEstacionSeleccionadaId(id)
  }

  const nombrePasajero = (
    firebaseUser?.displayName || 'Pasajero'
  )

  return (
    <Box sx={styles.pagina}>
      <Paper elevation={0} sx={styles.encabezado}>
        <Chip
          label={isPassenger ? 'Portal del pasajero' : 'Consulta pública'}
          size="small"
          sx={styles.chipEncabezado}
        />

        <Typography component="h1" sx={styles.titulo}>
          {cargandoSesion
            ? 'Bienvenido al Transmetro'
            : isPassenger
              ? `Hola, ${nombrePasajero}`
              : 'Explora las estaciones del Transmetro'}
        </Typography>

        <Typography sx={styles.descripcion}>
          Encuentra estaciones, consulta sus ubicaciones
          y revisa los trayectos de las líneas.
        </Typography>
      </Paper>

      <Box sx={styles.accesosGrid}>
        <Paper elevation={0} sx={styles.accesoTarjeta}>
          <Box sx={styles.accesoIcono}>
            <AltRouteRoundedIcon />
          </Box>

          <Typography component="h2" sx={styles.accesoTitulo}>
            Líneas y trayectos
          </Typography>

          <Typography sx={styles.textoSecundario}>
            Consulta las líneas disponibles y sus estaciones
            de ida y regreso.
          </Typography>

          <Button
            component={Link}
            to="/pasajeros"
            sx={styles.botonTexto}
          >
            Consultar líneas
          </Button>
        </Paper>

        {isPassenger && (
          <Paper elevation={0} sx={styles.accesoTarjeta}>
            <Box sx={styles.accesoIcono}>
              <CreditCardRoundedIcon />
            </Box>

            <Typography component="h2" sx={styles.accesoTitulo}>
              Mis pagos
            </Typography>

            <Typography sx={styles.textoSecundario}>
              Próximamente podrás consultar tus opciones
              de pagos desde este portal.
            </Typography>

            <Chip
              label="Próximamente"
              size="small"
              variant="outlined"
            />
          </Paper>
        )}
      </Box>

      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      <Paper elevation={0} sx={styles.seccion}>
        <Typography component="h2" sx={styles.seccionTitulo}>
          Mapa de estaciones
        </Typography>

        <Typography sx={styles.textoSecundario}>
          Selecciona un marcador para ver el nombre,
          estado y dirección de la estación.
        </Typography>

        {cargando ? (
          <Box sx={styles.cargando}>
            <CircularProgress />
            <Typography>Cargando estaciones...</Typography>
          </Box>
        ) : error ? (
          <Box sx={styles.vacio}>
            <Typography>
              El mapa de estaciones no está disponible.
            </Typography>
          </Box>
        ) : estaciones.length === 0 ? (
          <Box sx={styles.vacio}>
            <Typography>
              No hay estaciones disponibles para consultar.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ mt: 3 }}>
            <MapaEstaciones
              estaciones={estaciones}
              estacionSeleccionadaId={
                estacionSeleccionada?.id || ''
              }
              onSeleccionarEstacion={seleccionarEstacion}
            />
          </Box>
        )}
      </Paper>

      {estacionSeleccionada && (
        <Paper elevation={0} sx={styles.seccion}>
          <Box sx={styles.detalleEncabezado}>
            <Typography component="h2" sx={styles.seccionTitulo}>
              {estacionSeleccionada.nombre}
            </Typography>

            <Button
              onClick={() => setEstacionSeleccionadaId('')}
              sx={styles.botonTexto}
            >
              Quitar selección
            </Button>
          </Box>

          <Chip
            label={
              estacionSeleccionada.estado === 'MANTENIMIENTO'
                ? 'En mantenimiento'
                : 'Operativa'
            }
            color={
              estacionSeleccionada.estado === 'MANTENIMIENTO'
                ? 'warning'
                : 'success'
            }
            size="small"
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <Typography sx={styles.textoSecundario}>
            {estacionSeleccionada.direccion ||
              'Dirección no registrada'}
          </Typography>

          {estacionSeleccionada.municipalidad && (
            <Typography sx={styles.textoSecundario}>
              {estacionSeleccionada.municipalidad}
            </Typography>
          )}

          {enlaceSeleccionada ? (
            <Button
              component="a"
              href={enlaceSeleccionada}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<LocationOnRoundedIcon />}
              sx={styles.botonTexto}
            >
              Abrir ubicación en Google Maps
            </Button>
          ) : (
            <Typography sx={styles.textoSecundario}>
              Esta estación no tiene una ubicación válida
              registrada en el mapa.
            </Typography>
          )}
        </Paper>
      )}

      <Paper elevation={0} sx={styles.seccion}>
        <Typography component="h2" sx={styles.seccionTitulo}>
          Encuentra una estación
        </Typography>

        <TextField
          fullWidth
          label="Buscar estación"
          placeholder="Nombre, código, dirección o municipalidad"
          value={busqueda}
          onChange={(evento) => {
            setBusqueda(evento.target.value)
          }}
          disabled={cargando || Boolean(error)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon />
                </InputAdornment>
              ),
            },
          }}
          sx={styles.buscador}
        />

        {!cargando && !error && (
          <>
            <Typography sx={styles.textoSecundario}>
              {estacionesFiltradas.length} estaciones encontradas
            </Typography>

            {estacionesFiltradas.length === 0 ? (
              <Box sx={styles.vacio}>
                <Typography>
                  No se encontraron estaciones con esa búsqueda.
                </Typography>
              </Box>
            ) : (
              <Box sx={styles.estacionesGrid}>
                {estacionesFiltradas.map((estacion) => {
                  const tieneUbicacion = Boolean(
                    obtenerEnlaceMapa(estacion.coordenadas),
                  )

                  return (
                    <Paper
                      key={estacion.id}
                      elevation={0}
                      sx={{
                        ...styles.estacionTarjeta,
                        ...(estacion.id === estacionSeleccionada?.id
                          ? styles.estacionSeleccionada
                          : {}),
                      }}
                    >
                      <Typography
                        component="h3"
                        sx={styles.estacionNombre}
                      >
                        {estacion.nombre}
                      </Typography>

                      <Chip
                        label={
                          estacion.estado === 'MANTENIMIENTO'
                            ? 'En mantenimiento'
                            : 'Operativa'
                        }
                        color={
                          estacion.estado === 'MANTENIMIENTO'
                            ? 'warning'
                            : 'success'
                        }
                        size="small"
                        variant="outlined"
                      />

                      <Typography sx={styles.textoSecundario}>
                        {estacion.direccion ||
                          'Dirección no registrada'}
                      </Typography>

                      <Button
                        startIcon={<LocationOnRoundedIcon />}
                        onClick={() => seleccionarEstacion(estacion.id)}
                        sx={styles.botonTexto}
                      >
                        {tieneUbicacion
                          ? 'Seleccionar en el mapa'
                          : 'Ver información'}
                      </Button>
                    </Paper>
                  )
                })}
              </Box>
            )}
          </>
        )}
      </Paper>
    </Box>
  )
}

export default PasajerosHome