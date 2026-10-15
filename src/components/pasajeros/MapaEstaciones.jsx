import { useEffect, useRef } from 'react'
import {
  Box,
  Button,
  Typography,
} from '@mui/material'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const estacionesVacias = []

function tieneCoordenadasValidas(estacion) {
  const coordenadas = estacion.coordenadas

  if (!coordenadas) {
    return false
  }

  const { latitud, longitud } = coordenadas

  return (
    typeof latitud === 'number' &&
    typeof longitud === 'number' &&
    Number.isFinite(latitud) &&
    Number.isFinite(longitud) &&
    latitud >= -90 &&
    latitud <= 90 &&
    longitud >= -180 &&
    longitud <= 180
  )
}

function crearContenidoEstacion(estacion) {
  const contenido = document.createElement('div')
  contenido.style.maxWidth = '240px'

  const nombre = document.createElement('strong')
  nombre.textContent = estacion.nombre || 'Estación'
  nombre.style.display = 'block'
  nombre.style.marginBottom = '8px'
  contenido.appendChild(nombre)

  const estado = document.createElement('p')
  estado.textContent = (
    estacion.estado === 'OPERATIVA'
      ? 'Operativa'
      : estacion.estado === 'MANTENIMIENTO'
        ? 'En mantenimiento'
        : 'Estado no disponible'
  )

  estado.style.margin = '0 0 8px'
  contenido.appendChild(estado)

  if (estacion.direccion) {
    const direccion = document.createElement('p')
    direccion.textContent = estacion.direccion
    direccion.style.margin = '0 0 8px'
    contenido.appendChild(direccion)
  }

  if (estacion.municipalidad) {
    const municipalidad = document.createElement('p')
    municipalidad.textContent = estacion.municipalidad
    municipalidad.style.margin = '0 0 8px'
    contenido.appendChild(municipalidad)
  }

  const enlace = document.createElement('a')

  const ubicacion = encodeURIComponent(
    `${estacion.coordenadas.latitud},${estacion.coordenadas.longitud}`,
  )

  enlace.href =
    `https://www.google.com/maps/search/?api=1&query=${ubicacion}`

  enlace.target = '_blank'
  enlace.rel = 'noopener noreferrer'
  enlace.textContent = 'Abrir ubicación en Google Maps'

  contenido.appendChild(enlace)

  return contenido
}

