import {
  addDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore'

import { db } from '../../config/firebase'

export async function registrarPago({
  usuarioId,
  correo,
  tipoPago,
  monto,
}) {
  if (!usuarioId) {
    throw new Error('No se encontró el usuario.')
  }

  // ID único que utilizaremos para validar el QR
  const qrToken = crypto.randomUUID()

  const fechaInicio = new Date()

  let fechaVencimiento = null

  // Suscripción válida por un mes
  if (tipoPago === 'suscripcion') {
    fechaVencimiento = new Date(fechaInicio)
    fechaVencimiento.setMonth(
      fechaVencimiento.getMonth() + 1,
    )
  }

  const pago = {
    usuarioId,
    correo: correo || '',
    tipoPago,
    monto,
    estado: 'activo',

    qrToken,

    fechaInicio,
    fechaVencimiento,

    creadoEn: serverTimestamp(),
  }

  const referencia = await addDoc(
    collection(db, 'pagos'),
    pago,
  )

  return {
    id: referencia.id,
    qrToken,
    tipoPago,
    monto,
    fechaInicio,
    fechaVencimiento,
  }
}