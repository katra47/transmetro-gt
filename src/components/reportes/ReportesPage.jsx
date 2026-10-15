import { useEffect, useMemo, useState } from 'react'

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'

import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded'
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'

import { useAuth } from '../usuarios/AuthContext'

import {
  suscribirseDatosReporte,
  estadosRecorrido,
  obtenerNombreLinea,
  obtenerNombreBus,
  obtenerNombrePiloto,
  prepararFilasReporte,
  filtrarFilasReporte,
  calcularResumenReporte,
  exportarReporteCSV,
} from './reportesService'

import { reportesStyles as styles } from './ReportesPage.styles'

const filtrosIniciales = {
  lineaId: '',
  busId: '',
  pilotoId: '',
  estado: '',
}

const permisosFuentes = {
  recorridos: ['recorridos.consultar', 'recorridos.ver'],
  lineas: ['lineas.consultar', 'lineas.ver'],
  buses: ['buses.consultar'],
  pilotos: ['pilotos.consultar'],
}

const etiquetasFuentes = {
  recorridos: 'recorridos',
  lineas: 'líneas',
  buses: 'buses',
  pilotos: 'pilotos',
}

const coloresEstado = {
  PROGRAMADO: 'info',
  EN_CURSO: 'success',
  FINALIZADO: 'default',
  FALLA_MECANICA: 'error',
}

