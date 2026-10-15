import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

import DirectionsBusRoundedIcon from '@mui/icons-material/DirectionsBusRounded'
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded'
import RouteRoundedIcon from '@mui/icons-material/RouteRounded'
import BuildRoundedIcon from '@mui/icons-material/BuildRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'

import { useAuth } from '../components/usuarios/AuthContext'
import { suscribirseDatosInicio } from './homeService'
import { homeStyles as styles } from './Home.styles'

const modulos = [
  {
    key: 'buses',
    titulo: 'Buses',
    ruta: '/buses',
    descripcion: 'Consulta las unidades y su disponibilidad.',
    Icono: DirectionsBusRoundedIcon,
  },
  {
    key: 'pilotos',
    titulo: 'Pilotos',
    ruta: '/pilotos',
    descripcion: 'Administra los pilotos y sus estados.',
    Icono: BadgeRoundedIcon,
  },
  {
    key: 'recorridos',
    titulo: 'Recorridos',
    ruta: '/recorridos',
    descripcion: 'Consulta las asignaciones y la operación.',
    Icono: RouteRoundedIcon,
  },
  {
    key: 'usuarios',
    titulo: 'Usuarios',
    ruta: '/usuarios',
    descripcion: 'Gestiona cuentas y solicitudes de acceso.',
    Icono: GroupsRoundedIcon,
  },
]

const permisosColecciones = {
  buses: 'buses.consultar',
  pilotos: 'pilotos.consultar',
  lineas: 'lineas.consultar',
  recorridos: 'recorridos.consultar',
  usuarios: 'usuarios.consultar',
}

const etiquetasColecciones = {
  buses: 'buses',
  pilotos: 'pilotos',
  lineas: 'líneas',
  recorridos: 'recorridos',
  usuarios: 'usuarios',
}

const permisosAlternativos = {
  lineas: 'lineas.ver',
  recorridos: 'recorridos.ver',
}

function useDatosInicio(colecciones, habilitado) {
  const [fuentes, setFuentes] = useState({})
  const clave = colecciones.join('|')

  useEffect(() => {
    if (!habilitado || !clave) {
      setFuentes({})
      return undefined
    }

    const nombres = clave.split('|')
    let vigente = true

    setFuentes(
      Object.fromEntries(
        nombres.map((nombre) => [
          nombre,
          {
            registros: [],
            cargando: true,
            error: '',
          },
        ]),
      ),
    )

    const actualizar = (nombre, datos) => {
      if (!vigente) return

      setFuentes((actuales) => ({
        ...actuales,
        [nombre]: datos,
      }))
    }

    const cancelar = nombres.map((nombre) => {
      const manejarError = () => {
        actualizar(nombre, {
          registros: [],
          cargando: false,
          error: `No fue posible consultar ${
            etiquetasColecciones[nombre]
          }. Comprueba tu conexión y los permisos de acceso.`,
        })
      }

      try {
        return suscribirseDatosInicio(
          nombre,
          (registros) => {
            actualizar(nombre, {
              registros,
              cargando: false,
              error: '',
            })
          },
          manejarError,
        )
      } catch {
        manejarError()
        return () => {}
      }
    })

    return () => {
      vigente = false
      cancelar.forEach((unsubscribe) => unsubscribe())
    }
  }, [clave, habilitado])

  return Object.fromEntries(
    colecciones.map((nombre) => [
      nombre,
      fuentes[nombre] ?? {
        registros: [],
        cargando: true,
        error: '',
      },
    ]),
  )
}

function TarjetaIndicador({
  titulo,
  cantidad,
  fuente,
  Icono,
  color,
}) {
  return (
    <Paper elevation={0} sx={styles.indicador}>
      <Box
        sx={{
          ...styles.indicadorIcono,
          color,
          backgroundColor: `${color}14`,
        }}
      >
        <Icono />
      </Box>

      <Typography sx={styles.indicadorTitulo}>
        {titulo}
      </Typography>

      {fuente?.cargando ? (
        <Skeleton width={75} height={52} />
      ) : (
        <Typography sx={styles.indicadorCantidad}>
          {fuente?.error ? '—' : cantidad}
        </Typography>
      )}

      <Typography sx={styles.textoSecundario}>
        {fuente?.error
          ? 'Información no disponible'
          : 'Estado actual'}
      </Typography>
    </Paper>
  )
}

