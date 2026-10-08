import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'

import { db } from '../../config/firebase'

const rolesCollection = collection(db, 'roles')

const availablePermissions = [
  {
    module: 'Líneas',
    permissions: [
      'lineas.consultar',
      'lineas.crear',
      'lineas.modificar',
      'lineas.desactivar',
    ],
  },
  {
    module: 'Estaciones',
    permissions: [
      'estaciones.consultar',
      'estaciones.crear',
      'estaciones.modificar',
      'estaciones.desactivar',
    ],
  },
  {
    module: 'Buses',
    permissions: [
      'buses.consultar',
      'buses.crear',
      'buses.modificar',
      'buses.desactivar',
    ],
  },
  {
    module: 'Recorridos',
    permissions: [
      'recorridos.consultar',
      'recorridos.crear',
      'recorridos.modificar',
      'recorridos.cancelar',
    ],
  },
  {
    module: 'Pilotos',
    permissions: [
      'pilotos.consultar',
      'pilotos.crear',
      'pilotos.modificar',
      'pilotos.desactivar',
    ],
  },
  {
    module: 'Parqueos',
    permissions: [
      'parqueos.consultar',
      'parqueos.crear',
      'parqueos.modificar',
      'parqueos.desactivar',
    ],
  },
  {
    module: 'Pagos',
    permissions: [
      'pagos.consultar',
      'pagos.registrar',
      'pagos.modificar',
      'pagos.anular',
    ],
  },
  {
    module: 'Usuarios',
    permissions: [
      'usuarios.consultar',
      'usuarios.crear',
      'usuarios.modificar',
      'usuarios.desactivar',
    ],
  },
  {
    module: 'Roles',
    permissions: [
      'roles.consultar',
      'roles.crear',
      'roles.modificar',
      'roles.desactivar',
    ],
  },
  {
    module: 'Personal administrativo',
    permissions: [
      'personal.consultar',
      'personal.crear',
      'personal.modificar',
      'personal.desactivar',
    ],
  },
  {
    module: 'Reportes',
    permissions: [
      'reportes.consultar',
      'reportes.exportar',
    ],
  },
]

function normalizeRoleName(name) {
  return name.trim().toLowerCase()
}

function observeRoles(onSuccess, onError) {
  return onSnapshot(
    rolesCollection,
    (snapshot) => {
      const roles = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }))

      roles.sort((firstRole, secondRole) => {
        const firstName = firstRole.nombre ?? ''
        const secondName = secondRole.nombre ?? ''

        return firstName.localeCompare(secondName)
      })

      onSuccess(roles)
    },
    (error) => {
      console.error('Error al consultar los roles:', error)

      if (onError) {
        onError(error)
      }
    },
  )
}

async function getRoleById(roleId) {
  if (!roleId) {
    throw new Error('El identificador del rol es obligatorio.')
  }

  const roleReference = doc(db, 'roles', roleId)
  const roleSnapshot = await getDoc(roleReference)

  if (!roleSnapshot.exists()) {
    return null
  }

  return {
    id: roleSnapshot.id,
    ...roleSnapshot.data(),
  }
}

async function roleNameExists(name, ignoredRoleId = null) {
  const normalizedName = normalizeRoleName(name)

  const rolesQuery = query(
    rolesCollection,
    where('nombreNormalizado', '==', normalizedName),
  )

  const snapshot = await getDocs(rolesQuery)

  return snapshot.docs.some(
    (document) => document.id !== ignoredRoleId,
  )
}

async function createRole({
  nombre,
  descripcion = '',
  permisos = [],
}) {
  if (!nombre?.trim()) {
    throw new Error('El nombre del rol es obligatorio.')
  }

  if (!Array.isArray(permisos) || permisos.length === 0) {
    throw new Error('Debe seleccionar al menos un permiso.')
  }

  const exists = await roleNameExists(nombre)

  if (exists) {
    throw new Error('Ya existe un rol con ese nombre.')
  }

  const roleReference = await addDoc(rolesCollection, {
    nombre: nombre.trim(),
    nombreNormalizado: normalizeRoleName(nombre),
    descripcion: descripcion.trim(),
    permisos: [...new Set(permisos)],
    activo: true,
    protegido: false,
    creadoEn: serverTimestamp(),
    actualizadoEn: serverTimestamp(),
  })

  return roleReference.id
}

async function updateRole(
  roleId,
  {
    nombre,
    descripcion = '',
    permisos = [],
  },
) {
  if (!roleId) {
    throw new Error('El identificador del rol es obligatorio.')
  }

  if (!nombre?.trim()) {
    throw new Error('El nombre del rol es obligatorio.')
  }

  if (!Array.isArray(permisos) || permisos.length === 0) {
    throw new Error('Debe seleccionar al menos un permiso.')
  }

  const currentRole = await getRoleById(roleId)

  if (!currentRole) {
    throw new Error('El rol que intenta modificar no existe.')
  }

  if (currentRole.protegido) {
    throw new Error('El rol principal está protegido.')
  }

  const exists = await roleNameExists(nombre, roleId)

  if (exists) {
    throw new Error('Ya existe otro rol con ese nombre.')
  }

  const roleReference = doc(db, 'roles', roleId)

  await updateDoc(roleReference, {
    nombre: nombre.trim(),
    nombreNormalizado: normalizeRoleName(nombre),
    descripcion: descripcion.trim(),
    permisos: [...new Set(permisos)],
    actualizadoEn: serverTimestamp(),
  })
}

async function changeRoleStatus(roleId, active) {
  if (!roleId) {
    throw new Error('El identificador del rol es obligatorio.')
  }

  const currentRole = await getRoleById(roleId)

  if (!currentRole) {
    throw new Error('El rol indicado no existe.')
  }

  if (currentRole.protegido) {
    throw new Error('El rol principal no puede desactivarse.')
  }

  const roleReference = doc(db, 'roles', roleId)

  await updateDoc(roleReference, {
    activo: Boolean(active),
    actualizadoEn: serverTimestamp(),
  })
}

export {
  availablePermissions,
  observeRoles,
  getRoleById,
  createRole,
  updateRole,
  changeRoleStatus,
}