import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'

import { db } from '../config/firebase'

const busesCollection = collection(db, 'buses')

const estadosPermitidos = [
  'DISPONIBLE',
  'EN_RUTA',
  'MANTENIMIENTO',
  'FUERA_DE_SERVICIO',
]

/* ==========================================
   VERIFICAR DATOS ÚNICOS
========================================== */

const verificarDatoUnico = async (
  campo,
  valor,
  busIdExcluir = null,
) => {
  const consulta = query(
    busesCollection,
    where(campo, '==', valor),
  )

  const resultado = await getDocs(consulta)

  if (resultado.empty) {
    return false
  }

  /*
   * Cuando estamos editando un bus,
   * ignoramos el documento que estamos editando.
   */
  if (busIdExcluir) {
    return resultado.docs.some(
      (documento) => documento.id !== busIdExcluir,
    )
  }

  return true
}

/* ==========================================
   REGISTRAR BUS
========================================== */

export const registrarBus = async (datos) => {
  const codigoInterno =
    datos.codigoInterno.trim().toUpperCase()

  const placa =
    datos.placa.trim().toUpperCase()

  if (!codigoInterno || !placa) {
    throw new Error(
      'El código interno y la placa son obligatorios.',
    )
  }

  if (!datos.marca?.trim()) {
    throw new Error(
      'La marca del bus es obligatoria.',
    )
  }

  if (!datos.modelo?.trim()) {
    throw new Error(
      'El modelo del bus es obligatorio.',
    )
  }

  if (
    !datos.anio ||
    Number(datos.anio) < 1990
  ) {
    throw new Error(
      'El año del bus no es válido.',
    )
  }

  if (Number(datos.capacidadMaxima) <= 0) {
    throw new Error(
      'La capacidad máxima debe ser mayor que cero.',
    )
  }

  if (!datos.parqueoId?.trim()) {
    throw new Error(
      'El bus debe tener un parqueo asignado.',
    )
  }

  if (
    datos.estado &&
    !estadosPermitidos.includes(datos.estado)
  ) {
    throw new Error(
      'El estado seleccionado no es válido.',
    )
  }

  const codigoExiste =
    await verificarDatoUnico(
      'codigoInterno',
      codigoInterno,
    )

  if (codigoExiste) {
    throw new Error(
      'Ya existe un bus con ese código interno.',
    )
  }

  const placaExiste =
    await verificarDatoUnico(
      'placa',
      placa,
    )

  if (placaExiste) {
    throw new Error(
      'Ya existe un bus con esa placa.',
    )
  }

  const bus = {
    codigoInterno,

    placa,

    marca:
      datos.marca.trim(),

    modelo:
      datos.modelo.trim(),

    anio:
      Number(datos.anio),

    capacidadMaxima:
      Number(datos.capacidadMaxima),

    parqueoId:
      datos.parqueoId.trim(),

    lineaId:
      datos.lineaId || null,

    estado:
      datos.estado || 'DISPONIBLE',

    activo: true,

    creadoEn:
      serverTimestamp(),

    actualizadoEn:
      serverTimestamp(),
  }

  const documento =
    await addDoc(
      busesCollection,
      bus,
    )

  return documento.id
}

/* ==========================================
   ESCUCHAR BUSES EN TIEMPO REAL
========================================== */

export const suscribirseABuses = (
  alRecibirDatos,
  alOcurrirError,
) => {
  const consulta = query(
    busesCollection,
    orderBy('creadoEn', 'desc'),
  )

  return onSnapshot(
    consulta,

    (resultado) => {
      const buses =
        resultado.docs.map(
          (documento) => ({
            id: documento.id,
            ...documento.data(),
          }),
        )

      alRecibirDatos(buses)
    },

    alOcurrirError,
  )
}

/* ==========================================
   ACTUALIZAR BUS COMPLETO
========================================== */

export const actualizarBus = async (
  busId,
  datos,
) => {
  if (!busId) {
    throw new Error(
      'No se encontró el identificador del bus.',
    )
  }

  const codigoInterno =
    datos.codigoInterno
      .trim()
      .toUpperCase()

  const placa =
    datos.placa
      .trim()
      .toUpperCase()

  if (!codigoInterno || !placa) {
    throw new Error(
      'El código interno y la placa son obligatorios.',
    )
  }

  if (!datos.marca?.trim()) {
    throw new Error(
      'La marca del bus es obligatoria.',
    )
  }

  if (!datos.modelo?.trim()) {
    throw new Error(
      'El modelo del bus es obligatorio.',
    )
  }

  if (
    !datos.anio ||
    Number(datos.anio) < 1990
  ) {
    throw new Error(
      'El año del bus no es válido.',
    )
  }

  if (Number(datos.capacidadMaxima) <= 0) {
    throw new Error(
      'La capacidad máxima debe ser mayor que cero.',
    )
  }

  if (!datos.parqueoId?.trim()) {
    throw new Error(
      'El bus debe tener un parqueo asignado.',
    )
  }

  if (
    datos.estado &&
    !estadosPermitidos.includes(datos.estado)
  ) {
    throw new Error(
      'El estado seleccionado no es válido.',
    )
  }

  /* Verificar que el nuevo código no pertenezca
     a otro bus */

  const codigoExiste =
    await verificarDatoUnico(
      'codigoInterno',
      codigoInterno,
      busId,
    )

  if (codigoExiste) {
    throw new Error(
      'Ya existe otro bus con ese código interno.',
    )
  }

  /* Verificar que la placa no pertenezca
     a otro bus */

  const placaExiste =
    await verificarDatoUnico(
      'placa',
      placa,
      busId,
    )

  if (placaExiste) {
    throw new Error(
      'Ya existe otro bus con esa placa.',
    )
  }

  const referenciaBus =
    doc(
      db,
      'buses',
      busId,
    )

  await updateDoc(
    referenciaBus,
    {
      codigoInterno,

      placa,

      marca:
        datos.marca.trim(),

      modelo:
        datos.modelo.trim(),

      anio:
        Number(datos.anio),

      capacidadMaxima:
        Number(datos.capacidadMaxima),

      parqueoId:
        datos.parqueoId.trim(),

      lineaId:
        datos.lineaId || null,

      estado:
        datos.estado || 'DISPONIBLE',

      actualizadoEn:
        serverTimestamp(),
    },
  )
}

/* ==========================================
   CAMBIAR ESTADO
========================================== */

export const actualizarEstadoBus = async (
  busId,
  nuevoEstado,
) => {
  if (
    !estadosPermitidos.includes(
      nuevoEstado,
    )
  ) {
    throw new Error(
      'El estado seleccionado no es válido.',
    )
  }

  const referenciaBus =
    doc(
      db,
      'buses',
      busId,
    )

  await updateDoc(
    referenciaBus,
    {
      estado:
        nuevoEstado,

      actualizadoEn:
        serverTimestamp(),
    },
  )
}

/* ==========================================
   ACTIVAR / DESACTIVAR
========================================== */

export const actualizarActividadBus = async (
  busId,
  activo,
) => {
  const referenciaBus =
    doc(
      db,
      'buses',
      busId,
    )

  await updateDoc(
    referenciaBus,
    {
      activo:
        Boolean(activo),

      actualizadoEn:
        serverTimestamp(),
    },
  )
}

/* ==========================================
   ELIMINAR BUS
========================================== */

export const eliminarBus = async (
  busId,
) => {
  if (!busId) {
    throw new Error(
      'No se encontró el identificador del bus.',
    )
  }

  const referenciaBus =
    doc(
      db,
      'buses',
      busId,
    )

  await deleteDoc(
    referenciaBus,
  )
}