import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'

import { db } from '../../config/firebase'

const usersCollection = collection(db, 'usuarios')

function observeUsers(onSuccess, onError) {
  return onSnapshot(
    usersCollection,
    (snapshot) => {
      const users = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }))

      users.sort((firstUser, secondUser) => {
        const firstName = firstUser.nombres ?? ''
        const secondName = secondUser.nombres ?? ''

        return firstName.localeCompare(secondName)
      })

      onSuccess(users)
    },
    (error) => {
      console.error('Error al consultar los usuarios:', error)

      if (onError) {
        onError(error)
      }
    },
  )
}

async function getUserById(uid) {
  if (!uid) {
    throw new Error('El UID del usuario es obligatorio.')
  }

  const userReference = doc(db, 'usuarios', uid)
  const userSnapshot = await getDoc(userReference)

  if (!userSnapshot.exists()) {
    return null
  }

  return {
    id: userSnapshot.id,
    ...userSnapshot.data(),
  }
}

async function createUser({
  uid,
  nombres,
  correo,
  rolId,
  personalId = null,
  fotoURL = '',
}) {
  if (!uid?.trim()) {
    throw new Error('El UID del usuario es obligatorio.')
  }

  if (!nombres?.trim()) {
    throw new Error('El nombre del usuario es obligatorio.')
  }

  if (!correo?.trim()) {
    throw new Error('El correo electrónico es obligatorio.')
  }

  if (!rolId?.trim()) {
    throw new Error('Debe seleccionar un rol.')
  }

  const normalizedUid = uid.trim()
  const userReference = doc(db, 'usuarios', normalizedUid)
  const existingUser = await getDoc(userReference)

  if (existingUser.exists()) {
    throw new Error('Ya existe un usuario registrado con este UID.')
  }

  await setDoc(userReference, {
    nombres: nombres.trim(),
    correo: correo.trim().toLowerCase(),
    fotoURL: fotoURL?.trim() ?? '',
    rolId: rolId.trim(),
    personalId: personalId || null,
    estado: 'ACTIVO',
    creadoEn: serverTimestamp(),
    actualizadoEn: serverTimestamp(),
    ultimoAcceso: null,
  })

  return normalizedUid
}

async function updateUser(
  uid,
  {
    nombres,
    correo,
    rolId,
    personalId = null,
    fotoURL = '',
  },
) {
  if (!uid) {
    throw new Error('El UID del usuario es obligatorio.')
  }

  if (!nombres?.trim()) {
    throw new Error('El nombre del usuario es obligatorio.')
  }

  if (!correo?.trim()) {
    throw new Error('El correo electrónico es obligatorio.')
  }

  if (!rolId?.trim()) {
    throw new Error('Debe seleccionar un rol.')
  }

  const userReference = doc(db, 'usuarios', uid)

  await updateDoc(userReference, {
    nombres: nombres.trim(),
    correo: correo.trim().toLowerCase(),
    fotoURL: fotoURL?.trim() ?? '',
    rolId: rolId.trim(),
    personalId: personalId || null,
    actualizadoEn: serverTimestamp(),
  })
}

async function changeUserStatus(uid, newStatus) {
  if (!uid) {
    throw new Error('El UID del usuario es obligatorio.')
  }

  if (!['ACTIVO', 'INACTIVO'].includes(newStatus)) {
    throw new Error('El estado indicado no es válido.')
  }

  const userReference = doc(db, 'usuarios', uid)

  await updateDoc(userReference, {
    estado: newStatus,
    actualizadoEn: serverTimestamp(),
  })
}

export {
  observeUsers,
  getUserById,
  createUser,
  updateUser,
  changeUserStatus,
}