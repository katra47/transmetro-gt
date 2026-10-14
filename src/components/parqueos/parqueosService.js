import {
  addDoc,
  collection,
  doc,
  getDoc,
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

const parqueosCollection = collection(db, 'parqueos')

const normalizarTexto = (value = '') => {
  return value.trim().toUpperCase()
}

const prepararParqueo = (parqueo) => {
  const capacidad = Number(parqueo.capacidad)

  if (!Number.isInteger(capacidad) || capacidad < 1) {
    throw new Error(
      'La capacidad debe ser un número entero mayor que cero.',
    )
  }

  return {
    codigo: normalizarTexto(parqueo.codigo),
    nombre: parqueo.nombre.trim(),
    estacionId: parqueo.estacionId,
    capacidad,
    descripcion: parqueo.descripcion?.trim() ?? '',
    estado: parqueo.estado ?? 'DISPONIBLE',
  }
}

const verificarEstacion = async (estacionId) => {
  if (!estacionId) {
    throw new Error(
      'Debes seleccionar la estación del parqueo.',
    )
  }

  const estacionSnapshot = await getDoc(
    doc(db, 'estaciones', estacionId),
  )

  if (!estacionSnapshot.exists()) {
    throw new Error(
      'La estación seleccionada ya no existe.',
    )
  }
}

const verificarCodigoDisponible = async (
  codigo,
  parqueoId = null,
) => {
  const codigoNormalizado = normalizarTexto(codigo)

  const codigoQuery = query(
    parqueosCollection,
    where('codigo', '==', codigoNormalizado),
    limit(1),
  )

  const snapshot = await getDocs(codigoQuery)

  if (snapshot.empty) {
    return true
  }

  return snapshot.docs[0].id === parqueoId
}

const suscribirseParqueos = (
  onSuccess,
  onError,
) => {
  const parqueosQuery = query(
    parqueosCollection,
    orderBy('nombre', 'asc'),
  )

  return onSnapshot(
    parqueosQuery,
    (snapshot) => {
      const parqueos = snapshot.docs.map(
        (documentSnapshot) => ({
          id: documentSnapshot.id,
          ...documentSnapshot.data(),
        }),
      )

      onSuccess(parqueos)
    },
    (error) => {
      console.error(
        'Error al consultar los parqueos:',
        error,
      )

      if (onError) {
        onError(error)
      }
    },
  )
}

const crearParqueo = async (parqueo) => {
  const datosParqueo = prepararParqueo(parqueo)

  await verificarEstacion(datosParqueo.estacionId)

  const codigoDisponible =
    await verificarCodigoDisponible(
      datosParqueo.codigo,
    )

  if (!codigoDisponible) {
    throw new Error(
      'Ya existe un parqueo registrado con este código.',
    )
  }

  return addDoc(parqueosCollection, {
    ...datosParqueo,
    creadoEn: serverTimestamp(),
    actualizadoEn: serverTimestamp(),
  })
}

const actualizarParqueo = async (
  parqueoId,
  parqueo,
) => {
  if (!parqueoId) {
    throw new Error(
      'No se proporcionó el identificador del parqueo.',
    )
  }

  const datosParqueo = prepararParqueo(parqueo)

  await verificarEstacion(datosParqueo.estacionId)

  const codigoDisponible =
    await verificarCodigoDisponible(
      datosParqueo.codigo,
      parqueoId,
    )

  if (!codigoDisponible) {
    throw new Error(
      'Ya existe otro parqueo registrado con este código.',
    )
  }

  return updateDoc(
    doc(db, 'parqueos', parqueoId),
    {
      ...datosParqueo,
      actualizadoEn: serverTimestamp(),
    },
  )
}

const cambiarEstadoParqueo = async (
  parqueoId,
  nuevoEstado,
) => {
  const estadosPermitidos = [
    'DISPONIBLE',
    'LLENO',
    'MANTENIMIENTO',
    'INACTIVO',
  ]

  if (!estadosPermitidos.includes(nuevoEstado)) {
    throw new Error(
      'El estado seleccionado no es válido.',
    )
  }

  return updateDoc(
    doc(db, 'parqueos', parqueoId),
    {
      estado: nuevoEstado,
      actualizadoEn: serverTimestamp(),
    },
  )
}

export {
  actualizarParqueo,
  cambiarEstadoParqueo,
  crearParqueo,
  suscribirseParqueos,
}