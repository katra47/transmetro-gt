import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'

import { db } from '../../config/firebase'

const recorridosCollection = collection(
  db,
  'recorridos',
)

const ESTADOS_VALIDOS = [
  'PROGRAMADO',
  'EN_CURSO',
  'FINALIZADO',
  'FALLA_MECANICA',
]

/*
 * Prepara y valida la información básica
 * que se guardará en Firestore.
 */
const prepararRecorrido = (recorrido) => {
  if (!recorrido.lineaId) {
    throw new Error(
      'Debes seleccionar una línea.',
    )
  }

  if (!recorrido.busId) {
    throw new Error(
      'Debes seleccionar un bus.',
    )
  }

  if (!recorrido.pilotoId) {
    throw new Error(
      'Debes seleccionar un piloto.',
    )
  }

  if (!recorrido.parqueoId) {
    throw new Error(
      'Debes seleccionar un parqueo de salida.',
    )
  }

  const estado =
    recorrido.estado || 'PROGRAMADO'

  if (!ESTADOS_VALIDOS.includes(estado)) {
    throw new Error(
      'El estado seleccionado no es válido.',
    )
  }

  return {
    lineaId: recorrido.lineaId,
    busId: recorrido.busId,
    pilotoId: recorrido.pilotoId,
    parqueoId: recorrido.parqueoId,
    estado,
    observaciones:
      recorrido.observaciones?.trim() ?? '',
  }
}

/*
 * Verifica que los documentos relacionados
 * realmente existan.
 *
 * Importante:
 * El estado del recorrido NO bloquea su
 * reutilización.
 */
const validarReferencias = async ({
  lineaId,
  busId,
  pilotoId,
  parqueoId,
}) => {
  const [
    lineaSnapshot,
    busSnapshot,
    pilotoSnapshot,
    parqueoSnapshot,
  ] = await Promise.all([
    getDoc(doc(db, 'lineas', lineaId)),
    getDoc(doc(db, 'buses', busId)),
    getDoc(doc(db, 'pilotos', pilotoId)),
    getDoc(doc(db, 'parqueos', parqueoId)),
  ])

  if (!lineaSnapshot.exists()) {
    throw new Error(
      'La línea seleccionada ya no existe.',
    )
  }

  if (!busSnapshot.exists()) {
    throw new Error(
      'El bus seleccionado ya no existe.',
    )
  }

  if (!pilotoSnapshot.exists()) {
    throw new Error(
      'El piloto seleccionado ya no existe.',
    )
  }

  if (!parqueoSnapshot.exists()) {
    throw new Error(
      'El parqueo seleccionado ya no existe.',
    )
  }

  const linea = lineaSnapshot.data()
  const bus = busSnapshot.data()
  const piloto = pilotoSnapshot.data()
  const parqueo = parqueoSnapshot.data()

  /*
   * Estas validaciones solamente se aplican
   * al momento de asignar recursos.
   */

  if (linea.estado !== 'ACTIVA') {
    throw new Error(
      'La línea seleccionada no se encuentra activa.',
    )
  }

  if (
    [
      'INACTIVO',
      'MANTENIMIENTO',
      'FUERA_SERVICIO',
    ].includes(bus.estado)
  ) {
    throw new Error(
      'El bus seleccionado no está disponible.',
    )
  }

  if (
    ['INACTIVO', 'SUSPENDIDO'].includes(
      piloto.estado,
    )
  ) {
    throw new Error(
      'El piloto seleccionado no está disponible.',
    )
  }

  if (
    ['INACTIVO', 'MANTENIMIENTO'].includes(
      parqueo.estado,
    )
  ) {
    throw new Error(
      'El parqueo seleccionado no está disponible.',
    )
  }
}

/*
 * Suscripción en tiempo real a los recorridos.
 *
 * Ya NO ordenamos por fecha porque fecha y hora
 * dejaron de formar parte del recorrido.
 */
const suscribirseRecorridos = (
  onSuccess,
  onError,
) => {
  return onSnapshot(
    recorridosCollection,

    (snapshot) => {
      const recorridos = snapshot.docs
        .map((documentSnapshot) => ({
          id: documentSnapshot.id,
          ...documentSnapshot.data(),
        }))
        .sort((a, b) => {
          /*
           * Primero intentamos ordenar por fecha
           * de creación.
           */
          const fechaA =
            a.creadoEn?.toMillis?.() ?? 0

          const fechaB =
            b.creadoEn?.toMillis?.() ?? 0

          return fechaB - fechaA
        })

      onSuccess(recorridos)
    },

    (error) => {
      console.error(
        'Error al consultar los recorridos:',
        error,
      )

      if (onError) {
        onError(error)
      }
    },
  )
}

/*
 * Función genérica para escuchar catálogos:
 *
 * - líneas
 * - buses
 * - pilotos
 * - parqueos
 */
