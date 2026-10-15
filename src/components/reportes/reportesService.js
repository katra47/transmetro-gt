import {
  collection,
  onSnapshot,
} from 'firebase/firestore'

import { db } from '../../config/firebase'

const coleccionesPermitidas = new Set([
  'recorridos',
  'lineas',
  'buses',
  'pilotos',
])

export const estadosRecorrido = [
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

export function suscribirseDatosReporte(
  nombreColeccion,
  onSuccess,
  onError,
) {
  if (!coleccionesPermitidas.has(nombreColeccion)) {
    throw new Error(
      'Colección no válida para los reportes.',
    )
  }

  return onSnapshot(
    collection(db, nombreColeccion),

    (snapshot) => {
      const registros = snapshot.docs.map(
        (documento) => ({
          ...documento.data(),
          id: documento.id,
        }),
      )

      onSuccess(registros)
    },

    (error) => {
      console.error(
        `Error al consultar ${nombreColeccion}:`,
        error,
      )

      if (onError) {
        onError(error)
      }
    },
  )
}

export function obtenerNombreLinea(linea) {
  if (!linea) {
    return 'Línea no disponible'
  }

  return (
    [linea.codigo, linea.nombre]
      .filter(Boolean)
      .join(' - ') ||
    'Línea sin nombre'
  )
}

export function obtenerNombreBus(bus) {
  if (!bus) {
    return 'Bus no disponible'
  }

  return (
    [
      bus.codigoInterno || bus.codigo,
      bus.placa,
    ]
      .filter(Boolean)
      .join(' - ') ||
    'Bus sin identificador'
  )
}

export function obtenerNombrePiloto(piloto) {
  if (!piloto) {
    return 'Piloto no disponible'
  }

  return (
    piloto.nombreCompleto ||
    [piloto.nombres, piloto.apellidos]
      .filter(Boolean)
      .join(' ') ||
    piloto.codigo ||
    'Piloto sin nombre'
  )
}

export function obtenerEtiquetaEstado(estado) {
  return (
    estadosRecorrido.find(
      (elemento) => elemento.value === estado,
    )?.label ||
    estado ||
    'Sin estado'
  )
}

export function prepararFilasReporte({
  recorridos = [],
  lineas = [],
  buses = [],
  pilotos = [],
}) {
  const lineasPorId = new Map(
    lineas.map((linea) => [linea.id, linea]),
  )

  const busesPorId = new Map(
    buses.map((bus) => [bus.id, bus]),
  )

  const pilotosPorId = new Map(
    pilotos.map((piloto) => [piloto.id, piloto]),
  )

  return recorridos.map((recorrido) => ({
    id: recorrido.id,
    lineaId: recorrido.lineaId || '',
    busId: recorrido.busId || '',
    pilotoId: recorrido.pilotoId || '',

    linea: obtenerNombreLinea(
      lineasPorId.get(recorrido.lineaId),
    ),

    bus: obtenerNombreBus(
      busesPorId.get(recorrido.busId),
    ),

    piloto: obtenerNombrePiloto(
      pilotosPorId.get(recorrido.pilotoId),
    ),

    estado: recorrido.estado || '',
    estadoTexto: obtenerEtiquetaEstado(
      recorrido.estado,
    ),

    observaciones: recorrido.observaciones || '',
  }))
}

export function filtrarFilasReporte(
  filas,
  filtros = {},
) {
  return filas.filter((fila) => {
    if (
      filtros.lineaId &&
      fila.lineaId !== filtros.lineaId
    ) {
      return false
    }

    if (
      filtros.busId &&
      fila.busId !== filtros.busId
    ) {
      return false
    }

    if (
      filtros.pilotoId &&
      fila.pilotoId !== filtros.pilotoId
    ) {
      return false
    }

    if (
      filtros.estado &&
      fila.estado !== filtros.estado
    ) {
      return false
    }

    return true
  })
}

export function calcularResumenReporte(filas) {
  return {
    total: filas.length,

    programados: filas.filter(
      (fila) => fila.estado === 'PROGRAMADO',
    ).length,

    enCurso: filas.filter(
      (fila) => fila.estado === 'EN_CURSO',
    ).length,

    finalizados: filas.filter(
      (fila) => fila.estado === 'FINALIZADO',
    ).length,

    fallas: filas.filter(
      (fila) => fila.estado === 'FALLA_MECANICA',
    ).length,
  }
}

function escaparCeldaCSV(valor) {
  let texto = String(valor ?? '')

  // Evita que Excel interprete contenido como fórmulas.
  if (/^[\s\uFEFF]*[=+\-@]/.test(texto)) {
    texto = `'${texto}`
  }

  return `"${texto.replace(/"/g, '""')}"`
}

export function exportarReporteCSV(filas) {
  if (!filas.length) {
    throw new Error(
      'No hay resultados para exportar.',
    )
  }

  const encabezados = [
    'Identificador',
    'Línea',
    'Bus',
    'Piloto',
    'Estado',
    'Observaciones',
  ]

  const registros = filas.map((fila) => [
    fila.id,
    fila.linea,
    fila.bus,
    fila.piloto,
    fila.estadoTexto,
    fila.observaciones,
  ])

  const contenido = [
    encabezados,
    ...registros,
  ]
    .map((registro) => (
      registro
        .map(escaparCeldaCSV)
        .join(',')
    ))
    .join('\r\n')

  const archivo = new Blob(
    ['\uFEFF', contenido],
    {
      type: 'text/csv;charset=utf-8;',
    },
  )

  const url = URL.createObjectURL(archivo)
  const enlace = document.createElement('a')

  enlace.href = url
  enlace.download = 'reporte-recorridos.csv'

  document.body.appendChild(enlace)
  enlace.click()
  enlace.remove()

  setTimeout(() => {
    URL.revokeObjectURL(url)
  }, 1000)
}