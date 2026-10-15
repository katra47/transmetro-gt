const tarjeta = {
  border: '1px solid #DFE9E5',
  borderRadius: '20px',
  backgroundColor: '#FFFFFF',
  boxShadow: '0 8px 25px rgba(8,47,73,0.04)',
}

export const pasajerosStyles = {
  pagina: {
    width: '100%',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },

  encabezado: {
    position: 'relative',
    overflow: 'hidden',
    p: {
      xs: 3,
      md: 5,
    },
    pb: {
      xs: 4,
      md: 6,
    },
    borderRadius: '24px',
    color: '#FFFFFF',
    background:
      'linear-gradient(125deg, #082F49 0%, #0A5968 58%, #008C7A 100%)',

    '&::after': {
      content: '""',
      position: 'absolute',
      right: 0,
      bottom: 0,
      left: 0,
      height: 6,
      background:
        'repeating-linear-gradient(90deg, #13B8A6 0 35px, #D6A84B 35px 55px, #B4533C 55px 75px, #F8F4E8 75px 85px)',
    },
  },

  chipEncabezado: {
    mb: 2,
    color: '#FFE29B',
    backgroundColor: 'rgba(214,168,75,0.14)',
    border: '1px solid rgba(214,168,75,0.35)',
    fontWeight: 700,
    maxWidth: '100%',
  },

  titulo: {
    maxWidth: 780,
    color: '#FFFFFF',
    fontSize: {
      xs: '1.8rem',
      sm: '2.3rem',
      md: '2.8rem',
    },
    fontWeight: 800,
    lineHeight: 1.15,
  },

  descripcion: {
    maxWidth: 700,
    mt: 2,
    color: 'rgba(255,255,255,0.85)',
    fontSize: '1rem',
    lineHeight: 1.7,
  },

  seccion: {
    ...tarjeta,
    minWidth: 0,
    p: {
      xs: 2,
      md: 3,
    },
  },

  seccionEncabezado: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    mb: 3,
  },

  iconoSeccion: {
    color: '#008C7A',
    fontSize: 28,
    flexShrink: 0,
  },

  seccionTitulo: {
    color: '#082F49',
    fontSize: {
      xs: '1.15rem',
      md: '1.35rem',
    },
    fontWeight: 800,
    lineHeight: 1.3,
  },

  buscador: {
    mb: 3,

    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
    },
  },

  lineasGrid: {
    display: 'grid',
    gridTemplateColumns: {
      xs: 'minmax(0, 1fr)',
      sm: 'repeat(2, minmax(0, 1fr))',
      lg: 'repeat(3, minmax(0, 1fr))',
    },
    gap: 2,
  },

  lineaTarjeta: {
    ...tarjeta,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 1.5,
    minWidth: 0,
    p: 3,
    transition:
      'border-color 0.2s ease, background-color 0.2s ease',
  },

  lineaSeleccionada: {
    borderColor: '#008C7A',
    backgroundColor: '#F0FAF6',
    boxShadow: '0 0 0 1px #008C7A',
  },

  codigoLinea: {
    color: '#007C70',
    backgroundColor: '#DDF5EE',
    fontWeight: 800,
  },

  lineaNombre: {
    color: '#082F49',
    fontSize: '1.1rem',
    fontWeight: 800,
    overflowWrap: 'anywhere',
  },

  textoSecundario: {
    color: '#64748B',
    fontSize: '0.9rem',
    lineHeight: 1.6,
    overflowWrap: 'anywhere',
  },

  botonTexto: {
    color: '#008C7A',
    textTransform: 'none',
    fontWeight: 700,
    borderRadius: '10px',

    '&:hover': {
      backgroundColor: '#E5F5EF',
    },
  },

  selectorLinea: {
    maxWidth: 640,
    mb: 3,

    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
    },
  },

  trayectoTitulo: {
    color: '#082F49',
    fontSize: '1.2rem',
    fontWeight: 800,
    mb: 2,
  },

  tabs: {
    mb: 3,
    borderBottom: '1px solid #DFE9E5',

    '& .MuiTab-root': {
      textTransform: 'none',
      fontWeight: 700,
    },

    '& .MuiTab-root.Mui-selected': {
      color: '#008C7A',
    },

    '& .MuiTabs-indicator': {
      backgroundColor: '#008C7A',
    },
  },

  trayectoLista: {
    listStyle: 'none',
    m: 0,
    p: 0,
  },

  trayectoEstacion: {
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-start',
    gap: {
      xs: 1.5,
      md: 2.5,
    },
    pb: 3,

    '&:not(:last-child)::before': {
      content: '""',
      position: 'absolute',
      left: 19,
      top: 40,
      bottom: 0,
      width: 2,
      backgroundColor: '#BCE5D9',
    },

    '&:last-child': {
      pb: 0,
    },
  },

  numeroEstacion: {
    position: 'relative',
    zIndex: 1,
    width: 40,
    height: 40,
    flexShrink: 0,
    display: 'grid',
    placeItems: 'center',
    borderRadius: '50%',
    color: '#FFFFFF',
    backgroundColor: '#008C7A',
    fontWeight: 800,
  },

  estacionContenido: {
    minWidth: 0,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 1,
    p: {
      xs: 2,
      md: 2.5,
    },
    border: '1px solid #E2ECE7',
    borderRadius: '14px',
    backgroundColor: '#FAFCFB',
  },

  estacionNombre: {
    color: '#082F49',
    fontSize: '1rem',
    fontWeight: 800,
    lineHeight: 1.4,
    overflowWrap: 'anywhere',
  },

  estacionesGrid: {
    display: 'grid',
    gridTemplateColumns: {
      xs: 'minmax(0, 1fr)',
      sm: 'repeat(2, minmax(0, 1fr))',
      lg: 'repeat(3, minmax(0, 1fr))',
    },
    gap: 2,
  },

  estacionTarjeta: {
    ...tarjeta,
    minWidth: 0,
    p: 3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 1.5,
  },

  cargando: {
    minHeight: 180,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    color: '#64748B',

    '& .MuiCircularProgress-root': {
      color: '#008C7A',
    },
  },

  vacio: {
    minHeight: 150,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    p: 3,
    color: '#64748B',
    textAlign: 'center',
  },
}