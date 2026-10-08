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

const lineasCollection = collection(db, 'lineas')

const normalizarTexto = (value = '') => {
  return value.trim().toUpperCase()
}

const prepararLinea = (linea) => ({
  codigo: normalizarTexto(linea.codigo),
  nombre: linea.nombre.trim(),
  municipalidad: linea.municipalidad.trim(),
  descripcion: linea.descripcion?.trim() ?? '',
  estado: linea.estado ?? 'ACTIVA',
})

const verificarCodigoDisponible = async (
  codigo,
  lineaId = null,
) => {
  const codigoNormalizado = normalizarTexto(codigo)

  const codigoQuery = query(
    lineasCollection,
    where('codigo', '==', codigoNormalizado),
    limit(1),
  )

  const snapshot = await getDocs(codigoQuery)

  if (snapshot.empty) {
    return true
  }

  return snapshot.docs[0].id === lineaId
}

const suscribirseLineas = (
  onSuccess,
  onError,
) => {
  const lineasQuery = query(
    lineasCollection,
    orderBy('nombre', 'asc'),
  )

  return onSnapshot(
    lineasQuery,
    (snapshot) => {
      const lineas = snapshot.docs.map((documentSnapshot) => ({
        id: documentSnapshot.id,
        ...documentSnapshot.data(),
      }))

      onSuccess(lineas)
    },
    (error) => {
      console.error('Error al consultar las líneas:', error)

      if (onError) {
        onError(error)
      }
    },
  )
}

const crearLinea = async (linea) => {
  const datosLinea = prepararLinea(linea)

  const codigoDisponible = await verificarCodigoDisponible(
    datosLinea.codigo,
  )

  if (!codigoDisponible) {
    throw new Error(
      'Ya existe una línea registrada con este código.',
    )
  }

  return addDoc(lineasCollection, {
    ...datosLinea,
    creadoEn: serverTimestamp(),
    actualizadoEn: serverTimestamp(),
  })
}

const actualizarLinea = async (
  lineaId,
  linea,
) => {
  if (!lineaId) {
    throw new Error(
      'No se proporcionó el identificador de la línea.',
    )
  }

  const datosLinea = prepararLinea(linea)

  const codigoDisponible = await verificarCodigoDisponible(
    datosLinea.codigo,
    lineaId,
  )

  if (!codigoDisponible) {
    throw new Error(
      'Ya existe otra línea registrada con este código.',
    )
  }

  const lineaReference = doc(db, 'lineas', lineaId)

  return updateDoc(lineaReference, {
    ...datosLinea,
    actualizadoEn: serverTimestamp(),
  })
}

const cambiarEstadoLinea = async (
  lineaId,
  nuevoEstado,
) => {
  if (!lineaId) {
    throw new Error(
      'No se proporcionó el identificador de la línea.',
    )
  }

  const estadosPermitidos = [
    'ACTIVA',
    'INACTIVA',
    'MANTENIMIENTO',
  ]

  if (!estadosPermitidos.includes(nuevoEstado)) {
    throw new Error(
      'El estado seleccionado no es válido.',
    )
  }

  const lineaReference = doc(db, 'lineas', lineaId)

  return updateDoc(lineaReference, {
    estado: nuevoEstado,
    actualizadoEn: serverTimestamp(),
  })
}

export {
  actualizarLinea,
  cambiarEstadoLinea,
  crearLinea,
  suscribirseLineas,
}
