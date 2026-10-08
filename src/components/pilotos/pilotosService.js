import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'

import { db } from '../../config/firebase'

const pilotosCollection = collection(db, 'pilotos')

function cleanText(value) {
  return String(value ?? '').trim()
}

function normalizePilotData(data) {
  const nombres = cleanText(data.nombres)
  const apellidos = cleanText(data.apellidos)

  return {
    codigo: cleanText(data.codigo).toUpperCase(),
    nombres,
    apellidos,
    nombreCompleto: `${nombres} ${apellidos}`.trim(),
    dpi: cleanText(data.dpi).replace(/\D/g, ''),
    numeroLicencia: cleanText(
      data.numeroLicencia,
    ).toUpperCase(),
    tipoLicencia: cleanText(
      data.tipoLicencia,
    ).toUpperCase(),
    telefono: cleanText(data.telefono),
    correo: cleanText(data.correo).toLowerCase(),
    direccion: cleanText(data.direccion),
    municipio: cleanText(data.municipio),
    departamento: cleanText(data.departamento),
    fechaNacimiento: data.fechaNacimiento || null,
    fechaContratacion: data.fechaContratacion || null,
    estado: data.estado || 'ACTIVO',
  }
}

function validatePilotData(pilotData) {
  if (!pilotData.codigo) {
    throw new Error('El código del piloto es obligatorio.')
  }

  if (!pilotData.nombres) {
    throw new Error('Los nombres del piloto son obligatorios.')
  }

  if (!pilotData.apellidos) {
    throw new Error('Los apellidos del piloto son obligatorios.')
  }

  if (pilotData.dpi.length !== 13) {
    throw new Error('El DPI debe contener exactamente 13 números.')
  }

  if (!pilotData.numeroLicencia) {
    throw new Error('El número de licencia es obligatorio.')
  }

  if (!pilotData.tipoLicencia) {
    throw new Error('El tipo de licencia es obligatorio.')
  }

  if (!pilotData.telefono) {
    throw new Error('El teléfono es obligatorio.')
  }

  if (!pilotData.direccion) {
    throw new Error('La dirección de residencia es obligatoria.')
  }

  if (!pilotData.municipio) {
    throw new Error('El municipio de residencia es obligatorio.')
  }

  if (!pilotData.departamento) {
    throw new Error('El departamento de residencia es obligatorio.')
  }
}

async function validateUniqueField(
  field,
  value,
  currentPilotId = null,
) {
  const fieldQuery = query(
    pilotosCollection,
    where(field, '==', value),
  )

  const snapshot = await getDocs(fieldQuery)

  const duplicatedDocument = snapshot.docs.find(
    (documentSnapshot) =>
      documentSnapshot.id !== currentPilotId,
  )

  return !duplicatedDocument
}

async function validateUniquePilot(
  pilotData,
  currentPilotId = null,
) {
  const uniqueCode = await validateUniqueField(
    'codigo',
    pilotData.codigo,
    currentPilotId,
  )

  if (!uniqueCode) {
    throw new Error(
      'Ya existe un piloto registrado con ese código.',
    )
  }

  const uniqueDpi = await validateUniqueField(
    'dpi',
    pilotData.dpi,
    currentPilotId,
  )

  if (!uniqueDpi) {
    throw new Error(
      'Ya existe un piloto registrado con ese DPI.',
    )
  }

  const uniqueLicense = await validateUniqueField(
    'numeroLicencia',
    pilotData.numeroLicencia,
    currentPilotId,
  )

  if (!uniqueLicense) {
    throw new Error(
      'Ya existe un piloto registrado con ese número de licencia.',
    )
  }
}

function observePilots(onSuccess, onError) {
  const pilotsQuery = query(
    pilotosCollection,
    orderBy('nombreCompleto', 'asc'),
  )

  return onSnapshot(
    pilotsQuery,
    (snapshot) => {
      const pilots = snapshot.docs.map(
        (documentSnapshot) => ({
          id: documentSnapshot.id,
          ...documentSnapshot.data(),
        }),
      )

      onSuccess(pilots)
    },
    onError,
  )
}

async function createPilot(data) {
  const pilotData = normalizePilotData(data)

  validatePilotData(pilotData)
  await validateUniquePilot(pilotData)

  return addDoc(pilotosCollection, {
    ...pilotData,
    creadoEn: serverTimestamp(),
    actualizadoEn: serverTimestamp(),
  })
}

async function updatePilot(pilotId, data) {
  if (!pilotId) {
    throw new Error(
      'No se proporcionó el identificador del piloto.',
    )
  }

  const pilotData = normalizePilotData(data)

  validatePilotData(pilotData)
  await validateUniquePilot(pilotData, pilotId)

  const pilotReference = doc(db, 'pilotos', pilotId)

  return updateDoc(pilotReference, {
    ...pilotData,
    actualizadoEn: serverTimestamp(),
  })
}

async function changePilotStatus(pilotId, newStatus) {
  if (!pilotId) {
    throw new Error(
      'No se proporcionó el identificador del piloto.',
    )
  }

  const validStatuses = [
    'ACTIVO',
    'INACTIVO',
    'SUSPENDIDO',
  ]

  if (!validStatuses.includes(newStatus)) {
    throw new Error(
      'El estado seleccionado no es válido.',
    )
  }

  const pilotReference = doc(db, 'pilotos', pilotId)

  return updateDoc(pilotReference, {
    estado: newStatus,
    actualizadoEn: serverTimestamp(),
  })
}

export {
  changePilotStatus,
  createPilot,
  observePilots,
  updatePilot,
}