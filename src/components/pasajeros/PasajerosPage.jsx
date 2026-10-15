import { useEffect, useMemo, useState } from 'react'

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  InputAdornment,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'

import AltRouteRoundedIcon from '@mui/icons-material/AltRouteRounded'
import TrainRoundedIcon from '@mui/icons-material/TrainRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'

import {
  suscribirseLineasPublicas,
  suscribirseEstacionesPublicas,
  suscribirseTrayectoLinea,
  filtrarLineas,
  filtrarEstaciones,
  prepararTrayecto,
  obtenerEnlaceMapa,
} from './pasajerosService'

import { pasajerosStyles as styles } from './PasajerosPage.styles'

function UbicacionEstacion({ coordenadas }) {
  const enlace = obtenerEnlaceMapa(coordenadas)

  if (!enlace) {
    return null
  }

  return (
    <Button
      component="a"
      href={enlace}
      target="_blank"
      rel="noopener noreferrer"
      startIcon={<LocationOnRoundedIcon />}
      sx={styles.botonTexto}
    >
      Ver ubicación
    </Button>
  )
}

function EstadoEstacion({ estado }) {
  const etiquetas = {
    OPERATIVA: 'Operativa',
    MANTENIMIENTO: 'En mantenimiento',
    NO_DISPONIBLE: 'Información no disponible',
  }

  const colores = {
    OPERATIVA: 'success',
    MANTENIMIENTO: 'warning',
    NO_DISPONIBLE: 'default',
  }

  return (
    <Chip
      label={etiquetas[estado] || 'Estado no disponible'}
      color={colores[estado] || 'default'}
      variant="outlined"
      size="small"
    />
  )
}

