import {
  addDoc,
  collection,
  deleteField,
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
  writeBatch,
} from 'firebase/firestore'

import { db } from '../../config/firebase'

const lineasCollection = collection(db, 'lineas')

const relacionesCollection = collection(
  db,
  'lineasEstaciones',
)

const normalizarTexto = (value = '') => {
  return value.trim().toUpperCase()
}

const prepararLinea = (linea) => ({
  codigo: normalizarTexto(linea.codigo),
  nombre: linea.nombre.trim(),
  descripcion: linea.descripcion?.trim() ?? '',
  estado: linea.estado ?? 'ACTIVA',
})

const validarSentido = (sentido) => {
  if (!['IDA', 'REGRESO'].includes(sentido)) {
    throw new Error(
      'El sentido seleccionado no es válido.',
    )
  }
}

const validarOrden = (orden) => {
  const orderNumber = Number(orden)

  if (!Number.isInteger(orderNumber) || orderNumber < 1) {
    throw new Error(
      'El orden debe ser un número entero mayor que cero.',
    )
  }

  return orderNumber
}

const validarDistancia = (distancia) => {
  const distanceNumber = Number(distancia)

  if (
    !Number.isFinite(distanceNumber) ||
    distanceNumber < 0
  ) {
    throw new Error(
      'La distancia debe ser mayor o igual a cero.',
    )
  }

  return distanceNumber
}

const verificarCodigoDisponible = async (
  codigo,
  lineaId = null,
) => {
  const codigoQuery = query(
    lineasCollection,
    where('codigo', '==', normalizarTexto(codigo)),
    limit(1),
  )

  const snapshot = await getDocs(codigoQuery)

  if (snapshot.empty) {
    return true
  }

  return snapshot.docs[0].id === lineaId
}

const obtenerAsignacionesRuta = async (
  lineaId,
  sentido,
) => {
  const routeQuery = query(
    relacionesCollection,
    where('lineaId', '==', lineaId),
  )

  const snapshot = await getDocs(routeQuery)

  return snapshot.docs
    .map((documentSnapshot) => ({
      id: documentSnapshot.id,
      ...documentSnapshot.data(),
    }))
    .filter(
      (assignment) => assignment.sentido === sentido,
    )
    .sort(
      (firstAssignment, secondAssignment) =>
        firstAssignment.orden -
        secondAssignment.orden,
    )
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
      onSuccess(
        snapshot.docs.map((documentSnapshot) => ({
          id: documentSnapshot.id,
          ...documentSnapshot.data(),
        })),
      )
    },
    onError,
  )
}

const suscribirseEstacionesParaLineas = (
  onSuccess,
  onError,
) => {
  const stationsQuery = query(
    collection(db, 'estaciones'),
    orderBy('nombre', 'asc'),
  )

  return onSnapshot(
    stationsQuery,
    (snapshot) => {
      onSuccess(
        snapshot.docs.map((documentSnapshot) => ({
          id: documentSnapshot.id,
          ...documentSnapshot.data(),
        })),
      )
    },
    onError,
  )
}

const suscribirseAsignacionesEstaciones = (
  onSuccess,
  onError,
) => {
  return onSnapshot(
    relacionesCollection,
    (snapshot) => {
      const assignments = snapshot.docs
        .map((documentSnapshot) => ({
          id: documentSnapshot.id,
          ...documentSnapshot.data(),
        }))
        .sort((firstAssignment, secondAssignment) => {
          if (
            firstAssignment.lineaId !==
            secondAssignment.lineaId
          ) {
            return firstAssignment.lineaId.localeCompare(
              secondAssignment.lineaId,
            )
          }

          if (
            firstAssignment.sentido !==
            secondAssignment.sentido
          ) {
            return firstAssignment.sentido.localeCompare(
              secondAssignment.sentido,
            )
          }

          return (
            firstAssignment.orden -
            secondAssignment.orden
          )
        })

      onSuccess(assignments)
    },
    onError,
  )
}

const crearLinea = async (linea) => {
  const datosLinea = prepararLinea(linea)

  if (!datosLinea.codigo || !datosLinea.nombre) {
    throw new Error(
      'El código y nombre de la línea son obligatorios.',
    )
  }

  const codigoDisponible =
    await verificarCodigoDisponible(datosLinea.codigo)

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
  const datosLinea = prepararLinea(linea)

  const codigoDisponible =
    await verificarCodigoDisponible(
      datosLinea.codigo,
      lineaId,
    )

  if (!codigoDisponible) {
    throw new Error(
      'Ya existe otra línea registrada con este código.',
    )
  }

  return updateDoc(
    doc(db, 'lineas', lineaId),
    {
      ...datosLinea,
      municipalidad: deleteField(),
      actualizadoEn: serverTimestamp(),
    },
  )
}

const cambiarEstadoLinea = async (
  lineaId,
  nuevoEstado,
) => {
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

  return updateDoc(
    doc(db, 'lineas', lineaId),
    {
      estado: nuevoEstado,
      actualizadoEn: serverTimestamp(),
    },
  )
}

