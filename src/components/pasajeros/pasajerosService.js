import {
  collection,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore'

import { db } from '../../config/firebase'

function escucharConsulta(consulta, onSuccess, onError) {
  return onSnapshot(
    consulta,

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
        'Error al consultar información para pasajeros:',
        error,
      )

      if (onError) {
        onError(error)
      }
    },
  )
}

export function suscribirseLineasPublicas(
  onSuccess,
  onError,
) {
  const consulta = query(
    collection(db, 'lineas'),
    where('estado', '==', 'ACTIVA'),
  )

  return escucharConsulta(
    consulta,
    (lineas) => {
      onSuccess(
        lineas.sort((a, b) => (
          String(a.nombre ?? '').localeCompare(
            String(b.nombre ?? ''),
            'es',
          )
        )),
      )
    },
    onError,
  )
}

export function suscribirseEstacionesPublicas(
  onSuccess,
  onError,
) {
  const consulta = query(
    collection(db, 'estaciones'),
    where('estado', 'in', [
      'OPERATIVA',
      'MANTENIMIENTO',
    ]),
  )

  return escucharConsulta(
    consulta,
    (estaciones) => {
      onSuccess(
        estaciones.sort((a, b) => (
          String(a.nombre ?? '').localeCompare(
            String(b.nombre ?? ''),
            'es',
          )
        )),
      )
    },
    onError,
  )
}

export function suscribirseTrayectoLinea(
  lineaId,
  onSuccess,
  onError,
) {
  if (!lineaId) {
    onSuccess([])
    return () => {}
  }

  const consulta = query(
    collection(db, 'lineasEstaciones'),
    where('lineaId', '==', lineaId),
  )

  return escucharConsulta(
    consulta,
    onSuccess,
    onError,
  )
}

export function normalizarBusqueda(valor = '') {
  return String(valor)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
}

export function filtrarLineas(lineas, busqueda = '') {
  const texto = normalizarBusqueda(busqueda)

  if (!texto) {
    return lineas
  }

  return lineas.filter((linea) => (
    normalizarBusqueda(
      [
        linea.codigo,
        linea.nombre,
        linea.descripcion,
      ]
        .filter(Boolean)
        .join(' '),
    ).includes(texto)
  ))
}

export function filtrarEstaciones(
  estaciones,
  busqueda = '',
) {
  const texto = normalizarBusqueda(busqueda)

  if (!texto) {
    return estaciones
  }

  return estaciones.filter((estacion) => (
    normalizarBusqueda(
      [
        estacion.codigo,
        estacion.nombre,
        estacion.direccion,
        estacion.municipalidad,
      ]
        .filter(Boolean)
        .join(' '),
    ).includes(texto)
  ))
}

export function prepararTrayecto({
  asignaciones = [],
  estaciones = [],
  sentido = 'IDA',
}) {
  const estacionesPorId = new Map(
    estaciones.map((estacion) => [
      estacion.id,
      estacion,
    ]),
  )

  return asignaciones
    .filter((asignacion) => (
      asignacion.sentido === sentido
    ))
    .sort((a, b) => (
      Number(a.orden ?? 0) -
      Number(b.orden ?? 0)
    ))
    .map((asignacion) => {
      const estacion = estacionesPorId.get(
        asignacion.estacionId,
      )

      const distancia = Number(
        asignacion.distanciaAnteriorKm,
      )

      return {
        id: asignacion.id,
        estacionId: asignacion.estacionId,
        orden: Number(asignacion.orden ?? 0),

        distanciaAnteriorKm: (
          Number.isFinite(distancia) &&
          distancia >= 0
        )
          ? distancia
          : null,

        nombre: estacion?.nombre ||
          'Estación no disponible',

        direccion: estacion?.direccion || '',
        municipalidad: estacion?.municipalidad || '',
        estado: estacion?.estado || 'NO_DISPONIBLE',
        coordenadas: estacion?.coordenadas || null,
      }
    })
}

export function obtenerEnlaceMapa(coordenadas) {
  if (!coordenadas) {
    return null
  }

  const {
    latitud,
    longitud,
  } = coordenadas

  if (
    typeof latitud !== 'number' ||
    typeof longitud !== 'number' ||
    !Number.isFinite(latitud) ||
    !Number.isFinite(longitud) ||
    latitud < -90 ||
    latitud > 90 ||
    longitud < -180 ||
    longitud > 180
  ) {
    return null
  }

  const ubicacion = encodeURIComponent(
    `${latitud},${longitud}`,
  )

  return `https://www.google.com/maps/search/?api=1&query=${ubicacion}`
}