function ReportesPage() {
  const {
    loading,
    isAuthorized,
    hasPermission,
  } = useAuth()

  const [fuentes, setFuentes] = useState({})
  const [filtros, setFiltros] = useState(filtrosIniciales)
  const [pagina, setPagina] = useState(0)
  const [filasPorPagina, setFilasPorPagina] = useState(10)
  const [errorExportacion, setErrorExportacion] = useState('')

  const puedeVerReportes = (
    isAuthorized &&
    hasPermission('reportes.consultar')
  )

  const puedeExportar = hasPermission('reportes.exportar')

  const colecciones = puedeVerReportes
    ? Object.keys(permisosFuentes).filter((nombre) => (
        permisosFuentes[nombre].some(hasPermission)
      ))
    : []

  const claveColecciones = colecciones.join('|')

  useEffect(() => {
    if (loading || !puedeVerReportes || !claveColecciones) {
      setFuentes({})
      return undefined
    }

    let vigente = true
    const nombres = claveColecciones.split('|')

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

    const actualizarFuente = (nombre, datos) => {
      if (!vigente) return

      setFuentes((actuales) => ({
        ...actuales,
        [nombre]: datos,
      }))
    }

    const cancelar = nombres.map((nombre) => {
      const manejarError = () => {
        actualizarFuente(nombre, {
          registros: [],
          cargando: false,
          error: `No fue posible consultar ${
            etiquetasFuentes[nombre]
          }. Comprueba tu conexión y los permisos de Firebase.`,
        })
      }

      try {
        return suscribirseDatosReporte(
          nombre,
          (registros) => {
            actualizarFuente(nombre, {
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
  }, [loading, puedeVerReportes, claveColecciones])

  const puedeConsultarFuente = (nombre) => (
    colecciones.includes(nombre)
  )

  const cargandoDatos = colecciones.some((nombre) => (
    !fuentes[nombre] || fuentes[nombre].cargando
  ))

  const errores = colecciones
    .filter((nombre) => fuentes[nombre]?.error)
    .map((nombre) => ({
      nombre,
      mensaje: fuentes[nombre].error,
    }))

  const filas = useMemo(() => {
    const registros = (nombre) => (
      claveColecciones.split('|').includes(nombre)
        ? fuentes[nombre]?.registros ?? []
        : []
    )

    const resultado = prepararFilasReporte({
      recorridos: registros('recorridos'),
      lineas: registros('lineas'),
      buses: registros('buses'),
      pilotos: registros('pilotos'),
    })

    return resultado
      .map((fila) => ({
        ...fila,
        linea: claveColecciones.split('|').includes('lineas')
          ? fila.linea
          : 'Sin permiso de consulta',
        bus: claveColecciones.split('|').includes('buses')
          ? fila.bus
          : 'Sin permiso de consulta',
        piloto: claveColecciones.split('|').includes('pilotos')
          ? fila.piloto
          : 'Sin permiso de consulta',
      }))
      .sort((a, b) => a.id.localeCompare(b.id))
  }, [fuentes, claveColecciones])

  const filasFiltradas = useMemo(
    () => filtrarFilasReporte(filas, filtros),
    [filas, filtros],
  )

  const resumen = useMemo(
    () => calcularResumenReporte(filasFiltradas),
    [filasFiltradas],
  )

  const ultimaPagina = Math.max(
    0,
    Math.ceil(filasFiltradas.length / filasPorPagina) - 1,
  )

  const paginaActual = Math.min(pagina, ultimaPagina)

  const filasVisibles = filasFiltradas.slice(
    paginaActual * filasPorPagina,
    (paginaActual + 1) * filasPorPagina,
  )

  const indicadores = [
    { titulo: 'Total de recorridos', cantidad: resumen.total },
    { titulo: 'Programados', cantidad: resumen.programados },
    { titulo: 'En curso', cantidad: resumen.enCurso },
    { titulo: 'Finalizados', cantidad: resumen.finalizados },
    { titulo: 'Con falla mecánica', cantidad: resumen.fallas },
  ]

  const cambiarFiltro = (evento) => {
    const { name, value } = evento.target

    setFiltros((actuales) => ({
      ...actuales,
      [name]: value,
    }))

    setPagina(0)
    setErrorExportacion('')
  }

  const limpiarFiltros = () => {
    setFiltros({ ...filtrosIniciales })
    setPagina(0)
    setErrorExportacion('')
  }

  const descargarReporte = () => {
    if (
      !puedeVerReportes ||
      !puedeExportar ||
      !puedeConsultarFuente('recorridos') ||
      cargandoDatos ||
      errores.length > 0
    ) {
      return
    }

    try {
      setErrorExportacion('')
      exportarReporteCSV(filasFiltradas)
    } catch (error) {
      setErrorExportacion(
        error.message || 'No fue posible exportar el reporte.',
      )
    }
  }

  const opcionesCatalogo = (nombre, obtenerNombre) => (
    (fuentes[nombre]?.registros ?? [])
      .map((registro) => ({
        id: registro.id,
        nombre: obtenerNombre(registro),
      }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
  )

  if (loading) {
    return (
      <Box sx={styles.cargando}>
        <CircularProgress />
        <Typography>Comprobando permisos...</Typography>
      </Box>
    )
  }

  if (!puedeVerReportes) {
    return (
      <Alert severity="warning">
        Tu cuenta no tiene permiso para consultar reportes.
      </Alert>
    )
  }

  if (!puedeConsultarFuente('recorridos')) {
    return (
      <Alert severity="info">
        Para consultar este reporte necesitas también el permiso
        de consulta de recorridos.
      </Alert>
    )
  }

  return (
    <Box sx={styles.pagina}>
      <Paper elevation={0} sx={styles.encabezado}>
        <Box sx={styles.encabezadoContenido}>
          <Box sx={styles.encabezadoIcono}>
            <AssessmentRoundedIcon />
          </Box>

          <Box>
            <Typography component="h1" sx={styles.titulo}>
              Reportes de recorridos
            </Typography>

            <Typography sx={styles.descripcion}>
              Consulta las asignaciones y su estado actual.
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          startIcon={<DownloadRoundedIcon />}
          onClick={descargarReporte}
          disabled={
            !puedeExportar ||
            cargandoDatos ||
            errores.length > 0 ||
            filasFiltradas.length === 0
          }
          sx={styles.botonPrincipal}
        >
          Descargar CSV
        </Button>
      </Paper>

      <Alert severity="info">
        Este reporte refleja el estado actual de los registros.
        No representa el historial de viajes por día o mes.
      </Alert>

      {!puedeExportar && (
        <Alert severity="info">
          Tu rol permite consultar reportes, pero no exportarlos.
        </Alert>
      )}

      {['lineas', 'buses', 'pilotos'].some(
        (nombre) => !puedeConsultarFuente(nombre),
      ) && (
        <Alert severity="info">
          Los nombres y filtros de líneas, buses y pilotos están
          disponibles únicamente si tu rol permite consultar
          esos módulos.
        </Alert>
      )}

      {errores.map((error) => (
        <Alert key={error.nombre} severity="error">
          {error.mensaje}
        </Alert>
      ))}

      {errorExportacion && (
        <Alert severity="error">
          {errorExportacion}
        </Alert>
      )}

      <Paper elevation={0} sx={styles.seccion}>
        <Typography component="h2" sx={styles.seccionTitulo}>
          Filtros
        </Typography>

        <Box sx={styles.filtrosGrid}>
          {[
            {
              nombre: 'lineas',
              campo: 'lineaId',
              etiqueta: 'Línea',
              obtenerNombre: obtenerNombreLinea,
            },
            {
              nombre: 'buses',
              campo: 'busId',
              etiqueta: 'Bus',
              obtenerNombre: obtenerNombreBus,
            },
            {
              nombre: 'pilotos',
              campo: 'pilotoId',
              etiqueta: 'Piloto',
              obtenerNombre: obtenerNombrePiloto,
            },
          ].map((catalogo) => (
            <TextField
              key={catalogo.campo}
              select
              fullWidth
              name={catalogo.campo}
              label={catalogo.etiqueta}
              value={filtros[catalogo.campo]}
              onChange={cambiarFiltro}
              disabled={
                !puedeConsultarFuente(catalogo.nombre) ||
                cargandoDatos ||
                errores.length > 0
              }
            >
              <MenuItem value="">Todos</MenuItem>

              {opcionesCatalogo(
                catalogo.nombre,
                catalogo.obtenerNombre,
              ).map((opcion) => (
                <MenuItem key={opcion.id} value={opcion.id}>
                  {opcion.nombre}
                </MenuItem>
              ))}
            </TextField>
          ))}

          <TextField
            select
            fullWidth
            name="estado"
            label="Estado"
            value={filtros.estado}
            onChange={cambiarFiltro}
            disabled={cargandoDatos || errores.length > 0}
          >
            <MenuItem value="">Todos</MenuItem>

            {estadosRecorrido.map((estado) => (
              <MenuItem key={estado.value} value={estado.value}>
                {estado.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Button
          startIcon={<RestartAltRoundedIcon />}
          onClick={limpiarFiltros}
          sx={styles.botonLimpiar}
        >
          Limpiar filtros
        </Button>
      </Paper>

      {!cargandoDatos && errores.length === 0 && (
        <Box sx={styles.indicadoresGrid}>
          {indicadores.map((indicador) => (
            <Paper
              key={indicador.titulo}
              elevation={0}
              sx={styles.indicador}
            >
              <Typography sx={styles.indicadorTitulo}>
                {indicador.titulo}
              </Typography>

              <Typography sx={styles.indicadorCantidad}>
                {indicador.cantidad}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}

      <Paper elevation={0} sx={styles.seccion}>
        <Typography component="h2" sx={styles.seccionTitulo}>
          Resultados
        </Typography>

        <Typography sx={styles.textoSecundario}>
          La descarga incluye todos los resultados filtrados,
          aunque estén en otras páginas de la tabla.
        </Typography>

        {cargandoDatos ? (
          <Box sx={styles.cargando}>
            <CircularProgress />
            <Typography>Cargando información...</Typography>
          </Box>
        ) : errores.length > 0 ? (
          <Box sx={styles.vacio}>
            <Typography>
              No se puede completar el reporte hasta consultar
              correctamente sus datos.
            </Typography>
          </Box>
        ) : filasFiltradas.length === 0 ? (
          <Box sx={styles.vacio}>
            <Typography>
              No hay recorridos que coincidan con los filtros.
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer sx={{ mt: 2 }}>
              <Table
                size="small"
                aria-label="Reporte de recorridos"
                sx={styles.tabla}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Línea</TableCell>
                    <TableCell>Bus</TableCell>
                    <TableCell>Piloto</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Observaciones</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filasVisibles.map((fila) => (
                    <TableRow key={fila.id}>
                      <TableCell>{fila.linea}</TableCell>
                      <TableCell>{fila.bus}</TableCell>
                      <TableCell>{fila.piloto}</TableCell>

                      <TableCell>
                        <Chip
                          label={fila.estadoTexto}
                          color={coloresEstado[fila.estado] || 'default'}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>

                      <TableCell sx={styles.observaciones}>
                        {fila.observaciones || 'Sin observaciones'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={filasFiltradas.length}
              page={paginaActual}
              rowsPerPage={filasPorPagina}
              rowsPerPageOptions={[10, 25, 50]}
              onPageChange={(_, nuevaPagina) => {
                setPagina(nuevaPagina)
              }}
              onRowsPerPageChange={(evento) => {
                setFilasPorPagina(Number(evento.target.value))
                setPagina(0)
              }}
              labelRowsPerPage="Filas por página:"
              labelDisplayedRows={({ from, to, count }) => (
                `${from}-${to} de ${count}`
              )}
              getItemAriaLabel={(tipo) => (
                tipo === 'next'
                  ? 'Ir a la página siguiente'
                  : 'Ir a la página anterior'
              )}
              sx={{ overflowX: 'auto' }}
            />
          </>
        )}
      </Paper>
    </Box>
  )
}

export default ReportesPage