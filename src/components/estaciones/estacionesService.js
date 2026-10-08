import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'

import { db } from '../../config/firebase'

const estacionesCollection = collection(db, 'estaciones')

const normalizarTexto = (value = '') => {
  return value.trim().toUpperCase()
}

const prepararCoordenadas = (
  latitud,
  longitud,
) => {
  const latitudeValue = String(latitud ?? '').trim()
  const longitudeValue = String(longitud ?? '').trim()

  if (!latitudeValue && !longitudeValue) {
    return null
  }

  if (!latitudeValue || !longitudeValue) {
    throw new Error(
      'Debes ingresar tanto la latitud como la longitud.',
    )
  }

  const latitudeNumber = Number(latitudeValue)
  const longitudeNumber = Number(longitudeValue)

  if (
    !Number.isFinite(latitudeNumber) ||
    latitudeNumber < -90 ||
    latitudeNumber > 90
  ) {
    throw new Error(
      'La latitud debe ser un número entre -90 y 90.',
    )
  }

  if (
    !Number.isFinite(longitudeNumber) ||
    longitudeNumber < -180 ||
    longitudeNumber > 180
  ) {
    throw new Error(
      'La longitud debe ser un número entre -180 y 180.',
    )
  }

  return {
    latitud: latitudeNumber,
    longitud: longitudeNumber,
  }
}

const prepararEstacion = (estacion) => ({
  codigo: normalizarTexto(estacion.codigo),
  nombre: estacion.nombre.trim(),
  municipalidad: estacion.municipalidad.trim(),
  direccion: estacion.direccion.trim(),
  descripcion: estacion.descripcion?.trim() ?? '',
  estado: estacion.estado ?? 'OPERATIVA',
  coordenadas: prepararCoordenadas(
    estacion.latitud,
    estacion.longitud,
  ),
})

const verificarCodigoDisponible = async (
  codigo,
  estacionId = null,
) => {
  const codigoNormalizado = normalizarTexto(codigo)

  const codigoQuery = query(
    estacionesCollection,
    where('codigo', '==', codigoNormalizado),
    limit(1),
  )

  const snapshot = await getDocs(codigoQuery)

  if (snapshot.empty) {
    return true
  }

  return snapshot.docs[0].id === estacionId
}

const suscribirseEstaciones = (
  onSuccess,
  onError,
) => {
  const estacionesQuery = query(
    estacionesCollection,
    orderBy('nombre', 'asc'),
  )

  return onSnapshot(
    estacionesQuery,
    (snapshot) => {
      const estaciones = snapshot.docs.map(
        (documentSnapshot) => ({
          id: documentSnapshot.id,
          ...documentSnapshot.data(),
        }),
      )

      onSuccess(estaciones)
    },
    (error) => {
      console.error(
        'Error al consultar las estaciones:',
        error,
      )

      if (onError) {
        onError(error)
      }
    },
  )
}

const crearEstacion = async (estacion) => {
  const datosEstacion = prepararEstacion(estacion)

  const codigoDisponible =
    await verificarCodigoDisponible(
      datosEstacion.codigo,
    )

  if (!codigoDisponible) {
    throw new Error(
      'Ya existe una estación registrada con este código.',
    )
  }

  return addDoc(estacionesCollection, {
    ...datosEstacion,
    creadoEn: serverTimestamp(),
    actualizadoEn: serverTimestamp(),
  })
}

const actualizarEstacion = async (
  estacionId,
  estacion,
) => {
  if (!estacionId) {
    throw new Error(
      'No se proporcionó el identificador de la estación.',
    )
  }

  const datosEstacion = prepararEstacion(estacion)

  const codigoDisponible =
    await verificarCodigoDisponible(
      datosEstacion.codigo,
      estacionId,
    )

  if (!codigoDisponible) {
    throw new Error(
      'Ya existe otra estación registrada con este código.',
    )
  }

  const estacionReference = doc(
    db,
    'estaciones',
    estacionId,
  )

  return updateDoc(estacionReference, {
    ...datosEstacion,
    actualizadoEn: serverTimestamp(),
  })
}

const cambiarEstadoEstacion = async (
  estacionId,
  nuevoEstado,
) => {
  if (!estacionId) {
    throw new Error(
      'No se proporcionó el identificador de la estación.',
    )
  }

  const estadosPermitidos = [
    'OPERATIVA',
    'INACTIVA',
    'MANTENIMIENTO',
  ]

  if (!estadosPermitidos.includes(nuevoEstado)) {
    throw new Error(
      'El estado seleccionado no es válido.',
    )
  }

  const estacionReference = doc(
    db,
    'estaciones',
    estacionId,
  )

  return updateDoc(estacionReference, {
    estado: nuevoEstado,
    actualizadoEn: serverTimestamp(),
  })
}

export {
  actualizarEstacion,
  cambiarEstadoEstacion,
  crearEstacion,
  suscribirseEstaciones,
}