function PasajerosPage() {
  const [lineas, setLineas] = useState([])
  const [estaciones, setEstaciones] = useState([])

  const [cargandoLineas, setCargandoLineas] = useState(true)
  const [cargandoEstaciones, setCargandoEstaciones] = useState(true)

  const [errorLineas, setErrorLineas] = useState('')
  const [errorEstaciones, setErrorEstaciones] = useState('')

  const [busquedaLineas, setBusquedaLineas] = useState('')
  const [busquedaEstaciones, setBusquedaEstaciones] = useState('')

  const [lineaSeleccionadaId, setLineaSeleccionadaId] = useState('')
  const [sentido, setSentido] = useState('IDA')

  const [datosTrayecto, setDatosTrayecto] = useState({
    lineaId: '',
    asignaciones: [],
    cargando: false,
    error: '',
  })

  useEffect(() => {
    let vigente = true

    const cancelarLineas = suscribirseLineasPublicas(
      (registros) => {
        if (!vigente) return

        setLineas(registros)
        setCargandoLineas(false)
        setErrorLineas('')
      },
      () => {
        if (!vigente) return

        setLineas([])
        setCargandoLineas(false)
        setErrorLineas(
          'No fue posible consultar las líneas. Intenta nuevamente más tarde.',
        )
      },
    )

    const cancelarEstaciones = suscribirseEstacionesPublicas(
      (registros) => {
        if (!vigente) return

        setEstaciones(registros)
        setCargandoEstaciones(false)
        setErrorEstaciones('')
      },
      () => {
        if (!vigente) return

        setEstaciones([])
        setCargandoEstaciones(false)
        setErrorEstaciones(
          'No fue posible consultar las estaciones. Intenta nuevamente más tarde.',
        )
      },
    )

    return () => {
      vigente = false
      cancelarLineas()
      cancelarEstaciones()
    }
  }, [])

  // Una línea que deja de estar activa ya no puede seleccionarse.
  const lineaSeleccionada = lineas.find(
    (linea) => linea.id === lineaSeleccionadaId,
  )

  const lineaActivaId = lineaSeleccionada?.id || ''

  useEffect(() => {
    if (!lineaActivaId) {
      setDatosTrayecto({
        lineaId: '',
        asignaciones: [],
        cargando: false,
        error: '',
      })

      return undefined
    }

    let vigente = true

    setDatosTrayecto({
      lineaId: lineaActivaId,
      asignaciones: [],
      cargando: true,
      error: '',
    })

    const cancelar = suscribirseTrayectoLinea(
      lineaActivaId,
      (asignaciones) => {
        if (!vigente) return

        setDatosTrayecto({
          lineaId: lineaActivaId,
          asignaciones,
          cargando: false,
          error: '',
        })
      },
      () => {
        if (!vigente) return

        setDatosTrayecto({
          lineaId: lineaActivaId,
          asignaciones: [],
          cargando: false,
          error:
            'No fue posible consultar el trayecto de esta línea.',
        })
      },
    )

    return () => {
      vigente = false
      cancelar()
    }
  }, [lineaActivaId])

  const lineasFiltradas = useMemo(
    () => filtrarLineas(lineas, busquedaLineas),
    [lineas, busquedaLineas],
  )

  const estacionesFiltradas = useMemo(
    () => filtrarEstaciones(estaciones, busquedaEstaciones),
    [estaciones, busquedaEstaciones],
  )

  const trayectoActual = datosTrayecto.lineaId === lineaActivaId

  const cargandoTrayecto = Boolean(
    lineaActivaId &&
    (
      !trayectoActual ||
      datosTrayecto.cargando ||
      cargandoEstaciones
    ),
  )

  const errorTrayecto = trayectoActual
    ? datosTrayecto.error
    : ''

  const trayecto = useMemo(
    () => prepararTrayecto({
      asignaciones: datosTrayecto.lineaId === lineaActivaId
        ? datosTrayecto.asignaciones
        : [],
      estaciones,
      sentido,
    }),
    [datosTrayecto, lineaActivaId, estaciones, sentido],
  )

  const seleccionarLinea = (id) => {
    setLineaSeleccionadaId(id)
    setSentido('IDA')
  }

  return (
    <Box sx={styles.pagina}>
      <Paper elevation={0} sx={styles.encabezado}>
        <Chip
          label="Información para pasajeros"
          size="small"
          sx={styles.chipEncabezado}
        />

        <Typography component="h1" sx={styles.titulo}>
          Encuentra tu línea y tus estaciones
        </Typography>

        <Typography sx={styles.descripcion}>
          Consulta las líneas activas del Transmetro,
          sus trayectos de ida y regreso y la ubicación
          de las estaciones.
        </Typography>
      </Paper>

      <Paper elevation={0} sx={styles.seccion}>
        <Box sx={styles.seccionEncabezado}>
          <AltRouteRoundedIcon sx={styles.iconoSeccion} />

          <Typography component="h2" sx={styles.seccionTitulo}>
            Líneas disponibles
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Buscar línea"
          placeholder="Escribe el código o nombre de la línea"
          value={busquedaLineas}
          onChange={(evento) => {
            setBusquedaLineas(evento.target.value)
          }}
          disabled={cargandoLineas || Boolean(errorLineas)}
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

        {errorLineas ? (
          <Alert severity="error">{errorLineas}</Alert>
        ) : cargandoLineas ? (
          <Box sx={styles.cargando}>
            <CircularProgress />
            <Typography>Cargando líneas...</Typography>
          </Box>
        ) : lineasFiltradas.length === 0 ? (
          <Box sx={styles.vacio}>
            <Typography>
              {lineas.length === 0
                ? 'No hay líneas activas disponibles.'
                : 'No se encontraron líneas con esa búsqueda.'}
            </Typography>
          </Box>
        ) : (
          <Box sx={styles.lineasGrid}>
            {lineasFiltradas.map((linea) => (
              <Paper
                key={linea.id}
                elevation={0}
                sx={{
                  ...styles.lineaTarjeta,
                  ...(linea.id === lineaActivaId
                    ? styles.lineaSeleccionada
                    : {}),
                }}
              >
                <Chip
                  label={linea.codigo || 'Línea'}
                  size="small"
                  sx={styles.codigoLinea}
                />

                <Typography component="h3" sx={styles.lineaNombre}>
                  {linea.nombre}
                </Typography>

                <Typography sx={styles.textoSecundario}>
                  {linea.descripcion || 'Consulta las estaciones de esta línea.'}
                </Typography>

                <Button
                  onClick={() => seleccionarLinea(linea.id)}
                  endIcon={<ArrowForwardRoundedIcon />}
                  aria-pressed={linea.id === lineaActivaId}
                  sx={styles.botonTexto}
                >
                  {linea.id === lineaActivaId
                    ? 'Línea seleccionada'
                    : 'Ver trayecto'}
                </Button>
              </Paper>
            ))}
          </Box>
        )}
      </Paper>

      <Paper elevation={0} sx={styles.seccion}>
        <Box sx={styles.seccionEncabezado}>
          <AltRouteRoundedIcon sx={styles.iconoSeccion} />

          <Typography component="h2" sx={styles.seccionTitulo}>
            Trayecto de la línea
          </Typography>
        </Box>

        <TextField
          select
          fullWidth
          label="Selecciona una línea"
          value={lineaActivaId}
          onChange={(evento) => {
            seleccionarLinea(evento.target.value)
          }}
          disabled={cargandoLineas || Boolean(errorLineas)}
          sx={styles.selectorLinea}
        >
          <MenuItem value="">Selecciona una línea</MenuItem>

          {lineas.map((linea) => (
            <MenuItem key={linea.id} value={linea.id}>
              {[linea.codigo, linea.nombre]
                .filter(Boolean)
                .join(' - ')}
            </MenuItem>
          ))}
        </TextField>

        {!lineaSeleccionada ? (
          <Box sx={styles.vacio}>
            <Typography>
              Selecciona una línea para consultar sus estaciones.
            </Typography>
          </Box>
        ) : (
          <>
            <Typography component="h3" sx={styles.trayectoTitulo}>
              {lineaSeleccionada.nombre}
            </Typography>

            <Tabs
              value={sentido}
              onChange={(_, valor) => setSentido(valor)}
              aria-label="Sentido del trayecto"
              sx={styles.tabs}
            >
              <Tab label="Ida" value="IDA" />
              <Tab label="Regreso" value="REGRESO" />
            </Tabs>

            {errorTrayecto || errorEstaciones ? (
              <Alert severity="error">
                {errorTrayecto || errorEstaciones}
              </Alert>
            ) : cargandoTrayecto ? (
              <Box sx={styles.cargando}>
                <CircularProgress />
                <Typography>Cargando trayecto...</Typography>
              </Box>
            ) : trayecto.length === 0 ? (
              <Box sx={styles.vacio}>
                <Typography>
                  No hay estaciones registradas en este sentido.
                </Typography>
              </Box>
            ) : (
              <Box
                component="ol"
                aria-label={`Estaciones de ${
                  sentido === 'IDA' ? 'ida' : 'regreso'
                }`}
                sx={styles.trayectoLista}
              >
                {trayecto.map((estacion) => (
                  <Box
                    component="li"
                    key={estacion.id}
                    sx={styles.trayectoEstacion}
                  >
                    <Box sx={styles.numeroEstacion}>
                      {estacion.orden}
                    </Box>

                    <Box sx={styles.estacionContenido}>
                      <Typography
                        component="h4"
                        sx={styles.estacionNombre}
                      >
                        {estacion.nombre}
                      </Typography>

                      <EstadoEstacion estado={estacion.estado} />

                      {estacion.direccion && (
                        <Typography sx={styles.textoSecundario}>
                          {estacion.direccion}
                        </Typography>
                      )}

                      {estacion.orden > 1 &&
                        estacion.distanciaAnteriorKm !== null && (
                          <Typography sx={styles.textoSecundario}>
                            Distancia registrada desde la estación
                            anterior: {estacion.distanciaAnteriorKm}
                            {' '}km
                          </Typography>
                        )}

                      <UbicacionEstacion
                        coordenadas={estacion.coordenadas}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </>
        )}
      </Paper>

      <Paper elevation={0} sx={styles.seccion}>
        <Box sx={styles.seccionEncabezado}>
          <TrainRoundedIcon sx={styles.iconoSeccion} />

          <Typography component="h2" sx={styles.seccionTitulo}>
            Buscar estaciones
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Buscar estación"
          placeholder="Nombre, código, dirección o municipalidad"
          value={busquedaEstaciones}
          onChange={(evento) => {
            setBusquedaEstaciones(evento.target.value)
          }}
          disabled={
            cargandoEstaciones ||
            Boolean(errorEstaciones)
          }
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

        {errorEstaciones ? (
          <Alert severity="error">{errorEstaciones}</Alert>
        ) : cargandoEstaciones ? (
          <Box sx={styles.cargando}>
            <CircularProgress />
            <Typography>Cargando estaciones...</Typography>
          </Box>
        ) : estacionesFiltradas.length === 0 ? (
          <Box sx={styles.vacio}>
            <Typography>
              No se encontraron estaciones disponibles.
            </Typography>
          </Box>
        ) : (
          <Box sx={styles.estacionesGrid}>
            {estacionesFiltradas.map((estacion) => (
              <Paper
                key={estacion.id}
                elevation={0}
                sx={styles.estacionTarjeta}
              >
                <Typography component="h3" sx={styles.estacionNombre}>
                  {estacion.nombre}
                </Typography>

                <EstadoEstacion estado={estacion.estado} />

                <Typography sx={styles.textoSecundario}>
                  {estacion.direccion || 'Dirección no registrada'}
                </Typography>

                {estacion.municipalidad && (
                  <Typography sx={styles.textoSecundario}>
                    {estacion.municipalidad}
                  </Typography>
                )}

                <UbicacionEstacion
                  coordenadas={estacion.coordenadas}
                />
              </Paper>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default PasajerosPage