import {
  collection,
  onSnapshot,
} from 'firebase/firestore'

import { db } from '../config/firebase'

const coleccionesPermitidas = new Set([
  'buses',
  'pilotos',
  'lineas',
  'recorridos',
  'usuarios',
])

export function suscribirseDatosInicio(
  nombreColeccion,
  onSuccess,
  onError,
) {
  if (!coleccionesPermitidas.has(nombreColeccion)) {
    throw new Error(
      'Colección no válida para el panel de inicio.',
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