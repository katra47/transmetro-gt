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
} from 'firebase/firestore';

import { db } from '../config/firebase';

const busesCollection = collection(db, 'buses');

const estadosPermitidos = [
  'DISPONIBLE',
  'EN_RUTA',
  'MANTENIMIENTO',
  'FUERA_DE_SERVICIO',
];

const verificarDatoUnico = async (campo, valor) => {
  const consulta = query(
    busesCollection,
    where(campo, '==', valor),
  );

  const resultado = await getDocs(consulta);

  return !resultado.empty;
};

export const registrarBus = async (datos) => {
  const codigoInterno = datos.codigoInterno.trim().toUpperCase();
  const placa = datos.placa.trim().toUpperCase();

  if (!codigoInterno || !placa) {
    throw new Error('El código interno y la placa son obligatorios.');
  }

  if (Number(datos.capacidadMaxima) <= 0) {
    throw new Error('La capacidad máxima debe ser mayor que cero.');
  }

  if (!datos.parqueoId) {
    throw new Error('El bus debe tener un parqueo asignado.');
  }

  const codigoExiste = await verificarDatoUnico(
    'codigoInterno',
    codigoInterno,
  );

  if (codigoExiste) {
    throw new Error('Ya existe un bus con ese código interno.');
  }

  const placaExiste = await verificarDatoUnico('placa', placa);

  if (placaExiste) {
    throw new Error('Ya existe un bus con esa placa.');
  }

  const bus = {
    codigoInterno,
    placa,
    marca: datos.marca.trim(),
    modelo: datos.modelo.trim(),
    anio: Number(datos.anio),
    capacidadMaxima: Number(datos.capacidadMaxima),
    parqueoId: datos.parqueoId.trim(),
    lineaId: datos.lineaId || null,
    estado: datos.estado || 'DISPONIBLE',
    activo: true,
    creadoEn: serverTimestamp(),
    actualizadoEn: serverTimestamp(),
  };

  const documento = await addDoc(busesCollection, bus);

  return documento.id;
};

export const suscribirseABuses = (alRecibirDatos, alOcurrirError) => {
  const consulta = query(
    busesCollection,
    orderBy('creadoEn', 'desc'),
  );

  return onSnapshot(
    consulta,
    (resultado) => {
      const buses = resultado.docs.map((documento) => ({
        id: documento.id,
        ...documento.data(),
      }));

      alRecibirDatos(buses);
    },
    alOcurrirError,
  );
};

export const actualizarEstadoBus = async (busId, nuevoEstado) => {
  if (!estadosPermitidos.includes(nuevoEstado)) {
    throw new Error('El estado seleccionado no es válido.');
  }

  const referenciaBus = doc(db, 'buses', busId);

  await updateDoc(referenciaBus, {
    estado: nuevoEstado,
    actualizadoEn: serverTimestamp(),
  });
};

export const actualizarActividadBus = async (busId, activo) => {
  const referenciaBus = doc(db, 'buses', busId);

  await updateDoc(referenciaBus, {
    activo,
    actualizadoEn: serverTimestamp(),
  });
};