function Home() {
  const {
    loading,
    isAuthorized,
    userProfile,
    authError,
    hasPermission,
  } = useAuth()

  const puedeConsultar = (nombre) => (
    hasPermission(permisosColecciones[nombre]) ||
    Boolean(
      permisosAlternativos[nombre] &&
      hasPermission(permisosAlternativos[nombre]),
    )
  )

  const colecciones = isAuthorized
    ? Object.keys(permisosColecciones).filter(puedeConsultar)
    : []

  const fuentes = useDatosInicio(
    colecciones,
    !loading && isAuthorized,
  )

  if (loading) {
    return (
      <Box sx={styles.cargando}>
        <CircularProgress />
        <Typography>Cargando panel...</Typography>
      </Box>
    )
  }

  if (!isAuthorized) {
    return (
      <Paper elevation={0} sx={styles.acceso}>
        <Typography component="h1" sx={styles.titulo}>
          Administración del Transmetro
        </Typography>

        <Typography sx={styles.textoSecundario}>
          Inicia sesión con una cuenta autorizada para
          consultar el panel administrativo.
        </Typography>

        {authError && (
          <Alert severity="info">{authError}</Alert>
        )}

        <Button
          component={Link}
          to="/iniciar-sesion"
          variant="contained"
          sx={styles.boton}
        >
          Ir al inicio de sesión
        </Button>
      </Paper>
    )
  }

  const registros = (nombre) => (
    fuentes[nombre]?.registros ?? []
  )

  const buses = registros('buses')
  const pilotos = registros('pilotos')
  const recorridos = registros('recorridos')
  const usuarios = registros('usuarios')

  const busesDisponibles = buses.filter(
    (bus) => (
      bus.activo !== false &&
      bus.estado === 'DISPONIBLE'
    ),
  ).length

  const busesMantenimiento = buses.filter(
    (bus) => (
      bus.activo !== false &&
      bus.estado === 'MANTENIMIENTO'
    ),
  ).length

  const pilotosActivos = pilotos.filter(
    (piloto) => piloto.estado === 'ACTIVO',
  ).length

  const recorridosEnCurso = recorridos
    .filter((recorrido) => recorrido.estado === 'EN_CURSO')
    .sort((a, b) => (
      (b.actualizadoEn?.toMillis?.() ?? 0) -
      (a.actualizadoEn?.toMillis?.() ?? 0) ||
      a.id.localeCompare(b.id)
    ))

  const fallas = recorridos.filter(
    (recorrido) => recorrido.estado === 'FALLA_MECANICA',
  ).length

  const pendientes = usuarios.filter(
    (usuario) => usuario.estado === 'PENDIENTE',
  ).length

  const indicadores = [
    {
      key: 'buses',
      titulo: 'Buses disponibles',
      cantidad: busesDisponibles,
      Icono: DirectionsBusRoundedIcon,
      color: '#008C7A',
    },
    {
      key: 'buses',
      titulo: 'Buses en mantenimiento',
      cantidad: busesMantenimiento,
      Icono: BuildRoundedIcon,
      color: '#B7791F',
    },
    {
      key: 'pilotos',
      titulo: 'Pilotos activos',
      cantidad: pilotosActivos,
      Icono: BadgeRoundedIcon,
      color: '#2563EB',
    },
    {
      key: 'recorridos',
      titulo: 'Recorridos en curso',
      cantidad: recorridosEnCurso.length,
      Icono: RouteRoundedIcon,
      color: '#7C3AED',
    },
  ].filter((indicador) => puedeConsultar(indicador.key))

  const errores = Object.entries(fuentes)
    .filter(([, fuente]) => fuente.error)
    .map(([nombre, fuente]) => ({
      nombre,
      mensaje: fuente.error,
    }))

  const alertas = []

  if (
    fuentes.recorridos &&
    !fuentes.recorridos.cargando &&
    !fuentes.recorridos.error &&
    fallas > 0
  ) {
    alertas.push({
      titulo: `${fallas} recorrido(s) con falla mecánica`,
      ruta: '/recorridos',
      severidad: 'error',
    })
  }

  if (
    fuentes.buses &&
    !fuentes.buses.cargando &&
    !fuentes.buses.error &&
    busesMantenimiento > 0
  ) {
    alertas.push({
      titulo: `${busesMantenimiento} bus(es) en mantenimiento`,
      ruta: '/buses',
      severidad: 'warning',
    })
  }

  if (
    fuentes.usuarios &&
    !fuentes.usuarios.cargando &&
    !fuentes.usuarios.error &&
    pendientes > 0
  ) {
    alertas.push({
      titulo: `${pendientes} usuario(s) pendiente(s) de autorización`,
      ruta: '/usuarios',
      severidad: 'info',
    })
  }

  const fuentesAlertas = ['buses', 'recorridos', 'usuarios']
    .map((nombre) => fuentes[nombre])
    .filter(Boolean)

  const cargandoAlertas = fuentesAlertas.some(
    (fuente) => fuente.cargando,
  )

  const errorAlertas = fuentesAlertas.some(
    (fuente) => fuente.error,
  )

  const identificar = (coleccion, id, obtenerNombre) => {
    const fuente = fuentes[coleccion]

    if (!fuente) return 'Sin permiso de consulta'
    if (fuente.cargando) return 'Cargando...'
    if (fuente.error) return 'No disponible'

    const registro = fuente.registros.find(
      (elemento) => elemento.id === id,
    )

    return registro
      ? obtenerNombre(registro)
      : 'Registro no disponible'
  }

  const accesos = modulos.filter(
    (modulo) => puedeConsultar(modulo.key),
  )

  return (
    <Box sx={styles.pagina}>
      <Paper elevation={0} sx={styles.encabezado}>
        <Box>
          <Chip
            label="Panel administrativo"
            size="small"
            sx={styles.chip}
          />

          <Typography
            component="h1"
            sx={styles.tituloEncabezado}
          >
            Hola, {userProfile?.nombres || 'Administrador'}
          </Typography>

          <Typography sx={styles.descripcionEncabezado}>
            Consulta el estado actual de la operación del Transmetro.
          </Typography>
        </Box>

        <Chip
          label="Actualización en tiempo real"
          sx={styles.chipTiempoReal}
        />
      </Paper>

      {errores.map((error) => (
        <Alert key={error.nombre} severity="error">
          {error.mensaje}
        </Alert>
      ))}

      {colecciones.length === 0 && (
        <Alert severity="info">
          Tu rol no tiene permisos para consultar los módulos del panel.
        </Alert>
      )}

      {indicadores.length > 0 && (
        <Box sx={styles.indicadoresGrid}>
          {indicadores.map((indicador) => (
            <TarjetaIndicador
              key={indicador.titulo}
              {...indicador}
              fuente={fuentes[indicador.key]}
            />
          ))}
        </Box>
      )}

      <Box sx={styles.contenidoGrid}>
        {puedeConsultar('recorridos') && (
          <Paper elevation={0} sx={styles.seccion}>
            <Box sx={styles.seccionEncabezado}>
              <Box>
                <Typography
                  component="h2"
                  sx={styles.seccionTitulo}
                >
                  Recorridos en curso
                </Typography>

                <Typography sx={styles.textoSecundario}>
                  Asignaciones que actualmente tienen estado en curso.
                </Typography>
              </Box>

              <Button
                component={Link}
                to="/recorridos"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={styles.botonTexto}
              >
                Ver todos
              </Button>
            </Box>

            {fuentes.recorridos?.cargando ? (
              <Box sx={styles.vacio}>
                <CircularProgress size={28} />
                <Typography>Cargando recorridos...</Typography>
              </Box>
            ) : fuentes.recorridos?.error ? (
              <Box sx={styles.vacio}>
                <Typography>
                  Los recorridos no están disponibles.
                </Typography>
              </Box>
            ) : recorridosEnCurso.length === 0 ? (
              <Box sx={styles.vacio}>
                <RouteRoundedIcon sx={{ fontSize: 40 }} />
                <Typography>
                  No hay recorridos en curso.
                </Typography>
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table
                    size="small"
                    aria-label="Recorridos en curso"
                    sx={styles.tabla}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Línea</TableCell>
                        <TableCell>Bus</TableCell>
                        <TableCell>Piloto</TableCell>
                        <TableCell>Estado</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {recorridosEnCurso.slice(0, 8).map((recorrido) => (
                        <TableRow key={recorrido.id}>
                          <TableCell>
                            {identificar(
                              'lineas',
                              recorrido.lineaId,
                              (linea) => (
                                [linea.codigo, linea.nombre]
                                  .filter(Boolean)
                                  .join(' · ') ||
                                'Línea sin nombre'
                              ),
                            )}
                          </TableCell>

                          <TableCell>
                            {identificar(
                              'buses',
                              recorrido.busId,
                              (bus) => (
                                [
                                  bus.codigoInterno || bus.codigo,
                                  bus.placa,
                                ]
                                  .filter(Boolean)
                                  .join(' · ') ||
                                'Bus sin identificador'
                              ),
                            )}
                          </TableCell>

                          <TableCell>
                            {identificar(
                              'pilotos',
                              recorrido.pilotoId,
                              (piloto) => (
                                piloto.nombreCompleto ||
                                [piloto.nombres, piloto.apellidos]
                                  .filter(Boolean)
                                  .join(' ') ||
                                piloto.codigo ||
                                'Piloto sin nombre'
                              ),
                            )}
                          </TableCell>

                          <TableCell>
                            <Chip
                              label="En curso"
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Typography sx={styles.notaTabla}>
                  Mostrando {Math.min(recorridosEnCurso.length, 8)}
                  {' '}de {recorridosEnCurso.length} recorridos en curso.
                </Typography>
              </>
            )}
          </Paper>
        )}

        {fuentesAlertas.length > 0 && (
          <Paper elevation={0} sx={styles.seccion}>
            <Typography
              component="h2"
              sx={styles.seccionTitulo}
            >
              Atención requerida
            </Typography>

            <Typography sx={styles.textoSecundario}>
              Situaciones que necesitan seguimiento.
            </Typography>

            <Box sx={styles.alertas}>
              {cargandoAlertas && (
                <Skeleton variant="rounded" height={65} />
              )}

              {alertas.map((alerta) => (
                <Alert
                  key={alerta.titulo}
                  severity={alerta.severidad}
                >
                  <Typography sx={{ fontSize: '0.9rem' }}>
                    {alerta.titulo}
                  </Typography>

                  <Button
                    component={Link}
                    to={alerta.ruta}
                    size="small"
                    color="inherit"
                    sx={{ textTransform: 'none' }}
                  >
                    Revisar
                  </Button>
                </Alert>
              ))}

              {!cargandoAlertas && errorAlertas && (
                <Alert severity="warning">
                  No se pudieron comprobar todas las alertas.
                </Alert>
              )}

              {!cargandoAlertas &&
                !errorAlertas &&
                alertas.length === 0 && (
                  <Alert severity="success">
                    Sin alertas en los módulos que puedes consultar.
                  </Alert>
                )}
            </Box>
          </Paper>
        )}
      </Box>

      {accesos.length > 0 && (
        <Box>
          <Typography
            component="h2"
            sx={styles.seccionTitulo}
          >
            Accesos rápidos
          </Typography>

          <Typography sx={styles.textoSecundario}>
            Abre los módulos disponibles para tu rol.
          </Typography>

          <Box sx={styles.accesosGrid}>
            {accesos.map(({ Icono, ...modulo }) => (
              <Paper
                key={modulo.key}
                component={Link}
                to={modulo.ruta}
                elevation={0}
                sx={styles.accesoTarjeta}
              >
                <Box sx={styles.accesoIcono}>
                  <Icono />
                </Box>

                <Typography sx={styles.accesoTitulo}>
                  {modulo.titulo}
                </Typography>

                <Typography sx={styles.textoSecundario}>
                  {modulo.descripcion}
                </Typography>

                <Box sx={styles.accesoAccion}>
                  Abrir módulo
                  <ArrowForwardRoundedIcon fontSize="small" />
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default Home