const suscribirseCatalogo = (
  collectionName,
  onSuccess,
  onError,
) => {
  return onSnapshot(
    collection(db, collectionName),

    (snapshot) => {
      const records = snapshot.docs
        .map((documentSnapshot) => ({
          id: documentSnapshot.id,
          ...documentSnapshot.data(),
        }))
        .sort((firstRecord, secondRecord) => {
          const firstName =
            firstRecord.nombre ??
            firstRecord.nombreCompleto ??
            firstRecord.codigo ??
            ''

          const secondName =
            secondRecord.nombre ??
            secondRecord.nombreCompleto ??
            secondRecord.codigo ??
            ''

          return String(firstName).localeCompare(
            String(secondName),
            'es',
          )
        })

      onSuccess(records)
    },

    (error) => {
      console.error(
        `Error al consultar ${collectionName}:`,
        error,
      )

      if (onError) {
        onError(error)
      }
    },
  )
}

/*
 * CATÁLOGO DE LÍNEAS
 */
const suscribirseLineasRecorridos = (
  onSuccess,
  onError,
) => {
  return suscribirseCatalogo(
    'lineas',
    onSuccess,
    onError,
  )
}

/*
 * CATÁLOGO DE BUSES
 */
const suscribirseBusesRecorridos = (
  onSuccess,
  onError,
) => {
  return suscribirseCatalogo(
    'buses',
    onSuccess,
    onError,
  )
}

/*
 * CATÁLOGO DE PILOTOS
 */
const suscribirsePilotosRecorridos = (
  onSuccess,
  onError,
) => {
  return suscribirseCatalogo(
    'pilotos',
    onSuccess,
    onError,
  )
}

/*
 * CATÁLOGO DE PARQUEOS
 */
const suscribirseParqueosRecorridos = (
  onSuccess,
  onError,
) => {
  return suscribirseCatalogo(
    'parqueos',
    onSuccess,
    onError,
  )
}

/*
 * CREAR RECORRIDO
 */
const crearRecorrido = async (recorrido) => {
  const datosRecorrido =
    prepararRecorrido(recorrido)

  await validarReferencias(datosRecorrido)

  /*
   * IMPORTANTE:
   *
   * Ya no comprobamos conflictos de fecha/hora.
   * Tampoco impedimos que un bus o piloto vuelva
   * a utilizar un recorrido.
   */

  return addDoc(recorridosCollection, {
    ...datosRecorrido,

    creadoEn: serverTimestamp(),
    actualizadoEn: serverTimestamp(),
  })
}

/*
 * EDITAR RECORRIDO
 */
const actualizarRecorrido = async (
  recorridoId,
  recorrido,
) => {
  if (!recorridoId) {
    throw new Error(
      'No se proporcionó el recorrido.',
    )
  }

  const recorridoReference = doc(
    db,
    'recorridos',
    recorridoId,
  )

  const recorridoSnapshot =
    await getDoc(recorridoReference)

  if (!recorridoSnapshot.exists()) {
    throw new Error(
      'El recorrido seleccionado ya no existe.',
    )
  }

  const datosRecorrido =
    prepararRecorrido(recorrido)

  await validarReferencias(datosRecorrido)

  /*
   * Ya NO bloqueamos recorridos FINALIZADOS
   * o con FALLA_MECANICA.
   *
   * Todos pueden volver a editarse.
   */

  return updateDoc(recorridoReference, {
    ...datosRecorrido,
    actualizadoEn: serverTimestamp(),
  })
}

/*
 * CAMBIAR ÚNICAMENTE EL ESTADO
 *
 * Los estados son informativos.
 * No consumen ni bloquean el recorrido.
 */
const cambiarEstadoRecorrido = async (
  recorridoId,
  estado,
) => {
  if (!recorridoId) {
    throw new Error(
      'No se proporcionó el recorrido.',
    )
  }

  if (!ESTADOS_VALIDOS.includes(estado)) {
    throw new Error(
      'El estado seleccionado no es válido.',
    )
  }

  const recorridoReference = doc(
    db,
    'recorridos',
    recorridoId,
  )

  const recorridoSnapshot =
    await getDoc(recorridoReference)

  if (!recorridoSnapshot.exists()) {
    throw new Error(
      'El recorrido seleccionado ya no existe.',
    )
  }

  return updateDoc(recorridoReference, {
    estado,
    actualizadoEn: serverTimestamp(),
  })
}

/*
 * ELIMINAR RECORRIDO
 */
const eliminarRecorrido = async (
  recorridoId,
) => {
  if (!recorridoId) {
    throw new Error(
      'No se proporcionó el recorrido.',
    )
  }

  const recorridoReference = doc(
    db,
    'recorridos',
    recorridoId,
  )

  const recorridoSnapshot =
    await getDoc(recorridoReference)

  if (!recorridoSnapshot.exists()) {
    throw new Error(
      'El recorrido seleccionado ya no existe.',
    )
  }

  return deleteDoc(recorridoReference)
}

export {
  actualizarRecorrido,
  cambiarEstadoRecorrido,
  crearRecorrido,
  eliminarRecorrido,
  suscribirseBusesRecorridos,
  suscribirseLineasRecorridos,
  suscribirseParqueosRecorridos,
  suscribirsePilotosRecorridos,
  suscribirseRecorridos,
}