const asignarEstacionLinea = async ({
  lineaId,
  estacionId,
  sentido,
  orden,
  distanciaAnteriorKm,
}) => {
  validarSentido(sentido)

  const [
    lineSnapshot,
    stationSnapshot,
  ] = await Promise.all([
    getDoc(doc(db, 'lineas', lineaId)),
    getDoc(doc(db, 'estaciones', estacionId)),
  ])

  if (!lineSnapshot.exists()) {
    throw new Error('La línea ya no existe.')
  }

  if (!stationSnapshot.exists()) {
    throw new Error('La estación ya no existe.')
  }

  if (
    stationSnapshot.data().estado !== 'OPERATIVA'
  ) {
    throw new Error(
      'Solo puedes asignar estaciones operativas.',
    )
  }

  const currentRoute =
    await obtenerAsignacionesRuta(lineaId, sentido)

  const duplicatedStation = currentRoute.some(
    (assignment) =>
      assignment.estacionId === estacionId,
  )

  if (duplicatedStation) {
    throw new Error(
      'La estación ya está asignada en este sentido.',
    )
  }

  const requestedOrder = validarOrden(orden)

  const finalOrder = Math.min(
    requestedOrder,
    currentRoute.length + 1,
  )

  const newReference = doc(relacionesCollection)

  const newAssignment = {
    id: newReference.id,
    lineaId,
    estacionId,
    sentido,
    orden: finalOrder,
    distanciaAnteriorKm:
      finalOrder === 1
        ? 0
        : validarDistancia(distanciaAnteriorKm),
    nueva: true,
  }

  const finalRoute = [...currentRoute]

  finalRoute.splice(
    finalOrder - 1,
    0,
    newAssignment,
  )

  const batch = writeBatch(db)

  finalRoute.forEach((assignment, index) => {
    const assignmentReference =
      assignment.nueva
        ? newReference
        : doc(
          db,
          'lineasEstaciones',
          assignment.id,
        )

    const assignmentData = {
      lineaId,
      estacionId: assignment.estacionId,
      sentido,
      orden: index + 1,
      distanciaAnteriorKm:
        index === 0
          ? 0
          : Number(
            assignment.distanciaAnteriorKm ?? 0,
          ),
      actualizadoEn: serverTimestamp(),
    }

    if (assignment.nueva) {
      batch.set(assignmentReference, {
        ...assignmentData,
        creadoEn: serverTimestamp(),
      })
    } else {
      batch.update(
        assignmentReference,
        assignmentData,
      )
    }
  })

  await batch.commit()
}

const actualizarAsignacionEstacion = async (
  assignmentId,
  {
    orden,
    distanciaAnteriorKm,
  },
) => {
  const assignmentReference = doc(
    db,
    'lineasEstaciones',
    assignmentId,
  )

  const assignmentSnapshot = await getDoc(
    assignmentReference,
  )

  if (!assignmentSnapshot.exists()) {
    throw new Error(
      'La asignación seleccionada ya no existe.',
    )
  }

  const currentAssignment = {
    id: assignmentSnapshot.id,
    ...assignmentSnapshot.data(),
  }

  const currentRoute =
    await obtenerAsignacionesRuta(
      currentAssignment.lineaId,
      currentAssignment.sentido,
    )

  const requestedOrder = validarOrden(orden)

  const finalOrder = Math.min(
    requestedOrder,
    currentRoute.length,
  )

  const routeWithoutAssignment =
    currentRoute.filter(
      (assignment) =>
        assignment.id !== assignmentId,
    )

  routeWithoutAssignment.splice(
    finalOrder - 1,
    0,
    {
      ...currentAssignment,
      distanciaAnteriorKm:
        finalOrder === 1
          ? 0
          : validarDistancia(
            distanciaAnteriorKm,
          ),
    },
  )

  const batch = writeBatch(db)

  routeWithoutAssignment.forEach(
    (assignment, index) => {
      batch.update(
        doc(
          db,
          'lineasEstaciones',
          assignment.id,
        ),
        {
          orden: index + 1,
          distanciaAnteriorKm:
            index === 0
              ? 0
              : Number(
                assignment.distanciaAnteriorKm ?? 0,
              ),
          actualizadoEn: serverTimestamp(),
        },
      )
    },
  )

  await batch.commit()
}

const eliminarAsignacionEstacion = async (
  assignmentId,
) => {
  const assignmentReference = doc(
    db,
    'lineasEstaciones',
    assignmentId,
  )

  const assignmentSnapshot = await getDoc(
    assignmentReference,
  )

  if (!assignmentSnapshot.exists()) {
    throw new Error(
      'La asignación seleccionada ya no existe.',
    )
  }

  const assignment = assignmentSnapshot.data()

  const currentRoute =
    await obtenerAsignacionesRuta(
      assignment.lineaId,
      assignment.sentido,
    )

  const remainingRoute = currentRoute.filter(
    (item) => item.id !== assignmentId,
  )

  const batch = writeBatch(db)

  batch.delete(assignmentReference)

  remainingRoute.forEach((item, index) => {
    batch.update(
      doc(db, 'lineasEstaciones', item.id),
      {
        orden: index + 1,
        distanciaAnteriorKm:
          index === 0
            ? 0
            : Number(
              item.distanciaAnteriorKm ?? 0,
            ),
        actualizadoEn: serverTimestamp(),
      },
    )
  })

  await batch.commit()
}

const calcularDistanciaRuta = (assignments) => {
  return assignments.reduce(
    (total, assignment) =>
      total +
      Number(
        assignment.distanciaAnteriorKm ?? 0,
      ),
    0,
  )
}

export {
  actualizarAsignacionEstacion,
  actualizarLinea,
  asignarEstacionLinea,
  calcularDistanciaRuta,
  cambiarEstadoLinea,
  crearLinea,
  eliminarAsignacionEstacion,
  suscribirseAsignacionesEstaciones,
  suscribirseEstacionesParaLineas,
  suscribirseLineas,
}