function MapaEstaciones({
  estaciones = estacionesVacias,
  estacionSeleccionadaId = '',
  onSeleccionarEstacion,
}) {
  const contenedorRef = useRef(null)
  const mapaRef = useRef(null)
  const capaRef = useRef(null)
  const marcadoresRef = useRef(new Map())
  const ajustadoRef = useRef(false)
  const seleccionarRef = useRef(onSeleccionarEstacion)

  useEffect(() => {
    seleccionarRef.current = onSeleccionarEstacion
  }, [onSeleccionarEstacion])

  useEffect(() => {
    if (!contenedorRef.current) {
      return undefined
    }

    const mapa = L.map(contenedorRef.current, {
      scrollWheelZoom: false,
    }).setView(
      [14.6349, -90.5069],
      12,
    )

    mapaRef.current = mapa

    L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    ).addTo(mapa)

    capaRef.current = L.featureGroup().addTo(mapa)

    let observador = null

    if (typeof ResizeObserver !== 'undefined') {
      observador = new ResizeObserver(() => {
        mapa.invalidateSize()
      })

      observador.observe(contenedorRef.current)
    }

    return () => {
      observador?.disconnect()

      marcadoresRef.current.clear()
      capaRef.current = null
      mapaRef.current = null
      ajustadoRef.current = false

      mapa.remove()
    }
  }, [])

  useEffect(() => {
    const mapa = mapaRef.current
    const capa = capaRef.current

    if (!mapa || !capa) {
      return
    }

    capa.clearLayers()
    marcadoresRef.current.clear()

    const estacionesUbicadas = estaciones.filter(
      tieneCoordenadasValidas,
    )

    estacionesUbicadas.forEach((estacion) => {
      const color = (
        estacion.estado === 'MANTENIMIENTO'
          ? '#B7791F'
          : '#008C7A'
      )

      const marcador = L.circleMarker(
        [
          estacion.coordenadas.latitud,
          estacion.coordenadas.longitud,
        ],
        {
          radius: 9,
          color: '#FFFFFF',
          weight: 2,
          fillColor: color,
          fillOpacity: 1,
        },
      )

      marcador.bindPopup(
        crearContenidoEstacion(estacion),
      )

      // Usa un elemento DOM para mostrar el nombre como texto.
      const etiqueta = document.createElement('span')
      etiqueta.textContent = estacion.nombre || 'Estación'

      marcador.bindTooltip(etiqueta, {
        direction: 'top',
      })

      marcador.on('click', () => {
        seleccionarRef.current?.(estacion.id)
      })

      marcador.addTo(capa)

      marcadoresRef.current.set(
        estacion.id,
        marcador,
      )
    })

    if (
      estacionesUbicadas.length > 0 &&
      !ajustadoRef.current
    ) {
      mapa.fitBounds(capa.getBounds(), {
        padding: [30, 30],
        maxZoom: 14,
      })

      ajustadoRef.current = true
    }
  }, [estaciones])

  useEffect(() => {
    if (!estacionSeleccionadaId) {
      return
    }

    const mapa = mapaRef.current
    const marcador = marcadoresRef.current.get(
      estacionSeleccionadaId,
    )

    if (!mapa || !marcador) {
      return
    }

    mapa.setView(
      marcador.getLatLng(),
      16,
    )

    marcador.openPopup()
  }, [estacionSeleccionadaId, estaciones])

  const mostrarTodas = () => {
    const mapa = mapaRef.current
    const capa = capaRef.current

    if (!mapa || !capa || !capa.getLayers().length) {
      return
    }

    mapa.closePopup()

    mapa.fitBounds(capa.getBounds(), {
      padding: [30, 30],
      maxZoom: 14,
    })
  }

  const cantidadUbicadas = estaciones.filter(
    tieneCoordenadasValidas,
  ).length

  const cantidadSinUbicacion = (
    estaciones.length - cantidadUbicadas
  )

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1,
          mb: 2,
        }}
      >
        <Typography sx={{ color: '#64748B', fontSize: '0.9rem' }}>
          {cantidadUbicadas} estaciones ubicadas en el mapa
        </Typography>

        <Button
          onClick={mostrarTodas}
          disabled={cantidadUbicadas === 0}
          sx={{
            color: '#008C7A',
            textTransform: 'none',
            fontWeight: 700,
          }}
        >
          Ver todas las estaciones
        </Button>
      </Box>

      <Box
        ref={contenedorRef}
        role="region"
        aria-label="Mapa de estaciones del Transmetro"
        sx={{
          height: {
            xs: 360,
            md: 500,
          },
          width: '100%',
          borderRadius: '16px',
          border: '1px solid #DFE9E5',
          overflow: 'hidden',

          // Mantiene los controles debajo de los
          // diálogos y menús de Material UI.
          position: 'relative',
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mt: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#008C7A',
            }}
          />
          <Typography sx={{ fontSize: '0.85rem', color: '#64748B' }}>
            Operativa
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#B7791F',
            }}
          />
          <Typography sx={{ fontSize: '0.85rem', color: '#64748B' }}>
            En mantenimiento
          </Typography>
        </Box>
      </Box>

      {cantidadSinUbicacion > 0 && (
        <Typography
          sx={{
            mt: 2,
            color: '#64748B',
            fontSize: '0.85rem',
          }}
        >
          {cantidadSinUbicacion} estaciones no tienen coordenadas
          válidas y aparecerán únicamente en la lista.
        </Typography>
      )}
    </Box>
  )
}

export default MapaEstaciones